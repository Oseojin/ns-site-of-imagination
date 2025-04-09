export type Test = {
  id: number;
  title: string;
  titleImage: string;
  createdAt: string;
};

export type IParams = Promise<{ id: string }>;
export type ILikes = Promise<{ id: number }>;

export type Option = {
  text: string;
};

export type QuestionType = "subjective" | "objective";

export type Result = {
  id: number;
  name: string;
  description: string;
  image: string;
  setting: string;
};

export type Question = {
  id: number;
  title: string;
  image: string;
  type: QuestionType;
  options: Option[];
};

export type TestData = {
  title: string;
  titleImage: string;
  questions: Question[];
  results: Result[];
};

export type TestPayload = {
  title: string;
  titleImage: string;
  questions: {
    text: string;
    type: QuestionType;
    imageUrl: string;
    options: string[];
  }[];
  results: {
    name: string;
    description: string;
    imageUrl: string;
  }[];
};
