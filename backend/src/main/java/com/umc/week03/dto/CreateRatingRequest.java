package com.umc.week03.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

public record CreateRatingRequest(

        @Schema(description = "평점을 등록할 TMDB 영화 ID", example = "550")
        @NotNull
        @Positive
        Long movieId,

        @Schema(
                description = "영화 평점 (0.0 ~ 5.0)",
                example = "4.5",
                minimum = "0.0",
                maximum = "5.0"
        )
        @NotNull
        @DecimalMin("0.0")
        @DecimalMax("5.0")
        Double score,

        @Schema(description = "영화에 대한 리뷰 또는 한줄평", example = "스토리가 흥미롭고 연출이 좋았어요.")
        String comment

) {}
