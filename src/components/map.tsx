import {
  AdvancedMarker,
  Map as GoogleMap,
  type MapMouseEvent,
  Pin,
} from "@vis.gl/react-google-maps";
import { env } from "~/env";
import { type SelectReview } from "~/server/db/schema";

type PropTypes = {
  markers: SelectReview[];
  onClick: (e: MapMouseEvent) => void;
  handleMarkerClick: (item: SelectReview) => void;
};

export const Map = ({ markers, onClick, handleMarkerClick }: PropTypes) => {
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
        <AdvancedMarker
          key={item.id}
          position={{ lng: +item.lng, lat: +item.lat }}
          onClick={() => handleMarkerClick(item)}
        >
          <Pin
            background={"#0f9d58"}
            borderColor={"#006425"}
            glyphColor={"#60d98f"}
            scale={0.6}
          />
        </AdvancedMarker>
      ))}
    </GoogleMap>
  );
};
