import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ComparisonProvider } from "@/contexts/comparison-context";
import ComparisonBar from "@/components/comparison-bar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Vehiql",
  description: "Find your Dream Car",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/logo-white.png" sizes="any" />
        </head>
        <body className={`${inter.className}`}>
          <ComparisonProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <ComparisonBar />
            <Toaster richColors />
          </ComparisonProvider>

          <footer className="bg-blue-50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>Developed by Pushpinder Singh</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}