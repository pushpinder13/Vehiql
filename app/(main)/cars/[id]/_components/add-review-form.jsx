"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { addReview } from "@/actions/reviews";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { useEffect } from "react";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  title: z.string().min(5, "Title must be at least 5 characters"),
  comment: z.string().min(20, "Review must be at least 20 characters"),
});

export default function AddReviewForm({ carId, onSuccess, onCancel }) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(reviewSchema),
  });

  const {
    loading: submittingReview,
    fn: addReviewFn,
    data: reviewResult,
    error: reviewError,
  } = useFetch(addReview);

  useEffect(() => {
    if (reviewResult?.success) {
      toast.success("Review submitted successfully! It will be visible after approval.");
      reset();
      setSelectedRating(0);
      onSuccess();
    }
  }, [reviewResult, reset, onSuccess]);

  useEffect(() => {
    if (reviewError) {
      toast.error(reviewError.message || "Failed to submit review");
    }
  }, [reviewError]);

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
    setValue("rating", rating);
  };

  const onSubmit = async (data) => {
    await addReviewFn({
      carId,
      ...data,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Rating *</Label>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRatingClick(star)}
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= (hoverRating || selectedRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {selectedRating > 0 && (
                  <>
                    {selectedRating} star{selectedRating !== 1 ? "s" : ""}
                  </>
                )}
              </span>
            </div>
            {errors.rating && (
              <p className="text-sm text-red-500 mt-1">{errors.rating.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Summarize your experience"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="comment">Your Review *</Label>
            <Textarea
              id="comment"
              {...register("comment")}
              placeholder="Share your experience with this car..."
              rows={4}
              className={errors.comment ? "border-red-500" : ""}
            />
            {errors.comment && (
              <p className="text-sm text-red-500 mt-1">{errors.comment.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={submittingReview}
              className="flex-1"
            >
              {submittingReview ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={submittingReview}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}