
package com.umc.week03.service;

import com.umc.week03.dto.*;
import com.umc.week03.entity.*;
import com.umc.week03.exception.ApiException;
import com.umc.week03.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public RatingResponse create(
            Long memberId, CreateRatingRequest request) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND, "MEMBER404_1",
                        "회원을 찾을 수 없습니다."));

        if (ratingRepository.existsByMember_MemberIdAndMovieId(
                memberId, request.movieId())) {
            throw new ApiException(
                    HttpStatus.CONFLICT, "RATING409_1",
                    "이미 평점을 등록한 영화입니다.");
        }

        Rating rating = new Rating(
                member,
                request.movieId(),
                request.score(),
                request.comment()
        );

        return RatingResponse.from(ratingRepository.save(rating));
    }

    @Transactional
    public RatingResponse update(
            Long memberId, Long ratingId,
            UpdateRatingRequest request) {

        Rating rating = findRating(ratingId);
        checkOwner(rating, memberId);

        rating.update(request.score(), request.comment());
        return RatingResponse.from(rating);
    }

    @Transactional
    public void delete(Long memberId, Long ratingId) {
        Rating rating = findRating(ratingId);
        checkOwner(rating, memberId);
        ratingRepository.delete(rating);
    }

    private Rating findRating(Long ratingId) {
        return ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "RATING404_1",
                        "평점을 찾을 수 없습니다."));
    }

    private void checkOwner(Rating rating, Long memberId) {
        if (!rating.getMember().getMemberId().equals(memberId)) {
            throw new ApiException(
                    HttpStatus.FORBIDDEN,
                    "RATING403_1",
                    "본인의 평점만 수정하거나 삭제할 수 있습니다.");
        }
    }
}
