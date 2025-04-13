import { IID } from "@/types/type";
import PreviewIntroPage from "@/components/PreviewIntroPage";

export default async function PreviewEdit(params: { params: IID }) {
  return (
    <PreviewIntroPage
      mode="edit"
      testId={parseInt((await params.params).id, 10)}
    />
  );
}
