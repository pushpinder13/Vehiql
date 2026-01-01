"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addReview({ carId, rating, title, comment }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("You must be logged in to write a review");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Check if user has purchased this car
    const hasPurchased = await db.car.findFirst({
      where: {
        id: carId,
        status: "SOLD",
      },
    });

    if (!hasPurchased) {
      throw new Error("You can only review cars you have purchased");
    }

    // Check if user already reviewed this car
    const existingReview = await db.review.findUnique({
      where: {
        userId_carId: {
          userId: user.id,
          carId,
        },
      },
    });

    if (existingReview) {
      throw new Error("You have already reviewed this car");
    }

    const review = await db.review.create({
      data: {
        carId,
        userId: user.id,
        rating: parseInt(rating),
        title,
        comment,
        status: "PENDING",
      },
    });

    revalidatePath(`/cars/${carId}`);

    return {
      success: true,
      data: review,
    };
  } catch (error) {
    console.error("Error adding review:", error);
    return {
      success: false,
      error: error.message || "Failed to add review",
    };
  }
}

export async function getCarReviews(carId) {
  try {
    const reviews = await db.review.findMany({
      where: {
        carId,
        status: "APPROVED",
      },
      include: {
        user: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const reviewStats = await db.review.aggregate({
      where: {
        carId,
        status: "APPROVED",
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return {
      success: true,
      data: {
        reviews: reviews.map(review => ({
          ...review,
          createdAt: review.createdAt.toISOString(),
          updatedAt: review.updatedAt.toISOString(),
        })),
        stats: {
          averageRating: reviewStats._avg.rating || 0,
          totalReviews: reviewStats._count.rating || 0,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch reviews",
    };
  }
}

export async function voteOnReview({ reviewId, isHelpful }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("You must be logged in to vote");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Check if user already voted on this review
    const existingVote = await db.reviewVote.findUnique({
      where: {
        userId_reviewId: {
          userId: user.id,
          reviewId,
        },
      },
    });

    if (existingVote) {
      // Update existing vote
      await db.reviewVote.update({
        where: {
          userId_reviewId: {
            userId: user.id,
            reviewId,
          },
        },
        data: {
          isHelpful,
        },
      });
    } else {
      // Create new vote
      await db.reviewVote.create({
        data: {
          reviewId,
          userId: user.id,
          isHelpful,
        },
      });
    }

    // Update vote counts
    const votes = await db.reviewVote.groupBy({
      by: ["isHelpful"],
      where: { reviewId },
      _count: true,
    });

    const helpfulCount = votes.find(v => v.isHelpful)?._count || 0;
    const unhelpfulCount = votes.find(v => !v.isHelpful)?._count || 0;

    await db.review.update({
      where: { id: reviewId },
      data: {
        helpfulVotes: helpfulCount,
        unhelpfulVotes: unhelpfulCount,
      },
    });

    revalidatePath("/cars");

    return {
      success: true,
      message: "Vote recorded successfully",
    };
  } catch (error) {
    console.error("Error voting on review:", error);
    return {
      success: false,
      error: error.message || "Failed to vote on review",
    };
  }
}

export async function getAllReviews() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Admin access required");
    }

    const reviews = await db.review.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        car: {
          select: {
            make: true,
            model: true,
            year: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: reviews.map(review => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch reviews",
    };
  }
}

export async function moderateReview({ reviewId, status }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Admin access required");
    }

    await db.review.update({
      where: { id: reviewId },
      data: { status },
    });

    revalidatePath("/admin/reviews");

    return {
      success: true,
      message: `Review ${status.toLowerCase()} successfully`,
    };
  } catch (error) {
    console.error("Error moderating review:", error);
    return {
      success: false,
      error: error.message || "Failed to moderate review",
    };
  }
}