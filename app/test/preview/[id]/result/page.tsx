import PreviewResultPage from "@/components/PreviewResultPage";
import { IID } from "@/types/type";

export default async function PreviewResultEdit(params: { params: IID }) {
  return (
    <PreviewResultPage
      mode="edit"
      testId={parseInt((await params.params).id, 10)}
    />
  );
}
