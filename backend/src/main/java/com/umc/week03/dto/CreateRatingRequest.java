
package com.umc.week03.dto;

import jakarta.validation.constraints.*;

public record CreateRatingRequest(
        @NotNull @Positive Long movieId,
        @NotNull @DecimalMin("0.0") @DecimalMax("5.0")
        Double score,
        String comment
) {}
