import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { "user-id": string } }
) {
  try {
    const { "user-id": userId } = await params;

    console.log(userId);

    return NextResponse.json({ msg: "성공" }, { status: 200 });
  } catch (err) {
    console.error("couple-code/couple-code-management > GET() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
