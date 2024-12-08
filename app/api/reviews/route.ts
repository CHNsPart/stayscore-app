import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { CANADIAN_PROVINCES } from '@/lib/location-utils';
import { Prisma } from '@prisma/client';

const ADMIN_EMAIL = 'imchn24@gmail.com';

export async function GET(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const currentUser = await getUser();
    const isAdmin = currentUser?.email === ADMIN_EMAIL;

    const { searchParams } = new URL(request.url);
    const stateParam = searchParams.get('state');
    const addressParam = searchParams.get('address')?.toLowerCase();
    const postalCodeParam = searchParams.get('postalCode')?.toUpperCase();
    const ratingParam = searchParams.get('rating');

    // Build the where clause
    const whereConditions: Prisma.ReviewWhereInput[] = [];

    // Add state filter
    if (stateParam && stateParam !== 'all') {
      const provinceLabel = CANADIAN_PROVINCES.find(p => p.value === stateParam)?.label;
      if (provinceLabel) {
        whereConditions.push({
          location: {
            contains: provinceLabel,
          }
        });
      }
    }

    // Add address filter
    if (addressParam) {
      // For SQLite, we'll use LIKE with the lowercase function
      whereConditions.push({
        location: {
          contains: addressParam,
        }
      });
    }

    // Add postal code filter
    if (postalCodeParam) {
      whereConditions.push({
        location: {
          contains: postalCodeParam,
        }
      });
    }

    // Add rating filter
    if (ratingParam) {
      const rating = parseInt(ratingParam, 10);
      if (!isNaN(rating)) {
        whereConditions.push({
          rating: {
            gte: rating
          }
        });
      }
    }

    // Construct the final where clause
    const where: Prisma.ReviewWhereInput = whereConditions.length > 0
      ? { AND: whereConditions }
      : {};

    // Fetch reviews with filters
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

    // Process reviews and handle anonymity
    const processedReviews = reviews.map(review => {
      const shouldHideIdentity = (review.anonymous || review.user.anonymous) && 
                                !isAdmin && 
                                review.userId !== currentUser?.id;

      // Parse location
      const [address = '', state = '', country = '', postalCode = ''] = review.location
        .split(',')
        .map(part => part.trim());

      return {
        ...review,
        user: {
          ...review.user,
          name: shouldHideIdentity ? 'Anonymous User' : review.user.name,
          email: shouldHideIdentity ? '****@****.com' : review.user.email,
        },
        parsedLocation: {
          address,
          state,
          country,
          postalCode
        }
      };
    });

    // Additional filter for case-insensitive matching (since SQLite's LIKE is case-sensitive)
    const filteredReviews = processedReviews.filter(review => {
      const locationLower = review.location.toLowerCase();
      let matches = true;

      if (stateParam && stateParam !== 'all') {
        const provinceLabel = CANADIAN_PROVINCES.find(p => p.value === stateParam)?.label;
        matches = matches && locationLower.includes(provinceLabel?.toLowerCase() || '');
      }

      if (addressParam) {
        matches = matches && locationLower.includes(addressParam);
      }

      if (postalCodeParam) {
        matches = matches && review.location.toUpperCase().includes(postalCodeParam);
      }

      return matches;
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