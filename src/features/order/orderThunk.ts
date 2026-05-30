import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../api/axiosClient";
import type {
  OrderDTO,
  FetchOrdersRequest,
  UpdateOrderStatusRequest,
} from "./orderType";

// ==================== RESPONSE SHAPE ====================
interface PagedOrderResponse {
  content: OrderDTO[];
  totalElements: number;
  totalPages: number;
  number: number; // current page (0-indexed)
  size: number;
}

// ==================== FETCH ADMIN ORDERS ====================
export const fetchAdminOrders = createAsyncThunk<
  PagedOrderResponse,
  FetchOrdersRequest,
  { rejectValue: string }
>("order/fetchAdminOrders", async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append("page", params.page.toString());
    if (params.size !== undefined) query.append("size", params.size.toString());
    if (params.status && params.status !== "ALL")
      query.append("status", params.status);
    if (params.search) query.append("search", params.search);

    const res = await axiosClient.get<PagedOrderResponse>(
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
