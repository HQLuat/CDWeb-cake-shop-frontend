// ==================== REVIEW ====================
export interface ReviewDTO {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ==================== PRODUCT IMAGE ====================
export interface ProductImageDTO {
  imageUrl: string;
  cloudinaryPublicId: string | null;
  sortOrder: number;
}

// ==================== PRODUCT ====================
export interface ProductSummary {
  [x: string]: any;
  id: number;
  name: string;
  price: number;
  currentPrice?: number;        
  discountPercent?: number;  
  description: string;
  collection: string;
  averageRating: number;
  totalReviews: number;
  imageUrls: string[];
  images?: ProductImageDTO[];   // bổ sung từ backend (admin)
}

export interface ProductDetail extends ProductSummary {
  detailDescription: string;
  storageGuide: string;
  shippingInfo: string;
  ingredients: string[];
  freshGuarantee: boolean;
  reviews: ReviewDTO[];
}

// ==================== PAGE RESPONSE ====================
export interface PageMeta {
  totalElements: number;
  totalPages: number;
  number: number; // current page (0-indexed)
  size: number;
  first: boolean;
  last: boolean;
}

export interface ProductPage extends PageMeta {
  content: ProductSummary[];
}

export interface ReviewPage extends PageMeta {
  content: ReviewDTO[];
}

// ==================== REQUESTS ====================
export interface FetchProductsRequest {
  page?: number;
  size?: number;
  search?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface FetchReviewsRequest {
  productId: number;
  page?: number;
  size?: number;
}

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  comment: string;
}

// ==================== STATE ====================
export interface ProductState {
  // Product list
  productPage: ProductPage | null;
  isLoadingList: boolean;
  listError: string | null;

  // Product detail
  selectedProduct: ProductDetail | null;
  isLoadingDetail: boolean;
  detailError: string | null;

  // Reviews
  reviewPage: ReviewPage | null;
  isLoadingReviews: boolean;
  reviewsError: string | null;

  // Submit review
  isSubmittingReview: boolean;
  submitReviewError: string | null;
  submitReviewSuccess: boolean;

   // Promotions
  promoProducts: PromotionProduct[];
  isLoadingPromos: boolean;
  promosError: string | null;
}

// ==================== PROMOTION ====================
export interface PromotionProduct {
  id: number;
  name: string;
  description: string;
  collection: string;
  price: number;
  currentPrice: number;
  averageRating: number;
  totalReviews: number;
  imageUrls: string[];
  discountPercent: number | null;
  discountedPrice: number | null;
}