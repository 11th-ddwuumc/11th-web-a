type StudyMember = {
  memberId: number;
  name: string;
  role: string;
  githubId?: string;
};

const members: StudyMember[] = [
  { memberId: 1, name: "유호연", role: "web" },
  { memberId: 2, name: "홍길동", role: "mobile", githubId: "hongjeon" },
];

function printMember(targetID: number) {
  const member = members.find((member) => member.memberId === targetID);

  if (member) {
    console.log("이름 : " + member.name);
    console.log("역할 : " + member.role);
    console.log("githubId : " + (member.githubId ?? "등록되지 않음"));
  } else {
    console.log("존재하지 않는 회원입니다. ID를 다시 확인해주세요.");
  }
}

printMember(1);
printMember(2);
printMember(999);
