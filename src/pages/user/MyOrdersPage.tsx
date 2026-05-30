import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faExclamationTriangle,
  faCalendarAlt,
  faMoneyBillWave,
  faCreditCard,
  faChevronRight,
  faBox,
} from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUserOrders, createVNPayPayment } from "../../features/order/userOrderThunk";
import { clearPaymentError } from "../../features/order/userOrderSlice";
import OrderDetailModal from "../../features/order/components/OrderDetailModal";
import OrderPagination from "../../features/order/components/OrderPagination";
import {
  formatDate,
  formatCurrency,
  getStatusStyle,
  STATUS_LABEL,
  STATUS_TABS,
} from "../../features/order/orderConstants";
import type { OrderDTO, OrderStatus } from "../../features/order/orderType";
import { Link } from "react-router-dom";

export default function MyOrdersPage() {
  const dispatch = useAppDispatch();

  // Redux Selectors
  const { orders, isLoading, isPaymentLoading, currentPage, totalPages, error, paymentError } =
    useAppSelector((state) => state.userOrder);

  // States
  const [activeTab, setActiveTab] = useState<OrderStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [detailOrder, setDetailOrder] = useState<OrderDTO | null>(null);

  // Fetch orders when activeTab or page changes
  useEffect(() => {
    dispatch(fetchUserOrders({ page, size: 5, orderStatus: activeTab }));
  }, [dispatch, activeTab, page]);

  // Reset page to 1 when changing tabs
  const handleTabChange = (tabValue: OrderStatus | "ALL") => {
    setActiveTab(tabValue);
    setPage(1);
    dispatch(clearPaymentError());
  };

  // Payment retry action
  const handleRetryPayment = async (e: React.MouseEvent, orderId: number) => {
    e.stopPropagation(); // Prevent opening modal
    const paymentAction = await dispatch(createVNPayPayment({ orderId }));
    if (createVNPayPayment.fulfilled.match(paymentAction)) {
      const { paymentUrl } = paymentAction.payload;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    }
  };

  // Helper for Payment Status Badge
  const getPaymentStatusStyle = (pStatus: string) => {
    switch (pStatus) {
      case "PAID":
        return "bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium border border-green-200";
      case "UNPAID":
        return "bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium border border-yellow-200";
      case "FAILED":
        return "bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium border border-red-200";
      case "REFUNDED":
        return "bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-medium border border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full font-medium border border-gray-200";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-28 md:pt-32 pb-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-5">
          <h1 className="text-2xl font-bold text-gray-900 font-lora">
            Đơn Hàng Của Tôi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi trạng thái giao hàng và lịch sử hóa đơn mua bánh của bạn
          </p>
        </div>

        {/* Payment Error Alert */}
        {paymentError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2 shadow-sm">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>⚠️ Không thể tiến hành thanh toán lại: {paymentError}</span>
          </div>
        )}

        {/* Tab Filters */}
        <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar mb-6 gap-2 md:gap-4 whitespace-nowrap">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all relative px-2 cursor-pointer ${
                activeTab === tab.value
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loader while loading */}
        {isLoading && orders.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
            <FontAwesomeIcon icon={faSpinner} className="text-primary text-3xl animate-spin mb-3" />
            <p className="text-sm text-gray-500 font-medium">Đang tải danh sách đơn hàng...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center bg-white rounded-3xl border border-red-100 shadow-sm">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3 text-lg">
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center px-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4 text-xl">
              <FontAwesomeIcon icon={faBox} />
            </div>
            <h3 className="font-bold text-gray-800 text-base mb-1.5">Không tìm thấy đơn hàng</h3>
            <p className="text-sm text-gray-400 max-w-xs mb-6">
              Bạn chưa có đơn hàng nào ở trạng thái này. Khám phá các món bánh ngon của chúng tôi ngay!
            </p>
            <Link
              to="/products"
              className="bg-primary hover:bg-opacity-90 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all uppercase tracking-wider"
            >
              Đến Cửa Hàng
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              // Check if payment retry is available
              const canRetryPayment =
                order.orderStatus === "PENDING" &&
                (order.paymentStatus === "UNPAID" || order.paymentStatus === "FAILED");

              return (
                <div
                  key={order.id}
                  onClick={() => setDetailOrder(order)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 cursor-pointer flex flex-col md:flex-row justify-between gap-4 md:items-center relative group"
                >
                  <div className="space-y-2.5 flex-1 min-w-0">
                    {/* Top Row: Order ID and Status Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-gray-900 font-lora text-base">
                        Mã đơn #{order.id}
                      </span>
                      <span className="text-gray-300">|</span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium uppercase tracking-wider ${getStatusStyle(
                          order.orderStatus
                        )}`}
                      >
                        {STATUS_LABEL[order.orderStatus]}
                      </span>
                      <span className={getPaymentStatusStyle(order.paymentStatus)}>
                        {order.paymentStatus === "PAID" ? "Đã thanh toán" : order.paymentStatus === "UNPAID" ? "Chưa thanh toán" : order.paymentStatus === "FAILED" ? "Thanh toán lỗi" : "Đã hoàn tiền"}
                      </span>
                    </div>

                    {/* Meta info: Date & Amount */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-300" />
                        <span>Ngày đặt: {formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faMoneyBillWave} className="text-gray-300" />
                        <span>
                          Tổng tiền:{" "}
                          <strong className="text-primary">{formatCurrency(order.totalAmount)}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Delivery summary */}
                    <div className="text-xs text-gray-400 truncate">
                      <span>Địa chỉ: {order.shippingAddress}</span>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex sm:flex-row items-center gap-2.5 shrink-0 justify-end">
                    {canRetryPayment && (
                      <button
                        onClick={(e) => handleRetryPayment(e, order.id)}
                        disabled={isPaymentLoading}
                        className="bg-primary hover:bg-opacity-90 disabled:bg-gray-300 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-primary/10 transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                      >
                        {isPaymentLoading ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                            Đang kết nối...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faCreditCard} />
                            Thanh toán lại
                          </>
                        )}
                      </button>
                    )}

                    <button className="bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold px-4 py-2.5 rounded-xl border border-gray-200 transition-all flex items-center gap-1 cursor-pointer">
                      <span>Chi tiết</span>
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="text-[10px] text-gray-400 group-hover:translate-x-0.5 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Pagination Component */}
            <OrderPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Reusable Detail Viewer Modal */}
      {detailOrder && (
        <OrderDetailModal order={detailOrder} onClose={() => setDetailOrder(null)} />
      )}
    </div>
  );
}
