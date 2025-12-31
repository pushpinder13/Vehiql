import CompareView from "./_components/compare-view";

export const metadata = {
  title: "Compare Cars | Vehiql",
  description: "Compare cars side by side to make the best choice",
};

export default function ComparePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CompareView />
    </div>
  );
}