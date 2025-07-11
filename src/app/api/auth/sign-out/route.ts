import { NextResponse } from "next/server";

/** 로그아웃 */
export async function POST() {
  try {
    /** 만료 날짜(현재 시간 - 1) */
    const pastTime: Date = new Date(Date.now() - 1000);

    // Refresh Token을 저장한 Cookie 삭제
    return NextResponse.json(
      { msg: "로그아웃 되었습니다." },
      {
        status: 200,
        headers: {
          "Set-Cookie": `refreshToken=; HttpOnly; path=/; Expires=${pastTime.toUTCString()}; Max-Age=0; Secure; SameSite=Strict;`,
        },
      }
    );
  } catch (err) {
    console.error("auth/sign-out > POST() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
