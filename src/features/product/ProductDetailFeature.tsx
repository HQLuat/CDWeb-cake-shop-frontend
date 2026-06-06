import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import { fetchProductDetail } from "./productThunk";
import { clearProductDetail } from "./productSlice";
import DetailSkeleton from "./components/DetailSkeleton";
import ProductDetailContent from "./components/ProductDetailContent";

export default function ProductDetailFeature() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { selectedProduct, isLoadingDetail, detailError } = useAppSelector(
    (state) => state.product,
  );

  // Fetch product on mount / id change
  useEffect(() => {
    if (!id) return;
    dispatch(fetchProductDetail(Number(id)));

    return () => {
      dispatch(clearProductDetail());
    };
  }, [dispatch, id]);

  // ---- LOADING ----
  if (isLoadingDetail) return <DetailSkeleton />;

  // ---- ERROR ----
  if (detailError || !selectedProduct) {
    return (
      <main className="mt-28 mb-20 text-center py-20">
        <p className="text-4xl mb-4">🍰</p>
        <p className="text-gray-500 font-medium text-[15px]">
          {detailError || "Không tìm thấy sản phẩm."}
        </p>
        <Link
          to="/products"
          className="mt-4 inline-block text-primary underline text-[14px]"
        >
          Quay lại danh sách
        </Link>
      </main>
    );
  }

  return (
    <main className="mt-10 mb-20">
      <ProductDetailContent
        key={selectedProduct.id}
        product={selectedProduct}
      />
    </main>
  );
}
