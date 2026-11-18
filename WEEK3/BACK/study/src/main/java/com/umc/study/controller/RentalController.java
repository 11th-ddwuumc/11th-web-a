package com.umc.study.controller;

import com.umc.study.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public String createRental(@RequestBody Map<String, Object> body) {

        Long userId = ((Number) body.get("userId")).longValue();
        Long bookId = ((Number) body.get("bookId")).longValue();

        rentalService.createRental(userId, bookId);

        return "도서 대여가 완료되었습니다!";
    }
}