// app/api/user/route.ts
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser) {
      console.log("API route: Unauthorized - No user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle missing email
    const email = kindeUser.email || `${kindeUser.id}@placeholder.com`;

    let dbUser;
    try {
      dbUser = await prisma.user.upsert({
        where: { kindeId: kindeUser.id },
        update: {
          name: kindeUser.given_name || "Unknown",
          email: email,
        },
        create: {
          kindeId: kindeUser.id,
          name: kindeUser.given_name || "Unknown",
          email: email,
        },
        include: {
          reviews: {
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
        },
      });
    } catch (prismaError) {
      console.error("API route: Prisma error when upserting user:", prismaError);
      return NextResponse.json({ error: "Database error", details: (prismaError as Error).message }, { status: 500 });
    }

    return NextResponse.json({ user: dbUser, reviews: dbUser.reviews });
  } catch (error) {
    console.error('API route: Error in GET request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}