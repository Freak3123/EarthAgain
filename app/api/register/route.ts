
import { NextResponse } from "next/server"
import { connectDB } from "@/config/mongoDB/connectDB";
import Registration from "@/lib/models/registrations"
import { sendConfirmationMail } from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()

    const registration = await Registration.create(body)

    await sendConfirmationMail(registration.email, registration.name, registration.registrationDays);

    return NextResponse.json({ success: true, data: registration }, { status: 201 })
  } catch (error) {
    console.error("Error saving registration:", error)
    return NextResponse.json({ success: false, error: "Failed to register" }, { status: 500 })
  }
}
