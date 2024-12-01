"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface ReviewFiltersProps {
  location?: string;
  rating?: number;
}

export default function ReviewFilters({ location, rating }: ReviewFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locationState, setLocation] = useState(searchParams.get("location") || "");
  const [ratingState, setRating] = useState(parseInt(searchParams.get("rating") || "0"));

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (locationState) params.set("location", locationState);
    if (ratingState > 0) params.set("rating", ratingState.toString());
    router.push(`/reviews?${params.toString()}`);
  };

  const handleReset = () => {
    setLocation("");
    setRating(0);
    router.push("/reviews");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={locationState}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rating">Minimum Rating</Label>
          <Slider
            id="rating"
            min={0}
            max={10}
            step={1}
            value={[ratingState]}
            onValueChange={(value) => setRating(value[0])}
          />
          <div className="text-center text-sm text-muted-foreground">
            {ratingState > 0 ? `${ratingState} stars and above` : "Any rating"}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleFilter} className="flex-1">
            Apply Filters
          </Button>
          <Button onClick={handleReset} variant="outline" className="flex-1">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
