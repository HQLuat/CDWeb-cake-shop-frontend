import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchAdminOrders, updateOrderStatus } from "./orderThunk";
import { clearOrderError } from "./orderSlice";
import type { OrderStatus, OrderDTO } from "./orderType";
import { PAGE_SIZE } from "./orderConstants";

import OrderStatusTabs from "./components/OrderStatusTabs";
import OrderSearchBar from "./components/OrderSearchBar";
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
  const [page, setPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);

  // ── Fetch ────────────────────────────────────────────────────
  const load = useCallback(() => {
    dispatch(
      fetchAdminOrders({
        page,
        size: PAGE_SIZE,
        status: filterStatus,
        search: searchQuery || undefined,
      }),
    );
  }, [dispatch, page, filterStatus, searchQuery]);

  useEffect(() => {
    load();
  }, [load]);

  // ── Handlers ─────────────────────────────────────────────────
  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(0);
  };

  const handleFilterStatus = (val: OrderStatus | "ALL") => {
    setFilterStatus(val);
    setPage(0);
  };

  const handleUpdateStatus = (id: number, newStatus: OrderStatus) => {
    dispatch(updateOrderStatus({ id, status: newStatus }));
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 font-lora">
          Quản Lý Đơn Hàng
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {isLoading
            ? "Đang tải..."
            : `Tổng cộng ${totalElements.toLocaleString()} đơn hàng`}
        </p>
      </div>

      {/* Status filter tabs */}
      <OrderStatusTabs
        activeStatus={filterStatus}
        onChange={handleFilterStatus}
      />

      {/* Search bar */}
      <OrderSearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSearch={handleSearch}
      />

      {/* Error banners */}
      <OrderErrorBanner
        error={error}
        updateError={updateError}
        onRetry={load}
        onDismiss={() => dispatch(clearOrderError())}
      />

      {/* Order table */}
      <OrderTable
        orders={orders}
        isLoading={isLoading}
        isUpdating={isUpdating}
        onViewDetail={setSelectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Pagination */}
      <OrderPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Detail modal */}
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
