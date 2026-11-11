package com.umc.week03.dto;

import com.umc.week03.entity.Member;
import java.time.LocalDateTime;

public record MemberResponse(
        Long memberId,
        String email,
        String nickname,
        LocalDateTime createdAt
) {
    public static MemberResponse from(Member member) {
        return new MemberResponse(
                member.getMemberId(),
                member.getEmail(),
                member.getNickname(),
                member.getCreatedAt()
        );
    }
}