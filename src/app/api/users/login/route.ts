import { DBconnect } from "@/db/config";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// DB connect
DBconnect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    console.log(reqBody);
    const { email, password } = reqBody;

    // check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User don't exist" }, { status: 400 });
    }

    // else we check the password
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // otherwise we create a JWT token
    // and send it as cookies to client side
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // create token
    const token = jwt.sign(tokenData, process.env.SECRET_TOKEN!, {
      expiresIn: "1h",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
