import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchReviews } from "../productThunk";
import { clearReviews } from "../productSlice";
import ReviewCard from "./ReviewCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import WriteReview from "./WriteReview";

const REVIEWS_PAGE_SIZE = 5;

export default function ReviewsSection({ productId }: { productId: number }) {
  const dispatch = useAppDispatch();
  const { reviewPage, isLoadingReviews, reviewsError } = useAppSelector(
    (state) => state.product,
  );

  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    dispatch(
      fetchReviews({ productId, page: currentPage, size: REVIEWS_PAGE_SIZE }),
    );
  }, [dispatch, productId, currentPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearReviews());
    };
  }, [dispatch]);

  const reviews = reviewPage?.content ?? [];
  const totalPages = reviewPage?.totalPages ?? 0;
  const totalElements = reviewPage?.totalElements ?? 0;

  return (
    <div className="mt-16 border-t border-gray-100 pt-12">
      {/* Section header */}
      <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
        <div>
          <h3 className="font-lora text-[26px] text-gray-800">
            Đánh Giá Từ Khách Hàng
          </h3>
          {totalElements > 0 && (
            <p className="text-gray-400 text-[13px] mt-1">
              {totalElements} đánh giá
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Reviews list */}
        <div className="lg:col-span-3">
          {/* Error */}
          {reviewsError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 text-[13px] rounded-2xl text-center">
              {reviewsError}
            </div>
          )}

          {/* Loading */}
          {isLoadingReviews ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-1/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-[#fff8f3] rounded-2xl p-10 text-center border border-primary/5">
              <p className="text-4xl mb-3">🍰</p>
              <p className="text-gray-500 text-[14px]">
                Chưa có đánh giá nào. Hãy là người đầu tiên!
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-6">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center disabled:opacity-30 hover:border-primary hover:text-primary transition-all text-sm"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} size="xs" />
                  </button>
                  <span className="text-[13px] text-gray-500">
                    Trang {currentPage + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={currentPage === totalPages - 1}
                    className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center disabled:opacity-30 hover:border-primary hover:text-primary transition-all text-sm"
                  >
                    <FontAwesomeIcon icon={faChevronRight} size="xs" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Write review */}
        <div className="lg:col-span-2">
          <WriteReview productId={productId} />
        </div>
      </div>
    </div>
  );
}
