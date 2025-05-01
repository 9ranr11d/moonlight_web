import { NextRequest, NextResponse } from "next/server";

import { query } from "@lib/dbConnect";

import { TVerificationType } from "@interfaces/auth";

/** Email 중복 검사 */
export async function POST(req: NextRequest) {
  try {
    // Email
    const { email, type }: { email: string; type: TVerificationType } =
      await req.json();

    // Email이 없을 경우
    if (!email)
      return NextResponse.json(
        { msg: "Email을 입력해주세요." },
        { status: 400 }
      );

    /** 결과 */
    const result = await query(
      `
      SELECT
        COUNT(*) AS count
      FROM
        users
      WHERE
        email = ?
      `,
      [email]
    );

    /** 중복 여부 */
    const isDuplicate = result[0]?.count > 0;

    switch (type) {
      case "findId":
        console.log(
          "auth/check-duplicate-email > POST() :",
          `'${email}'(은)는 ${
            isDuplicate ? "등록된" : "등록되지 않은"
          } Email입니다.`
        );

        return NextResponse.json(
          { isRegistered: isDuplicate },
          { status: 200 }
        );

      case "signUp":
      default:
        // 중복 시
        if (isDuplicate) {
          console.log(
            "auth/check-duplicate-email > POST() :",
            `'${email}'(은)는 이미 사용 중인 Email입니다.`
          );

          return NextResponse.json(
            { msg: "해당 Email은 이미 사용 중인 Email입니다." },
            { status: 409 }
          );
        }

        console.log(
          "auth/check-duplicate-email > POST() :",
          `'${email}'(은)는 사용 가능한 Email입니다입니다.`
        );

        // Email 중복 여부 반환
        return NextResponse.json(
          { msg: "해당 Email은 사용 가능한 Email입니다." },
          { status: 200 }
        );
    }
  } catch (err) {
    console.error("auth/check-duplicate-email > POST() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
