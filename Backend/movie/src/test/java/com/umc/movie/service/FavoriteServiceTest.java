package com.umc.movie.service;

import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class FavoriteServiceTest {
    private FavoriteRepository favoriteRepository;
    private MemberRepository memberRepository;
    private FavoriteService favoriteService;
    private Member member;

    @BeforeEach
    void setUp() {
        favoriteRepository = mock(FavoriteRepository.class);
        memberRepository = mock(MemberRepository.class);
        favoriteService = new FavoriteService(favoriteRepository, memberRepository);
        member = Member.builder().email("noco@umc.com").password("hash").nickname("수현").build();
        ReflectionTestUtils.setField(member, "memberId", 1L);
    }

    @Test
    void createAndListUseOnlyAuthenticatedMember() {
        Favorite favorite = Favorite.builder().member(member).movieId(550L).build();
        ReflectionTestUtils.setField(favorite, "favoriteId", 7L);
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).thenReturn(false);
        when(favoriteRepository.save(any(Favorite.class))).thenReturn(favorite);
        when(favoriteRepository.findByMember_MemberIdOrderByFavoriteIdDesc(1L))
                .thenReturn(List.of(favorite));

        assertThat(favoriteService.create(1L, new CreateFavoriteRequest(550L)).favoriteId()).isEqualTo(7L);
        assertThat(favoriteService.getMyFavorites(1L)).extracting("movieId").containsExactly(550L);
        verify(favoriteRepository).findByMember_MemberIdOrderByFavoriteIdDesc(1L);
    }

    @Test
    void duplicateFavoriteReturns409() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).thenReturn(true);

        assertThatThrownBy(() -> favoriteService.create(1L, new CreateFavoriteRequest(550L)))
                .isInstanceOf(ApiException.class)
                .extracting("status", "code")
                .containsExactly(org.springframework.http.HttpStatus.CONFLICT, "FAVORITE409_1");
        verify(favoriteRepository, never()).save(any());
    }

    @Test
    void statusChangesAndMissingDeleteReturns404() {
        when(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 550L))
                .thenReturn(false, true);
        assertThat(favoriteService.getStatus(1L, 550L).isFavorite()).isFalse();
        assertThat(favoriteService.getStatus(1L, 550L).isFavorite()).isTrue();

        when(favoriteRepository.findByMember_MemberIdAndMovieId(1L, 999L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> favoriteService.delete(1L, 999L))
                .isInstanceOf(ApiException.class)
                .extracting("status", "code")
                .containsExactly(org.springframework.http.HttpStatus.NOT_FOUND, "FAVORITE404_1");
    }
}
