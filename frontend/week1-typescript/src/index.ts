type StudyMember = {
  id: number;
  name: string;
  role: string;
  githubId?: string;
};

const members: StudyMember[] = [
  {
    id: 1,
    name: "철수",
    role: "학생",
    githubId: "chulsu123"
  },
  {
    id: 2,
    name: "영희",
    role: "개발자"
  }
];

function findMember(id: number): string {
  const member = members.find((member) => member.id === id);

  if (!member) {
    return "존재하지 않는 회원입니다.";
  }

  const github = member.githubId ?? "등록되지 않음";

  return (
    member.name +
    "님은 " +
    member.role +
    "이고, GitHub ID는 " +
    github +
    "입니다."
  );
}

console.log(findMember(1));
console.log(findMember(2));
console.log(findMember(999));