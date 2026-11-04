package com.umc.movie.controller;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.service.MemberService;
import com.umc.movie.service.RatingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
                        new MemberController(memberService),
                        new RatingController(ratingService)
                )
                .setControllerAdvice(new GlobalExceptionHandler())
                .setValidator(validator)
                .build();
    }

    @Test
    void successResponseUsesCommonStructure() throws Exception {
        when(memberService.checkEmail("new@umc.com"))
                .thenReturn(new EmailCheckResponse(true));
        when(memberService.checkNickname("새회원"))
                .thenReturn(new NicknameCheckResponse(true));
        when(ratingService.getRatingsByMember(1L)).thenReturn(List.of());
        doNothing().when(ratingService).delete(10L, 1L);

        mockMvc.perform(get("/members/email/{email}", "new@umc.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result.available").value(true));

        mockMvc.perform(get("/members/nickname/{nickname}", "새회원"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON200"));

        mockMvc.perform(get("/members/{memberId}/ratings", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result").isArray());

        mockMvc.perform(delete("/members/{memberId}/ratings/{ratingId}", 1L, 10L))
                .andExpect(status().isNoContent());
    }

    @Test
    void invalidInputReturns400() throws Exception {
        CreateRatingRequest request = new CreateRatingRequest(100L, 6, "잘못된 별점");

        mockMvc.perform(post("/members/{memberId}/ratings", 1L)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON4001"));
    }

    @Test
    void duplicateRequestsReturn409() throws Exception {
        when(memberService.signUp(any(SignUpRequest.class)))
                .thenThrow(new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다."));
        when(ratingService.create(eq(1L), any(CreateRatingRequest.class)))
                .thenThrow(new IllegalArgumentException("이미 이 영화에 평점을 남기셨습니다."));

        SignUpRequest signUpRequest = new SignUpRequest(
                "noco@umc.com",
                "Password1!",
                "수현"
        );
        CreateRatingRequest ratingRequest = new CreateRatingRequest(550L, 5, "중복 평점");

        mockMvc.perform(post("/members")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON409"));

        mockMvc.perform(post("/members/{memberId}/ratings", 1L)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(ratingRequest)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON4092"));
    }

    @Test
    void ownershipViolationReturns403() throws Exception {
        doThrow(new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다."
        )).when(ratingService).update(eq(10L), eq(4L), any(UpdateRatingRequest.class));

        UpdateRatingRequest request = new UpdateRatingRequest(3, "다른 회원의 수정 시도");

        mockMvc.perform(patch("/members/{memberId}/ratings/{ratingId}", 4L, 10L)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON403"));
    }

    @Test
    void missingRatingReturns404() throws Exception {
        doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 평점입니다."))
                .when(ratingService).delete(999999L, 1L);

        mockMvc.perform(delete("/members/{memberId}/ratings/{ratingId}", 1L, 999999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON404"));
    }
}
