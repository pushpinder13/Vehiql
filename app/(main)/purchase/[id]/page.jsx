import { getCarById } from "@/actions/car-listing";
import { notFound } from "next/navigation";
import PurchaseForm from "./_components/purchase-form";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const result = await getCarById(id);

  if (!result.success) {
    return {
      title: "Car Not Found | Vehiql",
      description: "The requested car could not be found",
    };
  }

  const car = result.data;

  return {
    title: `Purchase ${car.year} ${car.make} ${car.model} | Vehiql`,
    description: `Complete your purchase of ${car.year} ${car.make} ${car.model}`,
  };
}

export default async function PurchasePage({ params }) {
  const { id } = await params;
  const result = await getCarById(id);

  if (!result.success) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-6xl mb-6 gradient-title">Complete Your Purchase</h1>
      <PurchaseForm car={result.data} />
    </div>
  );
}