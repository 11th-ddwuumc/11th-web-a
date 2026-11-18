
package com.umc.week03.dto;

import jakarta.validation.constraints.*;

public record UpdateRatingRequest(
        @NotNull @DecimalMin("0.0") @DecimalMax("5.0")
        Double score,
        String comment
) {}
