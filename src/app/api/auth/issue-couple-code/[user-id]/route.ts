import { NextRequest, NextResponse } from "next/server";

import { query } from "@/lib/dbConnect";

import { ACCESS_LEVEL } from "@/constants";

/** 연인 식별자 발급 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ "user-id": string }> }
) {
  try {
    const { "user-id": userId } = await context.params;

    const code = await issueCoupleCode();

    // 트랜잭션 시작
    await query("START TRANSACTION");

    try {
      // couple_codes 테이블에 코드 삽입
      await query(
        `
        INSERT INTO
          couple_codes (
            couple_code
          )
        VALUES (
          ?
        )
        `,
        [code]
      );

      // couple_code_users 테이블에 사용자와 코드 연결
      await query(
        `
        INSERT INTO
          couple_code_users (
            couple_code,
            access_level,
            user_id
          )
        VALUES (
          ?,
          ?,
          ?
        )
        `,
        [code, ACCESS_LEVEL.ADMIN, userId]
      );

      console.log(typeof ACCESS_LEVEL.ADMIN, ACCESS_LEVEL.ADMIN);

      // 트랜잭션 커밋
      await query("COMMIT");

      console.log(
        `'${userId}'님에 의해 연인 식별자(${code})가 발급되었습니다.`
      );

      // 성공 Message 반환
      return NextResponse.json(
        { msg: "성공적으로 연인 식별자가 발급되었습니다.", coupleCode: code },
        { status: 200 }
      );
    } catch (err) {
      // 오류 발생 시 롤백
      await query("ROLLBACK");

      throw err;
    }
  } catch (err) {
    console.error("/src/app/api/auth/issue-couple-code > POST() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}

/** 연인 식별자 삭제 */
export async function DELETE(req: NextRequest) {
  try {
    // 성공 Message 반환
    return NextResponse.json({ msg: "성공했습니다." }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/auth/issue-couple-code > DELETE() :", err);

    return NextResponse.json({
      msg: "서버 오류입니다. 다시 시도해주세요.",
    });
  }
}

async function issueCoupleCode(): Promise<string> {
  let code;
  let existingUser;

  do {
    const seed = Math.random();
    code = seed.toString(36).substring(2, 11);

    const result = await query(
      `
      SELECT
        *
      FROM
        couple_codes
      WHERE
        couple_code = ?
      `,
      [code]
    );

    existingUser = result.length > 0;
  } while (existingUser);

  return code;
}
