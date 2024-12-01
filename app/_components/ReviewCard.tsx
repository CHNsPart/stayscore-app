import { formatDistanceToNow } from "date-fns";
import { Star, MapPin, User as UserIcon } from "lucide-react";
import { Review, User } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ReviewCardProps {
  review: Review & { user: User };
  currentUser: User | null;
}

export default function ReviewCard({ review, currentUser }: ReviewCardProps) {
  const isOwnReview = currentUser && currentUser.id === review.userId;
  const isAnonymous = review.anonymous;

  const getRandomName = () => {
    const names = ["Alex", "Sam", "Jordan", "Taylor", "Casey", "Morgan"];
    return names[Math.floor(Math.random() * names.length)];
  };

  const displayName = isAnonymous ? getRandomName() : review.user.name;
  const displayEmail = isAnonymous ? "****@****.com" : review.user.email;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{review.location}</CardTitle>
          <div className="flex items-center">
            {[...Array(10)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1" />
          {review.location}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm">{review.content}</p>
        {review.images && (
          <div className="mt-4 flex space-x-2 overflow-x-auto">
            {review.images.split(",").map((image, index) => (
              <img
                key={index}
                src={image.trim()}
                alt={`Review image ${index + 1}`}
                className="w-24 h-24 object-cover rounded-md"
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar>
            {isAnonymous ? (
              <AvatarFallback>
                <UserIcon className="w-4 h-4" />
              </AvatarFallback>
            ) : (
              <>
                <AvatarImage src={review.user.image || undefined} />
                <AvatarFallback>{review.user.name?.[0] || "U"}</AvatarFallback>
              </>
            )}
          </Avatar>
          <div>
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">{displayEmail}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {isOwnReview && <Badge variant="outline">Your Review</Badge>}
          {review.dynamicFields && (
            <Badge variant="secondary">Custom Fields</Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
