import { DBconnect } from "@/db/config";
import { NextRequest, NextResponse } from "next/server";

// DB connect
DBconnect();

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({
      message: "Log out successful",
      success: true,
    });

    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
