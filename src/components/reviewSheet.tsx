import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { type SelectReview } from "~/server/db/schema";
import { Skeleton } from "~/components/ui/skeleton";
import PlaceResult = google.maps.places.PlaceResult;
import StarReview from "~/components/ui/starReview";
import {
  foodTypeToString,
  getIsAdmin,
  getUrlByKey,
  orderTypeToString,
} from "~/lib/utils";
import { useUser } from "@clerk/nextjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alertDialog";
import Image from "next/image";
import { X } from "lucide-react";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import * as React from "react";

type PropTypes = {
  showSheet: boolean;
  setShowSheet: (flag: boolean) => void;
  handleDeletePlace: () => void;
  handleUpdate: () => void;
  selectedReview: SelectReview | null;
};

export const ReviewSheet = ({
  showSheet,
  setShowSheet,
  handleDeletePlace,
  handleUpdate,
  selectedReview,
}: PropTypes) => {
  const [placeData, setPlaceData] = useState<PlaceResult | null>(null);
  const map = useMap();
  const placesLib = useMapsLibrary("places");
  const { user } = useUser();
  const isAdmin = getIsAdmin(user);

  useEffect(() => {
    if (!placesLib || !map || !selectedReview) return;

    const svc = new placesLib.PlacesService(map);

    const request = {
      placeId: selectedReview.placeId,
      fields: ["name", "photos"],
    };

    svc.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log("Place details:", place);
        setPlaceData(place);
      } else {
        console.error("Place details request failed:", status);
      }
    });
  }, [selectedReview, map, placesLib]);

  return (
    <Sheet open={showSheet} onOpenChange={setShowSheet}>
      <SheetContent side={"left"}>
        {placeData && selectedReview ? (
          <>
            <SheetHeader className={"mb-6"}>
              <SheetTitle>{placeData.name}</SheetTitle>
            </SheetHeader>

            <ScrollArea className="mb-2 w-full whitespace-nowrap">
              <div className="flex w-max space-x-4">
                {selectedReview.images?.map((image) => (
                  <div key={image} className="overflow-hidden">
                    <Image
                      src={getUrlByKey(image)}
                      alt={``}
                      className={"max-h-75"}
                      width={380}
                      height={300}
                    />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <p className={"text-lg font-bold"}>Отзыв:</p>
            <p>&quot;{selectedReview.text}&quot;</p>
            <div className={"mt-4"}>
              <div className={"mb-4 flex items-center gap-2"}>
                Еда: <StarReview disabled rating={selectedReview.foodRating} />
              </div>
              <div className={"mb-4 flex items-center gap-2"}>
                Сервис:
                <StarReview disabled rating={selectedReview.serviceRating} />
              </div>
              <div className={"mb-4 flex items-center gap-2"}>
                Атмосфера:
                <StarReview disabled rating={selectedReview.atmosphereRating} />
              </div>
              <div className={"mb-4 flex items-center gap-2"}>
                Общая оценка:
                <StarReview disabled rating={selectedReview.rating} />
              </div>

              <div className={"mb-4 flex items-center gap-2"}>
                <p>
                  Способ заказа: &nbsp;
                  {orderTypeToString(selectedReview.orderType)}
                </p>
              </div>

              <div className={"mb-4 flex items-center gap-2"}>
                <p>
                  Тип заказа: &nbsp;{foodTypeToString(selectedReview.foodType)}
                </p>
              </div>
            </div>
            {isAdmin && (
              <SheetFooter className={"mt-6"}>
                <Button type="submit" onClick={handleUpdate}>
                  Обновить
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={"destructive"}>Удалить</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отменить</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeletePlace}>
                        Продолжить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </SheetFooter>
            )}
          </>
        ) : (
          <div className="mt-6 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
