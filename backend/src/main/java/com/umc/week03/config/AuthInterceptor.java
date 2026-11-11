
package com.umc.week03.config;

import com.umc.week03.exception.ApiException;
import com.umc.week03.repository.MemberRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    public static final String MEMBER_ID = "memberId";

    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler) {

        String authorization =
                request.getHeader("Authorization");

        if (authorization == null ||
                !authorization.startsWith("Bearer ")) {
            throw unauthorized();
        }

        String token = authorization.substring(7).trim();

        if (token.isEmpty()) {
            throw unauthorized();
        }

        try {
            Long memberId = jwtUtil.getMemberId(token);

            if (!memberRepository.existsById(memberId)) {
                throw unauthorized();
            }

            request.setAttribute(MEMBER_ID, memberId);
            return true;

        } catch (JwtException |
                 IllegalArgumentException e) {
            throw unauthorized();
        }
    }

    private ApiException unauthorized() {
        return new ApiException(
                HttpStatus.UNAUTHORIZED,
                "AUTH401_2",
                "유효한 인증 토큰이 필요합니다."
        );
    }
}
