import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchAdminOrders, updateOrderStatus } from "./orderThunk";
import { clearOrderError } from "./orderSlice";
import type { OrderStatus, OrderDTO } from "./orderType";
import { PAGE_SIZE } from "./orderConstants";

import OrderFilterBar from "./components/OrderFilterBar";
import OrderErrorBanner from "./components/OrderErrorBanner";
import OrderTable from "./components/OrderTable";
import OrderPagination from "./components/OrderPagination";
import OrderDetailModal from "./components/OrderDetailModal";

function AdminOrderFeature() {
  const dispatch = useAppDispatch();
  const {
    orders,
    isLoading,
    isUpdating,
    error,
    updateError,
    totalPages,
    currentPage,
    totalElements,
  } = useAppSelector((state) => state.order);

  // ── Local UI state ──────────────────────────────────────────
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "ALL">("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1); // 1-indexed
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);

  // ── Fetch ────────────────────────────────────────────────────
  const load = useCallback(() => {
    dispatch(
      fetchAdminOrders({
        page,
        size: PAGE_SIZE,
        orderStatus: filterStatus,
        keyword: searchQuery || undefined,
      }),
    );
  }, [dispatch, page, filterStatus, searchQuery]);

  useEffect(() => {
    load();
  }, [load]);

  // ── Handlers ─────────────────────────────────────────────────
  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleFilterChange = (val: OrderStatus | "ALL") => {
    setFilterStatus(val);
    setPage(1);
  };

  const handleUpdateStatus = (id: number, newStatus: OrderStatus) => {
    dispatch(updateOrderStatus({ id, status: newStatus }));
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ── Header – identical structure to AdminProduct ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-lora">
            Quản Lý Đơn Hàng
          </h1>
          <p className="text-sm text-gray-500">
            {isLoading
              ? "Đang tải..."
              : `${totalElements.toLocaleString("vi-VN")} đơn hàng trong hệ thống`}
          </p>
        </div>
      </div>

      {/* ── Combined filter bar – matches AdminProduct filter card ── */}
      <OrderFilterBar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearch={handleSearch}
        filterStatus={filterStatus}
        onFilterChange={handleFilterChange}
      />

      {/* ── Error banners ── */}
      <OrderErrorBanner
        error={error}
        updateError={updateError}
        onRetry={load}
        onDismiss={() => dispatch(clearOrderError())}
      />

      {/* ── Order table ── */}
      <OrderTable
        orders={orders}
        isLoading={isLoading}
        isUpdating={isUpdating}
        onViewDetail={setSelectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* ── Pagination ── */}
      <OrderPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* ── Detail modal ── */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

export default AdminOrderFeature;
