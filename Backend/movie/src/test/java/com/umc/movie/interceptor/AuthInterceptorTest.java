package com.umc.movie.interceptor;

import com.umc.movie.exception.ApiException;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AuthInterceptorTest {
    private static final String SECRET = "umc-11th-movie-rating-secret-key-please-change-me";

    @Test
    void missingAuthorizationHeaderReturns401() {
        AuthInterceptor interceptor = new AuthInterceptor(new JwtUtil(SECRET, 3600L));
        assertThatThrownBy(() -> interceptor.preHandle(
                new MockHttpServletRequest(), new MockHttpServletResponse(), new Object()))
                .isInstanceOf(ApiException.class)
                .extracting("status", "code")
                .containsExactly(org.springframework.http.HttpStatus.UNAUTHORIZED, "AUTH401_2");
    }

    @Test
    void validBearerTokenStoresMemberIdOnRequest() {
        JwtUtil jwtUtil = new JwtUtil(SECRET, 3600L);
        AuthInterceptor interceptor = new AuthInterceptor(jwtUtil);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(HttpHeaders.AUTHORIZATION,
                "Bearer " + jwtUtil.createAccessToken(4L, "minseo@umc.com"));
        assertThat(interceptor.preHandle(request, new MockHttpServletResponse(), new Object())).isTrue();
        assertThat(request.getAttribute(AuthInterceptor.MEMBER_ID)).isEqualTo(4L);
    }

    @Test
    void tamperedTokenReturns401() {
        JwtUtil jwtUtil = new JwtUtil(SECRET, 3600L);
        AuthInterceptor interceptor = new AuthInterceptor(jwtUtil);
        String token = jwtUtil.createAccessToken(1L, "noco@umc.com");
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(HttpHeaders.AUTHORIZATION,
                "Bearer " + token.substring(0, token.length() - 1) + "x");
        assertThatThrownBy(() -> interceptor.preHandle(request, new MockHttpServletResponse(), new Object()))
                .isInstanceOf(ApiException.class)
                .extracting("status", "code")
                .containsExactly(org.springframework.http.HttpStatus.UNAUTHORIZED, "AUTH401_3");
    }

    @Test
    void expiredTokenReturns401() {
        JwtUtil jwtUtil = new JwtUtil(SECRET, -120L);
        AuthInterceptor interceptor = new AuthInterceptor(jwtUtil);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(HttpHeaders.AUTHORIZATION,
                "Bearer " + jwtUtil.createAccessToken(1L, "noco@umc.com"));
        assertThatThrownBy(() -> interceptor.preHandle(request, new MockHttpServletResponse(), new Object()))
                .isInstanceOf(ApiException.class)
                .extracting("status", "code")
                .containsExactly(org.springframework.http.HttpStatus.UNAUTHORIZED, "AUTH401_4");
    }
}
