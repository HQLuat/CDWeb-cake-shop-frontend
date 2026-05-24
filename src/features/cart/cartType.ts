export interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  imageUrl: string;
}

export interface CartDTO {
  cartId: number;
  items: CartItem[];
  totalItems: number;
  totalQuantity: number;
  totalAmount: number;
}

export interface CartState {
  cart: CartDTO | null;
  isLoading: boolean;
  error: string | null;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  cartItemId: number;
  quantity: number;
}
