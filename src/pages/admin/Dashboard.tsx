import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faShoppingCart, faBox, faUsers, faChartLine, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

function AdminAnalytics() {
  // Dữ liệu giả lập cho Thống kê tổng quan
  const stats = [
    { title: "Tổng Doanh Thu", value: 45280000, icon: faDollarSign, change: "+12.5%", isPositive: true, color: "bg-blue-500" },
    { title: "Đơn Hàng Mới", value: 124, icon: faShoppingCart, change: "+8.2%", isPositive: true, color: "bg-green-500" },
    { title: "Sản Phẩm Đang Bán", value: 42, icon: faBox, change: "0%", isPositive: true, color: "bg-yellow-500" },
    { title: "Khách Hàng", value: 1205, icon: faUsers, change: "-2.1%", isPositive: false, color: "bg-purple-500" },
  ];

  // Dữ liệu giả lập cho biểu đồ tăng trưởng doanh thu theo tháng
  const monthlyRevenue = [
    { month: "Tháng 1", revenue: 28000000, orders: 85 },
    { month: "Tháng 2", revenue: 35000000, orders: 98 },
    { month: "Tháng 3", revenue: 42000000, orders: 110 },
    { month: "Tháng 4", revenue: 39000000, orders: 95 },
    { month: "Tháng 5", revenue: 45280000, orders: 124 },
  ];

  // Top sản phẩm bán chạy
  const topProducts = [
    { name: "The Signature Sourdough", sales: 245, revenue: 34300000 },
    { name: "Chocolate Fudge Cheesecake", sales: 180, revenue: 81000000 },
    { name: "Strawberry Macaron", sales: 152, revenue: 11400000 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 font-lora">Thống Kê Kinh Doanh</h1>
        <p className="text-sm text-gray-500">Tổng quan tình hình hoạt động và doanh thu của cửa hàng.</p>
      </div>

      {/* Grid thẻ báo cáo tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">{stat.title}</p>
              <h3 className="text-xl font-bold text-gray-800 mt-2">
                {stat.title.includes("Thu") ? `${stat.value.toLocaleString("vi-VN")}đ` : stat.value.toLocaleString("vi-VN")}
              </h3>
              <span className={`text-xs font-semibold flex items-center gap-1 mt-2 ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                <FontAwesomeIcon icon={stat.isPositive ? faArrowUp : faArrowDown} size="xs" />
                {stat.change} <span className="text-gray-400 font-normal">so với tháng trước</span>
              </span>
            </div>
            <div className={`w-12 h-12 rounded-xl ${stat.color} text-white flex items-center justify-center text-lg shadow-sm`}>
              <FontAwesomeIcon icon={stat.icon} />
            </div>
          </div>
        ))}
      </div>

      {/* Biểu đồ và Top sản phẩm */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột biểu đồ doanh thu (Mô phỏng cột CSS thuần) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FontAwesomeIcon icon={faChartLine} className="text-primary" /> Doanh Thu Các Tháng Gần Đây
            </h3>
          </div>
          <div className="h-64 flex items-end gap-6 pt-6 px-4 border-b border-gray-200">
            {monthlyRevenue.map((data, i) => {
              const maxRevenue = 50000000;
              const heightPercent = (data.revenue / maxRevenue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center group relative">
                  {/* Tooltip khi hover */}
                  <div className="absolute -top-12 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                    {data.revenue.toLocaleString("vi-VN")}đ ({data.orders} đơn)
                  </div>
                  {/* Cột đồ thị */}
                  <div 
                    style={{ height: `${heightPercent}%` }} 
                    className="w-full bg-primary bg-opacity-80 group-hover:bg-opacity-100 rounded-t-lg transition-all duration-500 shadow-sm"
                  ></div>
                  <span className="text-xs text-gray-500 mt-2 whitespace-nowrap">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cột Top Sản Phẩm */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Sản Phẩm Bán Chạy</h3>
          <div className="space-y-4">
            {topProducts.map((prod, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="max-w-[70%]">
                  <h4 className="text-sm font-semibold text-gray-800 truncate">{prod.name}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Đã bán: {prod.sales} mẻ bánh</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-primary">{prod.revenue.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;