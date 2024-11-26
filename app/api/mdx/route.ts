import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    // content 변수 사용 예시
    console.log("받은 MDX 내용:", content);

    // 여기서 실제 백엔드 로직을 구현합니다
    // 예: 데이터베이스에 저장
    // TODO: axios : http://localhost:3000/mdx/save
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    // error 타입 지정
    console.error("에러 발생:", err);
    return NextResponse.json(
      { error: "MDX 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
