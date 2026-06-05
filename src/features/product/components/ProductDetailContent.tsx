import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import type { ProductDetail } from "../productType";
import { addToCart } from "../../cart/cartThunk";
import StarRatingProductDetail from "./StarRatingProductDetail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faLeaf,
  faMinus,
  faPlus,
  faSpinner,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import ReviewsSection from "./ReviewsSection";
import { bake1 } from "../../../assets/homePage";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=800";

export default function ProductDetailContent({
  product,
}: {
  product: ProductDetail;
}) {
  const dispatch = useAppDispatch();
  const { isLoading: cartLoading } = useAppSelector((state) => state.cart);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"detail" | "storage">("detail");
  const [addedFeedback, setAddedFeedback] = useState(false);

  const images = product.imageUrls?.length ? product.imageUrls : [bake1];

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product.id, quantity })).then(() => {
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 2000);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-20">
      {/* ===== PRODUCT LAYOUT ===== */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* IMAGE GALLERY */}
        <div className="w-full md:w-1/2">
          <div className="sticky top-28">
            {/* Main image */}
            <div className="rounded-2xl overflow-hidden bg-[#fff8f3] shadow-md">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-120 object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMG;
                }}
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 transition-all ${
                      activeImage === i
                        ? "ring-2 ring-primary shadow-md"
                        : "opacity-60 hover:opacity-100 ring-1 ring-gray-200"
                    }`}
                  >
                    <img
                      src={url}
                      alt={`thumb-${i}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMG;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="w-full md:w-1/2">
          {/* Collection badge */}
          <span className="inline-block bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-[2px] px-3 py-1 rounded-full mb-3">
            {product.collection}
          </span>

          <h1 className="font-lora text-[36px] leading-tight text-gray-800 mb-4">
            {product.name}
          </h1>

          {/* Rating summary */}
          <div className="flex items-center gap-3 mb-5">
            <StarRatingProductDetail rating={product.averageRating} size="sm" />
            <span className="text-[13px] text-gray-400">
              <span className="font-semibold text-gray-600">
                {product.averageRating?.toFixed(1)}
              </span>{" "}
              ({product.totalReviews} đánh giá)
            </span>
          </div>

          {/* Price */}
          <div className="mb-5 flex items-baseline gap-3 flex-wrap">
            {(() => {
              const hasDiscount = product.discountPercent != null && product.discountPercent > 0;
              const originalPrice = product.price * quantity;
              const salePrice = hasDiscount && product.currentPrice
                ? product.currentPrice * quantity
                : originalPrice;
              const formatVND = (n: number) =>
                new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

              return (
                <>
                  <span className={`font-lora text-[34px] font-semibold ${hasDiscount ? "text-red-500" : "text-primary"}`}>
                    {formatVND(salePrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-gray-400 text-[18px] line-through">
                      {formatVND(originalPrice)}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="bg-red-100 text-red-500 text-[12px] font-bold px-2 py-0.5 rounded-full">
                      -{product.discountPercent}%
                    </span>
                  )}
                  {quantity > 1 && (
                    <span className="text-gray-400 text-[14px]">
                      ({formatVND(hasDiscount && product.currentPrice ? product.currentPrice : product.price)} / cái)
                    </span>
                  )}
                </>
              );
            })()}
          </div>

          {/* Description */}
          <p className="text-gray-500 leading-relaxed mb-8 border-b border-gray-100 pb-8 text-[14px]">
            {product.description}
          </p>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4 mb-8">
            {/* Quantity picker */}
            <div className="flex items-center border border-gray-200 rounded-full px-2 py-1 bg-[#fff8f3] gap-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
              >
                <FontAwesomeIcon icon={faMinus} size="xs" />
              </button>
              <span className="w-10 text-center text-[15px] font-bold text-gray-800">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} size="xs" />
              </button>
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              disabled={cartLoading}
              className={`flex-1 py-4 rounded-full font-bold uppercase tracking-widest text-[13px] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                addedFeedback
                  ? "bg-green-600 text-white shadow-green-200"
                  : "bg-primary text-white hover:bg-[#7a0001] shadow-primary/20 disabled:opacity-60"
              }`}
            >
              {cartLoading ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              ) : addedFeedback ? (
                "Đã thêm vào giỏ!"
              ) : (
                "Thêm vào giỏ hàng"
              )}
            </button>
          </div>

          {/* Meta info */}
          <div className="space-y-3 bg-[#fff8f3] rounded-2xl p-5 border border-primary/5">
            <div className="flex items-start gap-3 text-[13px] text-gray-600">
              <FontAwesomeIcon
                icon={faTruckFast}
                className="text-primary mt-0.5 shrink-0"
              />
              <span>
                {product.shippingInfo ||
                  "Giao hàng nhanh trong ngày tại TP.HCM"}
              </span>
            </div>

            {product.ingredients?.length > 0 && (
              <div className="flex items-start gap-3 text-[13px] text-gray-600">
                <FontAwesomeIcon
                  icon={faLeaf}
                  className="text-green-600 mt-0.5 shrink-0"
                />
                <span>
                  <span className="font-medium text-gray-700">
                    Thành phần:{" "}
                  </span>
                  {product.ingredients.join(", ")}
                </span>
              </div>
            )}

            {product.freshGuarantee && (
              <div className="flex items-center gap-3 text-[13px] text-gray-600">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-blue-500 shrink-0"
                />
                <span>Đảm bảo bánh tươi mới nướng trong ngày</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="mt-16 border-t border-gray-100 pt-10">
        <div className="flex gap-8 border-b border-gray-100 mb-8">
          {(["detail", "storage"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-lora text-[16px] transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              {tab === "detail" ? "Mô tả chi tiết" : "Hướng dẫn bảo quản"}
            </button>
          ))}
        </div>
        <div className="text-gray-500 leading-loose max-w-3xl text-[14px]">
          {activeTab === "detail" ? (
            <p>{product.detailDescription || "Chưa có mô tả chi tiết."}</p>
          ) : (
            <p>{product.storageGuide || "Chưa có hướng dẫn bảo quản."}</p>
          )}
        </div>
      </div>

      {/* ===== REVIEWS ===== */}
      <ReviewsSection productId={product.id} />
    </div>
  );
}
