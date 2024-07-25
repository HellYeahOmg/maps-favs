"use client";

import { APIProvider, type MapMouseEvent } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

import { NewPlaceDialog } from "~/components/newPlaceDialog";
import { Map } from "~/components/Map";
import { type NewPlaceData, type StoredMarker } from "~/types";
import { env } from "~/env";

export default function HomePage() {
  const [placeToSave, setPlaceToSave] = useState<NewPlaceData | null>(null);
  const [placeToEdit, setPlaceToEdit] = useState<StoredMarker | null>(null);
  const [markers, setMarkers] = useState<StoredMarker[]>([]);

  useEffect(() => {
    const savedMarkets = localStorage.getItem("markers");

    if (savedMarkets) {
      setMarkers(JSON.parse(savedMarkets) as StoredMarker[]);
    }
  }, []);

  const handleClick = (e: MapMouseEvent) => {
    e.stop();

    if (
      e.detail.placeId &&
      markers.some((m) => m.placeId === e.detail.placeId)
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

  const handleNewPlace = (review: string, rating: number) => {
    if (placeToSave) {
      const newMarker: StoredMarker = {
        ...placeToSave,
        review,
        rating,
      };

      setMarkers((prevState) => {
        const newData = [...prevState, newMarker];
        localStorage.setItem("markers", JSON.stringify(newData));
        return newData;
      });

      setPlaceToSave(null);
    }
  };

  const handleEditPlace = (place: StoredMarker) => {
    const index = markers.findIndex((m) => m.placeId === place.placeId);

    if (index !== -1) {
      const newMarkers = [...markers];
      newMarkers[index] = place;
      setMarkers(newMarkers);
      localStorage.setItem("markers", JSON.stringify(newMarkers));
    }

    setPlaceToEdit(null);
  };

  const onOpenChange = () => {
    setPlaceToEdit(null);
    setPlaceToSave(null);
  };

  const handleDeletePlace = (placeId: string) => {
    setMarkers((prev) => {
      const newMarkers = prev.filter((item) => item.placeId !== placeId);
      localStorage.setItem("markers", JSON.stringify(newMarkers));
      return newMarkers;
    });
  };

  return (
    <>
      <APIProvider apiKey={env.NEXT_PUBLIC_API_KEY}>
        <Map
          markers={markers}
          onClick={handleClick}
          handleDelete={handleDeletePlace}
          handleEdit={handleEditPlace}
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
}
