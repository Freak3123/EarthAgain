import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendConfirmationMail(
  to: string,
  name: string,
  registrationDays: string[]
) {
  const formattedDays = registrationDays.join(", "); // e.g., "6 Oct 2025, 7 Oct 2025, 8 Oct 2025"

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "🎉 Registration Confirmed – Earth Again 2.0 Conference",
    html: `
      <p>Dear <b>${name}</b>,</p>

      <p>Thank you for registering for <b>Earth Again 2.0 Conference</b>. 
      We are delighted to confirm your participation in this three-day event dedicated to sustainability, climate action, and innovative solutions for a greener future.</p>

      <p>
      📅 <b>Event Dates:</b> ${formattedDays}<br/>
      🕒 <b>Timing:</b> 11:00 AM – 5:00 PM (all three days)<br/>
      📍 <b>Venue:</b> Swosti Premium, Bhubaneswar
      </p>

      <p>This year’s conference will bring together environmental leaders, youth voices, changemakers, and innovators to engage in powerful discussions, workshops, and action-driven sessions.</p>

      <p>We look forward to your active participation in making Earth Again 2.0 a milestone for climate action. Together, let’s shape a greener, more sustainable future 🌱💚</p>

      <p>
      <b>For updates, connect with us here:</b><br/>
      🌐 <a href="https://share.google/pfYHJYJvuGtWqCGnc">Website</a><br/>
      📷 <a href="https://www.instagram.com/theearthagain_movement?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">Instagram</a><br/>
      📘 <a href="https://www.facebook.com/earthagainmovement">Facebook</a>
      </p>

      <p>Warm regards,<br/>
      <b>Team Earth Again</b></p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendStayUpdatedMail(to: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "🌱 Stay Connected with Earth Again",
    html: `
      <p>Thank you for subscribing to updates from <b>Earth Again</b>.</p>

      <p>For updates, connect with us here:</p>
      <p>
        📷 <a href="https://www.instagram.com/theearthagain_movement?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">Instagram</a><br/>
        📘 <a href="https://www.facebook.com/earthagainmovement">Facebook</a><br/>
        🌐 <a href="https://share.google/pfYHJYJvuGtWqCGnc">Website</a>
      </p>

      <p>Warm regards,<br/> <b>Team Earth Again</b></p>
    `,
  };

  return transporter.sendMail(mailOptions);
}
