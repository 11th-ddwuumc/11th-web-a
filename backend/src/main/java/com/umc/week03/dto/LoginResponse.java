package com.umc.week03.dto;

public record LoginResponse(
        String accessToken,
        String tokenType
) {}