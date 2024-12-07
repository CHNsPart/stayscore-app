import { Star, MapPin, User as UserIcon, EyeOff } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ReviewCardProps } from "@/types";

export default function ReviewCard({ review, currentUser, isAdmin }: ReviewCardProps) {
  const isOwnReview = currentUser?.id === review.userId;
  const shouldHideIdentity = (review.anonymous || review.user.anonymous) && 
                            !isAdmin && 
                            !isOwnReview;

  const displayName = shouldHideIdentity ? "Anonymous User" : review.user.name;
  const displayEmail = shouldHideIdentity ? "****@****.com" : review.user.email;

  const dynamicFields = review.dynamicFields ? 
    JSON.parse(review.dynamicFields) as Record<string, unknown> : 
    null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{review.location}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="size-4 mr-1" />
            {review.location}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {[...Array(10)].map((_, i) => (
              <Star
                key={i}
                className={`size-4 ${
                  i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 px-2 bg-gray-50 dark:bg-black/50 border rounded-full">
            {review.rating}<span className="text-gray-400 text-xs">{"/10"}</span>
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm">{review.content}</p>
        {review.images && (
          <div className="mt-4 flex space-x-2 overflow-x-auto">
            {review.images.split(",").map((image, index) => (
              <Image
                height={200}
                width={200}
                key={index}
                src={image.trim()}
                alt={`Review image ${index + 1}`}
                className="w-full h-24 object-cover rounded-md"
              />
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar>
            {shouldHideIdentity ? (
              <AvatarFallback>
                <UserIcon className="size-4" />
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
          {review.anonymous && isAdmin && (
            <Badge variant="secondary"><EyeOff className="size-4 mr-2"/> Review</Badge>
          )}
          {review.user.anonymous && isAdmin && (
            <Badge variant="secondary"><EyeOff className="size-4 mr-2"/> User</Badge>
          )}
          {dynamicFields && <Badge variant="secondary">Custom Fields</Badge>}
        </div>
      </CardFooter>
    </Card>
  );
}