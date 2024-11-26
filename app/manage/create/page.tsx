import MDXEditor from "@/app/components/MDXEditor";

export default function CreateMdxPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-[950px]">
        <MDXEditor mode="create" />
      </div>
    </main>
  );
} 