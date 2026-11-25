package com.umc.movie.service;

import com.umc.movie.dto.LoginRequest;
import com.umc.movie.dto.LoginResponse;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthServiceTest {
    private static final String SECRET = "umc-11th-movie-rating-secret-key-please-change-me";
    private MemberRepository memberRepository;
    private BCryptPasswordEncoder passwordEncoder;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        memberRepository = mock(MemberRepository.class);
        passwordEncoder = new BCryptPasswordEncoder();
        authService = new AuthService(memberRepository, passwordEncoder, new JwtUtil(SECRET, 3600L));
    }

    @Test
    void loginReturnsAccessTokenWithoutPassword() {
        Member member = Member.builder()
                .email("noco@umc.com")
                .password(passwordEncoder.encode("Password1!"))
                .nickname("수현")
                .build();
        ReflectionTestUtils.setField(member, "memberId", 1L);
        when(memberRepository.findByEmail("noco@umc.com")).thenReturn(Optional.of(member));

        LoginResponse response = authService.login(new LoginRequest("noco@umc.com", "Password1!"));

        assertThat(response.nickname()).isEqualTo("수현");
        assertThat(response.accessToken()).isNotBlank();
    }

    @Test
    void missingEmailAndWrongPasswordReturnSame401Response() {
        when(memberRepository.findByEmail("missing@umc.com")).thenReturn(Optional.empty());
        Member member = Member.builder()
                .email("noco@umc.com")
                .password(passwordEncoder.encode("Password1!"))
                .nickname("수현")
                .build();
        when(memberRepository.findByEmail("noco@umc.com")).thenReturn(Optional.of(member));

        assertInvalidCredentials(new LoginRequest("missing@umc.com", "Password1!"));
        assertInvalidCredentials(new LoginRequest("noco@umc.com", "WrongPassword1!"));
    }

    private void assertInvalidCredentials(LoginRequest request) {
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(ApiException.class)
                .extracting("status", "code", "message")
                .containsExactly(
                        org.springframework.http.HttpStatus.UNAUTHORIZED,
                        "AUTH401_1",
                        "이메일 또는 비밀번호가 올바르지 않습니다."
                );
    }
}
