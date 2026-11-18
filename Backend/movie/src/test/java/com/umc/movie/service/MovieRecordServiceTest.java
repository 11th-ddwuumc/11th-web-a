package com.umc.movie.service;

import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Method;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class MovieRecordServiceTest {
    private MemberRepository memberRepository;
    private RatingRepository ratingRepository;
    private FavoriteRepository favoriteRepository;
    private MovieRecordService movieRecordService;
    private Member member;

    @BeforeEach
    void setUp() {
        memberRepository = mock(MemberRepository.class);
        ratingRepository = mock(RatingRepository.class);
        favoriteRepository = mock(FavoriteRepository.class);
        movieRecordService = new MovieRecordService(memberRepository, ratingRepository, favoriteRepository);
        member = Member.builder().email("noco@umc.com").password("hash").nickname("수현").build();
        ReflectionTestUtils.setField(member, "memberId", 1L);
    }

    @Test
    void createStoresRatingAndFavoriteTogether() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 238L)).thenReturn(false);
        when(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 238L)).thenReturn(false);
        when(ratingRepository.save(any(Rating.class))).thenAnswer(invocation -> {
            Rating rating = invocation.getArgument(0);
            ReflectionTestUtils.setField(rating, "ratingId", 3L);
            return rating;
        });
        when(favoriteRepository.save(any(Favorite.class))).thenAnswer(invocation -> {
            Favorite favorite = invocation.getArgument(0);
            ReflectionTestUtils.setField(favorite, "favoriteId", 2L);
            return favorite;
        });

        MovieRecordResponse response = movieRecordService.create(
                1L, new CreateMovieRecordRequest(238L, 5, "다시 보고 싶은 영화", true));

        assertThat(response.rating().ratingId()).isEqualTo(3L);
        assertThat(response.favorite().favoriteId()).isEqualTo(2L);
        verify(ratingRepository).save(any(Rating.class));
        verify(favoriteRepository).save(any(Favorite.class));
    }

    @Test
    void addToFavoritesFalseStoresOnlyRating() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 238L)).thenReturn(false);
        when(ratingRepository.save(any(Rating.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MovieRecordResponse response = movieRecordService.create(
                1L, new CreateMovieRecordRequest(238L, 4, null, false));

        assertThat(response.favorite()).isNull();
        verify(favoriteRepository, never()).save(any());
    }

    @Test
    void duplicateRatingStopsBothWrites() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 238L)).thenReturn(true);

        assertThatThrownBy(() -> movieRecordService.create(
                1L, new CreateMovieRecordRequest(238L, 5, null, true)))
                .isInstanceOf(ApiException.class)
                .extracting("code").isEqualTo("RATING409_1");
        verify(ratingRepository, never()).save(any());
        verify(favoriteRepository, never()).save(any());
    }

    @Test
    void createMethodDefinesSingleTransactionBoundary() throws Exception {
        Method method = MovieRecordService.class.getMethod(
                "create", Long.class, CreateMovieRecordRequest.class);
        assertThat(method.isAnnotationPresent(Transactional.class)).isTrue();
    }
}
