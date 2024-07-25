import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useEffect, useState } from "react";
import StarReview from "~/components/ui/starReview";
import type { SelectReview } from "~/server/db/schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type ReviewWithoutPlace } from "~/types";

type PropTypes = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleNewPlace: (newItem: ReviewWithoutPlace) => void;
  placeToEdit?: SelectReview | null;
  handleEditPlace: (item: ReviewWithoutPlace) => void;
};

export const NewPlaceDialog = ({
  open,
  onOpenChange,
  handleNewPlace,
  placeToEdit,
  handleEditPlace,
}: PropTypes) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [atmosphereRating, setAtmosphereRating] = useState(0);
  const [orderType, setOrderType] =
    useState<SelectReview["orderType"]>("dine_in");
  const [foodType, setFoodType] =
    useState<SelectReview["foodType"]>("breakfast");

  const onSave = () => {
    const item: ReviewWithoutPlace = {
      text: reviewText,
      rating,
      foodRating,
      serviceRating,
      atmosphereRating,
      orderType,
      foodType,
    };

    placeToEdit ? handleEditPlace(item) : handleNewPlace(item);
    setReviewText("");
  };

  useEffect(() => {
    if (placeToEdit) {
      setReviewText(placeToEdit.text);
      setRating(placeToEdit.rating);
      setFoodRating(placeToEdit.foodRating);
      setServiceRating(placeToEdit.serviceRating);
      setAtmosphereRating(placeToEdit.atmosphereRating);
      setOrderType(placeToEdit.orderType);
      setFoodType(placeToEdit.foodType);
    }
  }, [placeToEdit]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить отзыв</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label>Отзыв</Label>
          <Textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Добавьте свои впечатления"
          />

          <div className={"flex gap-4"}>
            <p>Еда:</p>
            <StarReview rating={foodRating} onRate={setFoodRating} />
          </div>
          <div className={"flex gap-4"}>
            <p>Сервис:</p>
            <StarReview rating={serviceRating} onRate={setServiceRating} />
          </div>
          <div className={"flex gap-4"}>
            <p>Атмосфера:</p>
            <StarReview
              rating={atmosphereRating}
              onRate={setAtmosphereRating}
            />
          </div>
          <div className={"mb-2 flex gap-4"}>
            <p>Общая оценка:</p>
            <StarReview rating={rating} onRate={setRating} />
          </div>

          <div className={"flex items-center gap-4"}>
            <p>Способ заказа</p>
            <Select
              value={orderType}
              onValueChange={(value) =>
                setOrderType(value as SelectReview["orderType"])
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Способ заказа" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="dine_in">На месте</SelectItem>
                  <SelectItem value="take_out">Самовывоз</SelectItem>
                  <SelectItem value="delivery">Доставка</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className={"flex items-center gap-4"}>
            <p>Тип заказа</p>
            <Select
              value={foodType}
              onValueChange={(value) =>
                setFoodType(value as SelectReview["foodType"])
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Тип заказа" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="breakfast">Завтрак</SelectItem>
                  <SelectItem value="lunch">Обед</SelectItem>
                  <SelectItem value="dinner">Ужин</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSave} type="submit">
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
