"use client";

import { useState } from "react";
import type { NewPlaceData, ReviewWithoutPlace } from "~/types";
import { APIProvider, type MapMouseEvent } from "@vis.gl/react-google-maps";
import { env } from "~/env";
import { Map } from "~/components/map";
import { ReviewDialog } from "~/components/reviewDialog";
import { type SelectReview } from "~/server/db/schema";
import { addReview, deleteReview, updateReview } from "~/server/queries";
import { ReviewSheet } from "~/components/reviewSheet";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "~/lib/utils";

type PropTypes = {
  reviews: SelectReview[];
};

export const MapContainer = ({ reviews }: PropTypes) => {
  const { user } = useUser();
  const [placeToSave, setPlaceToSave] = useState<NewPlaceData | null>(null);
  const [selectedReview, setSelectedReview] = useState<SelectReview | null>(
    null,
  );
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showSheet, setShowSheet] = useState(false);

  const handleClick = (e: MapMouseEvent) => {
    e.stop();

    if (!isAdmin(user)) {
      return;
    }

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
      setShowReviewDialog(true);
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
      setShowReviewDialog(false);
    }
  };

  const handleEditPlace = async (review: ReviewWithoutPlace) => {
    if (selectedReview) {
      const itemToEdit: SelectReview = {
        ...review,
        id: selectedReview.id,
        lng: selectedReview.lng,
        lat: selectedReview.lat,
        placeId: selectedReview.placeId,
      };

      await updateReview(itemToEdit);
      setSelectedReview(null);
      setShowReviewDialog(false);
    }
  };

  const handleDeletePlace = async () => {
    if (selectedReview) {
      await deleteReview(selectedReview?.id);
      setShowSheet(false);
    }
  };

  const handleMarkerClick = (review: SelectReview) => {
    setShowSheet(true);
    setSelectedReview(review);
  };

  const handleUpdate = () => {
    setShowSheet(false);
    setShowReviewDialog(true);
  };

  return (
    <>
      <APIProvider apiKey={env.NEXT_PUBLIC_API_KEY}>
        <Map
          markers={reviews}
          onClick={handleClick}
          handleMarkerClick={handleMarkerClick}
        />

        <ReviewDialog
          open={showReviewDialog}
          placeToEdit={selectedReview}
          onOpenChange={setShowReviewDialog}
          handleNewPlace={handleNewPlace}
          handleEditPlace={handleEditPlace}
        />

        <ReviewSheet
          showSheet={showSheet}
          setShowSheet={setShowSheet}
          handleDeletePlace={handleDeletePlace}
          handleUpdate={handleUpdate}
          selectedReview={selectedReview}
        />
      </APIProvider>
    </>
  );
};
