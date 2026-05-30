// ==================== ORDER ITEM ====================
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// ==================== ORDER ====================
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED" | "FAILED";

export interface OrderDTO {
  id: number;
  userId: number;
  username: string;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

// ==================== STATE ====================
export interface OrderState {
  orders: OrderDTO[];
  isLoading: boolean;
  isUpdating: boolean; // loading riêng khi PUT status
  error: string | null;
  updateError: string | null;
  // Pagination
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

// ==================== REQUESTS ====================
export interface FetchOrdersRequest {
  page?: number;                         // 1-indexed
  size?: number;
  orderStatus?: OrderStatus | "ALL";     // đổi từ status -> orderStatus
  paymentStatus?: PaymentStatus;         // thêm mới
  keyword?: string;                      // đổi từ search -> keyword
}

export interface UpdateOrderStatusRequest {
  id: number;
  status: OrderStatus;
}
