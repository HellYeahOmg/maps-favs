import type { SelectReview } from "~/server/db/schema";

export type NewPlaceData = {
  lat: number;
  lng: number;
  placeId: string;
};

export type ReviewWithoutPlace = Omit<
  SelectReview,
  "lat" | "lng" | "placeId" | "id"
>;
