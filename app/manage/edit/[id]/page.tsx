import MDXEditor from "@/app/components/MDXEditor";

export default function EditMdxPage({ params }: { params: { id: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-[950px]">
        <MDXEditor mode="edit" postId={parseInt(params.id)} />
      </div>
    </main>
  );
} 