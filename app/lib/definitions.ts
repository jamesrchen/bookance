import { corpora } from '@/config';

export type CorpusName = keyof typeof corpora;
export type Corpus = typeof corpora[keyof typeof corpora];
export const fileToTitle = new Map<string, string>(Object.entries(corpora).map(([name, corpus]) => {
  let entries: [string, string][] = Object.entries(corpus.files)
  if("extra" in corpus) {
    let extra = Object.entries(corpus.extra);
    entries = entries.concat(extra);
  }
  return entries;
}).flat(1));

export enum AnswerView {
  user = 'My Answers',
  all = 'All Answers',
  bookmarked = 'Bookmarked Answers',
}

export interface Answer {
  id: number;
  question: string;
  answer: string;
  user_id: string;
  corpora?: string[];
  extra: boolean;
  created_at: Date;
  hidden: boolean;
}

export interface AnswerWithUser extends Answer {
  name: string;
  picture: string;
}

export interface AnswerWithUserAndBookmarked extends AnswerWithUser {
  bookmarked: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  premium_until?: Date;
}

export interface UserWithPremiumCheck extends User {
  premium: boolean;
}

export interface Comment {
  id: number;
  answer_id: number;
  user_id: string;
  content: string;
  created_at: Date;
}

export interface CommentWithUser extends Comment {
  name: string;
  picture: string;
}

export interface CorporaSearch {
  id: string;
  line: number;
  content: string;
}