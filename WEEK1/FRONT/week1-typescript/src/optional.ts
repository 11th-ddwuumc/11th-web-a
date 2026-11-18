//선택미션 1 : type과 interface
//interface : 객체 표현
interface StudyMemberInterface {
  memberId: number;
  name: string;
  role: string;
  githubId?: string;
}

//type
//1. 유니언 : 하나의 값이 여러 타입 중 하나가 될 수 있음
type MemberRole = "leader" | "member";

//2. 교차타입 : type은 &를 사용해 여러 객체 타입을 하나로 조합할 수 있음
type MemberProfile = {
  name: string;
};

type GithubProfile = {
  githubId: string;
};

type MemberWithGithub = MemberProfile & GithubProfile;

//3. 기본타입의 별칭
type StudentName = string; //별칭

interface Study_Member {
  name: StudentName;
}

interface Study_Member {
  member_level: number;
}

const member: Study_Member = {
  name: "광수",
  member_level: 1,
};

//선택미션 2
const studyHour: number | undefined = 0;

console.log(studyHour || 1); // 1
console.log(studyHour ?? 1); // 0

//선택미션 3
function formatMemberId(input: unknown) {
  if (typeof input === "number") {
    return "아이디가" + input + "(번)으로 변경되었습니다.";
  } else if (typeof input === "string") {
    return "아이디가" + input + "으로 변경되었습니다.";
  }
  return "숫자나 문자로 입력해주세요";
}
