import { NextRequest, NextResponse } from "next/server";

/** 즐겨찾기한 장소 가져오기 */
export async function GET() {
  try {
    // 장소들 반환
    return NextResponse.json({ msg: "success" }, { status: 200 });
  } catch (err) {
    console.error(
      "/src/app/api/map/favorite-location-management > GET() :",
      err
    );

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}

/** 즐겨찾기 추가 */
export async function POST(req: NextRequest) {
  try {
    // 성공 Message 반환
    return NextResponse.json(
      { msg: "즐겨찾기에 등록했습니다." },
      { status: 200 }
    );
  } catch (err) {
    console.error(
      "/src/app/api/map/favorite-location-management > POST() :",
      err
    );

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}

/** 즐겨찾기 삭제 */
export async function DELETE(req: NextRequest) {
  try {
    // 성공 Message 반환
    return NextResponse.json(
      { msg: "즐겨찾기를 삭제했습니다." },
      { status: 200 }
    );
  } catch (err) {
    console.error(
      "/src/app/api/map/favorite-location-management > DELETE() :",
      err
    );

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
