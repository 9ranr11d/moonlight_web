import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    return NextResponse.json(
      { msg: "사용자 정보를 수정 완료햇습니다." },
      { status: 200 }
    );
  } catch (err) {
    console.error("/src/app/api/auth/change-user-info > PUT() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
