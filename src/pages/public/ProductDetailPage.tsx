import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faTruckFast,
  faCheckCircle,
  faMinus,
  faPlus,
  faLeaf,
} from "@fortawesome/free-solid-svg-icons";
import { bake1 } from "../../assets/homePage";
import { useAppDispatch } from "../../app/hooks";
import { addToCart } from "../../features/cart/cartThunk";

// Khai báo kiểu dữ liệu khớp với ProductDetailDTO từ backend
interface ReviewDTO {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductDetail {
  id: number;
  name: string;
  price: number;
  description: string;
  detailDescription: string;
  storageGuide: string;
  collection: string;
  shippingInfo: string;
  ingredients: string[];
  freshGuarantee: boolean;
  averageRating: number;
  totalReviews: number;
  imageUrls: string[];
  reviews: ReviewDTO[];
}

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"detail" | "storage">("detail");

  // Redux
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data: ProductDetail) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi fetch sản phẩm:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <main className="mt-28 mb-20 text-center text-text-light">
        Đang tải...
      </main>
    );

  if (!product)
    return (
      <main className="mt-28 mb-20 text-center text-text-light">
        Không tìm thấy sản phẩm.
      </main>
    );

  return (
    <main className="mt-28 mb-20">
      <div className="max-w-300 mx-auto px-5">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Hình ảnh sản phẩm */}
          <div className="w-full md:w-1/2">
            <div className="sticky top-28">
              <div className="rounded-2xl overflow-hidden shadow-lg bg-bg-surface">
                <img
                  src={product.imageUrls[0] || bake1}
                  alt={product.name}
                  className="w-full h-125 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Thumbnails */}
              <div className="flex gap-4 mt-4">
                {(product.imageUrls.length > 0
                  ? product.imageUrls
                  : [bake1, bake1, bake1]
                ).map((url, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 border-2 border-primary rounded-lg overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-all"
                  >
                    <img
                      src={url}
                      alt={`thumb-${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="w-full md:w-1/2">
            <span className="text-primary font-medium uppercase tracking-widest text-xs">
              {product.collection}
            </span>
            <h1 className="font-lora text-4xl mt-2 mb-4 text-text-dark">
              {product.name}
            </h1>

            {/* Đánh giá */}
            <div className="flex items-center gap-2 mb-6">
              <div className="text-yellow-500 text-sm">
                {[...Array(Math.round(product.averageRating))].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} />
                ))}
              </div>
              <span className="text-text-light text-sm">
                ({product.totalReviews} đánh giá từ khách hàng)
              </span>
            </div>

            {/* Giá */}
            <div className="text-3xl font-semibold text-primary mb-6">
              ${(product.price * quantity).toFixed(2)}
            </div>

            {/* Mô tả */}
            <p className="text-text-light leading-relaxed mb-8 border-b pb-8">
              {product.description}
            </p>

            {/* Số lượng + Thêm vào giỏ */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center border border-gray-200 rounded-full px-4 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-text-light hover:text-primary p-2"
                >
                  <FontAwesomeIcon icon={faMinus} size="xs" />
                </button>
                <span className="px-6 font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-text-light hover:text-primary p-2"
                >
                  <FontAwesomeIcon icon={faPlus} size="xs" />
                </button>
              </div>
              <button
                onClick={() =>
                  dispatch(addToCart({ productId: product.id, quantity }))
                }
                className="flex-1 bg-primary text-white py-4 rounded-full font-semibold uppercase tracking-wider hover:bg-opacity-90 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                Thêm vào giỏ hàng
              </button>
            </div>

            {/* Thông tin thêm */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-3 text-sm text-text-dark">
                <FontAwesomeIcon icon={faTruckFast} className="text-primary" />
                <span>{product.shippingInfo}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-dark">
                <FontAwesomeIcon icon={faLeaf} className="text-green-600" />
                <span>Thành phần: {product.ingredients.join(", ")}</span>
              </div>
              {product.freshGuarantee && (
                <div className="flex items-center gap-3 text-sm text-text-dark">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-blue-500"
                  />
                  <span>Đảm bảo bánh tươi mới nướng trong ngày</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20">
          <div className="flex border-b gap-10 mb-8">
            <button
              onClick={() => setActiveTab("detail")}
              className={`pb-2 font-lora font-semibold ${activeTab === "detail" ? "border-b-2 border-primary" : "text-text-light hover:text-primary"}`}
            >
              Mô tả chi tiết
            </button>
            <button
              onClick={() => setActiveTab("storage")}
              className={`pb-2 font-lora ${activeTab === "storage" ? "border-b-2 border-primary font-semibold" : "text-text-light hover:text-primary"}`}
            >
              Hướng dẫn bảo quản
            </button>
          </div>
          <div className="text-text-light leading-loose max-w-3xl">
            {activeTab === "detail" ? (
              <p>{product.detailDescription}</p>
            ) : (
              <p>{product.storageGuide}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetail;
