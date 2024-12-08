// app/reviews/page.tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import ReviewFilters from "@/components/review/ReviewFilters";
import FilteredReviews from "@/components/review/FilteredReviews";

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  const user = kindeUser ? {
    id: kindeUser.id,
    kindeId: kindeUser.id,
    name: kindeUser.given_name,
    email: kindeUser.email,
    image: kindeUser.picture,
    darkMode: false,
    anonymous: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  } : null;

  // Extract and type-check search params
  const state = typeof searchParams.state === 'string' ? searchParams.state : undefined;
  const address = typeof searchParams.address === 'string' ? searchParams.address : undefined;
  const postalCode = typeof searchParams.postalCode === 'string' ? searchParams.postalCode : undefined;
  const rating = searchParams.rating ? parseInt(searchParams.rating as string, 10) : undefined;

  // Create a unique key for FilteredReviews to force re-render when filters change
  const filterKey = `${state}-${address}-${postalCode}-${rating}`;

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ReviewFilters 
            initialFilters={{
              state,
              address,
              postalCode,
              rating,
            }} 
          />
        </div>
        <div className="lg:col-span-3">
          <FilteredReviews 
            key={filterKey}
            state={state}
            address={address}
            postalCode={postalCode}
            rating={rating}
            currentUser={user} 
          />
        </div>
      </div>
    </div>
  );
}