import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../api/axiosClient";
import type {
  ProductPage,
  ProductDetail,
  ReviewPage,
  ReviewDTO,
  FetchProductsRequest,
  FetchReviewsRequest,
  CreateReviewRequest,
} from "./productType";

// --- FETCH PRODUCT LIST ---
export const fetchProducts = createAsyncThunk<
  ProductPage,
  FetchProductsRequest,
  { rejectValue: string }
>("product/fetchProducts", async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append("page", params.page.toString());
    if (params.size !== undefined) query.append("size", params.size.toString());
    if (params.search) query.append("search", params.search);
    if (params.collection) query.append("collection", params.collection);
    if (params.minPrice !== undefined)
      query.append("minPrice", params.minPrice.toString());
    if (params.maxPrice !== undefined)
      query.append("maxPrice", params.maxPrice.toString());

    const res = await axiosClient.get<ProductPage>(
      `/products?${query.toString()}`,
    );
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response)
      return rejectWithValue(
        error.response.data?.message || "Không thể tải danh sách sản phẩm.",
      );
    return rejectWithValue("Lỗi kết nối máy chủ!");
  }
});

// --- FETCH PRODUCT DETAIL ---
export const fetchProductDetail = createAsyncThunk<
  ProductDetail,
  number,
  { rejectValue: string }
>("product/fetchProductDetail", async (productId, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get<ProductDetail>(`/products/${productId}`);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response)
      return rejectWithValue(
        error.response.data?.message || "Không tìm thấy sản phẩm.",
      );
    return rejectWithValue("Lỗi kết nối máy chủ!");
  }
});

// --- FETCH REVIEWS ---
export const fetchReviews = createAsyncThunk<
  ReviewPage,
  FetchReviewsRequest,
  { rejectValue: string }
>(
  "product/fetchReviews",
  async ({ productId, page = 0, size = 5 }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get<ReviewPage>(
        `/products/${productId}/reviews?page=${page}&size=${size}`,
      );
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response)
        return rejectWithValue(
          error.response.data?.message || "Không thể tải đánh giá.",
        );
      return rejectWithValue("Lỗi kết nối máy chủ!");
    }
  },
);

// --- SUBMIT REVIEW ---
export const submitReview = createAsyncThunk<
  ReviewDTO,
  CreateReviewRequest,
  { rejectValue: string }
>(
  "product/submitReview",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post<ReviewDTO>(
        `/products/${productId}/reviews`,
        {
          rating,
          comment,
        },
      );
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response)
        return rejectWithValue(
          error.response.data?.message || "Gửi đánh giá thất bại.",
        );
      return rejectWithValue("Lỗi kết nối máy chủ!");
    }
  },
);
