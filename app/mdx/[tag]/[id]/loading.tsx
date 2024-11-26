export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-[950px]">
        <div className="animate-pulse">
          <div className="h-10 w-3/4 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-1/4 bg-gray-200 rounded mb-8" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}
