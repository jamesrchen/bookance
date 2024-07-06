'use client';
import Answer from "@/app/ui/answer";
import Answers from "@/app/ui/answers";
import clsx from "clsx";
import { motion } from "framer-motion";
import React, { useState } from "react";


export default function AnswerList({myAnswers, allAnswers}: {myAnswers: React.ReactNode, allAnswers: React.ReactNode}) {
  let [myQuestions, setMyQuestions] = useState(1);

  return (
    <div>
        <div key={myQuestions} className="mt-10 flex flex-row align-right text-right justify-end w-full gap-1">
          <motion.span
            className={clsx(
              myQuestions ? "text-blue-600" : "text-gray-500",
            )}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.15 }}
            transition={{ delay: 0.05 }}
            onClick={() => setMyQuestions(1)}
          >
            Mine
          </motion.span>
          <span>|</span>
          <motion.span
            className={clsx(
              !myQuestions ? "text-blue-600" : "text-gray-500",
            )}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.15 }}
            transition={{ delay: 0.05 }}
            onClick={() => setMyQuestions(0)}
          >
            All
          </motion.span>
        </div>

        {myQuestions ? myAnswers : allAnswers}
        {/* {children} */}
    </div>
  )
}

