import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User from "@models/User";

/** 커플 코드 유효성 검사 */
export async function POST(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // id: 다른 사용자 _id, coupleCode: 등록할 커플 코드
    const { id, coupleCode }: { id: string; coupleCode: string } = await req.json();

    /** 등록할 커플 코드를 지닌 사용자가 있는 지 확인 */
    const existingUser = await User.findOne({ coupleCode });

    // 등록할 커플 코드를 지닌 사용자가 없을 시
    if (!existingUser) return NextResponse.json({ msg: "사용자를 찾지 못했습니다." }, { status: 404 });

    // 해당 커플 코드를 등록
    await User.findByIdAndUpdate(id, { coupleCode }, { new: true });

    // 성공 메세지 반환
    return NextResponse.json({ msg: "커플 코드 발급되었습니다." }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/auth/registerCoupleCode > POST()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}
