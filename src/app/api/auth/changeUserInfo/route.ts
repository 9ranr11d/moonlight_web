import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User, { IIUser } from "@models/User";

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const { _id, nickname, email }: { _id: string; nickname: string; email: string } = await req.json();

    const updateFields: { nickname?: string; email?: string } = {};

    if (nickname) updateFields.nickname = nickname;

    if (email) updateFields.email = email;

    const user: IIUser | null = await User.findOne({ _id });

    // 일치하는 사용자가 없을 시 404 Error 반환
    if (!user) return NextResponse.json({ msg: "사용자를 찾지 못했습니다." }, { status: 404 });

    // DB 속 사용자의 비밀번호 변경
    await User.findByIdAndUpdate(_id, updateFields, { new: true });

    return NextResponse.json({ msg: "사용자 정보를 수정 완료햇습니다." }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/auth/changeUserInfo > PUT()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}
