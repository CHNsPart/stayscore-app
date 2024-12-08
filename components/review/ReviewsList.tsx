"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReviewCard from "./ReviewCard";
import { ReviewWithUser, User } from "@/types";  
import Loader from "../theme/Loader";
import { SearchX } from "lucide-react";

interface ReviewsListProps {
  initialReviews: ReviewWithUser[];
  currentUser: User | null;
}

export default function ReviewsList({ initialReviews, currentUser }: ReviewsListProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);  
  // Check if current user is admin
  const isAdmin = currentUser?.email === 'imchn24@gmail.com';

  // Use the initial reviews directly instead of fetching again
  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center min-h-[400px]"
      >
        <Loader size="lg" />
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

  if (reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[400px] text-center p-8"
      >
        <div className="relative p-5 mb-6">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          <SearchX className="relative size-16 text-primary/80" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">No Reviews Found</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          {"We couldn't find any reviews matching your current filters. Try adjusting your search criteria or explore all reviews."}
        </p>
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
        <ReviewCard 
          key={review.id} 
          review={review} 
          currentUser={currentUser}
          isAdmin={isAdmin}
        />
      ))}
    </motion.div>
  );
}