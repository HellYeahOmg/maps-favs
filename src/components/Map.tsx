import { MarkerWithInfoWindow } from "~/components/marketWithInfoWindow";

import {
  Map as GoogleMap,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { env } from "~/env";
import { type SelectReview } from "~/server/db/schema";

type PropTypes = {
  markers: SelectReview[];
  onClick: (e: MapMouseEvent) => void;
  handleDelete: (reviewId: number) => void;
  handleEdit: (item: SelectReview) => void;
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
