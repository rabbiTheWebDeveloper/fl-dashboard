import nodemailer from "nodemailer";

async function sendWelcomeEmail({ toEmail, fullName, password }) {
  // 🔹 Gmail SMTP setup
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rabbithedeveloper@gmail.com", // your Gmail
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
 export { sendWelcomeEmail };