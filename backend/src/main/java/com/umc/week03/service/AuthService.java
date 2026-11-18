
package com.umc.week03.service;

import com.umc.week03.config.JwtUtil;
import com.umc.week03.dto.*;
import com.umc.week03.entity.Member;
import com.umc.week03.exception.ApiException;
import com.umc.week03.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public MemberResponse signup(SignupRequest request) {
        if (memberRepository.existsByEmail(request.email())) {
            throw new ApiException(
                    HttpStatus.CONFLICT, "MEMBER409_1",
                    "이미 가입된 이메일입니다.");
        }

        if (memberRepository.existsByNickname(request.nickname())) {
            throw new ApiException(
                    HttpStatus.CONFLICT, "MEMBER409_2",
                    "이미 사용 중인 닉네임입니다.");
        }

        Member member = new Member(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.nickname()
        );

        return MemberResponse.from(memberRepository.save(member));
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        Member member = memberRepository
                .findByEmail(request.email())
                .orElseThrow(() -> new ApiException(
                        HttpStatus.UNAUTHORIZED,
                        "AUTH401_1",
                        "이메일 또는 비밀번호가 올바르지 않습니다."
                ));

        if (!passwordEncoder.matches(
                request.password(), member.getPassword())) {
            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "AUTH401_1",
                    "이메일 또는 비밀번호가 올바르지 않습니다."
            );
        }

        return new LoginResponse(
                jwtUtil.generateToken(member.getMemberId()),
                "Bearer"
        );
    }
}
