"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../theme/Loader";

interface ReviewFiltersProps {
  location?: string;
  rating?: number;
  onFilterChange?: (filters: { location: string; rating: number }) => void;
}

export default function ReviewFilters({ 
  location: initialLocation = "", 
  rating: initialRating = 0,
  onFilterChange 
}: ReviewFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [locationState, setLocation] = useState(searchParams.get("location") || initialLocation);
  const [debouncedLocation] = useDebounce(locationState, 500);
  const [ratingState, setRating] = useState(parseInt(searchParams.get("rating") || String(initialRating)));
  const [isFiltering, setIsFiltering] = useState(false);

  // Memoize URL params construction
  const constructUrlParams = useCallback((loc: string, rat: number) => {
    const params = new URLSearchParams();
    if (loc) params.set("location", loc);
    if (rat > 0) params.set("rating", rat.toString());
    return params;
  }, []);

  // Handle URL updates
  useEffect(() => {
    const params = constructUrlParams(debouncedLocation, ratingState);
    const newUrl = `/reviews${params.toString() ? `?${params.toString()}` : ''}`;
    
    setIsFiltering(true);
    const timeoutId = setTimeout(() => {
      router.push(newUrl, { scroll: false });
      onFilterChange?.({ location: debouncedLocation, rating: ratingState });
      setIsFiltering(false);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [debouncedLocation, ratingState, router, constructUrlParams, onFilterChange]);

  // Memoize handlers
  const handleLocationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  }, []);

  const handleRatingChange = useCallback((value: number[]) => {
    setRating(value[0]);
  }, []);

  const handleReset = useCallback(() => {
    setLocation("");
    setRating(0);
    router.push("/reviews", { scroll: false });
    onFilterChange?.({ location: "", rating: 0 });
  }, [router, onFilterChange]);

  // Memoize rating display
  const ratingDisplay = useMemo(() => {
    if (ratingState === 0) return "Any rating";
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center space-x-1"
      >
        <span className="flex items-center justify-center font-bold">
          {ratingState} <Star className="size-3 text-yellow-500 ml-1" />
        </span>
        <span>and above</span>
      </motion.div>
    );
  }, [ratingState]);

  return (
    <Card className="relative">
      {isFiltering && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <Loader size="sm" />
        </div>
      )}
      
      <CardHeader>
        <CardTitle>Filter Reviews</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={locationState}
            onChange={handleLocationChange}
            placeholder="Enter location"
            aria-label="Filter by location"
            autoComplete="off"
            className="transition-all duration-200 focus:ring-2"
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
            onValueChange={handleRatingChange}
            aria-label="Filter by minimum rating"
            className="my-4"
          />
          <AnimatePresence mode="wait">
            <motion.div 
              key={ratingState}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-center text-sm text-muted-foreground"
            >
              {ratingDisplay}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={handleReset}
            variant="outline" 
            className="flex-1 transition-all duration-200"
            disabled={isFiltering || (!locationState && ratingState === 0)}
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}