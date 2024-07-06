export const Corpus =  {
  waiting_for_the_barbarians: {
    name: "Waiting for the Barbarians",
    files: [
      "file-UPKLAE3DQiqRmouZVfO73vc3",
      "file-Gxp17BlI6vYcuPRJ2IYU16oM",
      "file-OECDtEqo64BfPjL98ucC62Go",
      "file-mBGEWTEg7kccgPdQO6pENzwA",
      "file-vOOVuFbQLKlEUaVpCJ4CWqek",
      "file-8LgzGrvJR3WijsTPrZE8BYcQ"
    ]
  },
  death_and_the_maiden: {
    name: "Death and the Maiden",
    files: [
      "file-Bb2K6WxTxp7qx8eQsBh5Wzzm",
      "file-L8bjEw7GYvzFGDGvuwQQzzki",
      "file-X0MA6cQKBHDGBaOJF6nYGYW2",
      "file-N7VmUed5BatfdmYfWnM0aJjl",
      "file-LkqBEqG98EaaxfvayoXARvMm",
      "file-59axy9eBfUte4rJpZYNr2rbG",
      "file-Y9EtjArp8VQuogNAwLdy65EK",
      "file-cwgOVWf9ifJgTKG78a842JeZ",
      "file-5kLTitG822G7HQkAYXQYmkf3"
    ]
  }
} as const;

export type Corpus = typeof Corpus[keyof typeof Corpus];

export const fileToTitle = new Map<string, string>([
  ["file-UPKLAE3DQiqRmouZVfO73vc3", "WftB Chapter 1"],
  ["file-Gxp17BlI6vYcuPRJ2IYU16oM", "WftB Chapter 2"],
  ["file-OECDtEqo64BfPjL98ucC62Go", "WftB Chapter 3"],
  ["file-mBGEWTEg7kccgPdQO6pENzwA", "WftB Chapter 4"],
  ["file-vOOVuFbQLKlEUaVpCJ4CWqek", "WftB Chapter 5"],
  ["file-8LgzGrvJR3WijsTPrZE8BYcQ", "WftB Chapter 6"],
  ["file-Bb2K6WxTxp7qx8eQsBh5Wzzm", "DatM Act 1 Scene 1"],
  ["file-L8bjEw7GYvzFGDGvuwQQzzki", "DatM Act 1 Scene 2"],
  ["file-X0MA6cQKBHDGBaOJF6nYGYW2", "DatM Act 1 Scene 3"],
  ["file-N7VmUed5BatfdmYfWnM0aJjl", "DatM Act 1 Scene 4"],
  ["file-LkqBEqG98EaaxfvayoXARvMm", "DatM Act 2 Scene 1"],
  ["file-59axy9eBfUte4rJpZYNr2rbG", "DatM Act 2 Scene 2"],
  ["file-Y9EtjArp8VQuogNAwLdy65EK", "DatM Act 3 Scene 1"],
  ["file-cwgOVWf9ifJgTKG78a842JeZ", "DatM Act 3 Scene 2"],
  ["file-5kLTitG822G7HQkAYXQYmkf3", "DatM Afterword"]
])

export interface Answer {
  id: number;
  question: string;
  answer: string;
  user_id: string;
  corpora?: string[];
}

export interface AnswerWithUser extends Answer {
  name: string;
  picture: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
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