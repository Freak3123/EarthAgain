import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/** Escapes the handful of characters that would otherwise break the markup. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendConfirmationMail(
  to: string,
  name: string,
  registrationDays: string[],
  sessions: { title: string; date: string; time: string; speakers: string[] }[],
  options: {
    /** "dates" registers whole days, so no session list is printed. */
    mode: "dates" | "dates-events";
    /** Site-wide venue; blank omits the Venue line entirely. */
    venue: string;
    /** Earliest start time across the registered days, when one is known. */
    startTime?: string;
  }
) {
  const { mode, venue, startTime } = options;

  const dateLine = registrationDays.includes("all")
    ? "All event days"
    : registrationDays.join(", ");

  // Every line is conditional — an unknown time or a blank venue drops out
  // rather than printing an empty label.
  const detailLines = [
    dateLine ? `<b>Date:</b> ${escapeHtml(dateLine)}` : "",
    mode === "dates" && startTime
      ? `<b>Time:</b> ${escapeHtml(startTime)} onwards`
      : "",
    venue ? `<b>Venue:</b> ${escapeHtml(venue)}` : "",
  ].filter(Boolean);

  const sessionsHtml =
    mode === "dates-events"
      ? sessions
          .map((s) => {
            const day = new Date(s.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const speakers = s.speakers?.length
              ? `<br/><span style="color:#555">Speakers: ${escapeHtml(
                  s.speakers.join(", ")
                )}</span>`
              : "";
            return `<li><b>${escapeHtml(s.title)}</b> — ${escapeHtml(
              day
            )}${s.time ? `, ${escapeHtml(s.time)}` : ""}${speakers}</li>`;
          })
          .join("")
      : "";

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Confirmation: Registration for Earth Again Event",
    html: `
      <p>Dear ${escapeHtml(name)},</p>

      <p>Thank you for registering for the Earth Again event, organized by
      Sambad. We are delighted to have you join us in our commitment to
      environmental sustainability and a greener future.</p>

      <p><b>Event Details</b><br/>
      ${detailLines.join("<br/>")}</p>

      ${
        sessionsHtml
          ? `<p><b>Your Sessions</b></p><ul>${sessionsHtml}</ul>`
          : ""
      }

      <p>Please keep this email for your records. If you have any questions or
      require special assistance, feel free to reply directly to this message.</p>

      <p>We look forward to welcoming you.</p>

      <p>Warm regards,<br/>
      Team Earth Again<br/>
      Sambad<br/>
      <a href="https://www.earthagain.in">https://www.earthagain.in</a></p>
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
