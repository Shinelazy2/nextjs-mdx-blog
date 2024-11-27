import MDXEditor from "@/app/components/MDXEditor";
import EditorLayout from "@/app/components/EditorLayout";

export default function EditMdxPage({ params }: { params: { id: string } }) {
  return (
    <EditorLayout>
      <MDXEditor mode="edit" postId={parseInt(params.id)} />
    </EditorLayout>
  );
} 