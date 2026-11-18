
package com.umc.week03.dto;

import com.umc.week03.entity.Rating;

public record RatingResponse(
        Long ratingId,
        Long movieId,
        Double score,
        String comment
) {
    public static RatingResponse from(Rating rating) {
        return new RatingResponse(
                rating.getRatingId(),
                rating.getMovieId(),
                rating.getScore(),
                rating.getComment()
        );
    }
}
