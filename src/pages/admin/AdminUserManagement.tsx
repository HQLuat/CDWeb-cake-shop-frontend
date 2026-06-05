import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTimes,
  faSpinner,
  faEye,
  faFilter,
  faChevronDown,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../api/axiosClient";
import OrderPagination from "../../features/order/components/OrderPagination";

// ==================== TYPES ====================
interface UserDTO {
  id: number;
  username: string;
  fullName: string;
  roleName: "ADMIN" | "USER" | "GUEST";
  email: string;
  phone: string;
  status: "ACTIVE" | "LOCKED" | "INACTIVE";
}

interface UserListMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface UserListResponse {
  data: UserDTO[];
  meta: UserListMeta;
}

interface FetchUsersParams {
  keyword?: string;
  status?: string;
  role?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

// ==================== HELPERS ====================
function getStatusBadge(status: UserDTO["status"]) {
  switch (status) {
    case "ACTIVE":
      return {
        label: "Hoạt động",
        cls: "bg-emerald-50 text-emerald-600 border border-emerald-200",
      };
    case "LOCKED":
      return {
        label: "Bị khóa",
        cls: "bg-red-50 text-red-600 border border-red-200",
      };
    case "INACTIVE":
      return {
        label: "Không hoạt động",
        cls: "bg-gray-100 text-gray-500 border border-gray-200",
      };
  }
}

function getRoleBadge(role: UserDTO["roleName"]) {
  switch (role) {
    case "ADMIN":
      return {
        label: "ADMIN",
        cls: "bg-purple-50 text-purple-600 border border-purple-200",
      };
    case "USER":
      return {
        label: "USER",
        cls: "bg-blue-50 text-blue-600 border border-blue-200",
      };
    case "GUEST":
      return {
        label: "GUEST",
        cls: "bg-gray-100 text-gray-500 border border-gray-200",
      };
  }
}

// ==================== DETAIL MODAL ====================
function UserDetailModal({
  userId,
  onClose,
}: {
  userId: number;
  onClose: () => void;
}) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    axiosClient
      .get<UserDTO>(`/users/${userId}`)
      .then((res) => {
        if (!cancelled) setUser(res.data);
      })
      .catch(() => {
        if (!cancelled) setError("Không thể tải thông tin người dùng.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const status = user ? getStatusBadge(user.status) : null;
  const role = user ? getRoleBadge(user.roleName) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-lora text-lg font-bold text-gray-800">
            Chi tiết người dùng
            {user && (
              <span className="ml-2 text-gray-400 font-normal text-sm">
                #{user.id}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100 transition-all"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-400">
              <FontAwesomeIcon
                icon={faSpinner}
                className="animate-spin text-2xl text-primary"
              />
              <p className="text-sm">Đang tải thông tin...</p>
            </div>
          )}

          {error && (
            <div className="py-8 text-center text-red-500 text-sm">
              {error}
            </div>
          )}

          {user && !loading && (
            <div className="space-y-4">
              {/* Avatar + name */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary text-xl shrink-0">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-base">
                    {user.fullName || "—"}
                  </p>
                  <p className="text-sm text-gray-400">@{user.username}</p>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <InfoField label="Username" value={user.username} />
                <InfoField label="Họ và tên" value={user.fullName || "—"} />
                <InfoField label="Email" value={user.email || "—"} />
                <InfoField
                  label="Số điện thoại"
                  value={user.phone || "—"}
                />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
                    Vai trò
                  </p>
                  {role && (
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${role.cls}`}
                    >
                      {role.label}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
                    Trạng thái
                  </p>
                  {status && (
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${status.cls}`}
                    >
                      {status.label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
        {label}
      </p>
      <p className="text-sm text-gray-700 font-medium">{value}</p>
    </div>
  );
}

// ==================== SKELETON ROWS ====================
function SkeletonRows({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100 last:border-0">
          {[6, 24, 12, 14, 14, 10].map((w, j) => (
            <td key={j} className="py-4 px-6">
              <div
                className="h-4 bg-gray-100 rounded-full animate-pulse"
                style={{ width: `${w * 4}px` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ==================== MAIN COMPONENT ====================
export default function AdminUserManagement() {
  // --- filter state ---
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRole, setFilterRole] = useState("");

  // --- data state ---
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- pagination (1-indexed to match API & OrderPagination) ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // --- modal ---
  const [viewingUserId, setViewingUserId] = useState<number | null>(null);

  // --- fetch ---
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: FetchUsersParams = {
        page: currentPage,
        size: 10,
        sortBy: "id",
        sortDir: "desc",
      };
      if (keyword.trim()) params.keyword = keyword.trim();
      if (filterStatus) params.status = filterStatus;
      if (filterRole) params.role = filterRole;

      const res = await axiosClient.get<UserListResponse>("/users", { params });
      setUsers(res.data.data);
      setTotalPages(res.data.meta.totalPages);
      setTotalElements(res.data.meta.totalElements);
    } catch {
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, keyword, filterStatus, filterRole]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Reset to page 1 when filters change (except when page itself changes)
  const applyFilter = (
    newKeyword?: string,
    newStatus?: string,
    newRole?: string,
  ) => {
    setCurrentPage(1);
    if (newKeyword !== undefined) setKeyword(newKeyword);
    if (newStatus !== undefined) setFilterStatus(newStatus);
    if (newRole !== undefined) setFilterRole(newRole);
  };

  const handleSearch = () => {
    applyFilter(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    applyFilter("");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Detail modal */}
      {viewingUserId !== null && (
        <UserDetailModal
          userId={viewingUserId}
          onClose={() => setViewingUserId(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-lora">
            Quản Lý Người Dùng
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isLoading
              ? "Đang tải..."
              : `Tổng cộng ${totalElements.toLocaleString("vi-VN")} người dùng trong hệ thống`}
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 gap-3">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Tìm theo tên, username, email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full bg-transparent outline-none text-sm text-gray-700"
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="text-gray-400 hover:text-gray-700 shrink-0"
            >
              <FontAwesomeIcon icon={faTimes} size="xs" />
            </button>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#7a0001] transition-all shrink-0"
        >
          Tìm
        </button>

        {/* Role filter */}
        <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 min-w-[160px] gap-2 relative">
          <FontAwesomeIcon
            icon={faFilter}
            className="text-gray-400 text-xs shrink-0"
          />
          <select
            value={filterRole}
            onChange={(e) => applyFilter(undefined, undefined, e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-700 cursor-pointer appearance-none"
          >
            <option value="">Tất cả vai trò</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
            <option value="GUEST">GUEST</option>
          </select>
          <FontAwesomeIcon
            icon={faChevronDown}
            className="text-gray-400 text-xs pointer-events-none shrink-0"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 min-w-[170px] gap-2 relative">
          <FontAwesomeIcon
            icon={faFilter}
            className="text-gray-400 text-xs shrink-0"
          />
          <select
            value={filterStatus}
            onChange={(e) => applyFilter(undefined, e.target.value, undefined)}
            className="w-full bg-transparent outline-none text-sm text-gray-700 cursor-pointer appearance-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="LOCKED">Bị khóa</option>
            <option value="INACTIVE">Không hoạt động</option>
          </select>
          <FontAwesomeIcon
            icon={faChevronDown}
            className="text-gray-400 text-xs pointer-events-none shrink-0"
          />
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={loadUsers}
            className="ml-4 underline font-semibold hover:text-red-800 transition-colors shrink-0"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Người dùng</th>
                <th className="py-4 px-6">Vai trò</th>
                <th className="py-4 px-6">Số điện thoại</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {isLoading ? (
                <SkeletonRows count={8} />
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <span className="text-4xl">👥</span>
                      <p className="text-sm">
                        Không tìm thấy người dùng nào phù hợp.
                      </p>
                      {(keyword || filterStatus || filterRole) && (
                        <button
                          onClick={() => {
                            setSearchInput("");
                            setKeyword("");
                            setFilterStatus("");
                            setFilterRole("");
                            setCurrentPage(1);
                          }}
                          className="text-primary underline text-xs font-semibold hover:opacity-80 transition-opacity"
                        >
                          Xóa bộ lọc
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const statusBadge = getStatusBadge(user.status);
                  const roleBadge = getRoleBadge(user.roleName);
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* ID */}
                      <td className="py-4 px-6 font-bold text-gray-400 text-xs">
                        #{user.id}
                      </td>

                      {/* Người dùng */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary text-xs shrink-0">
                            <FontAwesomeIcon icon={faUser} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-gray-800 truncate">
                              {user.fullName || user.username}
                            </span>
                            <span className="text-xs text-gray-400 mt-0.5 truncate">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge.cls}`}
                        >
                          {roleBadge.label}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-6 text-gray-600">
                        {user.phone || "—"}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge.cls}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <button
                            onClick={() => setViewingUserId(user.id)}
                            title="Xem chi tiết"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors text-xs font-semibold border border-blue-100"
                          >
                            <FontAwesomeIcon icon={faEye} />
                            Xem chi tiết
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <OrderPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}