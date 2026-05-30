import { createSlice } from "@reduxjs/toolkit";
import type { ProductState } from "./productType";
import {
  fetchProducts,
  fetchProductDetail,
  fetchReviews,
  submitReview,
  fetchPromoProducts,
} from "./productThunk";

const initialState: ProductState = {
  // Product list
  productPage: null,
  isLoadingList: false,
  listError: null,

  // Product detail
  selectedProduct: null,
  isLoadingDetail: false,
  detailError: null,

  // Reviews
  reviewPage: null,
  isLoadingReviews: false,
  reviewsError: null,

  // Submit review
  isSubmittingReview: false,
  submitReviewError: null,
  submitReviewSuccess: false,

  // Promotions
  promoProducts: [],
  isLoadingPromos: false,
  promosError: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductDetail: (state) => {
      state.selectedProduct = null;
      state.detailError = null;
    },
    clearReviews: (state) => {
      state.reviewPage = null;
      state.reviewsError = null;
    },
    clearSubmitReviewStatus: (state) => {
      state.submitReviewError = null;
      state.submitReviewSuccess = false;
    },
    clearListError: (state) => {
      state.listError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- FETCH PRODUCT LIST ---
      .addCase(fetchProducts.pending, (state) => {
        state.isLoadingList = true;
        state.listError = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoadingList = false;
        state.productPage = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoadingList = false;
        state.listError = action.payload ?? "Đã xảy ra lỗi.";
      })

      // --- FETCH PRODUCT DETAIL ---
      .addCase(fetchProductDetail.pending, (state) => {
        state.isLoadingDetail = true;
        state.detailError = null;
        state.selectedProduct = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.detailError = action.payload ?? "Đã xảy ra lỗi.";
      })

      // --- FETCH REVIEWS ---
      .addCase(fetchReviews.pending, (state) => {
        state.isLoadingReviews = true;
        state.reviewsError = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoadingReviews = false;
        state.reviewPage = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoadingReviews = false;
        state.reviewsError = action.payload ?? "Đã xảy ra lỗi.";
      })

      // --- SUBMIT REVIEW ---
      .addCase(submitReview.pending, (state) => {
        state.isSubmittingReview = true;
        state.submitReviewError = null;
        state.submitReviewSuccess = false;
      })
      .addCase(submitReview.fulfilled, (state) => {
        state.isSubmittingReview = false;
        state.submitReviewSuccess = true;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.isSubmittingReview = false;
        state.submitReviewError = action.payload ?? "Đã xảy ra lỗi.";
      })

      // --- FETCH PROMO PRODUCTS ---
      .addCase(fetchPromoProducts.pending, (state) => {
        state.isLoadingPromos = true;
        state.promosError = null;
      })
      .addCase(fetchPromoProducts.fulfilled, (state, action) => {
        state.isLoadingPromos = false;
        state.promoProducts = action.payload;
      })
      .addCase(fetchPromoProducts.rejected, (state, action) => {
        state.isLoadingPromos = false;
        state.promosError = action.payload ?? "Đã xảy ra lỗi.";
      });
  },
});

export const {
  clearProductDetail,
  clearReviews,
  clearSubmitReviewStatus,
  clearListError,
} = productSlice.actions;

export default productSlice.reducer;