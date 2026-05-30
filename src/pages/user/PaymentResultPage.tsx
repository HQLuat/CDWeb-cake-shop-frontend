import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faShoppingBag,
  faHome,
  faSync,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchOrderDetail, createVNPayPayment } from "../../features/order/userOrderThunk";
import { clearSelectedOrder } from "../../features/order/userOrderSlice";
import { formatDate, formatCurrency } from "../../features/order/orderConstants";

export default function PaymentResultPage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status"); // "success" | "failed"
  const orderIdStr = searchParams.get("orderId");
  const orderId = orderIdStr ? parseInt(orderIdStr, 10) : null;

  const { selectedOrder, isLoading, isPaymentLoading, error } = useAppSelector(
    (state) => state.userOrder
  );

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetail(orderId));
    }
    return () => {
      dispatch(clearSelectedOrder());
    };
  }, [orderId, dispatch]);

  const handleRetryPayment = async () => {
    if (orderId) {
      const paymentAction = await dispatch(createVNPayPayment({ orderId }));
      if (createVNPayPayment.fulfilled.match(paymentAction)) {
        const { paymentUrl } = paymentAction.payload;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        }
      }
    }
  };

  const isPageLoading = isLoading || isPaymentLoading;

  if (isPageLoading && !selectedOrder) {
    return (
      <div className="bg-gray-50 min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-primary text-3xl animate-spin mb-3"
          />
          <p className="text-sm text-gray-500 font-medium">Đang tải kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  const isSuccess = status === "success";

  return (
    <div className="bg-gray-50 min-h-screen pt-28 md:pt-32 pb-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-3xl mx-auto">
        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <span className="text-green-600 font-bold">1. Giỏ hàng ✓</span>
            <span className="text-gray-300">➔</span>
            <span className="text-green-600 font-bold">2. Đặt hàng ✓</span>
            <span className="text-gray-300">➔</span>
            <span className="text-primary font-bold">3. Hoàn thành</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden mb-6">
          {/* Header Banner */}
          <div className={`p-8 text-center text-white ${isSuccess ? "bg-green-600" : "bg-red-500"}`}>
            <div className="mb-4">
              <FontAwesomeIcon
                icon={isSuccess ? faCheckCircle : faTimesCircle}
                className="text-5xl animate-bounce"
              />
            </div>
            <h1 className="text-2xl font-bold font-lora">
              {isSuccess ? "Thanh Toán Thành Công!" : "Thanh Toán Thất Bại"}
            </h1>
            <p className="text-sm opacity-90 mt-1 max-w-md mx-auto">
              {isSuccess
                ? "Cảm ơn bạn đã tin tưởng Velvet Muse! Đơn hàng của bạn đang được chuẩn bị để chế biến."
                : "Giao dịch không thành công. Hãy chắc chắn số dư tài khoản của bạn đủ hoặc thử lại."}
            </p>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 space-y-6">
            {selectedOrder ? (
              <>
                {/* Order Summary & Delivery details */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                    <FontAwesomeIcon icon={faReceipt} className="text-gray-400" />
                    Thông Tin Đơn Hàng #{selectedOrder.id}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                        Ngày đặt hàng
                      </p>
                      <p className="font-semibold text-gray-800 mt-0.5">
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                        Khách hàng
                      </p>
                      <p className="font-semibold text-gray-800 mt-0.5">
                        {selectedOrder.username}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                        Địa chỉ nhận bánh
                      </p>
                      <p className="font-semibold text-gray-800 mt-0.5">
                        {selectedOrder.shippingAddress}
                      </p>
                    </div>
                    {selectedOrder.note && (
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                          Ghi chú của bạn
                        </p>
                        <p className="font-semibold text-gray-800 mt-0.5 italic">
                          "{selectedOrder.note}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Invoice list */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Bánh đã đặt mua
                  </h3>
                  <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center px-4 py-3 text-sm">
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="font-semibold text-gray-800 truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatCurrency(item.unitPrice)} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-primary">
                            {formatCurrency(item.subtotal)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Invoice amount */}
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center px-2">
                  <span className="text-base font-bold text-gray-800">Tổng thanh toán</span>
                  <span className="text-xl font-bold text-primary font-lora">
                    {formatCurrency(selectedOrder.totalAmount)}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  {error || "Không thể tải được thông tin đơn hàng lúc này."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {isSuccess ? (
            <>
              <Link
                to="/orders"
                className="w-full md:w-auto bg-primary hover:bg-opacity-90 text-white text-sm font-semibold px-6 py-3.5 rounded-xl shadow-md shadow-primary/10 transition-all flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faShoppingBag} />
                Quản Lý Đơn Hàng Của Tôi
              </Link>
              <Link
                to="/home"
                className="w-full md:w-auto bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary text-sm font-semibold px-6 py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faHome} />
                Quay Lại Trang Chủ
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={handleRetryPayment}
                disabled={isPaymentLoading}
                className="w-full md:w-auto bg-primary hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-3.5 rounded-xl shadow-md shadow-primary/10 transition-all flex items-center justify-center gap-2"
              >
                {isPaymentLoading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    Đang tạo liên kết thanh toán...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSync} />
                    Thử Thanh Toán Lại
                  </>
                )}
              </button>
              <Link
                to="/home"
                className="w-full md:w-auto bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary text-sm font-semibold px-6 py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faHome} />
                Quay Lại Trang Chủ
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
