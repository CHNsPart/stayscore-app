import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { isAuthenticated } = getKindeServerSession();
  const authenticated = await isAuthenticated();

  return NextResponse.json({ authenticated });
}
