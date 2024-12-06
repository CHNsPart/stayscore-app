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

  const location = typeof searchParams.location === 'string' ? searchParams.location : undefined;
  const rating = searchParams.rating ? parseInt(searchParams.rating as string, 10) : undefined;

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ReviewFilters location={location} rating={rating} />
        </div>
        <div className="lg:col-span-3">
          <FilteredReviews 
            key={`${location}-${rating}`} 
            location={location} 
            rating={rating} 
            currentUser={user} 
          />
        </div>
      </div>
    </div>
  );
}