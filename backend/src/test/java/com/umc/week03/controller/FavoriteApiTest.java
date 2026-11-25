package com.umc.week03.controller;

import com.umc.week03.config.JwtUtil;
import com.umc.week03.entity.Member;
import com.umc.week03.repository.MemberRepository;
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
class FavoriteApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private String accessToken;

    @BeforeEach
    void setUp() {
        // 테스트용 회원 생성
        Member member = new Member(
                "test@umc.com",
                "testPassword123!",
                "테스트회원"
        );

        Member savedMember = memberRepository.save(member);

        // 실제 JwtUtil을 사용하여 토큰 발급
        accessToken = jwtUtil.generateToken(
                savedMember.getMemberId()
        );
    }

    @Test
    @DisplayName("JWT 없이 즐겨찾기 등록 시 401")
    void createFavorite_withoutToken() throws Exception {

        mockMvc.perform(post("/favorites")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "movieId": 550
                                }
                                """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("정상 JWT로 즐겨찾기 등록 시 201")
    void createFavorite_success() throws Exception {

        mockMvc.perform(post("/favorites")
                        .header(
                                "Authorization",
                                "Bearer " + accessToken
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "movieId": 550
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.movieId").value(550));
    }

    @Test
    @DisplayName("같은 영화를 중복 등록하면 409")
    void createFavorite_duplicate() throws Exception {

        String requestBody = """
                {
                  "movieId": 550
                }
                """;

        // 첫 번째 등록
        mockMvc.perform(post("/favorites")
                        .header(
                                "Authorization",
                                "Bearer " + accessToken
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated());

        // 두 번째 등록 - 중복 오류
        mockMvc.perform(post("/favorites")
                        .header(
                                "Authorization",
                                "Bearer " + accessToken
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("즐겨찾기하지 않은 영화는 false 반환")
    void getFavoriteStatus_false() throws Exception {

        mockMvc.perform(get("/favorites/999")
                        .header(
                                "Authorization",
                                "Bearer " + accessToken
                        ))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isFavorite").value(false));
    }
}
