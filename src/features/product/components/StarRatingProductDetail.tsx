import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as StarEmpty } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function StarRatingProductDetail({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "xs" | "sm" | "lg";
}) {
  const sizeClass =
    size === "lg" ? "text-base" : size === "sm" ? "text-xs" : "text-[10px]";
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <span className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map((i) => {
        if (i <= full)
          return (
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              className={`text-amber-400 ${sizeClass}`}
            />
          );
        if (i === full + 1 && half)
          return (
            <FontAwesomeIcon
              key={i}
              icon={faStarHalfAlt}
              className={`text-amber-400 ${sizeClass}`}
            />
          );
        return (
          <FontAwesomeIcon
            key={i}
            icon={StarEmpty}
            className={`text-amber-300 ${sizeClass}`}
          />
        );
      })}
    </span>
  );
}
