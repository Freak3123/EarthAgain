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
  registrationDays: string[],
  sessions: { title: string; date: string; time: string; speakers: string[] }[] // ✅ has time
) {
  const formattedDays = registrationDays.join(", "); // e.g., "6 Oct 2025, 7 Oct 2025"

  const sessionsHtml = sessions
    .map((s) => {
      const day = new Date(s.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }); 
      return `
        <li>
          <b>Session:</b> ${s.title}, ${s.time || "time: to be announced"}, ${day}<br/>
          <b>Speakers details -</b> ${s.speakers.join(", ")}
        </li>
      `;
    })
    .join("");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "🎉 Registration Confirmed – Earth Again 2025 Conference",
    html: `
      <p>Dear <b>${name}</b>,</p>

      <p>Thank you for registering for <b>Earth Again 2025 Conference</b>. 
      We are delighted to confirm your participation in this three-day event dedicated to sustainability, climate action, and innovative solutions for a greener future.</p>

      <p><b>You have selected to join the following sessions. Please note you will only be allowed to attend these sessions only:</b></p>

      <p>
        📅 <b>Event Dates:</b> ${formattedDays}<br/>
        📍 <b>Venue:</b> Swosti Premium, Bhubaneswar
      </p>

      <p><b>Your Selected Sessions:</b></p>
      <ul>
        ${sessionsHtml || "<li>No sessions selected</li>"}
      </ul>

      <p>This year’s conference will bring together environmental leaders, youth voices, changemakers, and innovators to engage in powerful discussions, workshops, and action-driven sessions.</p>

      <p>
        <b>For updates, connect with us here:</b><br/>
        🌐 <a href="https://share.google/pfYHJYJvuGtWqCGnc">Website</a><br/>
        📷 <a href="https://www.instagram.com/theearthagain_movement?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">Instagram</a><br/>
        📘 <a href="https://www.facebook.com/earthagainmovement">Facebook</a>
      </p>

      <p><b>Important:</b> Please show this email at the registration desk on the first day of the event to collect your entry badge.</p>

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
    subject: "🌱 Stay Connected with Earth Again 2025",
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
