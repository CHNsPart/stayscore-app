import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { kindeId: user.id },
    select: { darkMode: true, anonymous: true },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(dbUser);
}

export async function PUT(request: Request) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
  
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const json = await request.json();
    const { anonymous } = json;
  
    const updatedUser = await prisma.user.update({
      where: { kindeId: user.id },
      data: { anonymous },
    });
  
    return NextResponse.json(updatedUser);
}