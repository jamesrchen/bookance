import { QueryResult, sql } from '@vercel/postgres';
import { Answer, AnswerWithUser, AnswerWithUserAndBookmarked, Comment, CommentWithUser, CorporaSearch, Corpus, CorpusName, User, UserWithPremiumCheck } from '@/app/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { validateRequest } from '@/app/lib/auth';

export async function fetchAnswers(userID?: string, bookmarked?: boolean) {
  noStore();
  let currentUser = await validateRequest();
  if (!currentUser) {
    throw new Error("User not authenticated");
  }
  try {
    let data: QueryResult<AnswerWithUserAndBookmarked>;
    if (userID) {
      if (bookmarked) {
        data = await sql<AnswerWithUserAndBookmarked>`
          SELECT answers.*, users.name, users.picture, bookmarks.user_id IS NOT NULL as bookmarked FROM answers 
          JOIN users ON answers.user_id = users.id 
          JOIN bookmarks ON answers.id = bookmarks.answer_id AND bookmarks.user_id = ${currentUser.id} 
          ORDER BY answers.id DESC LIMIT 50`;
      } else {
        // Select only answers by the user
        data = await sql<AnswerWithUserAndBookmarked>`
          SELECT answers.*, users.name, users.picture, bookmarks.user_id IS NOT NULL as bookmarked FROM answers 
          JOIN users ON answers.user_id = users.id LEFT 
          JOIN bookmarks ON answers.id = bookmarks.answer_id AND bookmarks.user_id = ${currentUser.id}
          WHERE answers.user_id = ${userID} 
          ORDER BY answers.id DESC LIMIT 50`;
      }
    } else {
      data = await sql<AnswerWithUserAndBookmarked>`
        SELECT answers.*, users.name, users.picture, bookmarks.user_id IS NOT NULL as bookmarked FROM answers 
        JOIN users ON answers.user_id = users.id LEFT 
        JOIN bookmarks ON answers.id = bookmarks.answer_id AND bookmarks.user_id = ${currentUser.id}
        ORDER BY answers.id DESC LIMIT 50`;
    }
    return data.rows
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch answers');
  }
}

export async function fetchUserInfo(id: string): Promise<UserWithPremiumCheck> {
  noStore();
  console.log("Calling val2")
  try {
    const data = await sql<User>`SELECT * FROM users WHERE id = ${id}`;
    if (data.rows.length === 0) {
      throw new Error('User not found');
    }
    let user: UserWithPremiumCheck = {... data.rows[0], premium: false};
    if (user.premium_until && user.premium_until > new Date()) {
      user.premium = true;
    }

    return user;
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
    let cleanSearch = search.trim()
    // If longer than 15 chars, remove leading and trailing 4 chars
    if (cleanSearch.length > 15) {
      cleanSearch = cleanSearch.slice(4, -4)
    }
    const data = await sql<CorporaSearch>`SELECT * FROM corpora WHERE id = ${corpus} AND content ILIKE ${`%${search}%`} LIMIT 3`;
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