import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Prisma } from '@prisma/client';

const ADMIN_EMAIL = 'imchn24@gmail.com';

export async function GET(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const currentUser = await getUser();
    const isAdmin = currentUser?.email === ADMIN_EMAIL;

    const { searchParams } = new URL(request.url);
    const locationParam = searchParams.get('location');
    const ratingParam = searchParams.get('rating');

    // Build the where clause
    const where: Prisma.ReviewWhereInput = {};

    // Only add location filter if locationParam exists
    if (locationParam) {
      where.location = {
        contains: locationParam.toLowerCase(),
      };
    }

    // Only add rating filter if ratingParam exists and is valid
    if (ratingParam) {
      const rating = parseInt(ratingParam, 10);
      if (!isNaN(rating)) {
        where.rating = {
          gte: rating,
        };
      }
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
            anonymous: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    const filteredReviews = reviews.map(review => {
      const shouldHideIdentity = (review.anonymous || review.user.anonymous) && 
                                !isAdmin && 
                                review.userId !== currentUser?.id;

      return {
        ...review,
        user: {
          ...review.user,
          name: shouldHideIdentity ? 'Anonymous User' : review.user.name,
          email: shouldHideIdentity ? '****@****.com' : review.user.email,
        }
      };
    });

    return NextResponse.json(filteredReviews);
  } catch (error) {
    console.error('Error in GET /api/reviews:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

interface ReviewCreatePayload {
  location: string;
  rating: number;
  content: string;
  anonymous?: boolean;
  images?: string;
  dynamicFields?: Record<string, unknown>;
}

export async function POST(request: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First, ensure the user exists in our database
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

    const payload = await request.json() as ReviewCreatePayload;
    
    // Handle anonymous setting - use user's global setting as default
    const isAnonymous = payload.anonymous !== undefined 
      ? payload.anonymous 
      : dbUser.anonymous;

    // Create the review with properly formatted data
    const review = await prisma.review.create({
      data: {
        location: payload.location,
        rating: payload.rating,
        content: payload.content,
        anonymous: isAnonymous,
        images: payload.images,
        // Convert dynamicFields to string once
        dynamicFields: payload.dynamicFields 
          ? JSON.stringify(payload.dynamicFields)
          : null,
        user: { connect: { id: dbUser.id } },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            anonymous: true,
          }
        }
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error in POST /api/reviews:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}