import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User, { IIUser } from "@interfaces/index";

/** Identification 중복 여부 확인 */
export async function POST(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // Identification
    const { identification }: { identification: string } = await req.json();

    /** Identification와 일치하는 사용자 정보 */
    const user: IIUser | null = await User.findOne({ identification });

    // 해당 Identification를 가진 사용자가 있을 시 409 Error 반환
    if (user) return NextResponse.json({ msg: "이미 존재하는 Identification입니다." }, { status: 409 });

    // 해당 Identification를 가진 사용자가 없을 시 '사용 가능' 메세지 반환
    return NextResponse.json({ msg: "해당 Identification는 사용 가능합니다." }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/auth/checkDuplicateId > POST()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}
