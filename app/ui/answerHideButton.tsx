'use client';

import { hideAnswer, unbookmarkAnswers, unhideAnswer } from "@/app/lib/actions";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function AnswerHideButton({id, hidden}: {id: number, hidden: boolean}) {

  let [isHidden, setIsHidden] = useState(hidden);

  return (
    // <FaBookmark size={20} className="text-gray-500" />
    <motion.span
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.15 }}
      transition={{ delay: 0.05 }}
      onClick={() => {
        if (!hidden) {
          hideAnswer(id);
          setIsHidden(true);
        } else {
          unhideAnswer(id);
          setIsHidden(false);
        }
      }}
    >
     { isHidden ? <FaRegEyeSlash size={20} className="text-gray-500" /> : <FaRegEye size={20} className="text-gray-500" />}
    </motion.span>
  )
}