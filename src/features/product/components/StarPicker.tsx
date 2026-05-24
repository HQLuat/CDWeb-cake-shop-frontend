import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          className="text-xl transition-transform hover:scale-110 active:scale-95"
        >
          <FontAwesomeIcon
            icon={faStar}
            className={`transition-colors ${
              (hovered || value) >= i ? "text-amber-400" : "text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
