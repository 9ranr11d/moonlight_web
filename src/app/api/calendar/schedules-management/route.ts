import { NextRequest, NextResponse } from "next/server";

/** 일정 생성 */
export async function POST(req: NextRequest) {
  try {
    // 성공 Message 반환
    return NextResponse.json({ msg: "일정을 생성했습니다." }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/calendar/schedules-management > POST() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}

/** 일정 수정 */
export async function PUT(req: NextRequest) {
  try {
    // 성공 Message 반환
    return NextResponse.json({ msg: "일정을 수정했습니다." }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/calendar/schedules-management > PUT() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}

/** 일정 삭제 */
export async function DELETE(req: NextRequest) {
  try {
    // 성공 Message 반환
    return NextResponse.json({ msg: "일정을 삭제했습니다." }, { status: 200 });
  } catch (err) {
    console.error(
      "/src/app/api/calendar/schedules-management > DELETE() :",
      err
    );

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
