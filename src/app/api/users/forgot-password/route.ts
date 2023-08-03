import { DBconnect } from "@/db/config";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/sendMail";

// DB connect
DBconnect();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // console.log(email);

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User don't exist" }, { status: 400 });
    }

    //  send reset password email
    const info = await sendEmail(user.email, user._id, "RESET");

    console.log(info);

    if (info?.messageId) {
      return NextResponse.json(
        {
          message: "Reset password email sent successfully",
          success: true,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
