"use strict";
const members = [
    { memberId: 1, name: "광수", role: "member", githubId: "gwangsoo", },
    { memberId: 2, name: "지수", role: "member", githubId: "jisoo", },
];
const studyHour = 0;
function formatMemberId(input) {
    if (typeof input === "number") {
        console.log(input + "은 숫자입니다.");
    }
    else if (typeof input === "string") {
        console.log(input + "은 문자열입니다.");
    }
    else {
        console.log(input + "은 그 밖의 값입니다.");
    }
}
formatMemberId(1);
formatMemberId("hello");
