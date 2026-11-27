import nodemailer from "nodemailer";

const SENDER_EMAIL = process.env.SMTP_USER || "su31f2@gmail.com";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  return "http://localhost:3000";
};

    function createMailError(code, message) {
    const err = new Error(message);
    err.code = code;
    return err;
  }

function createTransporter() {
      const pass = process.env.GMAIL_APP_PASSWORD;
      if (!pass) {
        console.error("Mail configuration error: GMAIL_APP_PASSWORD is missing.");
        throw createMailError(
          "MAIL_CONFIG_ERROR",
          "ইমেইল সার্ভার কনফিগার করা হয়নি। অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।"
        );
      }

      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: SENDER_EMAIL,
          pass,
        },
      });
    }

async function sendMailSafely(mailOptions) {
      const transporter = createTransporter();
      try {
        return await transporter.sendMail(mailOptions);
      } catch (error) {
        console.error("SMTP sendMail failed:", {
          code: error?.code,
          responseCode: error?.responseCode,
          message: error?.message,
        });

        if (error?.code === "EAUTH" || error?.responseCode === 535) {
          throw createMailError(
            "MAIL_AUTH_ERROR",
            "ইমেইল সার্ভারে লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।"
          );
        }

        if (
          error?.code === "ECONNECTION" ||
          error?.code === "ETIMEDOUT" ||
          error?.code === "ESOCKET"
        ) {
          throw createMailError(
            "MAIL_CONNECTION_ERROR",
            "ইমেইল সার্ভারে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।"
          );
        }

        throw createMailError(
          "MAIL_SEND_ERROR",
          "ইমেইল পাঠানো যায়নি। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।"
        );
      }
    }

async function sendWelcomeEmail({ toEmail, fullName }) {
      const mailOptions = {
        from: `"AMARDokan" <${SENDER_EMAIL}>`,
        to: toEmail,
        subject: "অভিনন্দন! আপনার AMARDokan অ্যাকাউন্ট ভেরিফাই হয়েছে",
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #2c3e50; text-align: center;">স্বাগতম, ${fullName}! 🎉</h2>
        <p>আপনার AMARDokan অ্যাকাউন্ট সফলভাবে তৈরি এবং ভেরিফাই হয়েছে।</p>
        <p><strong>আপনার রেজিস্টার্ড ইমেইল:</strong> ${toEmail}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${getBaseUrl()}/login" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">লগইন করুন</a>
        </div>
        <p>এখন আপনি আপনার ড্যাশবোর্ডে লগইন করে আপনার দোকান পরিচালনা করতে পারবেন।</p>
        <p>কোনো সহায়তার প্রয়োজন হলে আমাদের সাথে যোগাযোগ করতে পারেন।</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="font-size: 14px; color: #666; text-align: center;">ধন্যবাদ,<br><strong>AMARDokan টিম</strong></p>
      </div>
    `,
      };

      await sendMailSafely(mailOptions);
    }

      async function sendVerifyEmail({ toEmail, fullName, code }) {
        const mailOptions = {
          from: `"AMARDokan" <${SENDER_EMAIL}>`,
          to: toEmail,
          subject: "আপনার AMARDokan ইমেইল ভেরিফিকেশন কোড",
          html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
      <h2 style="color: #2c3e50; text-align: center;">প্রিয় ${fullName},</h2>
      <p>AMARDokan-এ অ্যাকাউন্ট তৈরি করার জন্য ধন্যবাদ!</p>
      <p>আপনার ইমেইল ভেরিফাই করার জন্য নিচের <strong>৪-অঙ্কের</strong> কোডটি ব্যবহার করুন:</p>
      
      <div style="text-align: center;">
        <div style="font-size: 28px; font-weight: bold; color: #4f46e5; background: #f3f4f6; padding: 15px 30px; display: inline-block; margin: 15px 0; border-radius: 6px; letter-spacing: 5px;">
          ${code}
        </div>
      </div>
      
      <p>এই কোডটি পরবর্তী <strong>১৫ মিনিট</strong> পর্যন্ত বৈধ থাকবে।</p>
      <div style="text-align: center; margin: 25px 0;">
        <a href="${getBaseUrl()}/account-verify?email=${encodeURIComponent(toEmail)}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">ইমেইল ভেরিফাই করুন</a>
      </div>
      <p style="font-size: 14px; color: #777;">আপনি যদি এই অ্যাকাউন্টটি তৈরি না করে থাকেন, তবে এই ইমেইলটি এড়িয়ে যান।</p>
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
      <p style="font-size: 14px; color: #666; text-align: center;">ধন্যবাদ,<br><strong>AMARDokan টিম</strong></p>
    </div>
  `,
        };

        await sendMailSafely(mailOptions);
      }

      async function sendPasswordResetEmail({ toEmail, fullName, code }) {
        const resetUrl = `${getBaseUrl()}/forgot-password?email=${encodeURIComponent(
          toEmail
        )}&step=reset`;

        const mailOptions = {
          from: `"AMARDokan" <${SENDER_EMAIL}>`,
          to: toEmail,
          subject: "আপনার AMARDokan পাসওয়ার্ড রিসেট কোড",
          html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
      <h2 style="color: #2c3e50; text-align: center;">প্রিয় ${fullName || "ব্যবহারকারী"},</h2>
      <p>আপনার AMARDokan অ্যাকাউন্টের পাসওয়ার্ড রিসেট করার অনুরোধ পাওয়া গেছে।</p>
      <p>নতুন পাসওয়ার্ড সেট করতে নিচের <strong>৬-অঙ্কের</strong> কোডটি ব্যবহার করুন:</p>

      <div style="text-align: center;">
        <div style="font-size: 28px; font-weight: bold; color: #4f46e5; background: #f3f4f6; padding: 15px 30px; display: inline-block; margin: 15px 0; border-radius: 6px; letter-spacing: 6px;">
          ${code}
        </div>
      </div>

      <p>এই কোডটি পরবর্তী <strong>১৫ মিনিট</strong> পর্যন্ত বৈধ থাকবে।</p>
      <div style="text-align: center; margin: 25px 0;">
        <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">পাসওয়ার্ড রিসেট করুন</a>
      </div>
      <p style="font-size: 14px; color: #777;">আপনি যদি এই অনুরোধ না করে থাকেন, তবে এই ইমেইলটি এড়িয়ে যান। আপনার পাসওয়ার্ড অপরিবর্তিত থাকবে।</p>
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
      <p style="font-size: 14px; color: #666; text-align: center;">ধন্যবাদ,<br><strong>AMARDokan টিম</strong></p>
    </div>
  `,
        };

        await sendMailSafely(mailOptions);
      }

      export { sendWelcomeEmail, sendVerifyEmail, sendPasswordResetEmail };
