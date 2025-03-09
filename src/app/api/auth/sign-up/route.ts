import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

/** 회원가입 */
export async function POST(req: NextRequest) {
  try {
    // 아이디, 별명, 비밀번호
    const {
      identification,
      nickname,
      password,
      email,
    }: {
      identification: string;
      nickname: string;
      password: string;
      email: string;
    } = await req.json();

    /** 해싱된 비밀번호 */
    const hashedPw: string = await bcrypt.hash(password, 10);

    /** 회원가입 할 사용자 정보  */
    const newUser: IIUser = new User({
      identification,
      password: hashedPw,
      nickname,
      email,
      signUpMethod: "web",
      accessLevel: 0,
    });

    // 사용자 정보 저장
    await newUser.save();

    // 회원가입 성공 메세지 반환
    return NextResponse.json({ msg: "회원가입 되었습니다." }, { status: 200 });
  } catch (err) {
    console.error(
      "/src/app/api/auth/sign-up > POST()에서 오류가 발생했습니다. :",
      err
    );

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
