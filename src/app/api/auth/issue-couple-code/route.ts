import { NextRequest, NextResponse } from "next/server";

/** 커플 코드 발급 */
export async function POST(req: NextRequest) {
  try {
    // 성공 Message 반환
    return NextResponse.json(
      { msg: "성공적으로 커플 코드가 발급되었습니다." },
      { status: 200 }
    );
  } catch (err) {
    console.error("/src/app/api/auth/issue-couple-code > POST() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}

/** 커플 코드 삭제 */
export async function DELETE(req: NextRequest) {
  try {
    // 성공 Message 반환
    return NextResponse.json({ msg: "성공했습니다." }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/auth/issue-couple-code > DELETE() :", err);

    return NextResponse.json({
      msg: "서버 오류입니다. 다시 시도해주세요.",
    });
  }
}

async function issueCoupleCode(): Promise<string> {
  let code;
  let existingUser;

  do {
    const seed = Math.random();

    code = seed.toString(36).substring(2, 11);
  } while (existingUser);

  return code;
}
