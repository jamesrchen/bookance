import { fetchAnswers } from "@/app/lib/data";
import Answer from "@/app/ui/answer";

type props = {
  userID?: string;
}

export default async function Answers({userID, bookmarked}: {userID?: string, bookmarked?: boolean}) {
  let answers = await fetchAnswers(userID, bookmarked);
  answers = answers.filter(answer => !answer.hidden || (userID && answer.user_id === userID));

  return (
    <div className="flex flex-col gap-5">
      {answers.map((answer) => (
        <Answer key={answer.id} answer={answer} />
      ))}
    </div>
  )
}