"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Star, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Loader from "../theme/Loader";

const reviewSchema = z.object({
  location: z.string().min(1, "Location is required"),
  rating: z.number().min(1).max(10),
  content: z.string().min(10, "Review content must be at least 10 characters"),
  anonymous: z.boolean().default(false),
  images: z.string().optional(),
  dynamicFields: z.record(z.unknown()).optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function CreateReviewForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalAnonymous, setGlobalAnonymous] = useState(false);

  // Fetch user's global anonymous setting
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        setGlobalAnonymous(data.anonymous);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

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
      anonymous: globalAnonymous, // Set default based on global setting
    },
  });

  const rating = watch("rating");
  const anonymous = watch("anonymous");

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      // Explicitly include the anonymous field in the request
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          anonymous: data.anonymous // Make sure this is explicitly sent
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create review");
      }

      router.push("/reviews");
    } catch (error) {
      console.error("Error creating review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <Loader size="md" />
        </div>
      )}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {globalAnonymous && (
          <Alert>
            <AlertDescription className="flex items-center gap-2">
              <EyeOff className="h-4 w-4" />
              Global anonymous mode is enabled. Your review will be anonymous by default.
            </AlertDescription>
          </Alert>
        )}

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
          <Switch 
            id="anonymous" 
            checked={anonymous}
            onCheckedChange={(checked) => setValue("anonymous", checked)}
          />
          <label htmlFor="anonymous" className="text-sm font-medium flex items-center gap-2">
            <EyeOff className="h-4 w-4" />
            Post anonymously
          </label>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Create Review"}
        </Button>
      </motion.form>
    </div>
  );
}