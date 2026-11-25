package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RatingService ratingService;

    @Test
    @DisplayName("같은 영화에 평점을 다시 등록하면 저장하지 않고 409 RATING409_1을 반환한다")
    void duplicateMovieRatingReturnsConflictWithoutSaving() {
        long memberId = 1L;
        Member member = Member.builder().build();
        CreateRatingRequest request = new CreateRatingRequest(550L, 5, "중복 평점");
        given(memberRepository.findById(memberId)).willReturn(Optional.of(member));
        given(ratingRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())).willReturn(true);

        assertThatThrownBy(() -> ratingService.create(memberId, request))
                .isInstanceOfSatisfying(ApiException.class, exception -> {
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(exception.getCode()).isEqualTo("RATING409_1");
                });
        verify(ratingRepository, never()).save(any(Rating.class));
    }

    @Test
    @DisplayName("다른 회원의 평점을 수정하면 내용을 바꾸지 않고 403 RATING403_1을 반환한다")
    void updatingAnotherMembersRatingReturnsForbiddenWithoutChangingIt() {
        Member owner = Member.builder().build();
        ReflectionTestUtils.setField(owner, "memberId", 1L);
        Rating rating = Rating.builder().member(owner).movieId(550L).score(5).comment("원래 코멘트").build();
        long ratingId = 10L;
        given(ratingRepository.findById(ratingId)).willReturn(Optional.of(rating));

        assertThatThrownBy(() -> ratingService.update(2L, ratingId, new UpdateRatingRequest(2, "수정 시도")))
                .isInstanceOfSatisfying(ApiException.class, exception -> {
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
                    assertThat(exception.getCode()).isEqualTo("RATING403_1");
                });
        assertThat(rating.getScore()).isEqualTo(5);
        assertThat(rating.getComment()).isEqualTo("원래 코멘트");
    }
}
