import { NextResponse } from "next/server";

/** 심사 통과된 사용자 명단 가져오기 */
export async function GET() {
  try {
    // 심사 통과된 사용자 명단 반환
    return NextResponse.json({ msg: "성공" }, { status: 200 });
  } catch (err) {
    console.error(
      "/src/app/api/auth/get-users-with-high-access-level > GET() :",
      err
    );

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
