import { QueryResult, sql } from '@vercel/postgres';
import { Answer, AnswerWithUser, Comment, CommentWithUser, Corpus, User } from '@/app/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchAnswers(userID?: string) {
  noStore();
  try {
    // const data = await sql<Answer>`SELECT * FROM answers ORDER BY id DESC`;
    // join using foreign key user_id
    let data: QueryResult<AnswerWithUser>;
    if (userID) {
      data = await sql<AnswerWithUser>`SELECT answers.*, users.name, users.picture FROM answers JOIN users ON answers.user_id = users.id WHERE answers.user_id = ${userID} ORDER BY answers.id DESC LIMIT 50`;
    } else {
      data = await sql<AnswerWithUser>`SELECT answers.*, users.name, users.picture FROM answers JOIN users ON answers.user_id = users.id ORDER BY answers.id DESC LIMIT 50`;
    }
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