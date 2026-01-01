"use client";

import { useState } from "react";
import Image from "next/image";
import { Car as CarIcon, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SoldCarsList({ cars }) {
  const router = useRouter();

  if (!cars || cars.length === 0) {
    return (
      <div className="text-center py-12">
        <CarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No sold cars found
        </h3>
        <p className="text-gray-500">
          Check back later for sold cars and their reviews.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <Card key={car.id} className="overflow-hidden hover:shadow-lg transition">
          <div className="relative h-48">
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
                  <CarIcon className="h-12 w-12 text-gray-400" />
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <CarIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
            
            <div className="absolute top-2 left-2">
              <Badge variant="destructive">SOLD</Badge>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="flex flex-col mb-2">
              <h3 className="text-lg font-bold line-clamp-1">
                {car.make} {car.model}
              </h3>
              <span className="text-xl font-bold text-blue-600">
                ${parseFloat(car.price).toLocaleString()}
              </span>
            </div>

            <div className="text-gray-600 mb-2 flex items-center">
              <span>{car.year}</span>
              <span className="mx-2">•</span>
              <span>{car.transmission}</span>
              <span className="mx-2">•</span>
              <span>{car.fuelType}</span>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              <Badge variant="outline" className="bg-gray-50">
                {car.bodyType}
              </Badge>
              <Badge variant="outline" className="bg-gray-50">
                {car.mileage.toLocaleString()} miles
              </Badge>
              <Badge variant="outline" className="bg-gray-50">
                {car.color}
              </Badge>
            </div>

            {car.reviews && car.reviews.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= car.averageRating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({car.reviews.length} review{car.reviews.length !== 1 ? 's' : ''})
                  </span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">
                  "{car.reviews[0].comment}"
                </p>
              </div>
            )}

            <Button
              className="w-full"
              onClick={() => router.push(`/sold-cars/${car.id}`)}
            >
              View Details & Reviews
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}