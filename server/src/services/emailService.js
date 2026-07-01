// src/services/emailService.js
//
// Single reusable email service. Every transactional email in the app
// goes through sendEmail() here — no other file should create its own
// Nodemailer transporter.

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});
// console.log("Email config:", process.env.EMAIL_USER, process.env.EMAIL_APP_PASSWORD ? "PASSWORD_SET" : "PASSWORD_MISSING");

/**
 * Generic low-level sender. All template functions below call this.
 * @param {{ to: string, subject: string, html: string }} params
 */
export async function sendEmail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: `"PrintQ" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    // console.log(`✅ Email sent to ${to}: ${subject}`);
  } catch (err) {
    // Email failures should never block the main flow (registration,
    // login, etc.) — log and move on.
    console.error(`❌ Failed to send email to ${to}:`, err.message);
  }
}

/**
 * 1. Registration Received
 */
export async function sendRegistrationReceivedEmail(shop) {
  await sendEmail({
    to: shop.email,
    subject: 'PrintQ — Registration Received',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #EAB308;">PrintQ</h2>
        <p>Hi ${shop.ownerName},</p>
        <p>Thanks for registering <strong>${shop.shopName}</strong> on PrintQ.</p>
        <p>Your shop is currently <strong>under verification</strong>. We'll notify you by email once it's reviewed.</p>
        <p style="color: #6B7280; font-size: 13px; margin-top: 24px;">— Team PrintQ</p>
      </div>
    `,
  });
}

/**
 * 2. Shop Approved
 */
export async function sendShopApprovedEmail(shop) {
  await sendEmail({
    to: shop.email,
    subject: 'PrintQ — Your Shop Has Been Approved 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #E5E7EB; border-radius: 12px;">
        <h2 style="color: #EAB308; margin-bottom: 4px;">PrintQ</h2>
        <p style="margin-top: 0; color: #6B7280; font-size: 13px;">Campus Printing, Simplified</p>

        <div style="margin: 24px 0; padding: 12px 16px; background: #F0FDF4; border-left: 4px solid #22C55E; border-radius: 6px;">
          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #16A34A;">✅ Registration Approved</p>
        </div>

        <p>Hi <strong>${shop.ownerName}</strong>,</p>
        <p>Congratulations! <strong>${shop.shopName}</strong> has been approved on PrintQ.</p>
        <p>You can now log in and start accepting orders.</p>

        <p style="color: #6B7280; font-size: 13px; margin-top: 24px;">
          — Team PrintQ<br/>
          <a href="mailto:printqsupport@gmail.com" style="color: #EAB308;">printqsupport@gmail.com</a>
        </p>
      </div>
    `,
  });
}

/**
 * 3. Shop Rejected
 */
export async function sendShopRejectedEmail(shop, reason) {
  await sendEmail({
    to: shop.email,
    subject: 'PrintQ — Registration Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #E5E7EB; border-radius: 12px;">
        <h2 style="color: #EAB308; margin-bottom: 4px;">PrintQ</h2>
        <p style="margin-top: 0; color: #6B7280; font-size: 13px;">Campus Printing, Simplified</p>

        <div style="margin: 24px 0; padding: 12px 16px; background: #FEF2F2; border-left: 4px solid #EF4444; border-radius: 6px;">
          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #DC2626;">❌ Registration Rejected</p>
        </div>

        <p>Hi <strong>${shop.ownerName}</strong>,</p>
        <p>Unfortunately, your registration for <strong>${shop.shopName}</strong> was not approved.</p>
        ${reason ? `<p>Reason: <strong>${reason}</strong></p>` : ''}
        <p>If you believe this was a mistake, please contact our support team.</p>

        <p style="color: #6B7280; font-size: 13px; margin-top: 24px;">
          — Team PrintQ<br/>
          <a href="mailto:printqsupport@gmail.com" style="color: #EAB308;">printqsupport@gmail.com</a>
        </p>
      </div>
    `,
  });
}

/**
 * 4. Forgot Password OTP
 */
export async function sendForgotPasswordOtpEmail(shop, otp) {
  await sendEmail({
    to: shop.email,
    subject: 'PrintQ — Password Reset OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #EAB308;">PrintQ</h2>
        <p>Hi ${shop.ownerName},</p>
        <p>Your OTP to reset your password is:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #1F2937;">${otp}</p>
        <p>This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
        <p style="color: #6B7280; font-size: 13px; margin-top: 24px;">— Team PrintQ</p>
      </div>
    `,
  });
}

/**
 * 5. Password Changed Successfully
 */
export async function sendPasswordChangedEmail(shop) {
  await sendEmail({
    to: shop.email,
    subject: 'PrintQ — Password Changed Successfully',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #EAB308;">PrintQ</h2>
        <p>Hi ${shop.ownerName},</p>
        <p>Your password was changed successfully.</p>
        <p>If you didn't make this change, please contact our support team immediately.</p>
        <p style="color: #6B7280; font-size: 13px; margin-top: 24px;">— Team PrintQ</p>
      </div>
    `,
  });
}