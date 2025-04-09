export type Test = {
  id: number;
  title: string;
  titleImage: string;
  createdAt: string;
};

export type TestWithLikes = Test & {
  likeCount: number;
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
    title: string; // ✅ 일관된 이름
    type: QuestionType;
    image: string;
    options: { text: string }[]; // ✅ Option[] 형태로 통일
  }[];
  results: {
    name: string;
    description: string;
    image: string;
  }[];
};
