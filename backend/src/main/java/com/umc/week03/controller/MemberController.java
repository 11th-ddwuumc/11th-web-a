
package com.umc.week03.controller;

import com.umc.week03.config.AuthInterceptor;
import com.umc.week03.dto.*;
import com.umc.week03.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/me")
    public MemberResponse getMe(
            @RequestAttribute(AuthInterceptor.MEMBER_ID)
            Long memberId) {
        return memberService.getMe(memberId);
    }

    @PatchMapping("/me")
    public MemberResponse updateMe(
            @RequestAttribute(AuthInterceptor.MEMBER_ID)
            Long memberId,
            @Valid @RequestBody UpdateNicknameRequest request) {
        return memberService.updateMe(memberId, request);
    }

    // 이메일 중복 확인
    @GetMapping("/email/{email}")
    public Map<String, Boolean> checkEmail(
            @PathVariable String email) {

        boolean available = memberService.isEmailAvailable(email);
        return Map.of("available", available);
    }

    // 닉네임 중복 확인
    @GetMapping("/nickname/{nickname}")
    public Map<String, Boolean> checkNickname(
            @PathVariable String nickname) {

        boolean available = memberService.isNicknameAvailable(nickname);
        return Map.of("available", available);
    }
}
