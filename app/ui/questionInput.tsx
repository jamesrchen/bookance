'use client';
import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { motion } from "framer-motion";
import { getAnswer } from "@/app/lib/actions";
import { Corpus, CorpusName } from "@/app/lib/definitions";
import { corpora } from "@/config";

export default function QuestionInput() {
  let [question, setQuestion] = useState<string>("");
  let [waiting, setWaiting] = useState(0);
  

  let [chosenCorpus, setChosenCorpus] = useState<CorpusName[]>([]);

  let [error, setError] = useState<string>("");

  // Defaults
  let corpus: CorpusName[] = Object.keys(corpora) as CorpusName[];

  return (
  // <div className="border-black w-10 h-10 rounded">
  // </div>
  <div className="flex flex-col gap-3">
    <div className="flex flex-row gap-2">
      <input className="border-black border-4 w-full h-10 rounded-lg p-2"
        type="text" 
        placeholder="Ask a question" 
        value={question} 
        onChange={(e) => {setQuestion(e.target.value)}}
      />
      <motion.div
        key={waiting}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        // change opacity to 0.5 when waiting
        style={{opacity: (waiting || chosenCorpus.length == 0 || question.length == 0) ? 0.5 : 1}}
        onTap={ async () => { 
          if (question.length == 0) return;
          if (waiting) return;
          if (chosenCorpus.length == 0) return;
          try {
            setError('');
            setWaiting(1);
            await getAnswer(question, chosenCorpus);
            setWaiting(0)
            setQuestion('');
          } catch {
            setError("An error occurred. Please try again later. If this persists, contact James.");
            setWaiting(0);
          }
        }}
      >
        <IoSend className="bg-black text-white w-20 h-10 rounded-lg px-4 py-2" />
      </motion.div>
    </div>

    <div>
      <b>Select some texts:</b>
      <div className="flex flex-row flex-wrap gap-3">
        {/* Checkboxes for corpus */}
        {corpus.map((c) => (
          <motion.div
            key={c}
            className="border-black border-2 rounded-lg p-2"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onTap={() => {
              if (chosenCorpus.includes(c)) {
                setChosenCorpus(chosenCorpus.filter((cc) => cc !== c));
              } else {
                setChosenCorpus([...chosenCorpus, c]);
              }
            }}
            style={{backgroundColor: chosenCorpus.includes(c) ? "black" : "white", color: chosenCorpus.includes(c) ? "white" : "black"}}
          >
            {c}
          </motion.div>
        ))}
      </div>
    </div>
    
    <p>Chosen corpus: <i>{chosenCorpus.length > 0 ? chosenCorpus.join(", ") : "None Selected"}</i></p>
    
    {/* If preparing an answer */}
    <div className="flex flex-row w-full justify-center h-4">
      {waiting ? <p>Preparing answer... Hold on for a moment</p> : null}
      {error ? <p className="text-red-400">{error}</p> : null}
    </div>
  </div>
  ) 
}