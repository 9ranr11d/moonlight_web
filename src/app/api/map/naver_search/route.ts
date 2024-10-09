import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID: string = process.env.NAVER_SEARCH_CLIENT_ID!;
const CLIENT_SECRET: string = process.env.NAVER_SEARCH_ClIENT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { searchQuery }: { searchQuery: string } = await req.json();

    console.log(searchQuery);

    const response = await fetch(`https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(searchQuery)}&display=10&start=1&sort=random`, {
      headers: {
        "X-Naver-Client-Id": CLIENT_ID,
        "X-Naver-Client-Secret": CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch from Naver API");

      return NextResponse.json({ msg: "Failed to fetch data" }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Error in /src/app/api/auth/naver_search > POST() :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
