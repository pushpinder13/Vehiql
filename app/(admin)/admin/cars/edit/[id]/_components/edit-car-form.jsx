"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Upload, X, Car as CarIcon } from "lucide-react";
import { updateCar } from "@/actions/cars";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import Link from "next/link";
import Image from "next/image";

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const transmissions = ["Automatic", "Manual", "Semi-Automatic"];
const bodyTypes = ["SUV", "Sedan", "Hatchback", "Convertible", "Coupe", "Wagon", "Pickup"];
const carStatuses = ["AVAILABLE", "UNAVAILABLE", "SOLD"];

const editCarSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().refine((val) => {
    const year = parseInt(val);
    return !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 1;
  }, "Valid year required"),
  price: z.string().min(1, "Price is required"),
  mileage: z.string().min(1, "Car Driven is required"),
  color: z.string().min(1, "Color is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  bodyType: z.string().min(1, "Body type is required"),
  seats: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["AVAILABLE", "UNAVAILABLE", "SOLD"]),
  featured: z.boolean().default(false),
});

export default function EditCarForm({ car }) {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState(car.images || []);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(editCarSchema),
    defaultValues: {
      make: car.make,
      model: car.model,
      year: car.year.toString(),
      price: car.price.toString(),
      mileage: car.mileage.toString(),
      color: car.color,
      fuelType: car.fuelType,
      transmission: car.transmission,
      bodyType: car.bodyType,
      seats: car.seats?.toString() || "",
      description: car.description,
      status: car.status,
      featured: car.featured,
    },
  });

  const {
    data: updateResult,
    loading: updateLoading,
    fn: updateCarFn,
    error: updateError,
  } = useFetch(updateCar);

  useEffect(() => {
    if (updateResult?.success) {
      toast.success("Car updated successfully");
      router.push("/admin/cars");
    }
  }, [updateResult, router]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError.message || "Failed to update car");
    }
  }, [updateError]);

  const onSubmit = async (data) => {
    const carData = {
      ...data,
      year: parseInt(data.year),
      price: parseFloat(data.price),
      mileage: parseInt(data.mileage),
      seats: data.seats ? parseInt(data.seats) : null,
    };

    await updateCarFn(car.id, carData, images, imagesToDelete);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages(prev => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
    setImagesToDelete(prev => [...prev, imageUrl]);
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/cars">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Cars
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Car Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  {...register("make")}
                  placeholder="e.g. Toyota"
                  className={errors.make ? "border-red-500" : ""}
                />
                {errors.make && (
                  <p className="text-xs text-red-500">{errors.make.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  {...register("model")}
                  placeholder="e.g. Camry"
                  className={errors.model ? "border-red-500" : ""}
                />
                {errors.model && (
                  <p className="text-xs text-red-500">{errors.model.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  {...register("year")}
                  placeholder="e.g. 2022"
                  className={errors.year ? "border-red-500" : ""}
                />
                {errors.year && (
                  <p className="text-xs text-red-500">{errors.year.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  {...register("price")}
                  placeholder="e.g. 25000"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-xs text-red-500">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileage">Car Driven</Label>
                <Input
                  id="mileage"
                  {...register("mileage")}
                  placeholder="e.g. 15000"
                  className={errors.mileage ? "border-red-500" : ""}
                />
                {errors.mileage && (
                  <p className="text-xs text-red-500">{errors.mileage.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  {...register("color")}
                  placeholder="e.g. Blue"
                  className={errors.color ? "border-red-500" : ""}
                />
                {errors.color && (
                  <p className="text-xs text-red-500">{errors.color.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select
                  onValueChange={(value) => setValue("fuelType", value)}
                  defaultValue={getValues("fuelType")}
                >
                  <SelectTrigger className={errors.fuelType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fuelType && (
                  <p className="text-xs text-red-500">{errors.fuelType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Select
                  onValueChange={(value) => setValue("transmission", value)}
                  defaultValue={getValues("transmission")}
                >
                  <SelectTrigger className={errors.transmission ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.transmission && (
                  <p className="text-xs text-red-500">{errors.transmission.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyType">Body Type</Label>
                <Select
                  onValueChange={(value) => setValue("bodyType", value)}
                  defaultValue={getValues("bodyType")}
                >
                  <SelectTrigger className={errors.bodyType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select body type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bodyType && (
                  <p className="text-xs text-red-500">{errors.bodyType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="seats">
                  Number of Seats <span className="text-sm text-gray-500">(Optional)</span>
                </Label>
                <Input
                  id="seats"
                  {...register("seats")}
                  placeholder="e.g. 5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => setValue("status", value)}
                  defaultValue={getValues("status")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {carStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label>Car Images</Label>
              
              {/* All Images in One Grid */}
              {(existingImages.length > 0 || images.length > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Existing Images */}
                  {existingImages.map((imageUrl, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border">
                        <Image
                          src={imageUrl}
                          alt={`Car image ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center hidden">
                          <CarIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeExistingImage(imageUrl)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  {/* New Images */}
                  {images.map((image, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border border-blue-200">
                        <Image
                          src={image}
                          alt={`New image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute top-1 left-1">
                        <span className="bg-blue-500 text-white text-xs px-1 py-0.5 rounded">NEW</span>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeNewImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragOver 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <Upload className={`h-8 w-8 mb-2 ${
                      isDragOver ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm mb-1 ${
                      isDragOver ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {isDragOver ? 'Drop images here' : 'Click to upload or drag & drop images'}
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter detailed description of the car..."
                className={`min-h-32 ${errors.description ? "border-red-500" : ""}`}
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
              <Checkbox
                id="featured"
                checked={watch("featured")}
                onCheckedChange={(checked) => setValue("featured", checked)}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="featured">Feature this car</Label>
                <p className="text-sm text-gray-500">
                  Featured cars appear on the homepage
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Car...
                  </>
                ) : (
                  "Update Car"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/cars")}
                disabled={updateLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}