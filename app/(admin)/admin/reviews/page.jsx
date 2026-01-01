import ReviewsList from "./_components/reviews-list";

export const metadata = {
  title: "Reviews Management | Vehiql Admin",
  description: "Manage and moderate customer reviews",
};

export default function AdminReviewsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reviews Management</h1>
      <ReviewsList />
    </div>
  );
}