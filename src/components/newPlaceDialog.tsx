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

type PropTypes = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleNewPlace: (text: string, rating: number) => void;
  placeToEdit?: SelectReview | null;
  handleEditPlace: (item: SelectReview) => void;
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

  const onSave = () => {
    placeToEdit
      ? handleEditPlace({ ...placeToEdit, text: reviewText, rating })
      : handleNewPlace(reviewText, rating);
    setReviewText("");
  };

  useEffect(() => {
    if (placeToEdit) {
      setReviewText(placeToEdit.text);
      setRating(placeToEdit.rating);
    }
  }, [placeToEdit]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a place</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label>Review text</Label>
          <Textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Type your message here."
          />
          <div className={"flex gap-4"}>
            <p>Rating:</p>
            <StarReview rating={rating} onRate={setRating} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSave} type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
