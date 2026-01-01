import PurchaseHistoryList from "./_components/purchase-history-list";

export const metadata = {
  title: "Purchase History | Vehiql",
  description: "View your purchased cars and write reviews",
};

export default function PurchaseHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Purchase History</h1>
      <PurchaseHistoryList />
    </div>
  );
}