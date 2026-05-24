import type { ReviewDTO } from "../productType";
import StarRatingProductDetail from "./StarRatingProductDetail";

export default function ReviewCard({ review }: { review: ReviewDTO }) {
  const initials = review.customerName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const date = new Date(review.createdAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="font-semibold text-gray-800 text-[14px]">
                {review.customerName}
              </p>
              <StarRatingProductDetail rating={review.rating} size="xs" />
            </div>
            <span className="text-[11px] text-gray-400">{date}</span>
          </div>
          {review.comment && (
            <p className="mt-2.5 text-[13px] text-gray-500 leading-relaxed">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
