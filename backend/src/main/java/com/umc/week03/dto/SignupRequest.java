
package com.umc.week03.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

public record SignupRequest(

        @Schema(description = "회원가입에 사용할 이메일", example = "una@umc.com")
        @NotBlank
        @Email
        String email,

        @Schema(description = "8자 이상의 비밀번호", example = "Umc1234!")
        @NotBlank
        @Size(min = 8)
        String password,

        @Schema(description = "회원 닉네임", example = "우나")
        @NotBlank
        String nickname

) {}
