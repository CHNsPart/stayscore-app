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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CANADIAN_PROVINCES } from "@/lib/location-utils";

interface LocationFields {
  address: string;
  state: string;
  postalCode: string;
}

const reviewSchema = z.object({
  locationFields: z.object({
    address: z.string().min(1, "Address is required"),
    state: z.string().min(1, "Province/Territory is required"),
    postalCode: z.string().min(6, "Valid postal code is required").max(7, "Postal code too long"),
  }),
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
      anonymous: globalAnonymous,
      locationFields: {
        state: "ON", // Default to Ontario
        address: "",
        postalCode: "",
      },
    },
  });

  const rating = watch("rating");
  const anonymous = watch("anonymous");
  const locationFields = watch("locationFields");

  const formatLocation = (fields: LocationFields): string => {
    const { address, state, postalCode } = fields;
    const stateLabel = CANADIAN_PROVINCES.find(p => p.value === state)?.label || state;
    return `${address}, ${stateLabel}, Canada, ${postalCode}`.trim();
  };

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      const formattedLocation = formatLocation(data.locationFields);
      
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          location: formattedLocation,
          anonymous: data.anonymous
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

        <div className="space-y-4">
          <div>
            <Label>Country</Label>
            <Input
              value="Canada"
              disabled
              className="bg-muted"
            />
          </div>

          <div>
            <Label>Province/Territory</Label>
            <Select
              defaultValue={locationFields.state}
              onValueChange={(value) => setValue("locationFields.state", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select province/territory" />
              </SelectTrigger>
              <SelectContent>
                {CANADIAN_PROVINCES.map((province) => (
                  <SelectItem key={province.value} value={province.value}>
                    {province.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.locationFields?.state && (
              <p className="text-sm text-destructive mt-1">{errors.locationFields.state.message}</p>
            )}
          </div>

          <div>
            <Label>Address</Label>
            <Textarea
              {...register("locationFields.address")}
              placeholder="Enter street address"
              className="resize-none"
            />
            {errors.locationFields?.address && (
              <p className="text-sm text-destructive mt-1">{errors.locationFields.address.message}</p>
            )}
          </div>

          <div>
            <Label>Postal Code</Label>
            <Input
              {...register("locationFields.postalCode")}
              placeholder="A1A 1A1"
              className="uppercase"
              onChange={(e) => {
                const formatted = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                if (formatted.length <= 6) {
                  setValue("locationFields.postalCode", formatted);
                }
              }}
            />
            {errors.locationFields?.postalCode && (
              <p className="text-sm text-destructive mt-1">{errors.locationFields.postalCode.message}</p>
            )}
          </div>
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
          <Label>Review Content</Label>
          <Textarea
            {...register("content")}
            placeholder="Write your review here"
            rows={5}
          />
          {errors.content && (
            <p className="text-sm text-destructive mt-1">{errors.content.message}</p>
          )}
        </div>

        <div>
          <Label>Images (optional)</Label>
          <Input
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