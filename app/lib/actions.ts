'use server';

import OpenAI from 'openai';
import { sql } from '@vercel/postgres';
import { Answer, AnswerWithUser, Corpus, CorpusName, fileToTitle, User } from '@/app/lib/definitions';
import { revalidatePath } from 'next/cache';
import { Google, generateCodeVerifier, generateState } from 'arctic';
import { google, validateRequest } from '@/app/lib/auth';
import { cookies } from 'next/headers';
import { corpora } from '@/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY, 
});

export async function getAnswer(question: string, selectedCorpora: CorpusName[] ) {
  // Validate user
  const userID = await validateRequest();
  if (!userID) {
    throw new Error("User not authenticated");
  }

  if (!question || question.length === 0) {
    throw new Error("Question is required");
  }

  if (!selectedCorpora || selectedCorpora.length === 0) {
    throw new Error("Corpora is required");
  }

  let files = selectedCorpora.map((name) => {
    let corpus = corpora[name];
    return Object.keys(corpus.files);
  }).flat(1);

  const vectorStore = await openai.beta.vectorStores.create({
    name: `Search for ${userID}`,
    file_ids: files,
    expires_after: {
      anchor: "last_active_at",
      days: 1
    }
  });

  const assistant = await openai.beta.assistants.create({
    instructions: `You are a literature assistant.
                    You answer questions on works of literature provided.
                    Ensure you use relevant themes and literary devices in discussions.
                    Ensure that you also provide quotes to support your answer. Use > on a new line to indicate a quote, this is important.
                    Make sure to keep your response short and concise as well, approximately 300 words.`,
    model: "gpt-4o",
    tools: [{"type": "file_search"}],
    tool_resources: {
      "file_search": {
        vector_store_ids: [vectorStore.id]
      }
    }
  });

  const thread = await openai.beta.threads.create();


  const message = await openai.beta.threads.messages.create(
    thread.id,
    {
      role: "user",
      content: question
    }
  );

  let run = await openai.beta.threads.runs.createAndPoll(
    thread.id,
    { 
      assistant_id: assistant.id,

      max_completion_tokens: 1000
    },
  );

  if (run.status === 'completed') {
    const messages = await openai.beta.threads.messages.list(
      run.thread_id,
      {
        limit: 1
      }
    );
    let message = messages.data[0];    
    if(message.content[0] && message.content[0].type === 'text') {
      let answer = message.content[0].text.value; 

      for (let annotation of message.content[0].text.annotations) {
        if (annotation.type != 'file_citation') {
          continue;
        }
        console.log("Replacement check: ", annotation.file_citation)
        let replacement = fileToTitle.get(annotation.file_citation.file_id);
        if (replacement) {
          answer = answer.replace(annotation.text, ` (${replacement})`);
        } else {
          console.error("No replacement found for ", annotation.file_citation.file_id);
        }
      }
      // console.log(message.content[0].text.annotations[0].file_citation);
      // Add the answer to the database
      const result = await sql`
        INSERT INTO answers (question, answer, user_id, corpora)
        VALUES (${question}, ${answer}, ${userID}, ${JSON.stringify(selectedCorpora).replace("[", "{").replace("]", "}")} )
      `
      revalidatePath('/');
      await openai.beta.vectorStores.del(vectorStore.id);
      await openai.beta.assistants.del(assistant.id);
      return;
    }

  } else {
    console.error("Run failed", run);
  }
  
  throw new Error("No answers provided");
}

// export async function fetchAnswers() {;
//   try {
//     // const data = await sql<Answer>`SELECT * FROM answers ORDER BY id DESC`;
//     // join using foreign key user_id
//     const data = await sql<AnswerWithUser>`SELECT answers.*, users.name, users.picture FROM answers JOIN users ON answers.user_id = users.id ORDER BY answers.id DESC`;
//     return data.rows
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch answers');
//   }
// }

export async function getCurrentUser() {
  const userID = await validateRequest();
  if (!userID) {
    throw new Error("User not authenticated");
  }

  const data = await sql<User>`
    SELECT * FROM users WHERE id = ${userID}
  `;
  return data.rows[0];
}

export async function submitComment(answerID: number, content: string) {
  const userID = await validateRequest();
  if (!userID) {
    throw new Error("User not authenticated");
  }

  if (!content || content.length === 0) {
    throw new Error("Comment is required");
  }

  const result = await sql`
    INSERT INTO comments (answer_id, user_id, content)
    VALUES (${answerID}, ${userID}, ${content})
  `;
  revalidatePath('/');
}