package com.umc.week03.service;

import com.umc.week03.dto.*;
import com.umc.week03.entity.Member;
import com.umc.week03.entity.Rating;
import com.umc.week03.exception.ApiException;
import com.umc.week03.repository.MemberRepository;
import com.umc.week03.repository.RatingRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RatingService ratingService;

    private Member member;
    private Rating rating;

    @BeforeEach
    void setUp() {
        member = mock(Member.class);
        lenient().when(member.getMemberId()).thenReturn(1L);

        rating = new Rating(
                member,
                100L,
                4.0,
                "재미있는 영화"
        );
    }

    @Test
    @DisplayName("평점 등록 성공")
    void createSuccess() {
        // given
        CreateRatingRequest request =
                new CreateRatingRequest(
                        100L, 4.5, "정말 재미있어요"
                );

        when(memberRepository.findById(1L))
                .thenReturn(Optional.of(member));

        when(ratingRepository
                .existsByMember_MemberIdAndMovieId(1L, 100L))
                .thenReturn(false);

        when(ratingRepository.save(any(Rating.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0));

        // when
        RatingResponse response =
                ratingService.create(1L, request);

        // then
        assertNotNull(response);
        assertEquals(4.5, response.score());

        verify(ratingRepository, times(1))
                .save(any(Rating.class));
    }

    @Test
    @DisplayName("평점 중복 등록 실패")
    void createDuplicateFail() {
        // given
        CreateRatingRequest request =
                new CreateRatingRequest(
                        100L, 4.5, "중복 평점"
                );

        when(memberRepository.findById(1L))
                .thenReturn(Optional.of(member));

        when(ratingRepository
                .existsByMember_MemberIdAndMovieId(1L, 100L))
                .thenReturn(true);

        // when & then
        assertThrows(
                ApiException.class,
                () -> ratingService.create(1L, request)
        );

        verify(ratingRepository, never())
                .save(any(Rating.class));
    }

    @Test
    @DisplayName("존재하지 않는 회원은 평점 등록 실패")
    void createMemberNotFound() {
        // given
        CreateRatingRequest request =
                new CreateRatingRequest(
                        100L, 4.0, "감상평"
                );

        when(memberRepository.findById(1L))
                .thenReturn(Optional.empty());

        // when & then
        assertThrows(
                ApiException.class,
                () -> ratingService.create(1L, request)
        );

        verify(ratingRepository, never())
                .save(any(Rating.class));
    }

    @Test
    @DisplayName("평점 수정 성공")
    void updateSuccess() {
        // given
        UpdateRatingRequest request =
                new UpdateRatingRequest(
                        5.0, "수정된 감상평"
                );

        when(ratingRepository.findById(10L))
                .thenReturn(Optional.of(rating));

        // when
        RatingResponse response =
                ratingService.update(1L, 10L, request);

        // then
        assertEquals(5.0, response.score());
        assertEquals("수정된 감상평", response.comment());
        assertEquals(5.0, rating.getScore());
    }

    @Test
    @DisplayName("다른 회원의 평점 수정 실패")
    void updateForbidden() {
        // given
        UpdateRatingRequest request =
                new UpdateRatingRequest(
                        3.0, "수정 시도"
                );

        when(ratingRepository.findById(10L))
                .thenReturn(Optional.of(rating));

        // when & then
        assertThrows(
                ApiException.class,
                () -> ratingService.update(2L, 10L, request)
        );

        assertEquals(4.0, rating.getScore());
    }

    @Test
    @DisplayName("평점 삭제 성공")
    void deleteSuccess() {
        // given
        when(ratingRepository.findById(10L))
                .thenReturn(Optional.of(rating));

        // when
        ratingService.delete(1L, 10L);

        // then
        verify(ratingRepository, times(1))
                .delete(rating);
    }

    @Test
    @DisplayName("다른 회원의 평점 삭제 실패")
    void deleteForbidden() {
        // given
        when(ratingRepository.findById(10L))
                .thenReturn(Optional.of(rating));

        // when & then
        assertThrows(
                ApiException.class,
                () -> ratingService.delete(2L, 10L)
        );

        verify(ratingRepository, never())
                .delete(any(Rating.class));
    }

    @Test
    @DisplayName("내 평점 목록 조회 성공")
    void getMyRatingsSuccess() {
        // given
        when(ratingRepository
                .findByMember_MemberIdOrderByRatingIdDesc(1L))
                .thenReturn(List.of(rating));

        // when
        List<RatingResponse> responses =
                ratingService.getMyRatings(1L);

        // then
        assertEquals(1, responses.size());
        assertEquals(4.0, responses.get(0).score());

        verify(ratingRepository, times(1))
                .findByMember_MemberIdOrderByRatingIdDesc(1L);
    }

    @Test
    @DisplayName("존재하지 않는 평점 수정 실패")
    void updateNotFound() {
        // given
        UpdateRatingRequest request =
                new UpdateRatingRequest(
                        4.5, "수정"
                );

        when(ratingRepository.findById(999L))
                .thenReturn(Optional.empty());

        // when & then
        assertThrows(
                ApiException.class,
                () -> ratingService.update(1L, 999L, request)
        );
    }
}
