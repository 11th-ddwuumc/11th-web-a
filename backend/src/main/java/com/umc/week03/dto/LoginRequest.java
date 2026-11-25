
package com.umc.week03.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

public record LoginRequest(

        @Schema(description = "가입할 때 사용한 이메일", example = "una@umc.com")
        @NotBlank
        @Email
        String email,

        @Schema(description = "가입할 때 사용한 비밀번호", example = "Umc1234!")
        @NotBlank
        String password

) {}
