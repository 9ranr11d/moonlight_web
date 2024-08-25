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
    if (!user) return NextResponse.json({ msg: "User Not Found" }, { status: 404 });

    // 일치하는 사용자가 있을 시 성공 메세지 반환
    return NextResponse.json({ msg: "E-mail is Available" }, { status: 200 });
  } catch (err) {
    console.error("Error in /src/app/api/auth/verify_user_info_match > POST() :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
