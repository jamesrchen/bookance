'use client';
import { FaCommentAlt } from "react-icons/fa";
import { useState } from "react";
import { motion } from "framer-motion";
import { submitComment } from "@/app/lib/actions";

export default function CommentInput({answerId}: {answerId: number}) {
  let [comment, setComment] = useState<string>('');

  return (
    <div className="flex flex-row gap-1">
      <input className="border-black w-full rounded-md p-1/2 pl-1 text-base" type="text" placeholder="Add a comment" 
        value={comment} 
        onChange={(e) => setComment(e.target.value)}
      />
      
      <motion.div
        key={comment}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        // change opacity to 0.5 when waiting
        style={{opacity: (comment.length == 0) ? 0.5 : 1}}
        onTap={ async () => { 
          if(comment.length == 0) return;
          await submitComment(answerId, comment);
          setComment('');
        }}
      >
        <FaCommentAlt className="text-black w-8 h-6 rounded-lg" />
      </motion.div>
    </div>
  )
}