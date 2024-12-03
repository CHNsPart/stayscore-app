'use client';

import { useEffect, useState } from 'react';
import { Review, User } from "@prisma/client";
import ReviewsList from '@/components/review/ReviewsList';

interface FilteredReviewsProps {
  location?: string;
  rating?: number;
  currentUser: User | null;
}

export default function FilteredReviews({ location, rating, currentUser }: FilteredReviewsProps) {
  const [reviews, setReviews] = useState<(Review & { user: User })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (location) params.append('location', location);
        if (rating) params.append('rating', rating.toString());

        const response = await fetch(`/api/reviews?${params.toString()}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setReviews(data);
        setError(null);
      } catch (e) {
        console.error('Error fetching reviews:', e);
        setError('Failed to fetch reviews. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [location, rating]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <ReviewsList initialReviews={reviews} currentUser={currentUser} />;
}