import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User, { IIUser } from "@interfaces/auth/index";

/** 해당 id를 가진 사용자가 존재하는 확인 */
export async function POST(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // 아이디
    const { identification }: { identification: string } = await req.json();

    /** Identification와 일차하는 사용자 정보 */
    const user: IIUser | null = await User.findOne({ identification });

    // 일치하는 사용자가 없을 시 404 Error 반환
    if (!user)
      return NextResponse.json(
        { msg: "사용자를 찾지 못했습니다." },
        { status: 404 }
      );

    // 일차하는 사용자의 아이디, email 반환
    return NextResponse.json(
      { identification: user.identification, email: user.email },
      { status: 200 }
    );
  } catch (err) {
    console.error("/src/app/api/auth/check-id > POST() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요.입니다." },
      { status: 500 }
    );
  }
}
