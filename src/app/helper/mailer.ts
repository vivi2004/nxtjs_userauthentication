import nodemailer from "nodemailer";
import User from "@/app/models/UserModel";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}) => {
  try {
    // Generate random token
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcryptjs.hash(token, 10);

    // Update user based on email type
    const updateFields: any = {};
    if (emailType === "VERIFY") {
      updateFields.verifyToken = hashedToken;
      updateFields.verifyTokenExpiry = Date.now() + 3600000; // 1 hour
    } else if (emailType === "RESET") {
      updateFields.forgotPasswordToken = hashedToken;
      updateFields.forgotPasswordTokenExpiry = Date.now() + 3600000;
    }

    await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    );

 // Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "fe1800fda06431",
    pass: "192316897c820e"
  }
});

    // Configure email content
    const subject = emailType === "VERIFY" 
      ? "Verify your email" 
      : "Reset your password";
      
    const actionPath = emailType === "VERIFY" 
      ? "verifyemail" 
      : "resetpassword";

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html: `<p>Click <a href="${process.env.DOMAIN}/${actionPath}?token=${token}&userId=${userId}">here</a> to ${
        emailType === "VERIFY" 
          ? "verify your email" 
          : "reset your password"
      }</p>`
    };

    // Send email
    return await transport.sendMail(mailOptions);

  } catch (error: any) {
    console.error("Email sending error:", error);
    throw new Error(error.message || "Failed to send email");
  }
};