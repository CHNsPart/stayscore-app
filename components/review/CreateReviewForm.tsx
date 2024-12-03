"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const reviewSchema = z.object({
  location: z.string().min(1, "Location is required"),
  rating: z.number().min(1).max(10),
  content: z.string().min(10, "Review content must be at least 10 characters"),
  anonymous: z.boolean(),
  images: z.string().optional(),
  dynamicFields: z.record(z.string()).optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function CreateReviewForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      anonymous: false,
    },
  });

  const rating = watch("rating");
  const anonymous = watch("anonymous");

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...data, anonymous}),
      });

      if (response.ok) {
        router.push("/reviews");
      } else {
        throw new Error("Failed to create review");
      }
    } catch (error) {
      console.error("Error creating review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-1">
          Location
        </label>
        <Input
          id="location"
          {...register("location")}
          placeholder="Enter the location"
        />
        {errors.location && (
          <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium mb-1">
          Rating
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <Star
              key={value}
              className={`w-6 h-6 cursor-pointer ${
                value <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setValue("rating", value)}
            />
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          Review Content
        </label>
        <Textarea
          id="content"
          {...register("content")}
          placeholder="Write your review here"
          rows={5}
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="images" className="block text-sm font-medium mb-1">
          Images (optional)
        </label>
        <Input
          id="images"
          {...register("images")}
          placeholder="Enter image URLs separated by commas"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="anonymous" {...register("anonymous")} />
        <label htmlFor="anonymous" className="text-sm font-medium">
          Post anonymously
        </label>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Create Review"}
      </Button>
    </motion.form>
  );
}
