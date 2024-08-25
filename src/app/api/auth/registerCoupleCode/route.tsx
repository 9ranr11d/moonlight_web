import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@lib/dbConnect";

import User from "@models/User";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { id, coupleCode }: { id: string; coupleCode: string } = await req.json();

    const existingUser = await User.findOne({ coupleCode });

    if (!existingUser) return NextResponse.json({ msg: "User Not Found" }, { status: 404 });

    await User.findByIdAndUpdate(id, { coupleCode }, { new: true });

    return NextResponse.json({ msg: "Success" }, { status: 200 });
  } catch (err) {
    console.error("Error in /src/app/api/auth/registerCoupleCode > POST() :", err);

    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
