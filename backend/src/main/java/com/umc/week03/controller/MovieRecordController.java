package com.umc.week03.controller;

import com.umc.week03.config.AuthInterceptor;
import com.umc.week03.dto.CreateMovieRecordRequest;
import com.umc.week03.dto.MovieRecordResponse;
import com.umc.week03.service.MovieRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/movie-records")
@RequiredArgsConstructor
public class MovieRecordController {

    private final MovieRecordService movieRecordService;

    // 영화 기록 저장 (평점 + 선택적 즐겨찾기)
    @PostMapping
    public ResponseEntity<MovieRecordResponse> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @Valid @RequestBody CreateMovieRecordRequest request
    ) {
        MovieRecordResponse response =
                movieRecordService.create(memberId, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }
}