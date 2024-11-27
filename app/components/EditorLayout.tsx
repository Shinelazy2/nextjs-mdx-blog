export default function EditorLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-[2000px]">
        {children}
      </div>
    </main>
  );
} 