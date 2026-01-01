import { getSoldCars } from "@/actions/cars";
import SoldCarsList from "./_components/sold-cars-list";

export const metadata = {
  title: "Sold Cars History - VEHIQL",
  description: "Browse previously sold cars and their customer reviews",
};

export default async function SoldCarsPage() {
  const soldCars = await getSoldCars();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sold Cars History</h1>
        <p className="text-gray-600">
          Browse cars that have been sold and read customer reviews
        </p>
      </div>

      <SoldCarsList cars={soldCars} />
    </div>
  );
}