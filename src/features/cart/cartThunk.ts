import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../api/axiosClient";
import type { ApiResponse } from "../auth/authType";
import type {
  CartDTO,
  AddToCartRequest,
  UpdateCartItemRequest,
} from "./cartType";

export const fetchCart = createAsyncThunk<
  ApiResponse<CartDTO>,
  void,
  { rejectValue: string }
>("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get<ApiResponse<CartDTO>>("/cart");
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response)
      return rejectWithValue(
        error.response.data?.message || "Không thể tải giỏ hàng.",
      );
    return rejectWithValue("Lỗi kết nối máy chủ!");
  }
});

export const addToCart = createAsyncThunk<
  ApiResponse<CartDTO>,
  AddToCartRequest,
  { rejectValue: string }
>("cart/addToCart", async (payload, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post<ApiResponse<CartDTO>>(
      "/cart/items",
      payload,
    );
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response)
      return rejectWithValue(
        error.response.data?.message || "Thêm vào giỏ thất bại.",
      );
    return rejectWithValue("Lỗi kết nối máy chủ!");
  }
});

export const updateCartItem = createAsyncThunk<
  ApiResponse<CartDTO>,
  UpdateCartItemRequest,
  { rejectValue: string }
>("cart/updateItem", async ({ cartItemId, quantity }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put<ApiResponse<CartDTO>>(
      `/cart/items/${cartItemId}`,
      { quantity },
    );
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response)
      return rejectWithValue(
        error.response.data?.message || "Cập nhật thất bại.",
      );
    return rejectWithValue("Lỗi kết nối máy chủ!");
  }
});

export const removeCartItem = createAsyncThunk<
  ApiResponse<CartDTO>,
  number,
  { rejectValue: string }
>("cart/removeItem", async (cartItemId, { rejectWithValue }) => {
  try {
    const res = await axiosClient.delete<ApiResponse<CartDTO>>(
      `/cart/items/${cartItemId}`,
    );
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response)
      return rejectWithValue(
        error.response.data?.message || "Xóa sản phẩm thất bại.",
      );
    return rejectWithValue("Lỗi kết nối máy chủ!");
  }
});

export const clearCart = createAsyncThunk<
  ApiResponse<object>,
  void,
  { rejectValue: string }
>("cart/clearCart", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.delete<ApiResponse<object>>("/cart");
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response)
      return rejectWithValue(
        error.response.data?.message || "Xóa giỏ hàng thất bại.",
      );
    return rejectWithValue("Lỗi kết nối máy chủ!");
  }
});
