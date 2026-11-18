package com.umc.week03.controller;

import com.umc.week03.dto.CreateRentalRequest;
import com.umc.week03.service.RentalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/rentals")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> createRental(
            @Valid @RequestBody CreateRentalRequest request) {

        rentalService.createRental(request);

        return Map.of(
                "message",
                "대여가 완료되었습니다."
        );
    }
}