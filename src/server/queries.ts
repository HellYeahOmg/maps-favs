"use server";

import { db } from "~/server/db";
import {
  reviews,
  type InsertReview,
  type SelectReview,
} from "~/server/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { utapi } from "~/server/uploadthing";

export const getReviews = async () => await db.query.reviews.findMany();

export const deleteReview = async (reviewId: number) => {
  await db.delete(reviews).where(eq(reviews.id, reviewId));
  revalidatePath("/");
};

export const updateReview = async (item: SelectReview) => {
  await db.update(reviews).set(item).where(eq(reviews.id, item.id));
  revalidatePath("/");
};

export const addReview = async (item: InsertReview) => {
  await db.insert(reviews).values(item);
  revalidatePath("/");
};

export const deleteFile = async (keys: string[]) => {
  await utapi.deleteFiles(keys);
};
