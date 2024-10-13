import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID: string = process.env.NAVER_SEARCH_CLIENT_ID!;
const CLIENT_SECRET: string = process.env.NAVER_SEARCH_ClIENT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { searchQuery }: { searchQuery: string } = await req.json();

    const response = await fetch(`https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(searchQuery)}&display=10&start=1&sort=random`, {
      headers: {
        "X-Naver-Client-Id": CLIENT_ID,
        "X-Naver-Client-Secret": CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      console.error("네이버 API에서 데이터를 가져오지 못했습니다.");

      return NextResponse.json({ msg: "데이터를 가져오지 못했습니다." }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("/src/app/api/auth/naver_search > POST()에서 오류가 발생했습니다. :", err);

    return NextResponse.json({ msg: "서버 오류입니다." }, { status: 500 });
  }
}
