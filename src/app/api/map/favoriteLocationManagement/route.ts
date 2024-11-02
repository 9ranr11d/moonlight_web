import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";
import FavoriteLocation, { IFavoriteLocation } from "@models/FavoriteLocation";

/** 즐겨찾기한 장소 가져오기 */
export async function GET() {
  try {
    // DB 연결
    await dbConnect();

    /** 장소들 */
    const locations: IFavoriteLocation[] | null = await FavoriteLocation.find();

    // 장소들 반환
    return NextResponse.json(locations, { status: 200 });
  } catch (err) {
    console.log("/src/app/api/map/favoriteLocationManagement > GET()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    return NextResponse.json({ msg: "성공했습니다." }, { status: 200 });
  } catch (err) {
    console.log("/src/app/api/map/favoriteLocationManagement > POST() :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}
