// config/email.js
import SibApiV3Sdk from 'sib-api-v3-sdk';

// ✅ إعداد مفتاح Brevo API
const BREVO_API_KEY = process.env.BREVO_API_KEY;
console.log('🔑 BREVO_API_KEY loaded:', BREVO_API_KEY);
if (!BREVO_API_KEY) {
  throw new Error('❌ Missing BREVO_API_KEY in .env file');
}

// ✅ تهيئة العميل
const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = BREVO_API_KEY;
const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// ✅ المرسل الافتراضي
const SENDER = {
  email: 'ilyesprogrammer46@gmail.com',
  name: 'ilyes',
};

/**
 * ✉️ إرسال بريد عام عبر Brevo
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const sendSmtpEmail = {
      sender: SENDER,
      to: [{ email: to }],
      subject,
      htmlContent: html || `<pre>${text || ''}</pre>`,
      textContent: text || undefined,
    };

    await tranEmailApi.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error?.response?.body || error);
    throw new Error('Email sending failed');
  }
};

/**
 * 🔐 إنشاء وإرسال كود التحقق عبر Brevo
 */
export const sendVerificationEmail = async (email, code) => {
  const subject = 'Verify your email address';
  const html = `
    <div style="font-family: Arial, sans-serif; text-align: center;">
      <h2>Welcome to MyApp 🎉</h2>
      <p>Your verification code is:</p>
      <h1 style="letter-spacing: 4px;">${code}</h1>
      <p>This code will expire in <b>15 minutes</b>.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject,
    text: `Your verification code is: ${code}`,
    html,
  });

  console.log(`📨 Verification code sent to ${email}`);
};

export const sendPasswordResetEmail = async (email, token) => {
  const subject = 'Reset your password';
  const html = `
    <div style="font-family: Arial, sans-serif; text-align: center;">
      <h2>Reset your password</h2>
      <p>Your password reset token is:</p>
      <h1 style="letter-spacing: 4px;">${token}</h1>
    
    </div>
  `;
  await sendEmail({
    to: email,
    subject,
    text: `visit this link to reset your password: ${token}`,
    html,
  });
};

export const sendWelcomeEmail = async (email, name) => {
  const subject = 'Welcome to MyApp 🎉';
  const html = `
    <div style="font-family: Arial, sans-serif; text-align: center;">
      <h2>Welcome to MyApp 🎉</h2>
      <p>Hi ${name},</p>
      <p>Thank you for joining us!</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject,
    text: `Hi ${name}, Thank you for joining us!`,
    html,
  });

  console.log(`📨 Welcome email sent to ${email}`);
};
