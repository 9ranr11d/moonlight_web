import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({ msg: "success" }, { status: 200 });
  } catch (err) {
    console.error(
      "/src/app/api/map/favorite-location-history-management > GET :",
      err
    );

    return NextResponse.json(
      { msg: "서버 오류입니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
