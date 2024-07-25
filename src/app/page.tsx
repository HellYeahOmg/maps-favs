import { MapComponent } from "~/components/MapComponent";
import React from "react";
import { getReviews } from "~/server/queries";

export default async function HomePage() {
  const data = await getReviews();
  console.log("data", data);

  return <MapComponent reviews={data} />;
}
