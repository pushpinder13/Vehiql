"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getCarReviews, voteOnReview } from "@/actions/reviews";
import useFetch from "@/hooks/use-fetch";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import AddReviewForm from "./add-review-form";

export default function ReviewSection({ carId }) {
  const { isSignedIn } = useAuth();
  const [showAddReview, setShowAddReview] = useState(false);

  const {
    loading: loadingReviews,
    fn: fetchReviews,
    data: reviewsData,
    error: reviewsError,
  } = useFetch(getCarReviews);

  const {
    loading: votingOnReview,
    fn: voteOnReviewFn,
    data: voteResult,
    error: voteError,
  } = useFetch(voteOnReview);

  useEffect(() => {
    fetchReviews(carId);
  }, [carId]);

  useEffect(() => {
    if (voteResult?.success) {
      toast.success(voteResult.message);
      fetchReviews(carId);
    }
  }, [voteResult, carId]);

  useEffect(() => {
    if (voteError) {
      toast.error(voteError.message || "Failed to vote on review");
    }
  }, [voteError]);

  const handleVote = async (reviewId, isHelpful) => {
    if (!isSignedIn) {
      toast.error("Please sign in to vote on reviews");
      return;
    }
    await voteOnReviewFn({ reviewId, isHelpful });
  };

  const renderStars = (rating, size = "w-4 h-4") => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loadingReviews) {
    return (
      <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b pb-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const reviews = reviewsData?.data?.reviews || [];
  const stats = reviewsData?.data?.stats || { averageRating: 0, totalReviews: 0 };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          {stats.totalReviews > 0 && (
            <div className="flex items-center gap-2">
              {renderStars(Math.round(stats.averageRating), "w-5 h-5")}
              <span className="text-lg font-semibold">
                {stats.averageRating.toFixed(1)}
              </span>
              <span className="text-gray-600">
                ({stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""})
              </span>
            </div>
          )}
        </div>
        
        {isSignedIn && (
          <Button
            onClick={() => setShowAddReview(!showAddReview)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Write Review
          </Button>
        )}
      </div>

      {showAddReview && (
        <div className="mb-6">
          <AddReviewForm
            carId={carId}
            onSuccess={() => {
              setShowAddReview(false);
              fetchReviews(carId);
            }}
            onCancel={() => setShowAddReview(false)}
          />
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reviews yet
          </h3>
          <p className="text-gray-600">
            Be the first to share your experience with this car.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={review.user.imageUrl} />
                  <AvatarFallback>
                    {review.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">
                      {review.user.name || "Anonymous"}
                    </span>
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  
                  <h4 className="font-medium mb-2">{review.title}</h4>
                  <p className="text-gray-700 mb-4">{review.comment}</p>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      Was this helpful?
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleVote(review.id, true)}
                        disabled={votingOnReview}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.helpfulVotes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleVote(review.id, false)}
                        disabled={votingOnReview}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>{review.unhelpfulVotes}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}