'use client';

import { useEffect, useState } from 'react';
import { Review, User } from "@prisma/client";
import ReviewsList from '@/components/review/ReviewsList';
import Loader from '../theme/Loader';
import { usePathname, useSearchParams } from 'next/navigation';

interface FilteredReviewsProps {
  state?: string;
  address?: string;
  postalCode?: string;
  rating?: number;
  currentUser: User | null;
}

export default function FilteredReviews({  
  currentUser 
}: FilteredReviewsProps) {
  const [reviews, setReviews] = useState<(Review & { user: User })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        // Build query parameters from the current search params
        const currentParams = new URLSearchParams(searchParams);
        const url = `/api/reviews${currentParams.toString() ? `?${currentParams.toString()}` : ''}`;
        console.log('Fetching reviews from:', url);

        const response = await fetch(url);
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

    // Only fetch if we're on the reviews page
    if (pathname === '/reviews') {
      fetchReviews();
    }
  }, [pathname, searchParams]);

  if (isLoading) return <Loader size="md" />;
  if (error) return <div>Error: {error}</div>;

  return <ReviewsList initialReviews={reviews} currentUser={currentUser} />;
}