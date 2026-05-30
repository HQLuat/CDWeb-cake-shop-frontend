import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../api/axiosClient";
import type { OrderDTO } from "./orderType";
import type {
  CreateOrderRequest,
  CreatePaymentRequest,
  PaymentUrlResponse,
} from "./userOrderType";

// ==================== RESPONSE SHAPE ====================
interface OrderApiResponse {
  success: boolean;
  message: string;
  data: OrderDTO[];
  meta: {
    page: number;          // 1-indexed
    size: number;
    totalPages: number;
    totalElements: number;
    timestamp: string;
    version: string;
  };
}

// ==================== FETCH USER ORDERS ====================
export const fetchUserOrders = createAsyncThunk<
  OrderApiResponse,
  { page?: number; size?: number; orderStatus?: string },
  { rejectValue: string }
>("userOrder/fetchUserOrders", async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    query.append("page", (params.page ?? 1).toString()); // 1-indexed
    if (params.size !== undefined) query.append("size", params.size.toString());
    if (params.orderStatus && params.orderStatus !== "ALL")
      query.append("orderStatus", params.orderStatus);

    const res = await axiosClient.get<OrderApiResponse>(
      `/orders?${query.toString()}`,
    );
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response)
      return rejectWithValue(
        error.response.data?.message || "Không thể tải danh sách đơn hàng.",
      );
    return rejectWithValue("Lỗi kết nối máy chủ!");
  }
});

// ==================== FETCH ORDER DETAIL ====================
export const fetchOrderDetail = createAsyncThunk<
  OrderDTO,
  number,
  { rejectValue: string }
>("userOrder/fetchOrderDetail", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get<any>(`/orders/${id}`);
    // Support both wrapped response and direct data
    return res.data.data !== undefined ? res.data.data : res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response)
      return rejectWithValue(
        error.response.data?.message || "Không thể tải chi tiết đơn hàng.",
      );
    return rejectWithValue("Lỗi kết nối máy chủ!");
  }
});

// ==================== CREATE ORDER ====================
export const createOrder = createAsyncThunk<
  OrderDTO,
  CreateOrderRequest,
  { rejectValue: string }
>("userOrder/createOrder", async (payload, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post<any>("/orders", payload);
    // Support both wrapped response and direct data
    return res.data.data !== undefined ? res.data.data : res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response)
      return rejectWithValue(
        error.response.data?.message || "Đặt hàng thất bại.",
      );
    return rejectWithValue("Lỗi kết nối máy chủ!");
  }
});

// ==================== CREATE VNPAY PAYMENT ====================
export const createVNPayPayment = createAsyncThunk<
  PaymentUrlResponse,
  CreatePaymentRequest,
  { rejectValue: string }
>("userOrder/createVNPayPayment", async (payload, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post<any>("/payment/vnpay/create", payload);
    // Support both wrapped response and direct data
    return res.data.data !== undefined ? res.data.data : res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response)
      return rejectWithValue(
        error.response.data?.message || "Không thể khởi tạo thanh toán VNPay.",
      );
    return rejectWithValue("Lỗi kết nối máy chủ!");
  }
});
