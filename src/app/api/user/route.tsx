import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import dbConnect from "@config/dbConnect";

import User from "@models/User";

/** 로그인 */
export async function GET(req: NextRequest) {
  try {
    console.log("hihihihi");
    await dbConnect();

    /** GET방식으로 가져온 id값 */
    const id = req.nextUrl.searchParams.get("id") as string;
    /** GET방식으로 가져온 pw값 */
    const pw = req.nextUrl.searchParams.get("pw") as string;

    /** id와 DB에 일치하는 id 존재 여부 */
    const userInfo = await User.findOne({ id: id });

    if (!userInfo) return NextResponse.json({ err: "User Not Found" }, { status: 404 }); // 일치하는 id가 없을 때

    /** pw를 해싱해서 DB 속 pw와 일치 여부 */
    const pwMatch = await bcrypt.compare(pw, userInfo.pw);

    if (!pwMatch) return NextResponse.json({ err: "Incorrect Password" }, { status: 401 }); // pw가 일치하지 않을 때

    return NextResponse.json(userInfo, { status: 200 });
  } catch (err) {
    console.error("User GET :", err);

    return NextResponse.json({ err: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { id, nickname, pw } = await req.json(); // body 속 변수

    /** 해싱된 Pw */
    const hashedPw = await bcrypt.hash(pw, 10);

    /**  */
    const newUser = new User({
      id,
      pw: hashedPw,
      nickname,
      accessLevel: 0,
    });

    await newUser.save();

    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.error("User POST: ", err);

    return NextResponse.json({ err: "Internal Server Error" }, { status: 500 });
  }
}
