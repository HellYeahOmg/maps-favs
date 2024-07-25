import { type FC, useState } from "react";

type StarReviewProps = {
  rating: number;
  totalStars?: number;
  onRate?: (rating: number) => void;
  disabled?: boolean;
};

const StarReview: FC<StarReviewProps> = ({
  totalStars = 5,
  rating,
  onRate,
  disabled,
}) => {
  const [hover, setHover] = useState(0);

  const handleClick = (ratingValue: number) => {
    if (disabled) return;

    if (onRate) {
      onRate(ratingValue);
    }
  };

  const handleMouseOver = (ratingValue: number) => {
    if (disabled) return;
    setHover(ratingValue);
  };

  const handleMouseOut = () => {
    setHover(0);
  };

  const renderStar = (filled: boolean) => (
    <svg
      className={`h-6 w-6 ${
        filled ? "text-yellow-500" : "text-gray-400"
      } fill-current`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  );

  return (
    <div className="flex space-x-1">
      {Array.from({ length: totalStars }, (_, index) => index + 1).map(
        (star) => (
          <button
            key={star}
            className="focus:outline-none"
            onClick={() => handleClick(star)}
            onMouseOver={() => handleMouseOver(star)}
            onMouseOut={handleMouseOut}
          >
            {renderStar((hover || rating) >= star)}
          </button>
        ),
      )}
    </div>
  );
};

export default StarReview;
