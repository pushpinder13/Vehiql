"use client";

import { useEffect, useState } from "react";
import { Star, Calendar, Car as CarIcon, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserPurchases } from "@/actions/purchase";
import { getCarReviews } from "@/actions/reviews";
import useFetch from "@/hooks/use-fetch";
import { formatCurrency } from "@/lib/helper";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import AddReviewForm from "../../cars/[id]/_components/add-review-form";

export default function PurchaseHistoryList() {
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [userReviews, setUserReviews] = useState({});

  const {
    loading: loadingPurchases,
    fn: fetchPurchases,
    data: purchasesData,
    error: purchasesError,
  } = useFetch(getUserPurchases);

  const {
    loading: loadingReviews,
    fn: fetchCarReviews,
    data: reviewsData,
  } = useFetch(getCarReviews);

  useEffect(() => {
    fetchPurchases();
  }, []);

  // Check if user has already reviewed each car
  useEffect(() => {
    if (purchasesData?.success && purchasesData.data.length > 0) {
      purchasesData.data.forEach(async (purchase) => {
        const reviews = await fetchCarReviews(purchase.carId);
        if (reviews?.success) {
          const userReview = reviews.data.reviews.find(
            review => review.userId === purchase.userId
          );
          if (userReview) {
            setUserReviews(prev => ({
              ...prev,
              [purchase.carId]: userReview
            }));
          }
        }
      });
    }
  }, [purchasesData]);

  const handleReviewSuccess = (carId) => {
    setShowReviewForm(null);
    fetchPurchases(); // Refresh the list
  };

  if (loadingPurchases) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const purchases = purchasesData?.data || [];

  if (purchases.length === 0) {
    return (
      <div className="text-center py-12">
        <CarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          No purchases yet
        </h3>
        <p className="text-gray-600 mb-6">
          When you purchase a car, it will appear here and you can write reviews.
        </p>
        <Link href="/cars">
          <Button>Browse Cars</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {purchases.map((purchase) => (
        <Card key={purchase.id} className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Purchased on {format(new Date(purchase.purchaseDate), "MMMM d, yyyy")}
              </CardTitle>
              <Badge className="bg-green-100 text-green-800">
                {purchase.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Car Image */}
              <div className="relative h-48 rounded-lg overflow-hidden">
                {purchase.car.images && purchase.car.images[0] ? (
                  <Image
                    src={purchase.car.images[0]}
                    alt={`${purchase.car.year} ${purchase.car.make} ${purchase.car.model}`}
                    fill
                    className="object-cover"
                    unoptimized
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${purchase.car.images && purchase.car.images[0] ? 'hidden' : ''}`}>
                  <CarIcon className="h-12 w-12 text-gray-400" />
                </div>
              </div>

              {/* Car Details */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold">
                  {purchase.car.year} {purchase.car.make} {purchase.car.model}
                </h3>
                <div className="flex gap-2">
                  <Badge variant="outline">{purchase.car.bodyType}</Badge>
                  <Badge variant="outline">{purchase.car.fuelType}</Badge>
                  <Badge variant="outline">{purchase.car.transmission}</Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Car Driven: {purchase.car.mileage.toLocaleString()} miles</div>
                  <div>Color: {purchase.car.color}</div>
                  {purchase.car.seats && <div>Seats: {purchase.car.seats}</div>}
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(purchase.car.price)}
                </div>
              </div>

              {/* Review Section */}
              <div className="space-y-4">
                {userReviews[purchase.carId] ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Your Review</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= userReviews[purchase.carId].rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm font-medium">
                        {userReviews[purchase.carId].rating}/5
                      </span>
                    </div>
                    <h4 className="font-medium mb-1">
                      {userReviews[purchase.carId].title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {userReviews[purchase.carId].comment}
                    </p>
                    <Badge 
                      variant="outline" 
                      className={`mt-2 ${
                        userReviews[purchase.carId].status === 'APPROVED' 
                          ? 'bg-green-50 text-green-700' 
                          : userReviews[purchase.carId].status === 'PENDING'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {userReviews[purchase.carId].status}
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Share your experience</span>
                    </div>
                    <Button
                      onClick={() => setShowReviewForm(purchase.carId)}
                      className="w-full"
                      variant="outline"
                    >
                      Write Review
                    </Button>
                  </div>
                )}
                
                <Link href={`/cars/${purchase.carId}`}>
                  <Button variant="outline" className="w-full">
                    View Car Details
                  </Button>
                </Link>
              </div>
            </div>

            {/* Review Form */}
            {showReviewForm === purchase.carId && (
              <div className="mt-6 pt-6 border-t">
                <AddReviewForm
                  carId={purchase.carId}
                  onSuccess={() => handleReviewSuccess(purchase.carId)}
                  onCancel={() => setShowReviewForm(null)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}