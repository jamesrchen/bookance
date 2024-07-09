'use server';

import OpenAI from 'openai';
import { sql } from '@vercel/postgres';
import { Answer, AnswerWithUser, CorporaSearch, Corpus, CorpusName, fileToTitle, User } from '@/app/lib/definitions';
import { revalidatePath } from 'next/cache';
import { Google, generateCodeVerifier, generateState } from 'arctic';
import { google, validateRequest } from '@/app/lib/auth';
import { cookies } from 'next/headers';
import { corpora } from '@/config';
import { fetchUserInfo, intextSearch } from '@/app/lib/data';
import { title } from 'process';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY, 
});

export async function getAnswer(question: string, selectedCorpora: CorpusName[] ) {
  // Validate user
  const userID = await validateRequest();
  if (!userID) {
    throw new Error("User not authenticated");
  }

  const user = await fetchUserInfo(userID);

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

      let offset = 0;
      for (let annotation of message.content[0].text.annotations) {
        if (annotation.type != 'file_citation') {
          continue;
        }

        let replacement = fileToTitle.get(annotation.file_citation.file_id);
        if (replacement) {
          answer = answer.replace(annotation.text, ` (${replacement})`);
        } else {
          console.error("No replacement found for ", annotation.file_citation.file_id);
        }
      }

      // Search for quotes. Extracting all text between " "
      let quotes = answer.match(/"(.*?)"/g)
      console.log(quotes)
      
      console.log(answer)
      if(quotes) {
        // look for any quotes separated by ... or [...]
        let newQuotes: string[] = []
        for (let quote of quotes) {
          let splitQuotes = quote.split("...");
          newQuotes = newQuotes.concat(splitQuotes);
        }

        // Remove duplicates
        newQuotes = Array.from(new Set(newQuotes));

        for (let quote of newQuotes) {
          // Check if contents of quote matches anything in corpora table content

          // Short quotes may not be that useful, i.e one word
          if(quote.length < 10) {
            continue;
          }

          let quoteContent = quote.replace(/"/g, "");
          // Check all selected corpora
          let foundCorpus: CorpusName | null = null;
          for (let corpus of selectedCorpora) {
            let corporaData = await intextSearch(corpus, quoteContent)
            if (corporaData.length > 0) {
              foundCorpus = corpus;
              break;
            }
          }

          // console.log(`searching for ${quoteContent}`)
          if (foundCorpus) {
            console.log(`found ${quoteContent}`)
            // Replace with URL to /intext?corpus=${corporaData.rows[0].id}&search=${quoteContent} using markdown
            answer = answer.replace(quote, `[${quote}](${encodeURI(`/intext?corpus=${foundCorpus}&search=${quoteContent}`)})`);
          }
        }
      }

      // console.log(message.content[0].text.annotations[0].file_citation);
      // Add the answer to the database
      const result = await sql`
        INSERT INTO answers (question, answer, user_id, corpora)
        VALUES (${question}, ${answer}, ${userID}, ${JSON.stringify(selectedCorpora).replace("[", "{").replace("]", "}")} )
      `
      revalidatePath('/');
      openai.beta.vectorStores.del(vectorStore.id);
      openai.beta.assistants.del(assistant.id);

      // Notify discord webhook
      if (process.env.DISCORD_WEBHOOK_URL) {
        fetch(process.env.DISCORD_WEBHOOK_URL, {
          method : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            embeds: [
              {
                author: {
                  name: user.name,
                  icon_url: user.picture
                },
                title: question,
                description: answer,
              }
            ]
          })
        })
      }

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

export async function bookmarkAnswers(answerID: number) {
  const userID = await validateRequest();
  if (!userID) {
    throw new Error("User not authenticated");
  }

  const result = await sql`
    INSERT INTO bookmarks (user_id, answer_id)
    VALUES (${userID}, ${answerID})
  `;
  revalidatePath('/');
}

export async function unbookmarkAnswers(answerID: number) {
  const userID = await validateRequest();
  if (!userID) {
    throw new Error("User not authenticated");
  }

  const result = await sql`
    DELETE FROM bookmarks
    WHERE user_id = ${userID} AND answer_id = ${answerID}
  `;
  revalidatePath('/');
}