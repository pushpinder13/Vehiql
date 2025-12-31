"use client";

import { useComparison } from "@/contexts/comparison-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ComparisonBar() {
  const { comparisonCars, removeFromComparison } = useComparison();

  if (comparisonCars.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <Card className="p-4 shadow-lg border-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Compare Cars</span>
              <Badge variant="secondary">{comparisonCars.length}/3</Badge>
            </div>
            
            <div className="flex gap-2">
              {comparisonCars.map((car) => (
                <div key={car.id} className="relative group">
                  <div className="w-16 h-12 rounded border overflow-hidden">
                    {car.images && car.images.length > 0 ? (
                      <Image
                        src={car.images[0]}
                        alt={`${car.make} ${car.model}`}
                        width={64}
                        height={48}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <button
                    onClick={() => removeFromComparison(car.id)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {car.make} {car.model}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link href="/compare">
            <Button className="flex items-center gap-2">
              Compare Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}