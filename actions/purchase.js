"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function completePurchase(carId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Update car status to SOLD
    await db.car.update({
      where: { id: carId },
      data: { status: "SOLD" },
    });

    revalidatePath(`/cars/${carId}`);
    revalidatePath("/admin/cars");
    revalidatePath("/");

    return {
      success: true,
      message: "Purchase completed successfully",
    };
  } catch (error) {
    console.error("Purchase error:", error);
    return {
      success: false,
      error: error.message || "Failed to complete purchase",
    };
  }
}