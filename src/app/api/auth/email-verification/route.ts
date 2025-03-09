import { NextRequest, NextResponse } from "next/server";

import nodemailer from "nodemailer";

import { generateRandomCode } from "@utils/index";

/** 관리자 E-mail 아이디 */
const ADMIN_MAIL: string = process.env.NODEMAILER_ID!;
/** 관리자 E-mail PassWord(앱 비밀번호) */
const ADMIN_PASSWORD: string = process.env.NODEMAILER_PW!;

/** E-mail 인증 */
export async function POST(req: NextRequest) {
  try {
    // E-mail
    const { email }: { email: string } = await req.json();

    // E-mail이 없을 경우
    if (!email)
      return NextResponse.json(
        { msg: "이메일을 입력해주세요." },
        { status: 400 }
      );

    /** 인증 코드 */
    const code: string = generateRandomCode(6);

    /** 인증 코드가 포함된 E-maili 양식 */
    const content: string = `
      <html>
        <head>
          <title>Moonlight E-mail Verification</title>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">

          <style>
            html, body {
              padding: 0;
              margin: 0;
            }
        
            ul, li {
              list-style: none;
              list-style-position: outside;
              padding: 0;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <h3>${code}</h3>  
        </body>
      </html>
    `;

    /** 송신할 관리자 E-mail 정보 */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      host: "smtp.gmail.com",
      secure: false,
      requireTLS: true,
      auth: {
        user: ADMIN_MAIL,
        pass: ADMIN_PASSWORD,
      },
    });

    // E-mail 송신
    await transporter.sendMail({
      from: ADMIN_MAIL,
      to: email,
      subject: "MOONLIGHT E-mail 인증",
      html: content,
    });

    // 인증 코드 반환
    return NextResponse.json({ code: code, email: email }, { status: 200 });
  } catch (err) {
    console.error(
      "/src/app/api/auth/email-verification > POST()에서 오류가 발생했습니다. :",
      err
    );

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
