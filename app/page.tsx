import { validateRequest } from "@/app/lib/auth";
import { fetchUserInfo } from "@/app/lib/data";
import QuestionInput from "@/app/ui/questionInput";
import { redirect } from "next/navigation";
import AnswerList from "@/app/ui/answerList";
import Answers from "@/app/ui/answers";

export const maxDuration = 60; // Increased for OpenAI calls

export default async function Home() {
  let userID = await validateRequest();
  if (!userID) {
		return redirect("/login");
	}
  let user = await fetchUserInfo(userID);

  return (
    <main className="flex flex-col align-middle justify-center p-10 lg:px-60 lg:py-20">
      <h1 className="text-lg font-bold">Welcome, {user.name}</h1>
      <QuestionInput />
      <AnswerList allAnswers={<Answers />} myAnswers={<Answers userID={userID} />} />
    </main>
  );
}
