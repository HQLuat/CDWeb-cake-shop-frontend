import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUserSlash,
  faUserCheck,
  faUserShield,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: "ADMIN" | "USER";
  status: "Hoạt động" | "Bị khóa";
  createdAt: string;
}

function AdminUserManagement() {
  const [filterRole, setFilterRole] = useState<string>("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: 1,
      fullName: "Nguyễn Văn Quản Trị",
      email: "admin@velvetmuse.com",
      phone: "0901234567",
      role: "ADMIN",
      status: "Hoạt động",
      createdAt: "01/01/2026",
    },
    {
      id: 2,
      fullName: "Trần Thị Khách Hàng",
      email: "khachhang.b@gmail.com",
      phone: "0912345678",
      role: "USER",
      status: "Hoạt động",
      createdAt: "15/05/2026",
    },
    {
      id: 3,
      fullName: "Phạm Minh Vi Phạm",
      email: "vipham.c@yahoo.com",
      phone: "0987654321",
      role: "USER",
      status: "Bị khóa",
      createdAt: "20/05/2026",
    },
  ]);

  // Hàm cập nhật trạng thái hoạt động/khóa tài khoản
  const handleToggleStatus = (id: number, currentStatus: AdminUser["status"]) => {
    const newStatus = currentStatus === "Hoạt động" ? "Bị khóa" : "Hoạt động";
    setUsers(users.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
  };

  // Hàm chuyển đổi vai trò (Role)
  const handleToggleRole = (id: number, currentRole: AdminUser["role"]) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
  };

  const getStatusStyle = (status: AdminUser["status"]) => {
    return status === "Hoạt động"
      ? "bg-green-50 text-green-600 border border-green-200"
      : "bg-red-50 text-red-600 border border-red-200";
  };

  const getRoleStyle = (role: AdminUser["role"]) => {
    return role === "ADMIN"
      ? "bg-purple-50 text-purple-600 border border-purple-200"
      : "bg-gray-50 text-gray-600 border border-gray-200";
  };

  // Lọc danh sách theo tìm kiếm và vai trò
  const filteredUsers = users
    .filter((u) => filterRole === "Tất cả" || u.role === filterRole)
    .filter(
      (u) =>
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone.includes(searchQuery)
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Tiêu đề trang */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 font-lora">Quản Lý Người Dùng</h1>
        <p className="text-sm text-gray-500">
          Quản lý tài khoản khách hàng, phân quyền trị viên và kiểm soát trạng thái truy cập hệ thống.
        </p>
      </div>

      {/* Thanh công cụ lọc vai trò */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["Tất cả", "USER", "ADMIN"].map((role) => (
          <button
            key={role}
            onClick={() => setFilterRole(role)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterRole === role
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {role === "Tất cả" ? "Tất cả vai trò" : role}
          </button>
        ))}
      </div>

      {/* Tìm kiếm */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center px-4 py-2.5 border-gray-200">
        <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Tìm kiếm theo họ tên, email hoặc số điện thoại..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-gray-700"
        />
      </div>

      {/* Bảng dữ liệu người dùng */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Người dùng</th>
                <th className="py-4 px-6">Số điện thoại</th>
                <th className="py-4 px-6">Ngày tham gia</th>
                <th className="py-4 px-6">Vai trò</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-400">#{user.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{user.fullName}</span>
                        <span className="text-xs text-gray-400 mt-0.5">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.phone}</td>
                    <td className="py-4 px-6 text-gray-500">{user.createdAt}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleStyle(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        {/* Nút thay đổi quyền Admin/User */}
                        <button
                          onClick={() => handleToggleRole(user.id, user.role)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.role === "ADMIN"
                              ? "text-gray-400 hover:bg-gray-100"
                              : "text-purple-600 hover:bg-purple-50"
                          }`}
                          title={user.role === "ADMIN" ? "Gỡ quyền Admin" : "Cấp quyền Admin"}
                        >
                          <FontAwesomeIcon icon={user.role === "ADMIN" ? faUser : faUserShield} />
                        </button>

                        {/* Nút Khóa / Mở khóa tài khoản */}
                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.status === "Hoạt động"
                              ? "text-red-500 hover:bg-red-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                          title={user.status === "Hoạt động" ? "Khóa tài khoản" : "Kích hoạt tài khoản"}
                        >
                          <FontAwesomeIcon icon={user.status === "Hoạt động" ? faUserSlash : faUserCheck} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUserManagement;