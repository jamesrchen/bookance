'use client';

import { AnswerView } from "@/app/lib/definitions";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";


export default function AnswerListSelection() {
  const searchParams = useSearchParams();
  const router = useRouter();

  let view = AnswerView[searchParams.get("view") as keyof typeof AnswerView]

  return (
    <div className="mt-10 flex flex-row align-right text-right justify-end w-full gap-1">
      <motion.span
        className={clsx(
          !view ? "text-blue-600" : "text-gray-500",
        )}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.15 }}
        transition={{ delay: 0.05 }}
        onClick={() => {
          router.replace(`/`)
        }}
      >
        Mine
      </motion.span>
      <span>|</span>
      <motion.span
        className={clsx(
          view === AnswerView.all ? "text-blue-600" : "text-gray-500",
        )}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.15 }}
        transition={{ delay: 0.05 }}
        onClick={() => {
          router.replace(`/?view=all`)
        }}
      >
        All
      </motion.span>
      <span>|</span>
      <motion.span
        className={clsx(
          view === AnswerView.bookmarked ? "text-blue-600" : "text-gray-500",
        )}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.15 }}
        transition={{ delay: 0.05 }}
        onClick={() => {
          router.replace(`/?view=bookmarked`)
        }}
      >
        Bookmarked
      </motion.span>
    </div>

  )

}