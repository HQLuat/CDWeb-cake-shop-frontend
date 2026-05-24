import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as StarEmpty } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// ==================== STAR RATING ====================
export default function StarRating({ rating }: { rating: number }) {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= full)
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className="text-amber-400 text-[10px]"
        />,
      );
    else if (i === full + 1 && half)
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStarHalfAlt}
          className="text-amber-400 text-[10px]"
        />,
      );
    else
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={StarEmpty}
          className="text-amber-300 text-[10px]"
        />,
      );
  }
  return <span className="flex gap-0.5 items-center">{stars}</span>;
}
