import { NextRequest, NextResponse } from "next/server";

/** 연인 식별자 유효성 검사 */
export async function POST(req: NextRequest) {
  try {
    // 성공 Message 반환
    return NextResponse.json(
      { msg: "연인 식별자 발급되었습니다." },
      { status: 200 }
    );
  } catch (err) {
    console.error("/src/app/api/auth/register-couple-code > POST() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
