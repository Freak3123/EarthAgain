import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password } = await request.json();
    console.log(username, "----");
  if (username === process.env.ADMIN_NAME && password === process.env.ADMIN_PASSWORD) {
    console.log("-------")
    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } else {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}