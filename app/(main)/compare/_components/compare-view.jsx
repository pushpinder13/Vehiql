"use client";

import { useComparison } from "@/contexts/comparison-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/helper";
import { Car as CarIcon, X, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CompareView() {
  const { comparisonCars, removeFromComparison, clearComparison } = useComparison();
  const router = useRouter();

  if (comparisonCars.length === 0) {
    return (
      <div className="text-center py-12">
        <CarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Cars to Compare</h2>
        <p className="text-gray-600 mb-6">Add cars to comparison from the cars page to see them here.</p>
        <Link href="/cars">
          <Button>Browse Cars</Button>
        </Link>
      </div>
    );
  }

  const comparisonData = [
    { label: "Image", key: "images" },
    { label: "Make & Model", key: "makeModel" },
    { label: "Year", key: "year" },
    { label: "Price", key: "price" },
    { label: "Car Driven", key: "mileage" },
    { label: "Color", key: "color" },
    { label: "Fuel Type", key: "fuelType" },
    { label: "Transmission", key: "transmission" },
    { label: "Body Type", key: "bodyType" },
    { label: "Seats", key: "seats" },
    { label: "Status", key: "status" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case "UNAVAILABLE":
        return <Badge className="bg-amber-100 text-amber-800">Unavailable</Badge>;
      case "SOLD":
        return <Badge className="bg-blue-100 text-blue-800">Sold</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderCellValue = (car, key) => {
    switch (key) {
      case "images":
        return (
          <div className="w-24 h-16 rounded-md overflow-hidden mx-auto">
            {car.images && car.images.length > 0 ? (
              <Image
                src={car.images[0]}
                alt={`${car.make} ${car.model}`}
                width={96}
                height={64}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <CarIcon className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
        );
      case "makeModel":
        return (
          <div className="text-center">
            <div className="font-semibold">{car.make} {car.model}</div>
          </div>
        );
      case "price":
        return <div className="font-bold text-blue-600">{formatCurrency(car.price)}</div>;
      case "mileage":
        return `${car.mileage?.toLocaleString()} miles`;
      case "seats":
        return car.seats ? `${car.seats} seats` : "N/A";
      case "status":
        return getStatusBadge(car.status);
      default:
        return car[key] || "N/A";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Compare Cars</h1>
        </div>
        <Button variant="outline" onClick={clearComparison}>
          Clear All
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Car Comparison ({comparisonCars.length}/3)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-4 font-medium text-gray-600 w-32">Specification</th>
                  {comparisonCars.map((car) => (
                    <th key={car.id} className="p-4 text-center min-w-48">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-semibold">{car.make} {car.model}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => removeFromComparison(car.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={row.key} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="p-4 font-medium text-gray-700">{row.label}</td>
                    {comparisonCars.map((car) => (
                      <td key={car.id} className="p-4 text-center">
                        {renderCellValue(car, row.key)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-4 font-medium text-gray-700">Actions</td>
                  {comparisonCars.map((car) => (
                    <td key={car.id} className="p-4 text-center">
                      <div className="space-y-2">
                        <Link href={`/cars/${car.id}`}>
                          <Button size="sm" className="w-full">View Details</Button>
                        </Link>
                        {car.status === "AVAILABLE" && (
                          <Link href={`/test-drives/${car.id}`}>
                            <Button variant="outline" size="sm" className="w-full">Test Drive</Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}