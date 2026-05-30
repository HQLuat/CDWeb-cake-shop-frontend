import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import type { OrderDTO } from "../orderType";
import { formatDate, formatCurrency } from "../orderConstants";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderDetailModalProps {
  order: OrderDTO;
  onClose: () => void;
}

function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-800 text-lg font-lora">
              Chi tiết đơn #{order.id}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Đặt lúc {formatDate(order.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-5">
          {/* Customer info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-sm">
            <p>
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Khách hàng
              </span>
              <br />
              <span className="font-semibold text-gray-800">
                {order.username}
              </span>
            </p>
            <p>
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Địa chỉ giao
              </span>
              <br />
              <span className="text-gray-700">{order.shippingAddress || "—"}</span>
            </p>
            {order.note && (
              <p>
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  Ghi chú
                </span>
                <br />
                <span className="text-gray-700 italic">"{order.note}"</span>
              </p>
            )}
          </div>

          {/* Status + payment */}
          <div className="flex gap-3">
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
                Trạng thái
              </p>
              <OrderStatusBadge status={order.orderStatus} />
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
                Thanh toán
              </p>
              <span className="text-sm font-semibold text-gray-700">
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Sản phẩm
            </p>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
              {order.items.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  Không có sản phẩm
                </p>
              ) : (
                order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatCurrency(item.unitPrice)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-primary ml-4">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-1 border-t border-gray-100">
            <span className="text-sm text-gray-500 font-medium">
              Tổng thanh toán
            </span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailModal;
