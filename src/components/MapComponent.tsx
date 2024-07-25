"use client";

import { useState } from "react";
import type { NewPlaceData, ReviewWithoutPlace } from "~/types";
import { APIProvider, type MapMouseEvent } from "@vis.gl/react-google-maps";
import { env } from "~/env";
import { Map } from "~/components/Map";
import { NewPlaceDialog } from "~/components/newPlaceDialog";
import { type SelectReview } from "~/server/db/schema";
import { addReview, deleteReview, updateReview } from "~/server/queries";
import { text } from "drizzle-orm/pg-core";

type PropTypes = {
  reviews: SelectReview[];
};

export const MapComponent = ({ reviews }: PropTypes) => {
  const [placeToSave, setPlaceToSave] = useState<NewPlaceData | null>(null);
  const [placeToEdit, setPlaceToEdit] = useState<SelectReview | null>(null);

  const handleClick = (e: MapMouseEvent) => {
    e.stop();

    if (
      e.detail.placeId &&
      reviews.some((m) => m.placeId === e.detail.placeId)
    ) {
      return;
    }

    if (e.detail.placeId && e.detail.latLng) {
      const newMarker: NewPlaceData = {
        lat: e.detail.latLng.lat,
        lng: e.detail.latLng.lng,
        placeId: e.detail.placeId,
      };

      setPlaceToSave(newMarker);
    }
  };

  const handleNewPlace = async (item: ReviewWithoutPlace) => {
    if (placeToSave) {
      await addReview({
        lat: String(placeToSave.lat),
        lng: String(placeToSave.lng),
        placeId: placeToSave.placeId,
        ...item,
      });
      setPlaceToSave(null);
    }
  };

  const handleEditPlace = async (review: ReviewWithoutPlace) => {
    if (placeToEdit) {
      const itemToEdit: SelectReview = {
        ...review,
        id: placeToEdit.id,
        lng: placeToEdit.lng,
        lat: placeToEdit.lat,
        placeId: placeToEdit.placeId,
      };

      await updateReview(itemToEdit);
      setPlaceToEdit(null);
    }
  };

  const onOpenChange = () => {
    setPlaceToEdit(null);
    setPlaceToSave(null);
  };

  const handleDeletePlace = async (reviewId: number) => {
    await deleteReview(reviewId);
  };

  return (
    <>
      <APIProvider apiKey={env.NEXT_PUBLIC_API_KEY}>
        <Map
          markers={reviews}
          onClick={handleClick}
          handleDelete={handleDeletePlace}
          handleEdit={setPlaceToEdit}
        />
      </APIProvider>

      <NewPlaceDialog
        open={Boolean(placeToSave ?? placeToEdit)}
        placeToEdit={placeToEdit}
        onOpenChange={onOpenChange}
        handleNewPlace={handleNewPlace}
        handleEditPlace={handleEditPlace}
      />
    </>
  );
};
