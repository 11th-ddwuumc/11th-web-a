package com.umc.week03.service;

import com.umc.week03.dto.CreateFavoriteRequest;
import com.umc.week03.dto.FavoriteResponse;
import com.umc.week03.entity.Favorite;
import com.umc.week03.entity.Member;
import com.umc.week03.exception.ApiException;
import com.umc.week03.repository.FavoriteRepository;
import com.umc.week03.repository.MemberRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {

    @Mock
    private FavoriteRepository favoriteRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private FavoriteService favoriteService;

    private Member member;

    @BeforeEach
    void setUp() {
        member = mock(Member.class);
    }

    @Test
    @DisplayName("새로운 영화를 즐겨찾기에 등록하면 성공한다")
    void createFavorite_success() {

        // given
        Long memberId = 1L;
        Long movieId = 550L;

        CreateFavoriteRequest request =
                new CreateFavoriteRequest(movieId);

        when(memberRepository.findById(memberId))
                .thenReturn(Optional.of(member));

        when(favoriteRepository.existsByMember_MemberIdAndMovieId(
                memberId, movieId
        )).thenReturn(false);

        when(favoriteRepository.save(any(Favorite.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        // when
        FavoriteResponse response =
                favoriteService.create(memberId, request);

        // then
        assertNotNull(response);
        assertEquals(movieId, response.movieId());

        verify(favoriteRepository, times(1))
                .save(any(Favorite.class));
    }

    @Test
    @DisplayName("이미 즐겨찾기한 영화는 중복 등록할 수 없다")
    void createFavorite_duplicate() {

        // given
        Long memberId = 1L;
        Long movieId = 550L;

        CreateFavoriteRequest request =
                new CreateFavoriteRequest(movieId);

        when(memberRepository.findById(memberId))
                .thenReturn(Optional.of(member));

        when(favoriteRepository.existsByMember_MemberIdAndMovieId(
                memberId, movieId
        )).thenReturn(true);

        // when & then
        assertThrows(
                ApiException.class,
                () -> favoriteService.create(memberId, request)
        );

        verify(favoriteRepository, never())
                .save(any(Favorite.class));
    }
}
