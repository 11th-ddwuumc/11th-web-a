package com.umc.week03.controller;

import com.umc.week03.config.AuthInterceptor;
import com.umc.week03.dto.*;
import com.umc.week03.service.MemberService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
@Tag(name = "회원 API", description = "회원 정보 조회, 수정 및 중복 확인 API")
public class MemberController {

    private final MemberService memberService;

    @Operation(
            summary = "내 정보 조회",
            description = "JWT 인증을 통해 로그인한 회원의 정보를 조회합니다.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "회원 정보 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @GetMapping("/me")
    public MemberResponse getMe(
            @Parameter(hidden = true)
            @RequestAttribute(AuthInterceptor.MEMBER_ID)
            Long memberId
    ) {
        return memberService.getMe(memberId);
    }

    @Operation(
            summary = "내 정보 수정",
            description = "로그인한 회원의 닉네임을 수정합니다.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "회원 정보 수정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "409", description = "닉네임 중복")
    })
    @PatchMapping("/me")
    public MemberResponse updateMe(
            @Parameter(hidden = true)
            @RequestAttribute(AuthInterceptor.MEMBER_ID)
            Long memberId,

            @Valid @RequestBody
            UpdateNicknameRequest request
    ) {
        return memberService.updateMe(memberId, request);
    }

    @Operation(
            summary = "이메일 중복 확인",
            description = "입력한 이메일의 사용 가능 여부를 확인합니다. true이면 사용 가능합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "이메일 중복 확인 성공")
    })
    @GetMapping("/email/{email}")
    public Map<String, Boolean> checkEmail(
            @Parameter(
                    description = "중복 확인할 이메일",
                    example = "test@example.com"
            )
            @PathVariable String email
    ) {
        boolean available = memberService.isEmailAvailable(email);
        return Map.of("available", available);
    }

    @Operation(
            summary = "닉네임 중복 확인",
            description = "입력한 닉네임의 사용 가능 여부를 확인합니다. true이면 사용 가능합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "닉네임 중복 확인 성공")
    })
    @GetMapping("/nickname/{nickname}")
    public Map<String, Boolean> checkNickname(
            @Parameter(
                    description = "중복 확인할 닉네임",
                    example = "una"
            )
            @PathVariable String nickname
    ) {
        boolean available = memberService.isNicknameAvailable(nickname);
        return Map.of("available", available);
    }
}