import { createSlice } from "@reduxjs/toolkit";
import type { OrderState } from "./orderType";
import { fetchAdminOrders, updateOrderStatus } from "./orderThunk";

const initialState: OrderState = {
  orders: [],
  isLoading: false,
  isUpdating: false,
  error: null,
  updateError: null,
  // Pagination
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- FETCH ADMIN ORDERS ---
      .addCase(fetchAdminOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Đã xảy ra lỗi.";
      })

      // --- UPDATE ORDER STATUS ---
      .addCase(updateOrderStatus.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        // Cập nhật order đã thay đổi ngay trong danh sách
        const idx = state.orders.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1) {
          state.orders[idx] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload ?? "Đã xảy ra lỗi.";
      });
  },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
