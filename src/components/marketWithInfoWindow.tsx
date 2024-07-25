import {
  AdvancedMarker,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import { type StoredMarker } from "~/types";
import StarReview from "~/components/ui/starReview";
import { Button } from "~/components/ui/button";

export type Props = {
  item: StoredMarker;
  handleEdit: (item: StoredMarker) => void;
  handleDelete: (placeId: string) => void;
};

export const MarkerWithInfoWindow = ({
  item,
  handleEdit,
  handleDelete,
}: Props) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [title, setTitle] = useState("");

  const map = useMap();
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLib || !map || !infoWindowShown) return;

    const svc = new placesLib.PlacesService(map);

    const request = {
      placeId: item.placeId,
      fields: ["name"],
    };

    svc.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log("Place details:", place);
        setTitle(place?.name ?? "");
      } else {
        console.error("Place details request failed:", status);
      }
    });
  }, [item.placeId, map, placesLib, infoWindowShown]);

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback(
    () => setInfoWindowShown((isShown) => !isShown),
    [],
  );

  // if the maps api closes the infowindow, we have to synchronize our state
  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lng: item.lng, lat: item.lat }}
        onClick={handleMarkerClick}
      >
        <Pin
          background={"#0f9d58"}
          borderColor={"#006425"}
          glyphColor={"#60d98f"}
          scale={0.6}
        />
      </AdvancedMarker>

      {infoWindowShown && (
        <InfoWindow minWidth={200} anchor={marker} onClose={handleClose}>
          <p className={"bold mb-2 text-2xl"}>{title}</p>
          <p className={"mb-2"}>&quot;{item.review}&quot;</p>
          <div className={"mb-4 flex items-center gap-2"}>
            Rating: <StarReview disabled rating={item.rating} />
          </div>

          <div className={"flex gap-2"}>
            <Button size={"sm"} onClick={() => handleEdit(item)}>
              Edit
            </Button>
            <Button
              variant={"destructive"}
              size={"sm"}
              onClick={() => handleDelete(item.placeId)}
            >
              Delete
            </Button>
          </div>
        </InfoWindow>
      )}
    </>
  );
};
