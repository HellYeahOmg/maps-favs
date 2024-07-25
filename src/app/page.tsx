import { MapContainer } from "~/components/mapContainer";
import React from "react";
import { getReviews } from "~/server/queries";

export default async function HomePage() {
  const data = await getReviews();

  return <MapContainer reviews={data} />;
}
