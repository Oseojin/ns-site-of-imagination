// 📄 types/type.ts

export type TestCardData = {
  id: number;
  title: string;
  titleImage: string;
  _count: {
    likes: number;
  };
  isLiked: boolean;
};

export type QuestionType = "objective" | "subjective";

export type QuestionData = {
  id?: number;
  title: string;
  image: string;
  type: QuestionType;
  options: string[]; // 객관식일 경우만 사용됨
};

export type ResultData = {
  id?: number;
  name: string;
  description: string; // 사용자용 설명
  setting: string; // AI용 설명
  image: string;
};

export type MakeEditorInitialData = {
  title: string;
  titleImage: string;
  setting: string;
  questions: QuestionData[];
  results: ResultData[];
};

export type TestPayload = {
  title: string;
  titleImage: string;
  setting: string;
  questions: QuestionData[];
  results: ResultData[];
};

export type FooterButtonProps = {
  mode: "create" | "edit";
  testId?: number;
} & TestPayload;

export type IID = Promise<{ id: string }>;
