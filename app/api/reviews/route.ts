import { NextRequest, NextResponse } from 'next/server';
import { prisma, syncDatabase } from "@/lib/prisma";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    // Attempt to sync if in development
    if (process.env.NODE_ENV !== 'production') {
      try {
        await syncDatabase();
      } catch (syncError) {
        console.warn('Sync warning:', syncError);
        // Continue with the request even if sync fails
      }
    }

    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const rating = searchParams.get('rating') ? parseInt(searchParams.get('rating')!, 10) : undefined;
    const filter = searchParams.get('filter');

    const where: Prisma.ReviewWhereInput = {};

    if (location) {
      where.location = {
        contains: location.toLowerCase()
      };
    }

    if (rating !== undefined) {
      where.rating = { gte: rating };
    }

    if (filter) {
      where.OR = [
        { location: { contains: filter.toLowerCase() } },
        { content: { contains: filter.toLowerCase() } }
      ];
    }

    const reviews = await prisma.review.findMany({
      where,
      include: { 
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            anonymous: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error in GET /api/reviews:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First, ensure the user exists in the database
    const dbUser = await prisma.user.upsert({
      where: { kindeId: kindeUser.id },
      update: {
        name: kindeUser.given_name || "Unknown",
        email: kindeUser.email || `${kindeUser.id}@placeholder.com`,
      },
      create: {
        kindeId: kindeUser.id,
        name: kindeUser.given_name || "Unknown",
        email: kindeUser.email || `${kindeUser.id}@placeholder.com`,
      },
    });

    const json = await request.json();
    const { location, rating, content, anonymous, images, dynamicFields } = json;

    // Now create the review using the correct user ID
    const review = await prisma.review.create({
      data: {
        location,
        rating,
        content,
        anonymous,
        images,
        dynamicFields,
        user: { connect: { id: dbUser.id } }, // Connect using the internal ID
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            anonymous: true
          }
        }
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error in POST /api/reviews:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}