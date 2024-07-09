import { fetchComment } from "@/app/lib/data";
import { AnswerWithUser, AnswerWithUserAndBookmarked } from "@/app/lib/definitions";
import CommentInput from "@/app/ui/commentInput";
import Markdown, { AllowElement } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FaRegBookmark, FaBookmark, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import AnswerLikeButton from "@/app/ui/answerLikeButton";

export default async function Answer({answer}: {answer: AnswerWithUserAndBookmarked}) {
  let comments = await fetchComment(answer.id);

  return (
    <div className="border-gray-500 border-2 px-5 py-2 rounded w-full flex flex-col gap-0.5">
      <h1 className="font-bold">{answer.question}</h1>
      <span className="text-gray-500 italic">{answer.corpora?.join(", ")}</span>
      <hr/>
      <div className="leading-relaxed [&_h3]:text-lg [&_h4]:text-lg [&_h3]:font-semibold [&_h4]:font-medium [&_h3]:my-1 [&_h4]:my-0.5 [&_p]:my-1 [&_p]:indent-2">
        {/* {answer.answer} */}
        {/* <Markdown remarkPlugins={[remarkGfm]}>{answer.answer}</Markdown> */}
        <Markdown>{answer.answer}</Markdown>
      </div>
      <div className="mt-2 mb-2 w-full flex flex-row gap-2 content-end align-bottom">
        <AnswerLikeButton id={answer.id} liked={answer.bookmarked} />
        {/* <FaBookmark size={20} className="text-gray-500" /> */}
        {/* <FaThumbsUp size={20} className="text-gray-500" />
        <span className="text-gray-500">1</span> */}
        <span className="text-gray-500 w-full text-right mt-auto mb-auto">Asked by {answer.name}</span>
      </div>
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