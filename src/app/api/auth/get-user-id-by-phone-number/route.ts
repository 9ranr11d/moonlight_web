import { query } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

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

    /** 결과 */
    const result = await query(
      `
      SELECT
        identification
      FROM
        users
      WHERE
        phone_number = ?
      `,
      [phoneNumber]
    );

    // 일치하는 사용자가 없을 시 404 Error 반환
    if (result.length === 0)
      return NextResponse.json(
        { msg: "사용자를 찾지 못했습니다." },
        { status: 404 }
      );

    const [user] = result; // 사용자 정보

    /** 아이디의 앞의 보여지는 부분 */
    const visible = user.identification.slice(0, 3);

    /** 일치하는 사용자의 가려진 아이디(앞에서부터 3자리 빼고 '*' 표시 ) */
    const modifiedId: string = `${visible}${"*".repeat(
      user.identification.length - visible.length
    )}`;

    // 블러 처리한 사용자 아이디 반환
    return NextResponse.json({ identification: modifiedId }, { status: 200 });
  } catch (err) {
    console.error("auth/get-user-id-by-phone-number > POST() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
