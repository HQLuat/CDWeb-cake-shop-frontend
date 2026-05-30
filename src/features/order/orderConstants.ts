import type { OrderStatus } from "./orderType";

// ==================== CONSTANTS ====================
export const PAGE_SIZE = 10;

export const STATUS_TABS: { label: string; value: OrderStatus | "ALL" }[] = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ xử lý", value: "PENDING" },
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Đang giao", value: "SHIPPING" },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Đã hủy", value: "CANCELLED" },
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

// ==================== HELPERS ====================
export const getStatusStyle = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    case "CONFIRMED":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "SHIPPING":
      return "bg-indigo-50 text-indigo-700 border border-indigo-200";
    case "COMPLETED":
      return "bg-green-50 text-green-700 border border-green-200";
    case "CANCELLED":
      return "bg-gray-100 text-gray-500 border border-gray-200";
  }
};

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatCurrency = (amount: number) =>
  amount.toLocaleString("vi-VN") + "đ";
