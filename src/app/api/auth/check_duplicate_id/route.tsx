import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User from "@models/User";

/** id 중복 여부 확인 */
export async function POST(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // Identification
    const { id } = await req.json();

    /** id와 일치하는 사용자 정보 */
    const user = await User.findOne({ id: id });

    // 해당 id를 가진 사용자가 있을 시 409 Error 반환
    if (user) return NextResponse.json({ msg: "Identification Already in Use" }, { status: 409 });

    // 해당 id를 가진 사용자가 없을 시 '사용 가능' 메세지 반환
    return NextResponse.json({ msg: "Identification is Available" }, { status: 200 });
  } catch (err) {
    console.error("Check Duplicate Id POST :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
