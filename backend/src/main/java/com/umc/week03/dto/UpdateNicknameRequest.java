package com.umc.week03.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateNicknameRequest(
        @NotBlank String nickname
) {}