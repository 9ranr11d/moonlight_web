import { NextRequest, NextResponse } from "next/server";

import { query } from "@/lib/dbConnect";

import { IVerificationInfo } from "@/interfaces/auth";

/** 본인인증 정보 저장 */
export async function PUT(req: NextRequest) {
  try {
    /** 본인인증 정보 */
    const { method, identification, info }: IVerificationInfo =
      await req.json();

    if (!method || !identification || !info)
      return NextResponse.json(
        { msg: "잘못된 요청 데이터입니다." },
        { status: 400 }
      );

    switch (method) {
      case "phoneNumber":
        await query(
          `
          UPDATE
            users
          SET
            phone_number = ?
          WHERE
            identification = ?
          `,
          [info, identification]
        );

        break;
      case "email":
      default:
        await query(
          `
          UPDATE
            users
          SET
            email = ?
          WHERE
            identification = ?
          `,
          [info, identification]
        );

        break;
    }

    console.log(
      `auth/save-verification-info > PUT() : '${identification}'의 ${info}(${method.toUpperCase()}) 정보가 저장되었습니다.`
    );

    // 성공 Message 반환
    return NextResponse.json(
      { msg: "본인인증 정보가 저장되었습니다." },
      { status: 200 }
    );
  } catch (err) {
    console.error("auth/save-verification-info > PUT() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
