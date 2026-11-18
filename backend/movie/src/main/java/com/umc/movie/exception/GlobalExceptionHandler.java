package com.umc.movie.exception;

import com.umc.movie.dto.ApiResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(
            MethodArgumentNotValidException e) {

        String message = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("입력값이 올바르지 않습니다.");

        return ResponseEntity.badRequest()
                .body(ApiResponse.failure("COMMON400", message));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleConflict(
            IllegalArgumentException e) {

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.failure("COMMON409", e.getMessage()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataConflict(
            DataIntegrityViolationException e) {

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.failure("COMMON409", "중복되거나 유효하지 않은 데이터입니다."));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatus(
            ResponseStatusException e) {

        HttpStatus status = HttpStatus.resolve(e.getStatusCode().value());

        String code = switch (e.getStatusCode().value()) {
            case 400 -> "COMMON400";
            case 403 -> "COMMON403";
            case 404 -> "COMMON404";
            case 409 -> "COMMON409";
            default -> "COMMON_ERROR";
        };

        String message = e.getReason() != null
                ? e.getReason()
                : "요청을 처리할 수 없습니다.";

        return ResponseEntity.status(e.getStatusCode())
                .body(ApiResponse.failure(code, message));
    }
}