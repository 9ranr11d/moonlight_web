import { NextRequest, NextResponse } from "next/server";

import nodemailer from "nodemailer";

/** 관리자 E-mail Identification */
const ADMIN_MAIL: string = process.env.NODEMAILER_ID!;
/** 관리자 E-mail PassWord(앱 비밀번호) */
const ADMIN_PASSWORD: string = process.env.NODEMAILER_PW!;

/** 이메일 인증 */
export async function POST(req: NextRequest) {
  try {
    // E-mail
    const { email }: { email: string } = await req.json();

    /** 인증 코드 */
    const verificationCode: string = Math.random().toString(36).slice(2, 8);

    /** 인증 코드가 포함된 E-maili 양식 */
    const content: string = `
      <html>
        <head>
          <title>INMEDIC E-mail Verification</title>
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
          <h3>${verificationCode}</h3>  
        </body>
      </html>
    `;

    console.log("인증 코드 :", verificationCode);

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
      subject: "MOONLIGHT 이메일 인증",
      html: content,
    });

    // 인증 코드 반환
    return NextResponse.json({ verificationCode: verificationCode }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/auth/email_verification > POST()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류" }, { status: 500 });
  }
}
