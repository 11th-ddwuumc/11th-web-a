package com.umc.week03.controller;

import com.umc.week03.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> createRental(
            @RequestBody Map<String, Object> body) {

        rentalService.createRental(body);

        return Map.of(
                "message", "도서 대여가 완료되었습니다."
        );
    }
}