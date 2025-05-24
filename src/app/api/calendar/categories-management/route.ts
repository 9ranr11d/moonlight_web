import { NextRequest, NextResponse } from "next/server";

/** 카테고리들 가져오기 */
export async function GET() {
  try {
    // 카테고리들 반환
    return NextResponse.json({ msg: "성공" }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/calendar/categories-management > GET() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}

/** 카테고리 생성 */
export async function POST(req: NextRequest) {
  try {
    // 성공 Message 반환
    return NextResponse.json(
      { msg: "카테고리를 생성했습니다." },
      { status: 200 }
    );
  } catch (err) {
    console.error(
      "/src/app/api/calendar/categories-management > POST() :",
      err
    );

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}

/** 카테고리 정보 갱신 */
export async function PUT(req: NextRequest) {
  try {
    // 성공 Message 반환
    return NextResponse.json({ msg: "success" }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/calendar/categories-management > PUT() :", err);

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}

/** 카테고리 삭제 */
export async function DELETE(req: NextRequest) {
  try {
    // 성공 Message 반환
    return NextResponse.json(
      { msg: "카테고리를 삭제했습니다." },
      { status: 200 }
    );
  } catch (err) {
    console.error(
      "/src/app/api/calendar/categories-management > DELETE() :",
      err
    );

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
