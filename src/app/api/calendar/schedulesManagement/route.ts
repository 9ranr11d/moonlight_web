import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import Schedule, { IISchedule, IIISchedule } from "@models/Schedule";

/** 일정 생성 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // date: 날짜, user: 사용자, title: 일정 제목, categories: 카테고리들, content: 내용, isRepeating: 반복 여부
    const { date, user, title, categories, content, isRepeating }: IISchedule = await req.json();

    /** 시작 날짜와 종료 날짜가 같은 일정인지 */
    let isSingleDate = true;

    // 시작 날짜와 종료 날짜가 다른 일정 확인
    if (date[0] !== date[1]) isSingleDate = false;

    /** 생성할 일정 정보 */
    const newSchedule: IIISchedule = new Schedule({
      date,
      isSingleDate,
      user,
      title,
      categories,
      content,
      isRepeating,
    });

    // 일정 저장
    await newSchedule.save();

    // 성공 메세지 반환
    return NextResponse.json({ msg: "성공했습니다." }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/calendar/schedulesManagement > POST()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}

/** 일정 수정 */
export async function PUT(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    // _id: 카테고리 _id, date: 날짜, user: 사용자, title: 일정 제목, categories: 카테고리들, content: 내용, isRepeating: 반복 여부
    const { _id, date, user, title, categories, content, isRepeating }: IIISchedule = await req.json();

    /** 수정할 일정 정보 */
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      _id,
      {
        date,
        user,
        title,
        categories,
        content,
        isRepeating,
      },
      { new: true }
    );

    // 수정할 일정이 없을 시 404에러 반환
    if (!updatedSchedule) return NextResponse.json({ msg: "사용자를 찾지 못했습니다." }, { status: 404 });

    // 성공 메세지 반환
    return NextResponse.json({ msg: "성공했습니다." }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/calendar/schedulesManagement > PUT()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}

/** 일정 삭제 */
export async function DELETE(req: NextRequest) {
  try {
    // DB 연결
    await dbConnect();

    /** Identification */
    const _id = req.nextUrl.searchParams.get("_id");

    // 일정 삭제
    await Schedule.findByIdAndDelete(_id);

    // 성공 메세지 반환
    return NextResponse.json({ msg: "성공했습니다." }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/calendar/schedulesManagement > DELETE()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}
