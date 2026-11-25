package com.umc.week03.controller;

import com.umc.week03.config.AuthInterceptor;
import com.umc.week03.config.SwaggerConfig;
import com.umc.week03.dto.*;
import com.umc.week03.service.RatingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(
        name = "평점",
        description = "영화 평점 등록, 수정, 삭제 및 조회 API"
)
@SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
@RestController
@RequestMapping("/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // 평점 등록
    @Operation(summary = "영화 평점 등록", description = "JWT 인증 후 영화에 대한 평점과 리뷰를 등록합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "평점 등록 성공"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 평점 입력",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증 실패",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "이미 등록된 평점",
                    content = @Content
            )
    })
    @PostMapping
    public ResponseEntity<RatingResponse> create(
            @Parameter(hidden = true)
            @RequestAttribute(AuthInterceptor.MEMBER_ID)
            Long memberId,

            @Valid @RequestBody CreateRatingRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ratingService.create(memberId, request));
    }

    // 평점 수정
    @Operation(summary = "영화 평점 수정", description = "본인이 작성한 평점과 리뷰를 수정합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "평점 수정 성공"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증 실패",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "수정 권한 없음",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "평점을 찾을 수 없음",
                    content = @Content
            )
    })
    @PatchMapping("/{ratingId}")
    public RatingResponse update(
            @Parameter(hidden = true)
            @RequestAttribute(AuthInterceptor.MEMBER_ID)
            Long memberId,

            @Parameter(
                    description = "수정할 평점 ID",
                    example = "1"
            )
            @PathVariable Long ratingId,

            @Valid @RequestBody UpdateRatingRequest request
    ) {
        return ratingService.update(memberId, ratingId, request);
    }

    // 평점 삭제
    @Operation(summary = "영화 평점 삭제", description = "본인이 작성한 평점을 삭제합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "평점 삭제 성공"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증 실패",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "삭제 권한 없음",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "평점을 찾을 수 없음",
                    content = @Content
            )
    })
    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> delete(
            @Parameter(hidden = true)
            @RequestAttribute(AuthInterceptor.MEMBER_ID)
            Long memberId,

            @Parameter(
                    description = "삭제할 평점 ID",
                    example = "1"
            )
            @PathVariable Long ratingId
    ) {
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.ok().build();
    }

    // 내 평점 목록 조회
    @Operation(summary = "내 영화 평점 목록 조회", description = "로그인한 회원이 작성한 평점 목록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "평점 목록 조회 성공"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증 실패",
                    content = @Content
            )
    })
    @GetMapping("/me")
    public List<RatingResponse> getMyRatings(
            @Parameter(hidden = true)
            @RequestAttribute(AuthInterceptor.MEMBER_ID)
            Long memberId
    ) {
        return ratingService.getMyRatings(memberId);
    }
}
