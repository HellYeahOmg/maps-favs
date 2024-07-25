export type NewPlaceData = {
  lat: number;
  lng: number;
  placeId: string;
};

export type StoredMarker = NewPlaceData & {
  review: string;
  rating: number;
};
