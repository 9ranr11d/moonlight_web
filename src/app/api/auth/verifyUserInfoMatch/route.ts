import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User, { IIUser } from "@models/User";

/** E-mail 일치 여부 */
export async function POST(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // E-mail
    const { email }: { email: string } = await req.json();

    /** E-mail과 일치하는 사용자 정보 */
    const user: IIUser[] | null = await User.findOne({ email });

    // 일치하는 사용자가 없을 시 404 Error 반환
    if (!user) return NextResponse.json({ msg: "사용자를 찾지 못했습니다." }, { status: 404 });

    // 일치하는 사용자가 있을 시 성공 메세지 반환
    return NextResponse.json({ msg: "유효한 E-mail입니다." }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/auth/verifyUserInfoMatch > POST()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}
