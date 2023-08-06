import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  //   secure: true, // use with https
  auth: {
    user: process.env.MAILGUN_USERNAME,
    pass: process.env.MAILGUN_PASSWORD,
  },
});

export const sendEmail = async (
  email: string,
  id: string,
  emailType: string
) => {
  try {
    // creating token
    const hashedToken = await bcrypt.hash(id.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(id, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 24 * (60 * 60 * 1000),
      });

      const verifyUrl = `${process.env.DOMAIN}/verify-email?token=${hashedToken}`;

      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: "mrinmaydey4870@gmail.com",
        to: email,
        subject: "Verify your email -- NEXT-AUTH",
        html: `
      <h1>Verify your email</h1>
      <p>Please click the link below to verify your email</p>
      <a href=${verifyUrl} clicktraking=off>${verifyUrl}</a>
  `,
      });

      console.log(info.messageId);

      return info;
    }

    if (emailType === "RESET") {
      await User.findByIdAndUpdate(id, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 10 * (60 * 1000),
      });

      const verifyUrl = `${process.env.DOMAIN}/reset-password?token=${hashedToken}`;

      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: "mrinmaydey4870@gmail.com",
        to: email,
        subject: "RESET PASSWORD -- NEXT-AUTH",
        html: `
      <h1>You requested for a reset password</h1>
      <p>Please click the link below to reset your password. The link will expire in 10 minutes</p>
      <a href=${verifyUrl} clicktraking=off>${verifyUrl}</a>
  `,
      });

      // console.log(info.messageId);

      return info;
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
