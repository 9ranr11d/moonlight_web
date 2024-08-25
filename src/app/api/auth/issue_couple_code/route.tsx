import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User from "@models/User";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { _id, id }: { _id: string; id: string } = await req.json();

    let coupleCode = await issueCoupleCode();

    await User.findByIdAndUpdate(_id, { coupleCode: `${id}-${coupleCode}` }, { new: true });

    return NextResponse.json({ msg: "Couple code generated successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error in /src/app/api/auth/issue_couple_code > POST() :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const id = req.nextUrl.searchParams.get("id");
    const coupleCode = req.nextUrl.searchParams.get("coupleCode");

    if (!coupleCode) return NextResponse.json({ msg: "coupleCode is required" }, { status: 400 });

    const result = await User.updateOne({ _id: id, coupleCode }, { $unset: { coupleCode: "" } });

    if (result.modifiedCount === 0) return NextResponse.json({ msg: "No users found with the given coupleCode" }, { status: 404 });

    return NextResponse.json({ msg: "Success" }, { status: 200 });
  } catch (err) {
    console.error("Error in /src/app/api/auth/issue_couple_code > DELETE() :", err);

    return NextResponse.json({ msg: "Internal Server Error" });
  }
}

async function issueCoupleCode(): Promise<string> {
  let code;
  let existingUser;

  do {
    const seed = Math.random();

    code = seed.toString(36).substring(2, 11);

    existingUser = await User.findOne({ coupleCode: code });
  } while (existingUser);

  return code;
}
