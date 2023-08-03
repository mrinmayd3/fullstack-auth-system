import { DBconnect } from "@/db/config";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

import { getDataFromToken } from "@/helpers/getDataFromToken";

// DB connect
DBconnect();

export async function GET(req: NextRequest) {
  try {
    const userId = await getDataFromToken(req);

    const user = await User.findById(userId).select("-password");

    return NextResponse.json({
      user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
