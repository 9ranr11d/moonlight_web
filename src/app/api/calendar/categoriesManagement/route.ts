import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import ScheduleCategory, { IScheduleCategory, IIScheduleCategory } from "@models/ScheduleCategory";

/** 카테고리들 가져오기 */
export async function GET() {
  try {
    // DB 연결
    await dbConnect();

    /** 카테고리들 */
    const categories: IIScheduleCategory[] | null = await ScheduleCategory.find();

    // 카테고리들 반환
    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/calendar/categoriesManagement > GET()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}

/** 카테고리 생성 */
export async function POST(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // title: 카테고리 이름, color: 카테고리 색상, createdBy: 만든 날짜
    const { title, color, createdBy }: IScheduleCategory = await req.json();

    /** 생설할 카테고리 정보 */
    const newScheduleCategory: IIScheduleCategory = new ScheduleCategory({
      title,
      color,
      createdBy,
    });

    // 카테고리 DB에 저장
    await newScheduleCategory.save();

    // 성공 메세지 반환
    return NextResponse.json({ msg: "카테고리를 생성했습니다." }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/calendar/categoriesManagement > POST()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}

/** 카테고리 정보 갱신 */
export async function PUT(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // Identification, 색상, 제목
    const { _id, color, title }: { _id: string; color: string; title: string } = await req.json();

    /** 카테고리 정보 갱신 */
    const updatedScheduleCategory = await ScheduleCategory.findByIdAndUpdate(_id, { color, title }, { new: true });

    // 갱신할 카테고리 정보를 못 찾았을 시 404에러 반환
    if (!updatedScheduleCategory) return NextResponse.json({ msg: "카테고리가 없습니다." }, { status: 404 });

    // 성공 메세지 반환
    return NextResponse.json(updatedScheduleCategory, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/calendar/categoriesManagement > PUT()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}

/** 카테고리 삭제 */
export async function DELETE(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    /** Identification */
    const _id = req.nextUrl.searchParams.get("_id");

    // 카테고리 삭제
    await ScheduleCategory.findByIdAndDelete(_id);

    // 성공 메세지 반환
    return NextResponse.json({ msg: "카테고리를 삭제했습니다." }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/calendar/categoriesManagement > DELETE()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}
