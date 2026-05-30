import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../api/axiosClient";
import type {
  OrderDTO,
  FetchOrdersRequest,
  UpdateOrderStatusRequest,
} from "./orderType";

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

// ==================== FETCH ADMIN ORDERS ====================
export const fetchAdminOrders = createAsyncThunk<
  OrderApiResponse,
  FetchOrdersRequest,
  { rejectValue: string }
>("order/fetchAdminOrders", async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    query.append("page", (params.page ?? 1).toString()); // 1-indexed
    if (params.size !== undefined) query.append("size", params.size.toString());
    if (params.orderStatus && params.orderStatus !== "ALL")
      query.append("orderStatus", params.orderStatus);  // đổi từ status
    if (params.paymentStatus)
      query.append("paymentStatus", params.paymentStatus); // thêm mới
    if (params.keyword) query.append("keyword", params.keyword); // đổi từ search

    const res = await axiosClient.get<OrderApiResponse>(
      `/orders/admin?${query.toString()}`,
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

// ==================== UPDATE ORDER STATUS ====================
export const updateOrderStatus = createAsyncThunk<
  OrderDTO,
  UpdateOrderStatusRequest,
  { rejectValue: string }
>("order/updateOrderStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put<OrderDTO>(
      `/orders/${id}/status?status=${status}`,
    );
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response)
      return rejectWithValue(
        error.response.data?.message || "Cập nhật trạng thái thất bại.",
      );
    return rejectWithValue("Lỗi kết nối máy chủ!");
  }
});
