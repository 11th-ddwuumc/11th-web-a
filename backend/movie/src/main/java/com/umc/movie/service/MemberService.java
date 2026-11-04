package com.umc.movie.service;

import com.umc.movie.dto.*;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public MemberResponse signUp(SignUpRequest request) {

        if (memberRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다."
            );
        }

        if (memberRepository.existsByNickname(request.nickname())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "이미 사용 중인 닉네임입니다."
            );
        }

        Member member = Member.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .nickname(request.nickname())
                .build();

        Member savedMember = memberRepository.save(member);

        return new MemberResponse(
                savedMember.getMemberId(),
                savedMember.getEmail(),
                savedMember.getNickname()
        );
    }

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
                    HttpStatus.NOT_FOUND, "회원을 찾을 수 없습니다."
            );
        }

        return ratingRepository
                .findByMemberMemberIdOrderByCreatedAtDesc(memberId)
                .stream()
                .map(RatingResponse::from)
                .toList();
    }

    @Transactional
    public RatingResponse createRating(
            Long memberId,
            RatingCreateRequest request
    ) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "회원을 찾을 수 없습니다."
                ));

        if (ratingRepository.existsByMemberMemberIdAndMovieId(
                memberId, request.movieId())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "이미 해당 영화에 평점을 등록했습니다."
            );
        }

        Rating rating = Rating.builder()
                .member(member)
                .movieId(request.movieId())
                .score(request.score())
                .comment(request.comment())
                .build();

        Rating savedRating = ratingRepository.saveAndFlush(rating);

        return RatingResponse.from(savedRating);
    }

    @Transactional
    public RatingResponse updateRating(
            Long memberId,
            Long ratingId,
            RatingUpdateRequest request
    ) {

        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "평점을 찾을 수 없습니다."
                ));

        if (!rating.getMember().getMemberId().equals(memberId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "다른 회원의 평점은 수정할 수 없습니다."
            );
        }

        rating.update(request.score(), request.comment());

        ratingRepository.flush();

        return RatingResponse.from(rating);
    }

    @Transactional
    public void deleteRating(Long memberId, Long ratingId) {

        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "평점을 찾을 수 없습니다."
                ));

        if (!rating.getMember().getMemberId().equals(memberId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "다른 회원의 평점은 삭제할 수 없습니다."
            );
        }

        ratingRepository.delete(rating);
    }
}