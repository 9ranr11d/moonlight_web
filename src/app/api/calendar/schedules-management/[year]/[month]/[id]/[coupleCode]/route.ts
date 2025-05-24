import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  year: string;
  month: string;
  id: string;
  coupleCode: string;
};

/**
 * 해당 달 +-1달 일정 정보 가져오기
 * @param year 연도
 * @param month 달
 * @param id 사용자 Id
 * @param coupleCode 커플 코드
 */
export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
): Promise<NextResponse> {
  try {
    /** 일정들 반환 */
    return NextResponse.json({ msg: "success" }, { status: 200 });
  } catch (err) {
    console.error(
      "/src/app/api/calendar/schedules-management/[year]/[month] > GET() :",
      err
    );

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
