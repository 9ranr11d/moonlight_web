import { NextRequest, NextResponse } from "next/server";

import nodemailer from "nodemailer";

import { generateRandomCode } from "@/utils";
import { MAIN_DOMAIN } from "@/constants";

/** 관리자 Email 아이디 */
const ADMIN_MAIL: string = process.env.NODEMAILER_ID!;
/** 관리자 Email PassWord(앱 비밀번호) */
const ADMIN_PASSWORD: string = process.env.NODEMAILER_PW!;

/** Email 인증 */
export async function POST(req: NextRequest) {
  try {
    // Email
    const { email }: { email: string } = await req.json();

    // Email이 없을 경우
    if (!email)
      return NextResponse.json(
        { msg: "이메일을 입력해주세요." },
        { status: 400 }
      );

    /** 인증 코드 */
    const code: string = generateRandomCode(6);

    /** 인증 코드가 포함된 Emaili 양식 */
    const content: string = `
      <html>
        <head>
          <title>Moonlight Email Verification</title>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <style>
            html,
            body {
              padding: 0;
              margin: 0;
            }

            body {
              font-family: "Pretendard-Regular";
              font-size: 12px;
              font-weight: 400;
              color: #111;
            }

            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
              font-family: "pretendard_bold";
              margin: auto;
            }

            h1 {
              font-size: 66px;
              font-weight: 800;
              line-height: 130%;
            }

            h2 {
              font-size: 50px;
              font-weight: 800;
              line-height: 130%;
            }

            h3 {
              font-size: 32px;
              font-weight: 700;
              line-height: 130%;
            }

            h4 {
              font-size: 28px;
              font-weight: 700;
              line-height: 130%;
            }

            h5 {
              font-size: 24px;
              font-weight: 600;
              line-height: 130%;
            }

            h6 {
              font-size: 18px;
              font-weight: 600;
              line-height: 140%;
            }

            a {
              color: inherit;
            }

            a:hover {
              color: #808080;
            }

            ul,
            li {
              list-style: none;
              list-style-position: outside;
              padding: 0;
              margin: 0;
            }

            @font-face {
              font-family: "Pretendard-Regular";
              src: url("https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff")
                format("woff");
              font-weight: 400;
              font-style: normal;
            }

            @font-face {
              font-family: "Pretendard-Bold";
              src: url("https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Bold.woff") format("woff");
              font-weight: 700;
              font-style: normal;
            }

            .code {
              color: #b67a80;
            }

            .code:hover {
              color: #ae5861;
            }

            .footerTitle:hover {
              color: #333333;
            }
          </style>
        </head>

        <body style="background: #f9f9f9">
          <div style="width: 600px; background: white; margin: auto">
            <header style="position: relative">
              <a href="${MAIN_DOMAIN}">
                <img
                  src="https://drive.google.com/uc?export=view&id=1eTMr8H6d8doonyrQ0nrc6N4nIXKJXyKe"
                  style="position: absolute; top: 10px; left: 10px; width: 150px"
                  alt="MOONLIGHT"
                />
              </a>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <colgroup>
                  <col width="30%" />
                  <col width="40%" />
                  <col width="30%" />
                </colgroup>

                <tr>
                  <td style="border-bottom: 3px solid #ccc"></td>

                  <td align="center" style="border-bottom: 5px solid #333">
                    <h3 style="margin: 20px 0 10px; font-size: 24px">Email 인증</h3>
                  </td>

                  <td style="border-bottom: 3px solid #ccc"></td>
                </tr>
              </table>
            </header>

            <main style="margin: 20px 0 30px">
              <p style="text-align: center">
                <a href="${MAIN_DOMAIN}">MOONLIGHT</a>에서 Email 인증 코드가 발급되었습니다.
              </p>

              <div style="background: #f9f9f9; padding: 20px 10px; border-radius: 3px; margin: 0px 20px">
                <h4 style="text-align: center; color: #b67a80">${code}</h4>
              </div>

              <p style="text-align: center">
                해당 코드를 직접 인증 코드 입력칸에 입력하거나,
                <br />
                해당 코드를 복사하여 인증 코드 입력칸에 붙여넣기 해주세요.
              </p>
            </main>

            <footer style="background: #4d4d4d; padding: 20px; color: white">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <colgroup>
                  <col />
                  <col width="100%" />
                </colgroup>

                <tr>
                  <td>
                    <a href="${MAIN_DOMAIN}" class="footerTitle">
                      <h6>MOONLIGHT</h6>
                    </a>
                  </td>

                  <td></td>
                </tr>
              </table>

              <p>© 2024 9ranr11d. All rights reserved.</p>
            </footer>
          </div>
        </body>
      </html>
    `;

    /** 송신할 관리자 Email 정보 */
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

    // Email 송신
    await transporter.sendMail({
      from: ADMIN_MAIL,
      to: email,
      subject: "MOONLIGHT Email 인증",
      html: content,
    });

    console.log(
      "auth/email-verification > POST() :",
      `'${email}'(으)로 인증 코드 '${code}' 전송했습니다.`
    );

    // 인증 코드 반환
    return NextResponse.json(
      {
        code: code,
        email: email,
        msg: "해당 이메일로 인증 코드를 전송했습니다.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("auth/email-verification > POST() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
