import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faStickyNote,
  faSpinner,
  faCreditCard,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchCart } from "../../features/cart/cartThunk";
import {
  createOrder,
  createVNPayPayment,
} from "../../features/order/userOrderThunk";
import {
  clearCreateError,
  clearPaymentError,
} from "../../features/order/userOrderSlice";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  // State from location
  const { discount = 0, shippingFee = 30000 } = (location.state || {}) as {
    discount?: number;
    shippingFee?: number;
  };

  // Redux Selectors
  const { cart, isLoading: isCartLoading } = useAppSelector((state) => state.cart);
  const {
    isCreating,
    isPaymentLoading,
    createError,
    paymentError,
  } = useAppSelector((state) => state.userOrder);

  // Form states
  const [shippingAddress, setShippingAddress] = useState("");
  const [note, setNote] = useState("");
  const [addressTouched, setAddressTouched] = useState(false);

  useEffect(() => {
    // Clear errors when entering checkout
    dispatch(clearCreateError());
    dispatch(clearPaymentError());
    dispatch(fetchCart());
  }, [dispatch]);

  // Fallback shipping fee calculations if state is lost
  const calculatedShippingFee = cart
    ? cart.totalAmount > 500000
      ? 0
      : 30000
    : shippingFee;
  const finalDiscount = discount;
  const totalAmount = cart
    ? Math.max(0, cart.totalAmount + calculatedShippingFee - finalDiscount)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressTouched(true);

    if (!shippingAddress.trim()) {
      return;
    }

    // Call API Order
    const resultAction = await dispatch(
      createOrder({ shippingAddress: shippingAddress.trim(), note: note.trim() })
    );

    if (createOrder.fulfilled.match(resultAction)) {
      const order = resultAction.payload;
      // Call API Payment VNPay
      const paymentAction = await dispatch(
        createVNPayPayment({ orderId: order.id })
      );

      if (createVNPayPayment.fulfilled.match(paymentAction)) {
        const { paymentUrl } = paymentAction.payload;
        if (paymentUrl) {
          window.location.href = paymentUrl; // Redirect to VNPay
        }
      }
    }
  };

  if (isCartLoading && !cart) {
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
          <FontAwesomeIcon icon={faCreditCard} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 font-lora mb-2">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center max-w-xs">
          Bạn cần có sản phẩm trong giỏ hàng để thực hiện thanh toán.
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

  const isSubmitting = isCreating || isPaymentLoading;

  return (
    <div className="bg-gray-50 min-h-screen pt-28 md:pt-32 pb-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Step Indicator & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-lora">
              Xác Nhận Đặt Hàng
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Vui lòng kiểm tra lại thông tin giao hàng và giỏ hàng của bạn
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
              <span className="text-green-600 font-bold">1. Giỏ hàng ✓</span>
              <span className="text-gray-300">➔</span>
              <span className="text-primary font-bold">2. Đặt hàng</span>
              <span className="text-gray-300">➔</span>
              <span className="text-gray-400">3. Hoàn thành</span>
            </div>
          </div>
        </div>

        {/* Global Errors */}
        {(createError || paymentError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl space-y-1">
            {createError && <p>⚠️ Lỗi đặt hàng: {createError}</p>}
            {paymentError && <p>⚠️ Lỗi thanh toán: {paymentError}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Thông Tin Nhận Hàng (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-5 font-lora border-b border-gray-100 pb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
                Thông Tin Giao Hàng
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Địa Chỉ Giao Hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    onBlur={() => setAddressTouched(true)}
                    disabled={isSubmitting}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, thành phố..."
                    className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm outline-none transition-all ${
                      addressTouched && !shippingAddress.trim()
                        ? "border-red-500 focus:border-red-500 bg-red-50/20"
                        : "border-gray-200 focus:border-primary"
                    }`}
                  />
                  {addressTouched && !shippingAddress.trim() && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium">
                      Địa chỉ nhận hàng là bắt buộc và không được để trống.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Ghi Chú Đơn Hàng (Tùy chọn)
                  </label>
                  <div className="relative">
                    <span className="absolute top-3 left-4 text-gray-400">
                      <FontAwesomeIcon icon={faStickyNote} size="sm" />
                    </span>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Lời nhắn cho cửa hàng (Ví dụ: Bánh ít ngọt, giao giờ hành chính, viết chữ chúc mừng sinh nhật...)"
                      rows={4}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-primary rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Phương thức thanh toán (Cố định VNPay) */}
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 mt-6">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2.5">
                    Phương Thức Thanh Toán
                  </h4>
                  <div className="flex items-center justify-between bg-white px-4 py-3.5 rounded-xl border border-primary/20 shadow-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://sandbox.vnpayment.vn/paymentv2/Images/brands/logo-vnpay.png"
                        alt="VNPay"
                        className="h-6 object-contain"
                      />
                      <span className="text-sm font-bold text-gray-800">
                        Cổng thanh toán VNPay (Thẻ ATM/QR/Tín dụng)
                      </span>
                    </div>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-primary text-lg"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2.5 leading-relaxed">
                    Sau khi nhấn nút đặt hàng, hệ thống sẽ đưa bạn đến Cổng thanh toán VNPay bảo mật để thanh toán hóa đơn.
                  </p>
                </div>
              </form>
            </div>

            {/* Back button */}
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
            >
              <ArrowLeft size={15} />
              <span>Quay lại Giỏ hàng</span>
            </Link>
          </div>

          {/* Tóm Tắt Đơn Hàng (Right Column) */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 font-lora">
                Tóm Tắt Đơn Hàng
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1">
                {cart.items.map((item) => (
                  <div key={item.cartItemId} className="py-3 flex gap-3 text-sm">
                    <img
                      src={
                        item.imageUrl ||
                        "https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=200"
                      }
                      alt={item.productName}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        {item.subtotal.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fees & Discount Details */}
              <div className="space-y-2.5 text-sm text-gray-600 border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span>Tạm tính ({cart.totalQuantity} sản phẩm)</span>
                  <span className="font-semibold text-gray-800">
                    {cart.totalAmount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-gray-800">
                    {calculatedShippingFee === 0 ? (
                      <span className="text-green-600 font-medium">Miễn phí</span>
                    ) : (
                      `${calculatedShippingFee.toLocaleString("vi-VN")}đ`
                    )}
                  </span>
                </div>
                {finalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Mã giảm giá</span>
                    <span className="font-semibold">
                      -{finalDiscount.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                )}
              </div>

              {/* Total Payment */}
              <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-800">
                  Tổng thanh toán
                </span>
                <span className="text-xl font-bold text-primary font-lora">
                  {totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>

              {/* Payment trigger button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-bold py-3.5 rounded-xl shadow-md shadow-primary/10 transition-all mt-2 tracking-wide uppercase flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    Đang xử lý đặt hàng...
                  </>
                ) : (
                  <>
                    Thanh Toán Qua VNPay
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
