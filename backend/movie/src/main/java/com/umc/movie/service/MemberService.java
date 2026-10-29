package com.umc.movie.service;

import com.umc.movie.dto.AvailabilityResponse;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final RatingRepository ratingRepository;

    public AvailabilityResponse checkNickname(String nickname) {
        return new AvailabilityResponse(
                !memberRepository.existsByNickname(nickname)
        );
    }

    public AvailabilityResponse checkEmail(String email) {
        return new AvailabilityResponse(
                !memberRepository.existsByEmail(email)
        );
    }

    public List<RatingResponse> getMemberRatings(Long memberId) {
        if (!memberRepository.existsById(memberId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Member not found"
            );
        }

        return ratingRepository
                .findByMemberMemberIdOrderByCreatedAtDesc(memberId)
                .stream()
                .map(RatingResponse::from)
                .toList();
    }
}
