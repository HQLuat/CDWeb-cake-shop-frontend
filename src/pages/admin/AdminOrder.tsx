import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEye, faShippingFast, faCheckCircle, faBan } from "@fortawesome/free-solid-svg-icons";

interface AdminOrder {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: "Chờ xử lý" | "Đang giao" | "Đã hoàn thành" | "Đã hủy";
  payment: "Thẻ tín dụng" | "COD" | "Chuyển khoản";
}

function AdminOrderManagement() {
  const [filterStatus, setFilterStatus] = useState<string>("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const [orders, setOrders] = useState<AdminOrder[]>([
    { id: "ORD-0982", customer: "Nguyễn Văn A", date: "22/05/2026", total: 215000, status: "Chờ xử lý", payment: "COD" },
    { id: "ORD-0981", customer: "Trần Thị B", date: "21/05/2026", total: 590000, status: "Đang giao", payment: "Chuyển khoản" },
    { id: "ORD-0980", customer: "Phạm Minh C", date: "20/05/2026", total: 140000, status: "Đã hoàn thành", payment: "Thẻ tín dụng" },
  ]);

  // Hàm đổi trạng thái nhanh để test UI
  const handleUpdateStatus = (id: string, newStatus: AdminOrder["status"]) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const getStatusStyle = (status: AdminOrder["status"]) => {
    switch (status) {
      case "Chờ xử lý": return "bg-yellow-50 text-yellow-600 border border-yellow-200";
      case "Đang giao": return "bg-blue-50 text-blue-600 border border-blue-200";
      case "Đã hoàn thành": return "bg-green-50 text-green-600 border border-green-200";
      case "Đã hủy": return "bg-gray-100 text-gray-500 border border-gray-200";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 font-lora">Quản Lý Đơn Hàng</h1>
        <p className="text-sm text-gray-500">Theo dõi, duyệt vận chuyển và cập nhật trạng thái đơn đặt bánh.</p>
      </div>

      {/* Bộ lọc trạng thái thanh Tab */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["Tất cả", "Chờ xử lý", "Đang giao", "Đã hoàn thành", "Đã hủy"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterStatus === status
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Thanh tìm kiếm mã đơn / khách hàng */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center px-4 py-2.5 border-gray-200">
        <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-gray-700"
        />
      </div>

      {/* Bảng Danh sách đơn hàng */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Mã đơn</th>
                <th className="py-4 px-6">Khách hàng</th>
                <th className="py-4 px-6">Ngày đặt</th>
                <th className="py-4 px-6">Tổng tiền</th>
                <th className="py-4 px-6">Thanh toán</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-center">Xử lý nhanh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {orders
                .filter(o => filterStatus === "Tất cả" || o.status === filterStatus)
                .filter(o => o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customer.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-800">{order.id}</td>
                    <td className="py-4 px-6 font-medium text-gray-700">{order.customer}</td>
                    <td className="py-4 px-6 text-gray-500">{order.date}</td>
                    <td className="py-4 px-6 font-semibold text-primary">{order.total.toLocaleString("vi-VN")}đ</td>
                    <td className="py-4 px-6 text-xs text-gray-500">{order.payment}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg" title="Xem chi tiết">
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        {order.status === "Chờ xử lý" && (
                          <>
                            <button onClick={() => handleUpdateStatus(order.id, "Đang giao")} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg" title="Giao hàng">
                              <FontAwesomeIcon icon={faShippingFast} />
                            </button>
                            <button onClick={() => handleUpdateStatus(order.id, "Đã hủy")} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Hủy đơn">
                              <FontAwesomeIcon icon={faBan} />
                            </button>
                          </>
                        )}
                        {order.status === "Đang giao" && (
                          <button onClick={() => handleUpdateStatus(order.id, "Đã hoàn thành")} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg" title="Hoàn thành">
                            <FontAwesomeIcon icon={faCheckCircle} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderManagement;