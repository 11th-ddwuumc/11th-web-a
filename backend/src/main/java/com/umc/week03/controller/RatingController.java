
package com.umc.week03.controller;

import com.umc.week03.config.AuthInterceptor;
import com.umc.week03.dto.*;
import com.umc.week03.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<RatingResponse> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID)
            Long memberId,
            @Valid @RequestBody CreateRatingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ratingService.create(memberId, request));
    }

    @PatchMapping("/{ratingId}")
    public RatingResponse update(
            @RequestAttribute(AuthInterceptor.MEMBER_ID)
            Long memberId,
            @PathVariable Long ratingId,
            @Valid @RequestBody UpdateRatingRequest request) {
        return ratingService.update(memberId, ratingId, request);
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> delete(
            @RequestAttribute(AuthInterceptor.MEMBER_ID)
            Long memberId,
            @PathVariable Long ratingId) {
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.ok().build();
    }
}
