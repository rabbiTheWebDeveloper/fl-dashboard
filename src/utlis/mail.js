import nodemailer from "nodemailer";

async function sendWelcomeEmail({ toEmail, fullName, password }) {
  // 🔹 Gmail SMTP setup
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "su31f2@gmail.com", // your Gmail
      pass: process.env.GMAIL_APP_PASSWORD, // App Password, not your normal password
    },
  });

  const mailOptions = {
    from: `"AMARDokan" <rabbithedeveloper@gmail.com>`,
    to: toEmail,
    subject: "আপনার AMARDokan অ্যাকাউন্ট তৈরি হয়েছে",
    html: `
      <p>প্রিয় ${fullName},</p>
      <p>আপনার AMARDokan অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।</p>
      <p><strong>ইমেইল:</strong> ${toEmail}</p>
      <p><strong>পাসওয়ার্ড:</strong> ${password}</p>
      <p>লগইন করতে <a href="https://yourfrontend.com/login">এখানে ক্লিক করুন</a></p>
      <p>ধন্যবাদ,<br>AMARDokan টিম</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log("Email sent to", toEmail);
}

async function sendVerifyEmail({ toEmail, fullName, code, expiry }) {
  // 🔹 Gmail SMTP setup
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "su31f2@gmail.com", // your Gmail
      pass: process.env.GMAIL_APP_PASSWORD, // App Password, not your normal password
    },
  });

  const mailOptions = {
    from: `"AMARDokan" <su31f2@gmail.com>`,
    to: toEmail,
    subject: "আপনার AMARDokan ইমেইল ভেরিফিকেশন কোড",
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color: #2c3e50;">প্রিয় ${fullName},</h2>
      <p>আপনার AMARDokan অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।</p>
      <p>আপনার ইমেইল ভেরিফাই করার জন্য নিচের ৪-অঙ্কের কোডটি ব্যবহার করুন:</p>
      
      <div style="font-size: 24px; font-weight: bold; background: #f1f1f1; padding: 10px; display: inline-block; margin: 10px 0; letter-spacing: 4px;">
        ${code}
      </div>
      
      <p>এই কোডটি <strong>${expiry}</strong> পর্যন্ত বৈধ।</p>
      <p>লগইন করতে <a href="https://amardokan-two.vercel.app/login">এখানে ক্লিক করুন</a></p>
      <p>ধন্যবাদ,<br>AMARDokan টিম</p>
    </div>
  `,
  };

  await transporter.sendMail(mailOptions);
  // console.log("Email sent to", toEmail);
}
export { sendWelcomeEmail, sendVerifyEmail };
