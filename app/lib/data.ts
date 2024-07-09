import { QueryResult, sql } from '@vercel/postgres';
import { Answer, AnswerWithUser, AnswerWithUserAndBookmarked, Comment, CommentWithUser, CorporaSearch, Corpus, CorpusName, User } from '@/app/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { validateRequest } from '@/app/lib/auth';

// user_id   text    not null
// constraint bookmarks_users_id_fk
//     references users
//     on update cascade on delete cascade,
// answer_id integer not null
// constraint bookmarks_answers_id_fk
//     references answers
//     on update cascade on delete cascade,
// constraint bookmarks_pk
// primary key (user_id, answer_id)

export async function fetchAnswers(userID?: string, bookmarked?: boolean) {
  noStore();
  try {
    // const data = await sql<Answer>`SELECT * FROM answers ORDER BY id DESC`;
    // join using foreign key user_id
    // const userID = await validateRequest();
    let data: QueryResult<AnswerWithUserAndBookmarked>;
    if (userID) {
      if (bookmarked) {
        data = await sql<AnswerWithUserAndBookmarked>`SELECT answers.*, users.name, users.picture, bookmarks.user_id IS NOT NULL as bookmarked FROM answers JOIN users ON answers.user_id = users.id JOIN bookmarks ON answers.id = bookmarks.answer_id AND bookmarks.user_id = ${userID} ORDER BY answers.id DESC LIMIT 50`;
      } else {
        // Select only answers by the user
        data = await sql<AnswerWithUserAndBookmarked>`SELECT answers.*, users.name, users.picture, bookmarks.user_id IS NOT NULL as bookmarked FROM answers JOIN users ON answers.user_id = users.id LEFT JOIN bookmarks ON answers.id = bookmarks.answer_id AND bookmarks.user_id = ${userID} WHERE answers.user_id = ${userID} ORDER BY answers.id DESC LIMIT 50`;
        // data = await sql<AnswerWithUserAndBookmarked>`SELECT answers.*, users.name, users.picture, bookmarks.user_id IS NOT NULL as bookmarked FROM answers WHERE  JOIN users ON answers.user_id = users.id LEFT JOIN bookmarks ON answers.id = bookmarks.answer_id AND bookmarks.user_id = ${userID} ORDER BY answers.id DESC LIMIT 50`;
      }
    } else {
      data = await sql<AnswerWithUserAndBookmarked>`SELECT answers.*, users.name, users.picture, bookmarks.user_id IS NOT NULL as bookmarked FROM answers JOIN users ON answers.user_id = users.id LEFT JOIN bookmarks ON answers.id = bookmarks.answer_id ORDER BY answers.id DESC LIMIT 50`;
    }
    // console.log(data.rows)
    return data.rows
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch answers');
  }
}

export async function fetchUserInfo(id: string) {
  noStore();
  try {
    const data = await sql<User>`SELECT * FROM users WHERE id = ${id}`;
    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user info');
  }
}

export async function fetchComment(answerID: number) {
  noStore();
  try {
    const data = await sql<CommentWithUser>`SELECT comments.*, users.name, users.picture FROM comments JOIN users ON comments.user_id = users.id WHERE answer_id = ${answerID} ORDER BY comments.id DESC`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch comments');
  }
}

export async function intextSearch(corpus: CorpusName, search: string) {
  // fuzzy search from corpora table column content
  try {
    // console.log(`%${search}%`)
    let cleanSearch = search.trim()
    // If longer than 15 chars, remove leading and trailing 4 chars
    if (cleanSearch.length > 15) {
      cleanSearch = cleanSearch.slice(4, -4)
    }
    const data = await sql<CorporaSearch>`SELECT * FROM corpora WHERE id = ${corpus} AND content ILIKE ${`%${search}%`} LIMIT 3`;
    // console.log(data)
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch search results');
  }
}

export async function fetchLines(corpus: CorpusName, lineStart: number, lineEnd: number) {
  try {
    const data = await sql<CorporaSearch>`SELECT * FROM corpora WHERE id = ${corpus} AND line BETWEEN ${lineStart} AND ${lineEnd} ORDER BY line ASC`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch search results');
  }
}