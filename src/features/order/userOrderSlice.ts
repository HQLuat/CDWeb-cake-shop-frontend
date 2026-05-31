import { createSlice } from "@reduxjs/toolkit";
import type { UserOrderState } from "./userOrderType";
import {
  fetchUserOrders,
  fetchOrderDetail,
  createOrder,
  createVNPayPayment,
} from "./userOrderThunk";

const initialState: UserOrderState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  isCreating: false,
  isPaymentLoading: false,
  error: null,
  createError: null,
  paymentError: null,
  currentPage: 1,
  totalPages: 1,
  totalElements: 0,
};

const userOrderSlice = createSlice({
  name: "userOrder",
  initialState,
  reducers: {
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearPaymentError: (state) => {
      state.paymentError = null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserOrders
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        const payloadData = action.payload;
        // Support standard paginated response
        if (payloadData && payloadData.success) {
          state.orders = payloadData.data;
          state.currentPage = payloadData.meta?.page ?? 1;
          state.totalPages = payloadData.meta?.totalPages ?? 1;
          state.totalElements = payloadData.meta?.totalElements ?? 0;
        } else {
          // fallback if it's direct data array or wrapped differently
          const rawData = payloadData as any;
          state.orders = Array.isArray(rawData) ? rawData : (rawData.data || []);
        }
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Không thể tải danh sách đơn hàng.";
      })

      // fetchOrderDetail
      .addCase(fetchOrderDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Không thể tải chi tiết đơn hàng.";
      })

      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isCreating = false;
        state.selectedOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload ?? "Đặt hàng thất bại.";
      })

      // createVNPayPayment
      .addCase(createVNPayPayment.pending, (state) => {
        state.isPaymentLoading = true;
        state.paymentError = null;
      })
      .addCase(createVNPayPayment.fulfilled, (state) => {
        state.isPaymentLoading = false;
      })
      .addCase(createVNPayPayment.rejected, (state, action) => {
        state.isPaymentLoading = false;
        state.paymentError = action.payload ?? "Không thể tạo liên kết thanh toán VNPay.";
      });
  },
});

export const { clearCreateError, clearPaymentError, clearSelectedOrder } =
  userOrderSlice.actions;
export default userOrderSlice.reducer;
