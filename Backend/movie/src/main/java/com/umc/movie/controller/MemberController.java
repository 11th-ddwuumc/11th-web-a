package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/nickname/{nickname}")
    public ResponseEntity<ApiResponse<NicknameCheckResponse>> checkNickname(
            @PathVariable String nickname
    ) {
        NicknameCheckResponse response = memberService.checkNickname(nickname);
        return ResponseEntity.ok(ApiResponse.ok("닉네임 중복 확인에 성공했습니다.", response));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<EmailCheckResponse>> checkEmail(
            @PathVariable String email
    ) {
        EmailCheckResponse response = memberService.checkEmail(email);
        return ResponseEntity.ok(ApiResponse.ok("이메일 중복 확인에 성공했습니다.", response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        MemberResponse response = memberService.signUp(request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("회원가입에 성공했습니다.", response));
    }
}
