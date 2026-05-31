import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import type { ProductSummary } from "../productType";

export default function ProductCard({ product }: { product: ProductSummary }) {
  const fallback = "https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=400";
  const formatVND = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const hasDiscount = product.discountPercent != null && product.discountPercent > 0;
  const originalPrice = product.price * 1000;
  const salePrice = hasDiscount && product.currentPrice
    ? product.currentPrice * 1000
    : originalPrice;

  return (
    <Link to={`/product/${product.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-50">
      {/* Image */}
      <div className="h-56 overflow-hidden bg-[#fff8f3] relative">
        <img
          src={product.imageUrls?.[0] || fallback}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
        />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full shadow-sm">
          {product.collection}
        </span>
        {/* Badge giảm giá */}
        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
            -{product.discountPercent}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-lora text-[17px] font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <p className="text-gray-400 text-[13px] leading-relaxed mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <StarRating rating={product.averageRating || 0} />
          <span className="text-gray-400 text-[11px]">({product.totalReviews})</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <div className="flex flex-col">
            {/* Giá sale */}
            <span className={`font-semibold ${hasDiscount ? "text-red-500" : "text-primary"}`}>
              {formatVND(salePrice)}
            </span>
            {/* Giá gốc gạch ngang */}
            {hasDiscount && (
              <span className="text-gray-400 text-[11px] line-through">
                {formatVND(originalPrice)}
              </span>
            )}
          </div>
          <span className="bg-primary text-white text-[11px] font-semibold uppercase tracking-wider px-4 py-2 rounded-full group-hover:bg-[#7a0001] transition-all shadow-sm shadow-primary/20">
            Xem chi tiết
          </span>
        </div>
      </div>
    </Link>
  );
}
