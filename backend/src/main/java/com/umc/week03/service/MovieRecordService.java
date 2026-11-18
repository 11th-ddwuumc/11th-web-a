
package com.umc.week03.service;

import com.umc.week03.dto.CreateMovieRecordRequest;
import com.umc.week03.dto.FavoriteResponse;
import com.umc.week03.dto.MovieRecordResponse;
import com.umc.week03.dto.RatingResponse;
import com.umc.week03.entity.Favorite;
import com.umc.week03.entity.Member;
import com.umc.week03.entity.Rating;
import com.umc.week03.exception.ApiException;
import com.umc.week03.repository.FavoriteRepository;
import com.umc.week03.repository.MemberRepository;
import com.umc.week03.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MovieRecordService {

    private final MemberRepository memberRepository;
    private final RatingRepository ratingRepository;
    private final FavoriteRepository favoriteRepository;

    @Transactional
    public MovieRecordResponse create(
            Long memberId,
            CreateMovieRecordRequest request
    ) {

        // 1. 로그인한 회원 조회
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."
                ));

        // 2. 평점 중복 확인
        if (ratingRepository.existsByMember_MemberIdAndMovieId(
                memberId,
                request.movieId()
        )) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "RATING409_1",
                    "이미 이 영화에 평점을 남기셨습니다."
            );
        }

        // 3. 즐겨찾기 중복 확인
        if (Boolean.TRUE.equals(request.addToFavorites())
                && favoriteRepository.existsByMember_MemberIdAndMovieId(
                memberId,
                request.movieId()
        )) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "FAVORITE409_1",
                    "이미 이 영화를 즐겨찾기하셨습니다."
            );
        }

        // 4. 기존 Rating 생성자 사용
        Rating rating = new Rating(
                member,
                request.movieId(),
                request.score(),
                request.comment()
        );

        Rating savedRating = ratingRepository.save(rating);

        // 5. 즐겨찾기 추가 여부에 따라 저장
        FavoriteResponse favoriteResponse = null;

        if (Boolean.TRUE.equals(request.addToFavorites())) {

            Favorite favorite = Favorite.builder()
                    .member(member)
                    .movieId(request.movieId())
                    .build();

            Favorite savedFavorite = favoriteRepository.save(favorite);

            favoriteResponse = FavoriteResponse.from(savedFavorite);
        }

        // 6. 저장 결과 반환
        return new MovieRecordResponse(
                RatingResponse.from(savedRating),
                favoriteResponse
        );
    }
}
