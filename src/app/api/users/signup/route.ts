import { DBconnect } from "@/db/config";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { sendEmail } from "@/helpers/sendMail";

// DB connect
DBconnect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    console.log(reqBody);
    const { username, email, password } = reqBody;

    // check the user is exist or not
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exist" },
        { status: 400 }
      );
    }

    // otherwise
    // make a hash of the password and
    // make a new user
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();

    // send a verification email
    await sendEmail(savedUser.email, savedUser._id, "VERIFY");

    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        user: savedUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
