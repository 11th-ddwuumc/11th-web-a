package com.umc.week03.service;

import com.umc.week03.dto.CreateRentalRequest;
import com.umc.week03.repository.RentalRepository;
import org.springframework.stereotype.Service;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;

    public RentalService(RentalRepository rentalRepository) {
        this.rentalRepository = rentalRepository;
    }

    public void createRental(CreateRentalRequest request) {
        rentalRepository.save(
                request.userId(),
                request.bookId()
        );
    }
}