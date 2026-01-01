"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function completePurchase(carId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Create purchase record and update car status
    await db.$transaction([
      // Create purchase record
      db.purchase.create({
        data: {
          carId,
          userId: user.id,
          purchaseDate: new Date(),
          status: "COMPLETED",
        },
      }),
      // Update car status to SOLD
      db.car.update({
        where: { id: carId },
        data: { status: "SOLD" },
      }),
    ]);

    revalidatePath(`/cars/${carId}`);
    revalidatePath("/admin/cars");
    revalidatePath("/");
    revalidatePath("/purchase-history");

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

export async function getUserPurchases() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const purchases = await db.purchase.findMany({
      where: { userId: user.id },
      include: {
        car: true,
      },
      orderBy: { purchaseDate: "desc" },
    });

    return {
      success: true,
      data: purchases.map(purchase => ({
        ...purchase,
        purchaseDate: purchase.purchaseDate.toISOString(),
        car: {
          ...purchase.car,
          price: parseFloat(purchase.car.price.toString()),
          createdAt: purchase.car.createdAt.toISOString(),
          updatedAt: purchase.car.updatedAt.toISOString(),
        },
      })),
    };
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}