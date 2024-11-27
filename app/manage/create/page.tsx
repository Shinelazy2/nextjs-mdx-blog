import MDXEditor from "@/app/components/MDXEditor";
import EditorLayout from "@/app/components/EditorLayout";

export default function CreateMdxPage() {
  return (
    <EditorLayout>
      <MDXEditor mode="create" />
    </EditorLayout>
  );
} 