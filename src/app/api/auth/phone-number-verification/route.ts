import { NextRequest, NextResponse } from "next/server";

import twilio from "twilio";

import { generateRandomCode } from "@utils/index";

export async function POST(req: NextRequest) {
  try {
    // 휴대전화 번호
    const { phoneNumber }: { phoneNumber: string } = await req.json();

    // 휴대전화 번호가 없을 경우
    if (!phoneNumber)
      return NextResponse.json(
        { msg: "휴대전화 번호를 입력해주세요." },
        { status: 400 }
      );

    /** 인증 코드 */
    const code: string = generateRandomCode(6);

    /** Twilio 설정 */
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // SMS 전송
    await client.messages.create({
      body: `Moonlight 인증 코드: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return NextResponse.json(
      {
        code: code,
        phoneNumber: phoneNumber,
        msg: `${phoneNumber}로 인증 코드를 전송했습니다.`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(
      "/src/app/api/auth/phone-number-verification > POST() :",
      err
    );

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
