import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import productReducer from "../features/product/productSlice";
import orderReducer from "../features/order/orderSlice";
import userOrderReducer from "../features/order/userOrderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,         // admin
    userOrder: userOrderReducer, // user
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
