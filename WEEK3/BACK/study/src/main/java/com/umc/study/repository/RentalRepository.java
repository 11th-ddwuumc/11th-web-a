package com.umc.study.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RentalRepository {

    private final JdbcTemplate jdbcTemplate;

    public void createRental(Long userId, Long bookId) {

        //rental 테이블에 새로운 대여 기록을 만들기
        String sql = """
                INSERT INTO rental
                (user_id, book_id, rented_at, due_at)
                VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))
                """;

        jdbcTemplate.update(sql, userId, bookId);
    }
}