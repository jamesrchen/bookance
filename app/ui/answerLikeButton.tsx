'use client';

import { bookmarkAnswers, unbookmarkAnswers } from "@/app/lib/actions";
import { motion } from "framer-motion";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

export default function AnswerLikeButton({id, liked}: {id: number, liked: boolean}) {

  return (
    // <FaBookmark size={20} className="text-gray-500" />
    <motion.span
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.15 }}
      transition={{ delay: 0.05 }}
      onClick={() => {
        if (!liked) {
          bookmarkAnswers(id);
        } else {
          unbookmarkAnswers(id);
        }
      }}
    >
     { liked ? <FaBookmark size={20} className="text-gray-500" /> : <FaRegBookmark size={20} className="text-gray-500" />}
    </motion.span>
  )
}