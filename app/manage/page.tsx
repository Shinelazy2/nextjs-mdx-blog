import Link from "next/link";
import MdxManageList from "../components/MdxManageList";

export default function MdxManagePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-[950px]">
        <h1 className="text-2xl font-bold mb-6">MDX 관리</h1>
        <div className="flex justify-end mb-4">
          <Link 
            href="/manage/create" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            새 글 작성
          </Link>
        </div>
        <MdxManageList />
      </div>
    </main>
  );
} 