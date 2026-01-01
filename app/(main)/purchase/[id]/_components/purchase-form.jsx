"use client";

import { useState } from "react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/helper";
import { CreditCard, Lock, Car, CheckCircle } from "lucide-react";
import Image from "next/image";
import { completePurchase } from "@/actions/purchase";
import useFetch from "@/hooks/use-fetch";

const purchaseSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(10, "Complete address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Valid ZIP code is required"),
  cardNumber: z.string().min(16, "Valid card number is required"),
  expiryDate: z.string().min(5, "Valid expiry date is required (MM/YY)"),
  cvv: z.string().min(3, "Valid CVV is required"),
  cardName: z.string().min(2, "Cardholder name is required"),
});

export default function PurchaseForm({ car }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const {
    loading: purchaseLoading,
    fn: completePurchaseFn,
    data: purchaseResult,
    error: purchaseError,
  } = useFetch(completePurchase);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(purchaseSchema),
  });

  const onSubmit = async (data) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Complete the purchase (update car status to SOLD)
        await completePurchaseFn(car.id);
        setIsProcessing(false);
      } catch (error) {
        console.error("Purchase error:", error);
        setIsProcessing(false);
        toast.error("Purchase failed. Please try again.");
      }
    }, 3000);
  };

  // Handle purchase result from useFetch
  React.useEffect(() => {
    if (purchaseResult?.success) {
      setPaymentComplete(true);
      toast.success("Payment successful! Car marked as sold.");
    }
  }, [purchaseResult]);

  React.useEffect(() => {
    if (purchaseError) {
      toast.error(purchaseError.message || "Purchase failed");
    }
  }, [purchaseError]);

  if (paymentComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <Card className="p-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Purchase Successful!</h2>
          <p className="text-gray-600 mb-6">
            Congratulations! You have successfully purchased the {car.year} {car.make} {car.model}.
            Our team will contact you within 24 hours to arrange delivery and paperwork.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">Order Summary</p>
            <p className="text-sm text-gray-600">Vehicle: {car.year} {car.make} {car.model}</p>
            <p className="text-sm text-gray-600">Total Paid: {formatCurrency(car.price)}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Car Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {car.images && car.images[0] && (
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src={car.images[0]}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  fill
                  className="object-cover"
                  unoptimized
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gray-200 flex items-center justify-center hidden">
                  <Car className="h-12 w-12 text-gray-400" />
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-xl font-bold">{car.year} {car.make} {car.model}</h3>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{car.bodyType}</Badge>
                <Badge variant="outline">{car.fuelType}</Badge>
                <Badge variant="outline">{car.transmission}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Car Driven:</span>
                <span>{car.mileage.toLocaleString()} miles</span>
              </div>
              <div className="flex justify-between">
                <span>Color:</span>
                <span>{car.color}</span>
              </div>
              {car.seats && (
                <div className="flex justify-between">
                  <span>Seats:</span>
                  <span>{car.seats}</span>
                </div>
              )}
            </div>

            <Separator />
            
            <div className="flex justify-between text-lg font-bold">
              <span>Total Price:</span>
              <span className="text-blue-600">{formatCurrency(car.price)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="font-medium mb-4">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    placeholder="John Doe"
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="john@example.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="(555) 123-4567"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h4 className="font-medium mb-4">Delivery Address</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    {...register("address")}
                    placeholder="123 Main Street"
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      placeholder="New York"
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      {...register("state")}
                      placeholder="NY"
                      className={errors.state ? "border-red-500" : ""}
                    />
                    {errors.state && (
                      <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      {...register("zipCode")}
                      placeholder="10001"
                      className={errors.zipCode ? "border-red-500" : ""}
                    />
                    {errors.zipCode && (
                      <p className="text-xs text-red-500 mt-1">{errors.zipCode.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h4 className="font-medium mb-4">Payment Information</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    {...register("cardNumber")}
                    placeholder="1234 5678 9012 3456"
                    className={errors.cardNumber ? "border-red-500" : ""}
                  />
                  {errors.cardNumber && (
                    <p className="text-xs text-red-500 mt-1">{errors.cardNumber.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      {...register("expiryDate")}
                      placeholder="MM/YY"
                      className={errors.expiryDate ? "border-red-500" : ""}
                    />
                    {errors.expiryDate && (
                      <p className="text-xs text-red-500 mt-1">{errors.expiryDate.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      {...register("cvv")}
                      placeholder="123"
                      className={errors.cvv ? "border-red-500" : ""}
                    />
                    {errors.cvv && (
                      <p className="text-xs text-red-500 mt-1">{errors.cvv.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    {...register("cardName")}
                    placeholder="John Doe"
                    className={errors.cardName ? "border-red-500" : ""}
                  />
                  {errors.cardName && (
                    <p className="text-xs text-red-500 mt-1">{errors.cardName.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Lock className="h-4 w-4" />
                Your payment information is secure and encrypted
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg bg-green-600 hover:bg-green-700"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing Payment..." : `Complete Purchase - ${formatCurrency(car.price)}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}