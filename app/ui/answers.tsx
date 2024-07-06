import { fetchAnswers } from "@/app/lib/data";
import Answer from "@/app/ui/answer";

type props = {
  userID?: string;
}

export default async function Answers({userID}: {userID?: string}) {
  let answers = await fetchAnswers(userID);

  return (
    <div className="flex flex-col gap-5">
    {/* place template answer here, this is used for the loading environment */}
    {answers.map((answer) => (
      <Answer key={answer.id} answer={answer} />
    ))}
  </div>
  )
}