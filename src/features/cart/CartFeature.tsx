import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faPlus,
  faMinus,
  faTicketAlt,
  faShoppingBag,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "./cartThunk";
import { ArrowLeft, Trash2 } from "lucide-react";

const PROMO_CODES: Record<string, number> = { VELVETMUSE: 50000 };

export default function CartFeature() {
  const dispatch = useAppDispatch();
  const { cart, isLoading, error } = useAppSelector((state) => state.cart);

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{
    text: string;
    ok: boolean;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleUpdateQuantity = (
    cartItemId: number,
    currentQty: number,
    delta: number,
  ) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    dispatch(updateCartItem({ cartItemId, quantity: newQty }));
  };

  const handleRemoveItem = (cartItemId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      dispatch(removeCartItem(cartItemId));
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng không?")) {
      dispatch(clearCart());
      setDiscount(0);
      setPromoCode("");
      setPromoMessage(null);
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setDiscount(PROMO_CODES[code]);
      setPromoMessage({
        text: `Áp dụng mã giảm giá thành công! Giảm ${PROMO_CODES[code].toLocaleString("vi-VN")}đ`,
        ok: true,
      });
    } else {
      setDiscount(0);
      setPromoMessage({ text: "Mã giảm giá không hợp lệ.", ok: false });
    }
  };

  if (isLoading && !cart) {
    return (
      <div className="bg-gray-50 min-h-screen pt-28 flex items-center justify-center">
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-primary text-3xl animate-spin"
        />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen pt-28 pb-12 px-4 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-5 text-2xl shadow-inner">
          <FontAwesomeIcon icon={faShoppingBag} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 font-lora mb-2">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center max-w-xs">
          Hãy lấp đầy giỏ hàng bằng những mẻ bánh thơm ngon nóng hổi ngay nhé!
        </p>
        <Link
          to="/products"
          className="bg-primary hover:bg-opacity-90 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md transition-all"
        >
          Quay lại Cửa hàng
        </Link>
      </div>
    );
  }

  const shippingFee = cart.totalAmount > 500000 ? 0 : 30000;
  const total = Math.max(0, cart.totalAmount + shippingFee - discount);

  return (
    <div className="bg-gray-50 min-h-screen pt-28 md:pt-32 pb-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-lora">
              Giỏ Hàng Của Bạn
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {cart.totalQuantity} sản phẩm trong giỏ hàng
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
              <span className="text-primary font-bold">1. Giỏ hàng</span>
              <span className="text-gray-300">➔</span>
              <span className="text-gray-400">2. Đặt hàng</span>
              <span className="text-gray-300">➔</span>
              <span className="text-gray-400">3. Hoàn thành</span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Danh sách sản phẩm */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.cartItemId}
                className={`bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-4 md:gap-6 items-center transition-all hover:shadow-md ${isLoading ? "opacity-60 pointer-events-none" : ""}`}
              >
                <img
                  src={
                    item.imageUrl ||
                    "https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=200"
                  }
                  alt={item.productName}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border border-gray-100 shrink-0"
                />

                <div className="flex-1 min-w-0 pr-6">
                  <h3 className="text-sm md:text-base font-bold text-gray-800 truncate">
                    {item.productName}
                  </h3>
                  <p className="text-sm font-semibold text-primary mt-1">
                    {item.unitPrice.toLocaleString("vi-VN")}đ / cái
                  </p>

                  <div className="flex items-center gap-1.5 border border-gray-200 w-max rounded-lg bg-gray-50 p-0.5 mt-3">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.cartItemId, item.quantity, -1)
                      }
                      disabled={item.quantity <= 1 || isLoading}
                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <FontAwesomeIcon icon={faMinus} size="xs" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.cartItemId, item.quantity, 1)
                      }
                      disabled={isLoading}
                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      <FontAwesomeIcon icon={faPlus} size="xs" />
                    </button>
                  </div>
                </div>

                <div className="text-right flex flex-col justify-between items-end h-20 md:h-24 py-1">
                  <button
                    onClick={() => handleRemoveItem(item.cartItemId)}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors disabled:opacity-50"
                    title="Xóa sản phẩm"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} size="sm" />
                  </button>
                  <p className="text-sm md:text-base font-bold text-gray-800">
                    {item.subtotal.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            ))}

            {/* Footer của danh sách sản phẩm */}
            <div className="flex justify-between items-center pt-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
              >
                <ArrowLeft size={15} />
                <span>Tiếp tục mua bánh</span>
              </Link>

              <button
                onClick={handleClearCart}
                disabled={isLoading}
                className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-500 transition-all px-2 py-1"
              >
                <Trash2 size={15} />
                <span>Xoá tất cả</span>
              </button>
            </div>
          </div>

          {/* Cột tổng kết */}
          <div className="space-y-6">
            {/* Mã giảm giá */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faTicketAlt} className="text-gray-400" />{" "}
                Mã Giảm Giá
              </h3>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã (VD: VELVETMUSE)"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value);
                    setPromoMessage(null);
                  }}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary uppercase font-medium tracking-wider"
                />
                <button
                  type="submit"
                  className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                >
                  Áp dụng
                </button>
              </form>
              {promoMessage && (
                <p
                  className={`mt-2 text-xs ${promoMessage.ok ? "text-green-600" : "text-red-500"}`}
                >
                  {promoMessage.text}
                </p>
              )}
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3 font-lora">
                Tóm Tắt Đơn Hàng
              </h3>

              <div className="space-y-2.5 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Tạm tính ({cart.totalQuantity} sản phẩm)</span>
                  <span className="font-semibold text-gray-800">
                    {cart.totalAmount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-gray-800">
                    {shippingFee === 0 ? (
                      <span className="text-green-600 font-medium">
                        Miễn phí
                      </span>
                    ) : (
                      `${shippingFee.toLocaleString("vi-VN")}đ`
                    )}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span className="font-semibold">
                      -{discount.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-800">
                  Tổng thanh toán
                </span>
                <span className="text-xl font-bold text-primary font-lora">
                  {total.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <button className="w-full bg-primary hover:bg-opacity-90 text-white text-sm font-bold py-3.5 rounded-xl shadow-md shadow-primary/10 transition-all mt-2 tracking-wide uppercase">
                Tiến Hành Đặt Hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
