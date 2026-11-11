
package com.umc.week03.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Map<String, Object>> handleApi(
            ApiException e) {
        return ResponseEntity.status(e.getStatus()).body(
                Map.of(
                        "code", e.getCode(),
                        "message", e.getMessage()
                )
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegal(
            IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(
                Map.of("code", "COMMON400",
                        "message", e.getMessage())
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException e) {
        String message = e.getBindingResult()
                .getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("잘못된 요청입니다.");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "code", "COMMON400",
                        "message", message
                ));
    }
}
