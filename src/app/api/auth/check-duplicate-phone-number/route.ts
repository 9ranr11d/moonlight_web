import { NextRequest, NextResponse } from "next/server";

import { query } from "@lib/dbConnect";

/** 휴대전화 번호 중복 검사 */
export async function POST(req: NextRequest) {
  try {
    // 휴대전화 번호
    const { phoneNumber } = await req.json();

    // 휴대전화 번호이 없을 경우
    if (!phoneNumber)
      return NextResponse.json(
        { msg: "휴대전화 번호를 입력해주세요." },
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
        phone_number = ?
      `,
      [phoneNumber]
    );

    /** 중복 여부 */
    const isDuplicate = result[0]?.count > 0;

    // 중복 시
    if (isDuplicate) {
      console.log(
        "auth/check-duplicate-phone-number > POST() :",
        `'${phoneNumber}'(은)는 이미 사용 중인 휴대전화 번호입니다.`
      );

      return NextResponse.json(
        { msg: "해당 휴대전화 번호는 이미 사용 중인 휴대전화 번호입니다." },
        { status: 409 }
      );
    }

    console.log(
      "auth/check-duplicate-phone-number > POST() :",
      `'${phoneNumber}'(은)는 사용 가능한 휴대전화 번호입니다.`
    );

    // 휴대전화 번호 중복 여부 반환
    return NextResponse.json(
      { msg: "해당 휴대전화 번호는 사용 가능한 휴대전화 번호입니다." },
      { status: 200 }
    );
  } catch (err) {
    console.error("auth/check-duplicate-phone-number > POST() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
