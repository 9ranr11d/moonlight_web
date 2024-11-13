import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import FavoriteLocation, { IFavoriteLocation, IIFavoriteLocation } from "@models/FavoriteLocation";

/** 즐겨찾기한 장소 가져오기 */
export async function GET() {
  try {
    // DB 연결
    await dbConnect();

    /** 장소들 */
    const locations: IIFavoriteLocation[] | null = await FavoriteLocation.find();

    // 장소들 반환
    return NextResponse.json(locations, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/map/favoriteLocationManagement > GET()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}

/** 즐겨찾기 추가 */
export async function POST(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    /** 즐겨찾기 할 장소 정보 */
    const data: IFavoriteLocation = await req.json();

    /** 추가할 FavoriteLocation 객체 */
    const newFavoriteLocation: IIFavoriteLocation = new FavoriteLocation({
      ...data,
    });

    // FavoriteLocation 저장
    await newFavoriteLocation.save();

    // 성공 메세지 반환
    return NextResponse.json({ msg: "즐겨찾기에 등록했습니다." }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/map/favoriteLocationManagement > POST() :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}

/** 즐겨찾기 삭제 */
export async function DELETE(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    /** Kakao Map에서 부여한 Place id */
    const kakaoMapId = req.nextUrl.searchParams.get("id");
    /** 주소 */
    const addressName = req.nextUrl.searchParams.get("addressName");

    /** 삭제할 결과물들 */
    let deleteResult;

    // KakaoMapId가 있을 시
    if (kakaoMapId) deleteResult = await FavoriteLocation.deleteOne({ kakaoMapId });
    // 주소로 삭제 시
    else if (addressName) deleteResult = await FavoriteLocation.deleteOne({ addressName });
    // 일치하는 결과가 없을 시
    else return NextResponse.json({ msg: "삭제할 정보를 찾을 수 없습니다." }, { status: 400 });

    // 일치하는 결과 갯수가 없을 시
    if (deleteResult.deletedCount === 0) return NextResponse.json({ msg: "해당 즐겨찾기 장소를 찾을 수 없습니다." }, { status: 404 });

    // 성공 메세지 반환
    return NextResponse.json({ msg: "즐겨찾기를 삭제했습니다." }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/map/favoriteLocationManagement > DELETE() :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}
