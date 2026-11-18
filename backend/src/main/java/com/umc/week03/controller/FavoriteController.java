package com.umc.week03.controller;

import com.umc.week03.config.AuthInterceptor;
import com.umc.week03.dto.CreateFavoriteRequest;
import com.umc.week03.dto.FavoriteResponse;
import com.umc.week03.dto.FavoriteStatusResponse;
import com.umc.week03.service.FavoriteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    // 즐겨찾기 등록
    @PostMapping
    public ResponseEntity<FavoriteResponse> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @Valid @RequestBody CreateFavoriteRequest request
    ) {
        FavoriteResponse response =
                favoriteService.create(memberId, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    // 내 즐겨찾기 목록 조회
    @GetMapping
    public List<FavoriteResponse> getMyFavorites(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        return favoriteService.getMyFavorites(memberId);
    }

    // 특정 영화 즐겨찾기 여부 조회
    @GetMapping("/{movieId}")
    public FavoriteStatusResponse getStatus(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long movieId
    ) {
        return favoriteService.getStatus(memberId, movieId);
    }

    // 즐겨찾기 해제
    @DeleteMapping("/{movieId}")
    public ResponseEntity<Void> delete(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long movieId
    ) {
        favoriteService.delete(memberId, movieId);

        return ResponseEntity.ok().build();
    }
}
