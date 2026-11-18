
package com.umc.week03.service;

import com.umc.week03.dto.*;
import com.umc.week03.entity.Member;
import com.umc.week03.exception.ApiException;
import com.umc.week03.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public MemberResponse getMe(Long memberId) {
        return MemberResponse.from(findMember(memberId));
    }

    @Transactional
    public MemberResponse updateMe(
            Long memberId, UpdateNicknameRequest request) {

        Member member = findMember(memberId);

        if (memberRepository.existsByNicknameAndMemberIdNot(
                request.nickname(), memberId)) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "MEMBER409_2",
                    "이미 사용 중인 닉네임입니다.");
        }

        member.updateNickname(request.nickname());
        return MemberResponse.from(member);
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "MEMBER404_1",
                        "회원을 찾을 수 없습니다."
                ));
    }
}
