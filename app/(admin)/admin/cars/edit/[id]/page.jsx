import { getCarById } from "@/actions/car-listing";
import { notFound } from "next/navigation";
import EditCarForm from "./_components/edit-car-form";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const result = await getCarById(id);

  if (!result.success) {
    return {
      title: "Car Not Found | Vehiql Admin",
      description: "The requested car could not be found",
    };
  }

  const car = result.data;

  return {
    title: `Edit ${car.year} ${car.make} ${car.model} | Vehiql Admin`,
    description: `Edit details for ${car.year} ${car.make} ${car.model}`,
  };
}

export default async function EditCarPage({ params }) {
  const { id } = await params;
  const result = await getCarById(id);

  if (!result.success) {
    notFound();
  }

  // Extract only the car data, excluding testDriveInfo
  const { testDriveInfo, ...carData } = result.data;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Car</h1>
      <EditCarForm car={carData} />
    </div>
  );
}