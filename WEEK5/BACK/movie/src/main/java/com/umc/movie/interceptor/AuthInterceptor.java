
package com.umc.movie.interceptor;

import com.umc.movie.exception.ApiException;
import com.umc.movie.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    public static final String MEMBER_ID = "memberId";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtUtil jwtUtil;

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler
    ) {
        // CORS 사전 요청은 통과
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        // Authorization 헤더 읽기
        String header = request.getHeader(
                HttpHeaders.AUTHORIZATION
        );

        // Bearer 토큰이 없으면 401
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "AUTH401_2",
                    "로그인이 필요한 요청입니다."
            );
        }

        // JWT 검증 및 사용자 ID 추출
        String token = header.substring(BEARER_PREFIX.length());
        Long memberId = jwtUtil.getMemberId(token);

        // 컨트롤러에서 사용할 수 있도록 저장
        request.setAttribute(MEMBER_ID, memberId);

        return true;
    }
}

