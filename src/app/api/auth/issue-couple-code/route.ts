import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User from "@interfaces/auth/index";

/** 커플 코드 발급 */
export async function POST(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // _id: 사용자 _id, id: 사용자 identification
    const { _id, id }: { _id: string; id: string } = await req.json();

    /** 발급된 커플 코드 */
    const coupleCode = await issueCoupleCode();

    // 발급된 커플 코드를 저장
    await User.findByIdAndUpdate(
      _id,
      { coupleCode: `${id}-${coupleCode}` },
      { new: true }
    );

    // 성공 메세지 반환
    return NextResponse.json(
      { msg: "성공적으로 커플 코드가 발급되었습니다." },
      { status: 200 }
    );
  } catch (err) {
    console.error(
      "/src/app/api/auth/issue-couple-code > POST()에서 오류가 발생했습니다. :",
      err
    );

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요.입니다." },
      { status: 500 }
    );
  }
}

/** 커플 코드 삭제 */
export async function DELETE(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    /** 삭제할 사용자의 _id */
    const id = req.nextUrl.searchParams.get("id");
    /** 삭제할 커플 코드 */
    const coupleCode = req.nextUrl.searchParams.get("coupleCode");

    // 전송된 커플 코드가 있는 지 확인
    if (!coupleCode)
      return NextResponse.json(
        { msg: "커플 코드가 필요합니다." },
        { status: 400 }
      );

    /** _id와 커플 코드가 일치한 사용자의 커플 코드 삭제 */
    const result = await User.updateOne(
      { _id: id, coupleCode },
      { $unset: { coupleCode: "" } }
    );

    // _id와 커플 코드가 일치한지 확인
    if (result.modifiedCount === 0)
      return NextResponse.json(
        { msg: "해당 커플 코드로 사용자를 찾을 수 없습니다." },
        { status: 404 }
      );

    // 성공 메세지 반환
    return NextResponse.json({ msg: "성공했습니다." }, { status: 200 });
  } catch (err) {
    console.error(
      "/src/app/api/auth/issue-couple-code > DELETE()에서 오류가 발생했습니다. :",
      err
    );

    return NextResponse.json({
      msg: "서버 오류입니다. 다시 시도해주세요.입니다.",
    });
  }
}

async function issueCoupleCode(): Promise<string> {
  let code;
  let existingUser;

  do {
    const seed = Math.random();

    code = seed.toString(36).substring(2, 11);

    existingUser = await User.findOne({ coupleCode: code });
  } while (existingUser);

  return code;
}
