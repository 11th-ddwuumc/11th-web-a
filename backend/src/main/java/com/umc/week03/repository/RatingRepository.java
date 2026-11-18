package com.umc.week03.repository;

import com.umc.week03.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository
        extends JpaRepository<Rating, Long> {

    boolean existsByMember_MemberIdAndMovieId(
            Long memberId, Long movieId);
}