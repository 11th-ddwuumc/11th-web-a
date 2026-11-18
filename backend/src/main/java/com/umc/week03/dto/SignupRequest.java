package com.umc.week03.dto;

import jakarta.validation.constraints.*;

public record SignupRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8) String password,
        @NotBlank String nickname
) {}