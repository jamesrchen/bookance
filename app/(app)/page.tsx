import { validateRequest } from "@/app/lib/auth";
import { fetchUserInfo } from "@/app/lib/data";
import QuestionInput from "@/app/ui/questionInput";
import { redirect } from "next/navigation";
import Answers from "@/app/ui/answers";
import AnswerListSelection from "@/app/ui/answerListSelection";

export const maxDuration = 60; // Increased for OpenAI calls

export default async function Home({
  searchParams, 
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  let user = await validateRequest();
  if (!user) {
		return redirect("/login");
	}

  let answerComponent
  if (searchParams?.view == "all") {
    answerComponent =  <Answers />;
  } else if (searchParams?.view == "bookmarked") {
    answerComponent =  <Answers userID={user.id} bookmarked={true} />;
  } else {
    answerComponent =  <Answers userID={user.id} />;
  }
  return (
    <main className="flex flex-col align-middle justify-center p-10 lg:px-60">
      <h1 className="text-lg font-bold">Welcome, {user.name}</h1>
      <QuestionInput premium={user.premium} />
      <AnswerListSelection />
      {answerComponent}
    </main>
  );
}
