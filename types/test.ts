export interface OptionInput {
  text: string;
}

export interface QuestionInput {
  title: string;
  body: string;
  image: string;
  type: "subjective" | "objective"; // 주관식, 객관식
  options?: OptionInput[];
}

export interface ResultInput {
  name: string;
  description: string;
  image: string;
  setting: string;
}

export interface UpdateTestInput {
  title: string;
  titleImage: string;
  questions: QuestionInput[];
  results: ResultInput[];
}
