package com.umc.week03.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateMovieRecordRequest(

        @NotNull(message = "영화 ID는 필수입니다.")
        @Positive(message = "영화 ID는 양수여야 합니다.")
        Long movieId,

        @NotNull(message = "별점은 필수입니다.")
        @DecimalMin(value = "1.0", message = "별점은 1점 이상이어야 합니다.")
        @DecimalMax(value = "5.0", message = "별점은 5점 이하여야 합니다.")
        Double score,

        String comment,

        @NotNull(message = "즐겨찾기 추가 여부는 필수입니다.")
        Boolean addToFavorites

) {
}
