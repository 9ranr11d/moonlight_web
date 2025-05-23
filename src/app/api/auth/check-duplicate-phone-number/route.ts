import { NextRequest, NextResponse } from "next/server";

import { query } from "@lib/dbConnect";

import { TVerificationType } from "@interfaces/auth";

/** 휴대전화 번호 중복 검사 */
export async function POST(req: NextRequest) {
  try {
    // 휴대전화 번호
    const {
      phoneNumber,
      identification,
      type,
    }: {
      phoneNumber: string;
      identification: string;
      type: TVerificationType;
    } = await req.json();

    // 휴대전화 번호이 없을 경우
    if (!phoneNumber)
      return NextResponse.json(
        { msg: "휴대전화 번호를 입력해주세요." },
        { status: 400 }
      );

    switch (type) {
      case "findPw":
        if (!identification)
          return NextResponse.json(
            { msg: "아이디를 입력해주세요." },
            { status: 400 }
          );

        /** 결과 */
        const resultI = await query(
          `
          SELECT COUNT(*) AS count
          FROM users
          WHERE phone_number = ? AND identification = ?
          `,
          [phoneNumber, identification]
        );

        /** 중복 여부 */
        const isMatch = resultI[0]?.count > 0;

        console.log(
          "auth/check-duplicate-phone-number > POST() :",
          `'${identification}'(과)와 '${phoneNumber}'(은)는 ${
            isMatch ? "등록된" : "등록되지 않은"
          } Email입니다.`
        );

        return NextResponse.json({ isRegistered: isMatch }, { status: 200 });
      case "findId":
      case "signUp":
      default:
        /** 결과 */
        const resultII = await query(
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
        const isRegistered = resultII[0]?.count > 0;

        if (type === "signUp") {
          // 중복 시
          if (isRegistered) {
            console.log(
              "auth/check-duplicate-phone-number > POST() :",
              `'${phoneNumber}'(은)는 이미 사용 중인 휴대전화 번호입니다.`
            );

            return NextResponse.json(
              {
                msg: "해당 휴대전화 번호는 이미 사용 중인 휴대전화 번호입니다.",
              },
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
        }

        console.log(
          "auth/check-duplicate-phone-number > POST() :",
          `'${phoneNumber}'(은)는 ${
            isRegistered ? "등록된" : "등록되지 않은"
          } 휴대전화 번호입니다.`
        );

        return NextResponse.json(
          { isRegistered: isRegistered },
          { status: 200 }
        );
    }
  } catch (err) {
    console.error("auth/check-duplicate-phone-number > POST() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
