import { getSoldCarById } from "@/actions/cars";
import { getCarReviews } from "@/actions/reviews";
import { notFound } from "next/navigation";
import SoldCarDetails from "../_components/sold-car-details";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const car = await getSoldCarById(id);
  
  if (!car) {
    return {
      title: "Car Not Found - VEHIQL",
    };
  }

  return {
    title: `${car.make} ${car.model} (${car.year}) - Sold Car Details - VEHIQL`,
    description: `View details and customer reviews for this sold ${car.make} ${car.model}`,
  };
}

export default async function SoldCarPage({ params }) {
  const { id } = await params;
  const [car, reviewsResult] = await Promise.all([
    getSoldCarById(id),
    getCarReviews(id)
  ]);

  if (!car) {
    notFound();
  }

  const reviews = reviewsResult?.success ? reviewsResult.data.reviews : [];

  return <SoldCarDetails car={car} reviews={reviews} />;
}