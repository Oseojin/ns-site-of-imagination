import PreviewQuestionPage from "@/components/PreviewQuestionPage";
import { IID } from "@/types/type";

export default async function PreviewQuestionsEdit(params: { params: IID }) {
  return (
    <PreviewQuestionPage
      mode="edit"
      testId={parseInt((await params.params).id, 10)}
    />
  );
}
