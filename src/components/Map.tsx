import { MarkerWithInfoWindow } from "~/components/marketWithInfoWindow";

import {
  Map as GoogleMap,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import type { StoredMarker } from "~/types";
import { env } from "~/env";

type PropTypes = {
  markers: StoredMarker[];
  onClick: (e: MapMouseEvent) => void;
  handleDelete: (placeId: string) => void;
  handleEdit: (item: StoredMarker) => void;
};

export const Map = ({
  markers,
  onClick,
  handleDelete,
  handleEdit,
}: PropTypes) => {
  return (
    <GoogleMap
      style={{ width: "100vw", height: "100vh" }}
      defaultCenter={{ lat: 41.40186867346923, lng: 2.193995613179558 }}
      defaultZoom={17}
      mapId={env.NEXT_PUBLIC_MAP_ID}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
      onClick={onClick}
    >
      {markers.map((item) => (
        <MarkerWithInfoWindow
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          key={item.placeId}
          item={item}
        />
      ))}
    </GoogleMap>
  );
};
