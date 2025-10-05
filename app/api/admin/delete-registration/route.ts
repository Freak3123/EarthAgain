import { NextResponse } from "next/server";
import Registration from "@/lib/models/registrations";
import { connectDB } from "@/config/mongoDB/connectDB";

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Registration ID is required" },
        { status: 400 }
      );
    }

    const deletedRegistration = await Registration.findByIdAndDelete(id);

    if (!deletedRegistration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Registration deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting registration:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to delete registration" },
      { status: 500 }
    );
  }
}
