import { NextResponse } from "next/server";

/** 로그아웃 */
export async function POST() {
  try {
    /** 만료 날짜(현재 시간 - 1) */
    const pastTime: Date = new Date(Date.now() - 1000);

    // Refresh Token을 저장한 Cookie 삭제
    return NextResponse.json(
      { msg: "Sign Out Success" },
      {
        status: 200,
        headers: { "Set-Cookie": `refreshToken=; HttpOnly; path=/; Expires=${pastTime.toUTCString()}; Max-Age=0; Secure; SameSite=Strict;` },
      }
    );
  } catch (err) {
    console.error("Error in /src/app/api/auth/sign_out > POST :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
