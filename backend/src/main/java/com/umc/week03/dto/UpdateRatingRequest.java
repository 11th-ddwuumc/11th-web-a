package com.umc.week03.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

@Schema(description = "평점 수정 요청")
public record UpdateRatingRequest(

        @Schema(
                description = "수정할 평점 (0.0 ~ 5.0)",
                example = "4.5",
                minimum = "0.0",
                maximum = "5.0",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotNull
        @DecimalMin("0.0")
        @DecimalMax("5.0")
        Double score,

        @Schema(description = "수정할 감상평", example = "다시 봐도 정말 재미있는 영화였어요.")
        String comment
) {}
