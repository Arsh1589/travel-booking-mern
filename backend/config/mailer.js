const nodemailer = require("nodemailer");

// Uses Gmail SMTP with an "App Password" (not your real Gmail password —
// generate one at myaccount.google.com/apppasswords). For local dev/demo
// purposes this is enough; a production app would use a transactional
// email service like SendGrid or Postmark instead.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendBookingConfirmation({ to, name, tourTitle, travelDate, totalPrice }) {
  try {
    await transporter.sendMail({
      from: `"Travel Booking" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Booking Confirmed: ${tourTitle}`,
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Hi ${name},</p>
        <p>Your booking for <strong>${tourTitle}</strong> is confirmed.</p>
        <p>Travel date: ${new Date(travelDate).toLocaleDateString()}</p>
        <p>Total paid: ₹${totalPrice}</p>
        <p>Thanks for booking with us!</p>
      `,
    });
  } catch (err) {
    // Email failure shouldn't break the booking flow itself, so we log
    // instead of throwing — the booking is already confirmed in the DB.
    console.error("Failed to send confirmation email:", err.message);
  }
}

module.exports = { sendBookingConfirmation };
