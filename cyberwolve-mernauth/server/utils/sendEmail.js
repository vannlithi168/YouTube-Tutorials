const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "KAKSIKOR TEAM <yourapp@example.com>",
      to: email,
      subject: subject,
      html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f2f2f2;">
      <div style="padding: 20px; background-color: #f8f8f8; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333;">${subject}</h2>
        <p>${text}</p>
        <a href="${text}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Confirm Email</a>        <p>Click the "Confirm Email" button above or the link to verify your email address. If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>KAKSIKOR TEAM</p>
      </div>
    </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent Successfully");
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};
