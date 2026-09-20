type StudyMember = {
    memberId: number;
    name: string;
    role: string;
    githubId?: string;
};

const members: StudyMember[] = [
  { memberId: 1, name: "광수", role:"member", githubId: "gwangsoo", },
  { memberId: 2, name: "지수", role:"member", githubId: "jisoo", },
];

const studyHour: number | undefined = 0 

function formatMemberId (input: unknown){
    if(input === "number"){
        console.log(input + "은 숫자입니다.");
    }
    else if(input === "string"){
        console.log(input + "은 문자열입니다.");
    }
    else{
        console.log(input + "은 그 밖의 값입니다.");
    }
}