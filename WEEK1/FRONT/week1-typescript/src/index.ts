type WeeklyGoal = {
  title: string;
  targetCount: number;
};

const weeklyGoal: WeeklyGoal = {
  title: "TypeScript 예제 연습",
  //targetCount : "3",
  //targetCount 값을 number로 정의했는데 문자열이 입력
  targetCount: 3,
};

function printGoal(goal: WeeklyGoal): string {
  //console.log(goal.title); 반환값을 string으로 지정했는데 void
  return goal.title;
}

console.log(printGoal(weeklyGoal));
