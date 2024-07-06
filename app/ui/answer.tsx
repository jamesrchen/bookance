import { fetchComment } from "@/app/lib/data";
import { AnswerWithUser } from "@/app/lib/definitions";
import CommentInput from "@/app/ui/commentInput";
import Markdown, { AllowElement } from 'react-markdown'

export default async function Answer({answer}: {answer: AnswerWithUser}) {
  let comments = await fetchComment(answer.id);

  return (
    <div className="border-gray-500 border-2 px-5 py-2 rounded w-full flex flex-col gap-0.5">
      <h1 className="font-bold">{answer.question}</h1>
      <span className="text-gray-500 italic">{answer.corpora?.join(", ")}</span>
      <hr/>
      <div className="leading-relaxed [&_h3]:text-lg [&_h4]:text-lg [&_h3]:font-semibold [&_h4]:font-medium [&_h3]:my-1 [&_h4]:my-0.5">
        {/* {answer.answer} */}
        <Markdown>{answer.answer}</Markdown>
      </div>
      <span className="text-gray-500 w-full text-right">Asked by {answer.name}</span>
      <hr/>
      <div className="flex flex-col gap-3">
        {/* Comments */}
        <div className="flex flex-col">
          {
            comments.map(comment => (
              <div key={comment.id} className="flex flex-col gap-1">
                <span className="text-gray-500">{comment.name}:</span>
                <p className="pl-2">{comment.content}</p>
              </div>
            ))
          }
        </div>
        <CommentInput answerId={answer.id} />
      </div>
    </div>
  )
}