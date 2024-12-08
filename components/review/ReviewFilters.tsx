"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../theme/Loader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CANADIAN_PROVINCES } from "@/lib/location-utils";
import { cn } from "@/lib/utils";

interface ReviewFiltersProps {
  initialFilters?: {
    state?: string;
    address?: string;
    postalCode?: string;
    rating?: number;
  };
}

export default function ReviewFilters({ initialFilters }: ReviewFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [state, setState] = useState(searchParams.get("state") || initialFilters?.state || "all");
  const [address, setAddress] = useState(searchParams.get("address") || initialFilters?.address || "");
  const [postalCode, setPostalCode] = useState(searchParams.get("postalCode") || initialFilters?.postalCode || "");
  const [rating, setRating] = useState(parseInt(searchParams.get("rating") || initialFilters?.rating?.toString() || "0"));
  const [isFiltering, setIsFiltering] = useState(false);

  const [debouncedAddress] = useDebounce(address, 500);
  const [debouncedPostalCode] = useDebounce(postalCode, 500);

  const createQueryString = useCallback(
    (params: Record<string, string | undefined>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      
      // Update or remove parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newSearchParams.set(key, value);
        } else {
          newSearchParams.delete(key);
        }
      });
      
      return newSearchParams.toString();
    },
    [searchParams]
  );

  // Update URL when filters change
  useEffect(() => {
    setIsFiltering(true);
    
    const params: Record<string, string | undefined> = {
      state: state !== "all" ? state : undefined,
      address: debouncedAddress || undefined,
      postalCode: debouncedPostalCode || undefined,
      rating: rating > 0 ? rating.toString() : undefined,
    };

    const queryString = createQueryString(params);
    router.push(
      `${pathname}${queryString ? `?${queryString}` : ''}`,
      { scroll: false }
    );

    setIsFiltering(false);
  }, [debouncedAddress, debouncedPostalCode, state, rating, router, pathname, createQueryString]);

  const handleReset = () => {
    setState("all");
    setAddress("");
    setPostalCode("");
    setRating(0);
    router.push(pathname);
  };

  const hasActiveFilters = state !== "all" || address || postalCode || rating > 0;

  return (
    <Card className="relative">
      {isFiltering && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10 rounded-lg">
          <Loader size="sm" />
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2 leading-normal">
          <MapPin className="size-5" />
          <span>Filter Reviews</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Province/Territory</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger className="w-full focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <SelectValue placeholder="Select Province" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Provinces & Territories</SelectLabel>
                  <SelectItem value="all">All Provinces</SelectItem>
                  {CANADIAN_PROVINCES.map((province) => (
                    <SelectItem key={province.value} value={province.value}>
                      {province.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Street Address</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., 123 Main St"
              className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Postal Code</Label>
            <Input
              value={postalCode}
              onChange={(e) => {
                const formatted = e.target.value.toUpperCase();
                if (formatted.length <= 7) {
                  setPostalCode(formatted);
                }
              }}
              placeholder="A1A 1A1"
              className="uppercase focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </div>

        <div className="space-y-4 py-4 border-t border-border">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Minimum Rating</Label>
            <Slider
              min={0}
              max={10}
              step={1}
              value={[rating]}
              onValueChange={(vals) => setRating(vals[0])}
              className="my-4"
            />
            <AnimatePresence mode="wait">
              <motion.div 
                key={rating}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-center text-sm text-muted-foreground"
              >
                {rating === 0 ? (
                  "Any rating"
                ) : (
                  <div className="flex items-center justify-center space-x-1">
                    <span className="flex items-center justify-center font-bold">
                      {rating} <Star className="size-3 text-yellow-500 ml-1" />
                    </span>
                    <span>and above</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <Button 
          onClick={handleReset} 
          variant="outline" 
          className={cn(
            "w-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            hasActiveFilters ? "bg-secondary" : "bg-background"
          )}
          disabled={isFiltering || !hasActiveFilters}
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}