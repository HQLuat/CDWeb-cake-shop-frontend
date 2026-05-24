import { createSlice } from "@reduxjs/toolkit";
import type { CartState } from "./cartType";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "./cartThunk";

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

const setLoading = (state: CartState) => {
  state.isLoading = true;
  state.error = null;
};
const setError = (state: CartState, action: { payload?: string }) => {
  state.isLoading = false;
  state.error = action.payload ?? "Đã xảy ra lỗi.";
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, setLoading)
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) state.cart = action.payload.data;
      })
      .addCase(fetchCart.rejected, setError)

      .addCase(addToCart.pending, setLoading)
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) state.cart = action.payload.data;
      })
      .addCase(addToCart.rejected, setError)

      .addCase(updateCartItem.pending, setLoading)
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) state.cart = action.payload.data;
      })
      .addCase(updateCartItem.rejected, setError)

      .addCase(removeCartItem.pending, setLoading)
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) state.cart = action.payload.data;
      })
      .addCase(removeCartItem.rejected, setError)

      .addCase(clearCart.pending, setLoading)
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.cart = null;
      })
      .addCase(clearCart.rejected, setError);
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
