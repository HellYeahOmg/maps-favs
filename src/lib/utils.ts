import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type SelectReview } from "~/server/db/schema";
import { type UserResource } from "@clerk/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const orderTypeToString = (orderType: SelectReview["orderType"]) => {
  switch (orderType) {
    case "dine_in":
      return "На месте";
    case "take_out":
      return "Самовывоз";
    case "delivery":
      return "Доставка";
  }
};

export const foodTypeToString = (foodType: SelectReview["foodType"]) => {
  switch (foodType) {
    case "breakfast":
      return "Завтрак";
    case "lunch":
      return "Обед";
    case "dinner":
      return "Ужин";
  }
};

export const getIsAdmin = (user?: UserResource | null) => {
  if (!user) {
    return false;
  }

  return user.publicMetadata.isAdmin === "true";
};
