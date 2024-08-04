'use client';

import { bookmarkAnswers, unbookmarkAnswers } from "@/app/lib/actions";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

export default function AnswerLikeButton({id, liked}: {id: number, liked: boolean}) {

  let [isLiked, setIsLiked] = useState(liked);

  return (
    // <FaBookmark size={20} className="text-gray-500" />
    <motion.span
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.15 }}
      transition={{ delay: 0.05 }}
      onClick={() => {
        if (!liked) {
          bookmarkAnswers(id);
          setIsLiked(true);
        } else {
          unbookmarkAnswers(id);
          setIsLiked(false);
        }
      }}
    >
     { isLiked ? <FaBookmark size={20} className="text-gray-500" /> : <FaRegBookmark size={20} className="text-gray-500" />}
    </motion.span>
  )
}