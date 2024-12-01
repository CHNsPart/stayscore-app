// app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const rating = searchParams.get('rating') ? parseInt(searchParams.get('rating')!, 10) : undefined;
    const filter = searchParams.get('filter');

    console.log('Received params:', { location, rating, filter });

    let where: Prisma.ReviewWhereInput = {};

    if (location) {
      where.location = { contains: location.toLowerCase() };
      console.log('Location filter:', where.location);
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

    console.log('Prisma query:', JSON.stringify(where, null, 2));

    const reviews = await prisma.review.findMany({
      where,
      include: { 
        user: true
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`Found ${reviews.length} reviews`);

    // Log a sample of the reviews
    console.log('Sample reviews:', reviews.slice(0, 2).map(r => ({ id: r.id, location: r.location })));

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error in GET /api/reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const { location, rating, content, anonymous, images, dynamicFields } = json;

  const review = await prisma.review.create({
    data: {
      location,
      rating,
      content,
      anonymous,
      images,
      dynamicFields,
      user: { connect: { kindeId: user.id } },
    },
  });

  return NextResponse.json(review);
}

export async function PUT(request: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const { id, location, rating, content, anonymous, images, dynamicFields } = json;

  const review = await prisma.review.update({
    where: { id },
    data: { location, rating, content, anonymous, images, dynamicFields },
  });

  return NextResponse.json(review);
}

export async function DELETE(request: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
  }

  await prisma.review.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Review deleted successfully" });
}