// Updated mailer.ts implementation

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
    // Generate secure random token
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcryptjs.hash(token, 10);

    // Update user document with token
    const updateFields: any = {};
    const expiryTime = Date.now() + 3600000; // 1 hour
    
    if (emailType === "VERIFY") {
      updateFields.verifyToken = hashedToken;
      updateFields.verifyTokenExpiry = expiryTime;
    } else {
      updateFields.forgotPasswordToken = hashedToken;
      updateFields.forgotPasswordTokenExpiry = expiryTime;
    }

    await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    });

    // Configure email transport
    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAILTRAP_PORT),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    // Configure email content
    const emailSubject = emailType === "VERIFY" 
      ? "Verify Your Email Address" 
      : "Password Reset Request";

    const actionPath = emailType === "VERIFY" 
      ? "verify-email" 
      : "reset-password";

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">${emailSubject}</h2>
        <p>Please click the button below to ${
          emailType === "VERIFY" 
            ? "verify your email address" 
            : "reset your password"
        }:</p>
        
        <a href="${process.env.DOMAIN}/${actionPath}?token=${token}&userId=${userId}"
          style="display: inline-block; padding: 12px 24px; 
                 background-color: #2563eb; color: white; 
                 text-decoration: none; border-radius: 4px;
                 margin: 20px 0;">
          ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
        </a>

        <p style="color: #6b7280; font-size: 0.875rem;">
          This link will expire in 1 hour. If you didn't request this, 
          please ignore this email.
        </p>
      </div>
    `;

    // Send email
    return await transport.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: emailSubject,
      html: emailHtml,
    });

  } catch (error: any) {
    console.error("Email sending failed:", error);
    throw new Error(error.message || "Failed to send email");
  }
   };

   


