package com.umc.movie.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.FavoriteStatusResponse;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.exception.ApiException;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.FavoriteService;
import com.umc.movie.service.MovieRecordService;
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

class FavoriteApiContractTest {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private FavoriteService favoriteService;
    private MovieRecordService movieRecordService;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        favoriteService = mock(FavoriteService.class);
        movieRecordService = mock(MovieRecordService.class);
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();
        mockMvc = MockMvcBuilders.standaloneSetup(
                        new FavoriteController(favoriteService),
                        new MovieRecordController(movieRecordService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .setValidator(validator)
                .build();
    }

    @Test
    void favoriteCrudUsesAuthenticatedMemberIdAndCommonResponses() throws Exception {
        FavoriteResponse favorite = new FavoriteResponse(1L, 550L, LocalDateTime.now());
        when(favoriteService.create(eq(1L), any(CreateFavoriteRequest.class))).thenReturn(favorite);
        when(favoriteService.getMyFavorites(1L)).thenReturn(List.of(favorite));
        when(favoriteService.getStatus(1L, 550L)).thenReturn(new FavoriteStatusResponse(true));
        doNothing().when(favoriteService).delete(1L, 550L);

        mockMvc.perform(post("/favorites")
                        .requestAttr(AuthInterceptor.MEMBER_ID, 1L)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new CreateFavoriteRequest(550L))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(550));
        mockMvc.perform(get("/favorites").requestAttr(AuthInterceptor.MEMBER_ID, 1L))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result[0].favoriteId").value(1));
        mockMvc.perform(get("/favorites/{movieId}", 550L)
                        .requestAttr(AuthInterceptor.MEMBER_ID, 1L))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.isFavorite").value(true));
        mockMvc.perform(delete("/favorites/{movieId}", 550L)
                        .requestAttr(AuthInterceptor.MEMBER_ID, 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result").doesNotExist());
    }

    @Test
    void duplicateAndInvalidFavoriteReturn409And400() throws Exception {
        when(favoriteService.create(eq(1L), any(CreateFavoriteRequest.class)))
                .thenThrow(new ApiException(HttpStatus.CONFLICT, "FAVORITE409_1",
                        "이미 이 영화를 즐겨찾기하셨습니다."));

        mockMvc.perform(post("/favorites")
                        .requestAttr(AuthInterceptor.MEMBER_ID, 1L)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new CreateFavoriteRequest(550L))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("FAVORITE409_1"));
        mockMvc.perform(post("/favorites")
                        .requestAttr(AuthInterceptor.MEMBER_ID, 1L)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new CreateFavoriteRequest(0L))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("COMMON4001"));
    }

    @Test
    void movieRecordReturnsRatingAndFavoriteTogether() throws Exception {
        RatingResponse rating = new RatingResponse(3L, 238L, 5, "다시 보고 싶은 영화",
                LocalDateTime.now(), LocalDateTime.now());
        FavoriteResponse favorite = new FavoriteResponse(2L, 238L, LocalDateTime.now());
        when(movieRecordService.create(eq(1L), any(CreateMovieRecordRequest.class)))
                .thenReturn(new MovieRecordResponse(rating, favorite));

        mockMvc.perform(post("/movie-records")
                        .requestAttr(AuthInterceptor.MEMBER_ID, 1L)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(
                                new CreateMovieRecordRequest(238L, 5, "다시 보고 싶은 영화", true))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.rating.movieId").value(238))
                .andExpect(jsonPath("$.result.favorite.movieId").value(238));
    }
}
