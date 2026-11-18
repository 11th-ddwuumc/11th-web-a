package com.umc.movie.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.exception.ApiException;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.MemberService;
import com.umc.movie.service.RatingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ApiContractTest {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private MemberService memberService;
    private RatingService ratingService;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        memberService = mock(MemberService.class);
        ratingService = mock(RatingService.class);
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();
        mockMvc = MockMvcBuilders.standaloneSetup(
                        new MemberController(memberService), new RatingController(ratingService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .setValidator(validator)
                .build();
    }

    @Test
    void publicChecksUseCommonResponseAndRatingListIsPublic() throws Exception {
        when(memberService.checkEmail("new@umc.com")).thenReturn(new EmailCheckResponse(true));
        when(memberService.checkNickname("새회원")).thenReturn(new NicknameCheckResponse(true));
        when(ratingService.getRatingsByMember(1L)).thenReturn(List.of());

        mockMvc.perform(get("/members/email/{email}", "new@umc.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result.available").value(true));
        mockMvc.perform(get("/members/nickname/{nickname}", "새회원"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.isSuccess").value(true));
        mockMvc.perform(get("/members/{memberId}/ratings", 1L))
                .andExpect(status().isOk()).andExpect(jsonPath("$").isArray());
    }

    @Test
    void authenticatedRatingApisUseMemberIdFromRequestAttribute() throws Exception {
        RatingResponse response = new RatingResponse(
                10L, 550L, 5, "최고의 영화!", LocalDateTime.now(), LocalDateTime.now());
        when(ratingService.create(eq(1L), any(CreateRatingRequest.class))).thenReturn(response);
        when(ratingService.update(eq(1L), eq(10L), any(UpdateRatingRequest.class))).thenReturn(response);
        doNothing().when(ratingService).delete(1L, 10L);

        mockMvc.perform(post("/ratings")
                        .requestAttr(AuthInterceptor.MEMBER_ID, 1L)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new CreateRatingRequest(550L, 5, "최고의 영화!"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.ratingId").value(10));
        mockMvc.perform(patch("/ratings/{ratingId}", 10L)
                        .requestAttr(AuthInterceptor.MEMBER_ID, 1L)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new UpdateRatingRequest(4, "수정"))))
                .andExpect(status().isOk()).andExpect(jsonPath("$.code").value("COMMON200"));
        mockMvc.perform(delete("/ratings/{ratingId}", 10L)
                        .requestAttr(AuthInterceptor.MEMBER_ID, 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON200"));
    }

    @Test
    void invalidScoreReturns400() throws Exception {
        mockMvc.perform(post("/ratings")
                        .requestAttr(AuthInterceptor.MEMBER_ID, 1L)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new CreateRatingRequest(100L, 6, "잘못된 별점"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON4001"));
    }

    @Test
    void ownershipViolationReturns403() throws Exception {
        when(ratingService.update(eq(4L), eq(10L), any(UpdateRatingRequest.class)))
                .thenThrow(new ApiException(HttpStatus.FORBIDDEN, "RATING403_1",
                        "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다."));
        mockMvc.perform(patch("/ratings/{ratingId}", 10L)
                        .requestAttr(AuthInterceptor.MEMBER_ID, 4L)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new UpdateRatingRequest(3, "다른 회원의 수정 시도"))))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("RATING403_1"));
    }

    @Test
    void missingAndDuplicateRatingsReturn404And409() throws Exception {
        doThrow(new ApiException(HttpStatus.NOT_FOUND, "RATING404_1", "존재하지 않는 평점입니다."))
                .when(ratingService).delete(1L, 999999L);
        when(ratingService.create(eq(1L), any(CreateRatingRequest.class)))
                .thenThrow(new ApiException(HttpStatus.CONFLICT, "RATING409_1",
                        "이미 이 영화에 평점을 남기셨습니다."));
        mockMvc.perform(delete("/ratings/{ratingId}", 999999L)
                        .requestAttr(AuthInterceptor.MEMBER_ID, 1L))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("RATING404_1"));
        mockMvc.perform(post("/ratings")
                        .requestAttr(AuthInterceptor.MEMBER_ID, 1L)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new CreateRatingRequest(550L, 5, "중복"))))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("RATING409_1"));
    }
}
