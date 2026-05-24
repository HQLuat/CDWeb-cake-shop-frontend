import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchReviews, submitReview } from "../productThunk";
import { clearSubmitReviewStatus } from "../productSlice";
import { Link } from "react-router-dom";
import StarPicker from "./StarPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const REVIEWS_PAGE_SIZE = 5;

export default function WriteReview({ productId }: { productId: number }) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isSubmittingReview, submitReviewError, submitReviewSuccess } =
    useAppSelector((state) => state.product);

  const isAuthenticated = !!user || !!localStorage.getItem("token");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Khi success: chỉ reload reviews - không cần reset form vì form đã unmount
  useEffect(() => {
    if (submitReviewSuccess) {
      dispatch(fetchReviews({ productId, page: 0, size: REVIEWS_PAGE_SIZE }));
    }
  }, [submitReviewSuccess, productId, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearSubmitReviewStatus());
    };
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    dispatch(submitReview({ productId, rating, comment }));
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-[#fff8f3] rounded-2xl p-6 border border-primary/10 text-center">
        <p className="text-gray-500 text-[14px] mb-3">
          Bạn cần đăng nhập để viết đánh giá.
        </p>
        <Link
          to="/login"
          className="inline-block bg-primary text-white px-6 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#7a0001] transition-all"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  if (submitReviewSuccess) {
    return (
      <div className="bg-green-50 rounded-2xl p-6 border border-green-100 text-center">
        <div className="text-3xl mb-2">🎉</div>
        <p className="text-green-700 font-semibold text-[15px]">
          Cảm ơn bạn đã đánh giá!
        </p>
        <p className="text-green-600 text-[13px] mt-1">
          Nhận xét của bạn đã được ghi nhận.
        </p>
        <button
          onClick={() => dispatch(clearSubmitReviewStatus())}
          className="mt-4 text-[13px] text-primary underline"
        >
          Viết thêm đánh giá
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <h4 className="font-lora text-[17px] font-semibold text-gray-800 mb-4">
        Viết đánh giá của bạn
      </h4>

      {submitReviewError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-[13px] rounded-xl">
          {submitReviewError}
        </div>
      )}

      <div className="mb-4">
        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
          Đánh giá sao
        </label>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div className="mb-4">
        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
          Nhận xét
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
          rows={4}
          required
          className="w-full px-4 py-3 bg-[#fff8f3] rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all resize-none text-gray-700 placeholder:text-gray-300"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmittingReview || !comment.trim()}
        className="w-full py-3 bg-primary text-white text-[13px] font-bold uppercase tracking-widest rounded-full hover:bg-[#7a0001] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmittingReview && (
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
        )}
        {isSubmittingReview ? "Đang gửi..." : "Gửi đánh giá"}
      </button>
    </form>
  );
}
