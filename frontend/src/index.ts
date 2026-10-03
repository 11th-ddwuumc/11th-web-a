type StudyMember = {
  id: number;
  name: string;
  role: string;
  githubId?: string;
};

const members: StudyMember[] = [
  {
    id: 1,
    name: "우우",
    role: "스터디장",
    githubId: "uuna",
  },
  {
    id: 2,
    name: "나나",
    role: "스터디원",
  },
];

function findMember(memberId: number) {
  const member = members.find(
    (member) => member.id === memberId
  );

  if (member === undefined) {
    return "존재하지 않는 회원입니다.";
  }

  if (member.githubId === undefined) {
    return (
      member.name +
      " 님은 " +
      member.role +
      "이며, GitHub 아이디는 등록되지 않았습니다."
    );
  }

  return (
    member.name +
    " 님은 " +
    member.role +
    "이며, GitHub 아이디는 " +
    member.githubId +
    "입니다."
  );
}

console.log(findMember(1));
console.log(findMember(2));
console.log(findMember(999));