"use client";

import { useEffect, useState } from "react";
import { Star, Check, X, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllReviews, moderateReview } from "@/actions/reviews";
import useFetch from "@/hooks/use-fetch";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function ReviewsList() {
  const {
    loading: loadingReviews,
    fn: fetchReviews,
    data: reviewsData,
    error: reviewsError,
  } = useFetch(getAllReviews);

  const {
    loading: moderatingReview,
    fn: moderateReviewFn,
    data: moderateResult,
    error: moderateError,
  } = useFetch(moderateReview);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (moderateResult?.success) {
      toast.success(moderateResult.message);
      fetchReviews();
    }
  }, [moderateResult]);

  useEffect(() => {
    if (moderateError) {
      toast.error(moderateError.message || "Failed to moderate review");
    }
  }, [moderateError]);

  const handleModerate = async (reviewId, status) => {
    await moderateReviewFn({ reviewId, status });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>;
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loadingReviews) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const reviews = reviewsData?.data || [];

  return (
    <Card>
      <CardContent className="p-0">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <Eye className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reviews found
            </h3>
            <p className="text-gray-600">
              Customer reviews will appear here for moderation.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Car</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={review.user.imageUrl} />
                          <AvatarFallback>
                            {review.user.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {review.user.name || "Anonymous"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {review.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-medium">
                        {review.car.year} {review.car.make} {review.car.model}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-sm font-medium">{review.rating}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="max-w-xs">
                      <div className="font-medium mb-1">{review.title}</div>
                      <div className="text-sm text-gray-600 truncate">
                        {review.comment}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>👍 {review.helpfulVotes}</span>
                        <span>👎 {review.unhelpfulVotes}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {getStatusBadge(review.status)}
                    </TableCell>
                    
                    <TableCell className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex gap-1">
                        {review.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleModerate(review.id, "APPROVED")}
                              disabled={moderatingReview}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleModerate(review.id, "REJECTED")}
                              disabled={moderatingReview}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {review.status === "APPROVED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleModerate(review.id, "REJECTED")}
                            disabled={moderatingReview}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                        {review.status === "REJECTED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleModerate(review.id, "APPROVED")}
                            disabled={moderatingReview}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}