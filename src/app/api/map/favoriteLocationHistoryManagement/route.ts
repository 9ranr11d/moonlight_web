import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import FavoriteLocationHistory from "@models/FavoriteLocationHistory";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const _id: string | null = req.nextUrl.searchParams.get("_id");

    if (!_id) return NextResponse.json({ msg: "_id가 제공되지 않았습니다." }, { status: 400 });

    const histories = (await FavoriteLocationHistory.find({ _id })) || [];

    return NextResponse.json(histories, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/map/favoriteLocationHistoryManagement > GET :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}
