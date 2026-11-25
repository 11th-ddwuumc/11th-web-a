package com.umc.week03.controller;

import com.umc.week03.config.AuthInterceptor;
import com.umc.week03.config.SwaggerConfig;
import com.umc.week03.dto.CreateFavoriteRequest;
import com.umc.week03.dto.FavoriteResponse;
import com.umc.week03.dto.FavoriteStatusResponse;
import com.umc.week03.service.FavoriteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "즐겨찾기", description = "영화 즐겨찾기 등록, 조회, 해제 API")
@SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    // 즐겨찾기 등록
    @Operation(summary = "즐겨찾기 등록", description = "JWT 인증 후 영화 ID로 즐겨찾기를 등록합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "즐겨찾기 등록 성공"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "인증 실패",
                    content = @Content(
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "message": "인증이 필요합니다."
                                            }
                                            """
                            )
                    )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "이미 등록된 즐겨찾기"
            )
    })
    @PostMapping
    public ResponseEntity<FavoriteResponse> create(
            @Parameter(hidden = true)
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,

            @Valid @RequestBody CreateFavoriteRequest request
    ) {
        FavoriteResponse response =
                favoriteService.create(memberId, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    // 내 즐겨찾기 목록 조회
    @Operation(summary = "내 즐겨찾기 목록 조회", description = "로그인한 회원의 즐겨찾기 목록을 조회합니다.")
    @GetMapping
    public List<FavoriteResponse> getMyFavorites(
            @Parameter(hidden = true)
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        return favoriteService.getMyFavorites(memberId);
    }

    // 특정 영화 즐겨찾기 여부 조회
    @Operation(summary = "영화 즐겨찾기 여부 조회", description = "해당 영화가 내 즐겨찾기에 등록되어 있는지 확인합니다.")
    @GetMapping("/{movieId}")
    public FavoriteStatusResponse getStatus(
            @Parameter(hidden = true)
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,

            @Parameter(
                    description = "TMDB 영화 ID",
                    example = "550",
                    in = ParameterIn.PATH
            )
            @PathVariable Long movieId
    ) {
        return favoriteService.getStatus(memberId, movieId);
    }

    // 즐겨찾기 해제
    @Operation(summary = "즐겨찾기 해제", description = "로그인한 회원의 특정 영화 즐겨찾기를 해제합니다.")
    @DeleteMapping("/{movieId}")
    public ResponseEntity<Void> delete(
            @Parameter(hidden = true)
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,

            @Parameter(
                    description = "TMDB 영화 ID",
                    example = "550",
                    in = ParameterIn.PATH
            )
            @PathVariable Long movieId
    ) {
        favoriteService.delete(memberId, movieId);

        return ResponseEntity.ok().build();
    }
}
