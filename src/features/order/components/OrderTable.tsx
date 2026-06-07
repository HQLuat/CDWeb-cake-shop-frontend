import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faShippingFast,
  faCheckCircle,
  faBan,
  faCheck,
  faSpinner,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import type { OrderDTO, OrderStatus } from "../orderType";
import { formatDate, formatCurrency } from "../orderConstants";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderTableProps {
  orders: OrderDTO[];
  isLoading: boolean;
  isUpdating: boolean;
  onViewDetail: (order: OrderDTO) => void;
  onUpdateStatus: (id: number, status: OrderStatus) => void;
}

function OrderTable({
  orders,
  isLoading,
  isUpdating,
  onViewDetail,
  onUpdateStatus,
}: OrderTableProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-opacity ${isLoading || isUpdating ? "opacity-60 pointer-events-none" : ""
        }`}
    >
      {/* Loading indicator */}
      {(isLoading || isUpdating) && (
        <div className="flex items-center gap-2 px-6 py-2.5 bg-primary/5 text-primary text-xs font-medium border-b border-primary/10">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          {isLoading
            ? "Đang tải danh sách đơn hàng..."
            : "Đang cập nhật trạng thái..."}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
              <th className="py-4 px-5">Mã đơn</th>
              <th className="py-4 px-5">Khách hàng</th>
              <th className="py-4 px-5">Ngày đặt</th>
              <th className="py-4 px-5">Tổng tiền</th>
              <th className="py-4 px-5">Thanh toán</th>
              <th className="py-4 px-5">Trạng thái</th>
              <th className="py-4 px-5 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {!isLoading && orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-20 text-center text-gray-400">
                  <FontAwesomeIcon
                    icon={faBoxOpen}
                    className="text-3xl mb-3 block mx-auto text-gray-200"
                  />
                  Không có đơn hàng nào.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="py-4 px-5">
                    #{order.id}
                  </td>
                  <td className="py-4 px-5">
                    {order.username}
                  </td>
                  <td className="py-4 px-5">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-4 px-5">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="py-4 px-5">
                    {order.paymentStatus}
                  </td>
                  <td className="py-4 px-5">
                    <OrderStatusBadge status={order.orderStatus} />
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex justify-center gap-2">
                      {/* View detail */}
                      <button
                        onClick={() => onViewDetail(order)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors text-xs font-semibold border border-blue-100 cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <FontAwesomeIcon icon={faEye} />
                        Xem
                      </button>

                      {/* PENDING → CONFIRMED | CANCELLED */}
                      {order.orderStatus === "PENDING" && (
                        <>
                          <button
                            onClick={() =>
                              onUpdateStatus(order.id, "CONFIRMED")
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors text-xs font-semibold border border-blue-100 cursor-pointer"
                            title="Xác nhận đơn"
                          >
                            <FontAwesomeIcon icon={faCheck} />
                            Xác nhận
                          </button>
                          <button
                            onClick={() =>
                              onUpdateStatus(order.id, "CANCELLED")
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-xs font-semibold border border-red-100 cursor-pointer"
                            title="Hủy đơn"
                          >
                            <FontAwesomeIcon icon={faBan} />
                            Hủy đơn
                          </button>
                        </>
                      )}

                      {/* CONFIRMED → SHIPPING | CANCELLED */}
                      {order.orderStatus === "CONFIRMED" && (
                        <>
                          <button
                            onClick={() =>
                              onUpdateStatus(order.id, "SHIPPING")
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors text-xs font-semibold border border-indigo-100 cursor-pointer"
                            title="Giao hàng"
                          >
                            <FontAwesomeIcon icon={faShippingFast} />
                            Giao hàng
                          </button>
                          <button
                            onClick={() =>
                              onUpdateStatus(order.id, "CANCELLED")
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-xs font-semibold border border-red-100 cursor-pointer"
                            title="Hủy đơn"
                          >
                            <FontAwesomeIcon icon={faBan} />
                            Hủy đơn
                          </button>
                        </>
                      )}

                      {/* SHIPPING → COMPLETED */}
                      {order.orderStatus === "SHIPPING" && (
                        <button
                          onClick={() =>
                            onUpdateStatus(order.id, "COMPLETED")
                          }
                          className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                          title="Hoàn thành"
                        >
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderTable;
