"use client";

import Image from "next/image";
import { Car as CarIcon, Star, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SoldCarDetails({ car, reviews = [] }) {
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Car Images */}
        <div className="space-y-4">
          <div className="relative h-96 rounded-lg overflow-hidden">
            {car.images && car.images.length > 0 ? (
              <div className="relative w-full h-full">
                <Image
                  src={car.images[0]}
                  alt={`${car.make} ${car.model}`}
                  fill
                  className="object-cover"
                  unoptimized
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gray-200 flex items-center justify-center hidden">
                  <CarIcon className="h-16 w-16 text-gray-400" />
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <CarIcon className="h-16 w-16 text-gray-400" />
              </div>
            )}
            
            <div className="absolute top-4 left-4">
              <Badge variant="destructive" className="text-lg px-3 py-1">
                SOLD
              </Badge>
            </div>
          </div>
        </div>

        {/* Car Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {car.make} {car.model}
            </h1>
            <p className="text-2xl font-bold text-blue-600 mb-4">
              ${parseFloat(car.price).toLocaleString()}
            </p>
            
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= averageRating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {averageRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Year</span>
                <p className="font-semibold">{car.year}</p>
              </div>
              <div>
                <span className="text-gray-600">Car Driven</span>
                <p className="font-semibold">{car.mileage.toLocaleString()} miles</p>
              </div>
              <div>
                <span className="text-gray-600">Fuel Type</span>
                <p className="font-semibold">{car.fuelType}</p>
              </div>
              <div>
                <span className="text-gray-600">Transmission</span>
                <p className="font-semibold">{car.transmission}</p>
              </div>
              <div>
                <span className="text-gray-600">Body Type</span>
                <p className="font-semibold">{car.bodyType}</p>
              </div>
              <div>
                <span className="text-gray-600">Color</span>
                <p className="font-semibold">{car.color}</p>
              </div>
              {car.seats && (
                <div>
                  <span className="text-gray-600">Seats</span>
                  <p className="font-semibold">{car.seats}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{car.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No reviews available for this car yet.
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={review.user.imageUrl} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{review.user.name || "Anonymous"}</span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <h4 className="font-semibold mb-2">{review.title}</h4>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}