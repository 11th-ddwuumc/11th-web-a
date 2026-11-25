package com.umc.week03.controller;

import com.umc.week03.config.JwtUtil;
import com.umc.week03.entity.Member;
import com.umc.week03.entity.Rating;
import com.umc.week03.repository.MemberRepository;
import com.umc.week03.repository.RatingRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class RatingApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private Member member;
    private String accessToken;

    @BeforeEach
    void setUp() {
        member = memberRepository.save(
                new Member(
                        "rating-test@umc.com",
                        "testPassword123!",
                        "평점테스트회원"
                )
        );

        accessToken = jwtUtil.generateToken(
                member.getMemberId()
        );
    }

    private Rating saveRating() {
        return ratingRepository.save(
                new Rating(
                        member,
                        550L,
                        4.0,
                        "기존 감상평"
                )
        );
    }

    @Test
    @DisplayName("JWT 없이 평점 등록 시 401")
    void createRating_withoutToken() throws Exception {

        mockMvc.perform(post("/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "movieId": 550,
                                  "score": 4.5,
                                  "comment": "재미있어요"
                                }
                                """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("정상 JWT로 평점 등록 시 201")
    void createRating_success() throws Exception {

        mockMvc.perform(post("/ratings")
                        .header(
                                "Authorization",
                                "Bearer " + accessToken
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "movieId": 550,
                                  "score": 4.5,
                                  "comment": "정말 재미있어요"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.movieId").value(550))
                .andExpect(jsonPath("$.score").value(4.5))
                .andExpect(jsonPath("$.comment")
                        .value("정말 재미있어요"));
    }

    @Test
    @DisplayName("평점이 5점을 초과하면 400")
    void createRating_invalidScore() throws Exception {

        mockMvc.perform(post("/ratings")
                        .header(
                                "Authorization",
                                "Bearer " + accessToken
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "movieId": 550,
                                  "score": 6.0,
                                  "comment": "잘못된 평점"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("같은 영화에 평점을 중복 등록하면 409")
    void createRating_duplicate() throws Exception {

        String requestBody = """
                {
                  "movieId": 550,
                  "score": 4.5,
                  "comment": "중복 테스트"
                }
                """;

        mockMvc.perform(post("/ratings")
                        .header(
                                "Authorization",
                                "Bearer " + accessToken
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/ratings")
                        .header(
                                "Authorization",
                                "Bearer " + accessToken
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("본인의 평점 수정 성공")
    void updateRating_success() throws Exception {

        Rating rating = saveRating();

        mockMvc.perform(patch(
                        "/ratings/{ratingId}",
                        rating.getRatingId()
                )
                        .header(
                                "Authorization",
                                "Bearer " + accessToken
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "score": 5.0,
                                  "comment": "수정된 감상평"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score").value(5.0))
                .andExpect(jsonPath("$.comment")
                        .value("수정된 감상평"));
    }

    @Test
    @DisplayName("다른 회원의 평점 수정 시 403")
    void updateRating_forbidden() throws Exception {

        Rating rating = saveRating();

        Member otherMember = memberRepository.save(
                new Member(
                        "rating-other@umc.com",
                        "testPassword123!",
                        "다른평점회원"
                )
        );

        String otherToken = jwtUtil.generateToken(
                otherMember.getMemberId()
        );

        mockMvc.perform(patch(
                        "/ratings/{ratingId}",
                        rating.getRatingId()
                )
                        .header(
                                "Authorization",
                                "Bearer " + otherToken
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "score": 2.0,
                                  "comment": "수정 시도"
                                }
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("본인의 평점 삭제 성공")
    void deleteRating_success() throws Exception {

        Rating rating = saveRating();

        mockMvc.perform(delete(
                        "/ratings/{ratingId}",
                        rating.getRatingId()
                )
                        .header(
                                "Authorization",
                                "Bearer " + accessToken
                        ))
                .andExpect(status().isOk());

        mockMvc.perform(get("/ratings/me")
                        .header(
                                "Authorization",
                                "Bearer " + accessToken
                        ))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    @DisplayName("다른 회원의 평점 삭제 시 403")
    void deleteRating_forbidden() throws Exception {

        Rating rating = saveRating();

        Member otherMember = memberRepository.save(
                new Member(
                        "rating-delete-other@umc.com",
                        "testPassword123!",
                        "삭제테스트회원"
                )
        );

        String otherToken = jwtUtil.generateToken(
                otherMember.getMemberId()
        );

        mockMvc.perform(delete(
                        "/ratings/{ratingId}",
                        rating.getRatingId()
                )
                        .header(
                                "Authorization",
                                "Bearer " + otherToken
                        ))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("내 평점 목록 조회 성공")
    void getMyRatings_success() throws Exception {

        saveRating();

        mockMvc.perform(get("/ratings/me")
                        .header(
                                "Authorization",
                                "Bearer " + accessToken
                        ))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].movieId").value(550))
                .andExpect(jsonPath("$[0].score").value(4.0));
    }

    @Test
    @DisplayName("JWT 없이 내 평점 목록 조회 시 401")
    void getMyRatings_withoutToken() throws Exception {

        mockMvc.perform(get("/ratings/me"))
                .andExpect(status().isUnauthorized());
    }
}
