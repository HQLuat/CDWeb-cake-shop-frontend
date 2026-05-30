import type { OrderDTO } from "./orderType";

export interface CreateOrderRequest {
  shippingAddress: string;
  note?: string;
}

export interface CreatePaymentRequest {
  orderId: number;
}

export interface PaymentUrlResponse {
  paymentUrl: string;
}

export interface UserOrderState {
  orders: OrderDTO[];          // Dùng lại OrderDTO từ orderType.ts
  selectedOrder: OrderDTO | null;
  isLoading: boolean;
  isCreating: boolean;         // Loading riêng khi POST /orders
  isPaymentLoading: boolean;   // Loading khi tạo URL VNPay
  error: string | null;
  createError: string | null;
  paymentError: string | null;
  // Pagination
  currentPage: number;
  totalPages: number;
  totalElements: number;
}
