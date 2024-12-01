"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Review, User } from "@prisma/client";
import ReviewCard from "./ReviewCard";
import { useSearchParams } from "next/navigation";

type ReviewWithUser = Review & { user: User };

interface ReviewsListProps {
  initialReviews: ReviewWithUser[];
  currentUser: User | null;
}

export default function ReviewsList({ initialReviews, currentUser }: ReviewsListProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const filter = searchParams.get('filter');
        const location = searchParams.get('location');
        const rating = searchParams.get('rating');

        let queryString = '';
        if (filter) queryString += `filter=${encodeURIComponent(filter)}`;
        if (location) queryString += `${queryString ? '&' : ''}location=${encodeURIComponent(location)}`;
        if (rating) queryString += `${queryString ? '&' : ''}rating=${rating}`;

        const response = await fetch(`/api/reviews${queryString ? `?${queryString}` : ''}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setReviews(data);
      } catch (e) {
        console.error('Error fetching reviews:', e);
        setError('Failed to fetch reviews. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [searchParams]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center h-64"
      >
        <p>Loading...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center h-64"
      >
        <p>Error: {error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} currentUser={currentUser} />
      ))}
    </motion.div>
  );
}