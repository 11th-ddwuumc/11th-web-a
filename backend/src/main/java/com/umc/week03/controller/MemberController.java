
package com.umc.week03.controller;

import com.umc.week03.config.AuthInterceptor;
import com.umc.week03.dto.*;
import com.umc.week03.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
}
