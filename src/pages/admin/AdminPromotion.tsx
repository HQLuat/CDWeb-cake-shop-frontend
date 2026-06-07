import { useState, useEffect, useCallback, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPercent,
  faTimes,
  faCheck,
  faSpinner,
  faTrashAlt,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../api/axiosClient";
interface ProductSummary {
  id: number;
  name: string;
  price: number;
  imageUrls?: string[];
}

// ==================== TYPES ====================
interface PromotionProduct extends ProductSummary {
  collection: ReactNode;
  discountPercent: number | null; // null = no active promo
  discountedPrice: number | null;
}

interface ApplyPromoPayload {
  productId: number;
  discountPercent: number;
}

// ==================== CONSTANTS ====================
const QUICK_DISCOUNTS = [5, 10, 15, 20, 25, 30, 50];

// ==================== COMPONENT ====================
export default function AdminPromotion() {
  const [products, setProducts] = useState<PromotionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search / filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "active" | "inactive">("all");

  // Selected products & bulk discount
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkDiscount, setBulkDiscount] = useState<string>("");
  const [isBulkApplying, setIsBulkApplying] = useState(false);

  // Individual discount editing
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [successId, setSuccessId] = useState<number | null>(null);

  // ---- FETCH ----
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // GET /admin/promotions returns all products with their discount info
      const res = await axiosClient.get<PromotionProduct[]>("/admin/promotions");
      setProducts(res.data);
    } catch {
      setError("Không thể tải danh sách sản phẩm.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ---- APPLY / REMOVE DISCOUNT ----
  const applyDiscount = async (productId: number, discountPercent: number) => {
    setSavingId(productId);
    try {
      // PUT /admin/promotions/apply  → { productId, discountPercent }
      await axiosClient.put<PromotionProduct>("/admin/promotions/apply", {
        productId,
        discountPercent,
      } as ApplyPromoPayload);

      // Optimistic UI: recalculate locally
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== productId) return p;
          const discounted = parseFloat(
            (p.price * (1 - discountPercent / 100)).toFixed(1)
          );
          return { ...p, discountPercent, discountedPrice: discounted };
        })
      );
      setSuccessId(productId);
      setTimeout(() => setSuccessId(null), 2000);
    } catch {
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSavingId(null);
      setEditingId(null);
    }
  };

  const removeDiscount = async (productId: number) => {
    setSavingId(productId);
    try {
      // DELETE /admin/promotions/{productId}
      await axiosClient.delete(`/admin/promotions/${productId}`);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, discountPercent: null, discountedPrice: null }
            : p
        )
      );
    } catch {
      alert("Xóa khuyến mãi thất bại.");
    } finally {
      setSavingId(null);
    }
  };

  const handleBulkApply = async () => {
    const pct = Number(bulkDiscount);
    if (!pct || pct < 1 || pct > 99) return;
    setIsBulkApplying(true);
    try {
      // PUT /admin/promotions/bulk-apply → { productIds: number[], discountPercent }
      await axiosClient.put("/admin/promotions/bulk-apply", {
        productIds: Array.from(selectedIds),
        discountPercent: pct,
      });
      setProducts((prev) =>
        prev.map((p) => {
          if (!selectedIds.has(p.id)) return p;
          const discounted = parseFloat(
            (p.price * (1 - pct / 100)).toFixed(1)
          );
          return { ...p, discountPercent: pct, discountedPrice: discounted };
        })
      );
      setSelectedIds(new Set());
      setBulkDiscount("");
    } catch {
      alert("Áp dụng hàng loạt thất bại.");
    } finally {
      setIsBulkApplying(false);
    }
  };

  // ---- FILTERING ----
  const filtered = products.filter((p) => {
    const matchSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchMode =
      filterMode === "all"
        ? true
        : filterMode === "active"
          ? p.discountPercent !== null
          : p.discountPercent === null;
    return matchSearch && matchMode;
  });

  const activeCount = products.filter((p) => p.discountPercent !== null).length;

  // ---- SELECTION HELPERS ----
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((p) => p.id)));
    }
  };

  const fmtVND = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  // ==================== RENDER ====================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-lora flex items-center gap-2">
            Quản Lý Khuyến Mãi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeCount} sản phẩm đang giảm giá
          </p>
        </div>
      </div>

      {/* ===== BULK ACTION BAR ===== */}
      {selectedIds.size > 0 && (
        <div className="mb-4 bg-primary/5 border border-primary/20 rounded-2xl p-4 flex flex-wrap items-center gap-3 animate-pulse-once">
          <span className="text-sm font-semibold text-primary">
            Đã chọn {selectedIds.size} sản phẩm
          </span>
          <div className="flex-1" />
          {/* Quick select buttons */}
          <div className="flex flex-wrap gap-1.5">
            {QUICK_DISCOUNTS.map((d) => (
              <button
                key={d}
                onClick={() => setBulkDiscount(String(d))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${bulkDiscount === String(d)
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                  }`}
              >
                -{d}%
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5">
            <input
              type="number"
              min={1}
              max={99}
              value={bulkDiscount}
              onChange={(e) => setBulkDiscount(e.target.value)}
              placeholder="Tùy chỉnh %"
              className="w-24 outline-none text-sm text-gray-700 bg-transparent"
            />
            <FontAwesomeIcon icon={faPercent} className="text-gray-400 text-xs" />
          </div>
          <button
            onClick={handleBulkApply}
            disabled={!bulkDiscount || isBulkApplying}
            className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-[#7a0001] transition-all flex items-center gap-2 shadow-sm"
          >
            {isBulkApplying ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            ) : (
              <FontAwesomeIcon icon={faCheck} />
            )}
            Áp dụng
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100 transition-all"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}

      {/* ===== SEARCH & FILTER ===== */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 gap-3">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Tìm tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-700"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="text-gray-400 hover:text-gray-700">
              <FontAwesomeIcon icon={faTimes} size="xs" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border cursor-pointer ${filterMode === mode
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary"
                }`}
            >
              {mode === "all"
                ? "Tất cả"
                : mode === "active"
                  ? "Đang giảm"
                  : "Chưa giảm"}
            </button>
          ))}
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center text-gray-400">
            <FontAwesomeIcon
              icon={faSpinner}
              className="animate-spin text-3xl mb-3 text-primary"
            />
            <p className="text-sm">Đang tải sản phẩm...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-500 text-sm">
            {error}{" "}
            <button
              onClick={loadProducts}
              className="underline font-semibold ml-1"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-4 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        filtered.length > 0 &&
                        selectedIds.size === filtered.length
                      }
                      onChange={toggleSelectAll}
                      className="accent-primary w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="py-4 px-4">Sản phẩm</th>
                  <th className="py-4 px-4">Danh mục</th>
                  <th className="py-4 px-4">Giá gốc</th>
                  <th className="py-4 px-4">% Giảm</th>
                  <th className="py-4 px-4">Giá sau giảm</th>
                  <th className="py-4 px-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-16 text-center text-gray-400"
                    >
                      <FontAwesomeIcon
                        icon={faLayerGroup}
                        className="text-3xl mb-2 block mx-auto"
                      />
                      Không tìm thấy sản phẩm nào.
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => {
                    const isEditing = editingId === product.id;
                    const isSaving = savingId === product.id;
                    const isSuccess = successId === product.id;
                    const isSelected = selectedIds.has(product.id);
                    const hasDiscount = product.discountPercent !== null;

                    return (
                      <tr
                        key={product.id}
                        className={`hover:bg-gray-50/60 transition-colors ${isSelected ? "bg-primary/5" : ""
                          }`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(product.id)}
                            className="accent-primary w-4 h-4 cursor-pointer"
                          />
                        </td>

                        {/* Product */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                product.imageUrls?.[0] ||
                                "https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=100"
                              }
                              alt={product.name}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                            />
                            <div>
                              <p className="font-semibold text-gray-800 line-clamp-1">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                ID #{product.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Collection */}
                        <td className="py-4 px-4">
                          <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                            {product.collection}
                          </span>
                        </td>

                        {/* Original price */}
                        <td className="py-4 px-4 font-medium text-gray-700">
                          {fmtVND(product.price)}
                        </td>

                        {/* Discount % — editable */}
                        <td className="py-4 px-4">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center bg-primary/5 border border-primary/30 rounded-lg px-2 py-1 gap-1">
                                <input
                                  type="number"
                                  min={1}
                                  max={99}
                                  autoFocus
                                  value={editValue}
                                  onChange={(e) =>
                                    setEditValue(e.target.value)
                                  }
                                  className="w-14 outline-none text-sm font-bold text-primary bg-transparent"
                                />
                                <FontAwesomeIcon
                                  icon={faPercent}
                                  className="text-primary text-xs"
                                />
                              </div>
                              <button
                                onClick={() => {
                                  const pct = Number(editValue);
                                  if (pct >= 1 && pct <= 99)
                                    applyDiscount(product.id, pct);
                                }}
                                className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-xs cursor-pointer"
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-all text-xs cursor-pointer"
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => {
                                setEditingId(product.id);
                                setEditValue(
                                  String(product.discountPercent ?? "")
                                );
                              }}
                              className="cursor-pointer inline-flex items-center gap-1.5 group"
                            >
                              {hasDiscount ? (
                                <span className="bg-red-50 text-red-600 border border-red-200 font-bold text-sm px-3 py-1 rounded-full group-hover:bg-red-100 transition-all">
                                  -{product.discountPercent}%
                                </span>
                              ) : (
                                <span className="text-gray-300 text-xs border border-dashed border-gray-200 px-3 py-1 rounded-full group-hover:border-primary group-hover:text-primary transition-all">
                                  Chưa có
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Discounted price */}
                        <td className="py-4 px-4">
                          {hasDiscount && product.discountedPrice !== null ? (
                            <div className="flex flex-col">
                              <span className="font-bold text-primary">
                                {fmtVND(product.discountedPrice)}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                {fmtVND(product.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4">
                          <div className="flex justify-center gap-2">
                            {isSaving ? (
                              <FontAwesomeIcon
                                icon={faSpinner}
                                className="animate-spin text-primary"
                              />
                            ) : isSuccess ? (
                              <span className="text-green-600 text-xs font-semibold flex items-center gap-1">
                                <FontAwesomeIcon icon={faCheck} /> Đã lưu
                              </span>
                            ) : (
                              <>
                                {/* Quick discount buttons */}
                                <div className="flex gap-1">
                                  {[10, 20, 30].map((pct) => (
                                    <button
                                      key={pct}
                                      onClick={() =>
                                        applyDiscount(product.id, pct)
                                      }
                                      className="px-2 py-1 text-[11px] font-bold rounded-lg border border-gray-200 bg-white hover:bg-primary hover:text-white hover:border-primary transition-all text-gray-500"
                                    >
                                      -{pct}%
                                    </button>
                                  ))}
                                </div>

                                {/* Remove discount */}
                                {hasDiscount && (
                                  <button
                                    onClick={() => removeDiscount(product.id)}
                                    title="Xóa khuyến mãi"
                                    className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                                  >
                                    <FontAwesomeIcon
                                      icon={faTrashAlt}
                                      className="text-xs"
                                    />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}