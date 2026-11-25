package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.MemberInfoResponse;
import com.umc.movie.dto.MemberUpdateRequest;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
@Tag(name = "회원", description = "회원가입과 내 정보 API")

public class MemberController {

    private final MemberService memberService;

    @Operation(summary = "닉네임 중복 확인", description = "닉네임을 사용할 수 있는지 확인합니다. 토큰 없이 호출할 수 있습니다.")
    @GetMapping("/nickname/{nickname}")
    public ResponseEntity<ApiResponse<NicknameCheckResponse>> checkNickname(
            @PathVariable String nickname
    ) {
        NicknameCheckResponse response = memberService.checkNickname(nickname);
        return ResponseEntity.ok(ApiResponse.ok("닉네임 중복 확인에 성공했습니다.", response));
    }

    @Operation(summary = "이메일 중복 확인", description = "이메일을 사용할 수 있는지 확인합니다. 토큰 없이 호출할 수 있습니다.")
    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<EmailCheckResponse>> checkEmail(
            @PathVariable String email
    ) {
        EmailCheckResponse response = memberService.checkEmail(email);
        return ResponseEntity.ok(ApiResponse.ok("이메일 중복 확인에 성공했습니다.", response));
    }

    @Operation(
            summary = "회원가입",
            description = "이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 (회원가입 성공)"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 (입력값 검증 실패)"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "COMMON409 (이메일 또는 닉네임 중복), COMMON4091 (DB 제약 위반)")
            }
    )

    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        MemberResponse response = memberService.signUp(request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("회원가입에 성공했습니다.", response));
    }

    @Operation(summary = "내 정보 조회", description = "로그인한 회원의 정보를 조회합니다. Bearer 토큰이 필요합니다.", responses = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 (내 정보 조회 성공)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = SwaggerConfig.AUTH_ERROR),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 (회원을 찾을 수 없음)")
    })
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        MemberInfoResponse response = memberService.getMyInfo(memberId);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 조회했습니다.", response));
    }

    @Operation(summary = "내 정보 수정", description = "로그인한 회원의 닉네임을 수정합니다. Bearer 토큰이 필요합니다.", responses = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 (내 정보 수정 성공)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 (입력값 검증 실패)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = SwaggerConfig.AUTH_ERROR),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 (회원을 찾을 수 없음)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "MEMBER409_1 (중복 닉네임), COMMON4091 (DB 제약 위반)")
    })
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid MemberUpdateRequest request
    ) {
        MemberInfoResponse response = memberService.updateMyInfo(memberId, request);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 수정했습니다.", response));
    }
}
