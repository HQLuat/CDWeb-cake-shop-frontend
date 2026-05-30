import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProducts } from "./productThunk";
import SkeletonCard from "./components/SkeletonCard";
import ProductCard from "./components/ProductCard";

// ==================== CONSTANTS ====================
const PAGE_SIZE = 9;

const COLLECTIONS = [
  "Tất cả",
  "Signature Collection",
  "Premium Collection",
  "French Patisserie Collection",
  "Japanese Collection",
  "Italian Collection",
  "Artisan Bread Collection",
  "Classic Collection",
  "Seasonal Collection",
];

const PRICE_RANGES = [
  { label: "Tất cả", min: 0, max: undefined as number | undefined },
  { label: "Dưới 50.000đ", min: 0, max: 50000 },
  { label: "50.000đ – 100.000đ", min: 50000, max: 100000 },
  { label: "100.000đ – 200.000đ", min: 100000, max: 200000 },
  { label: "Trên 200.000đ", min: 200000, max: undefined as number | undefined },
];

export default function ProductListFeature() {
  const dispatch = useAppDispatch();
  const { productPage, isLoadingList, listError } = useAppSelector(
    (state) => state.product,
  );

  // Filter states (local — not worth putting in Redux)
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("Tất cả");
  const [selectedPriceIdx, setSelectedPriceIdx] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilter, setShowFilter] = useState(false);

  const priceRange = PRICE_RANGES[selectedPriceIdx];

const load = useCallback(() => {
  dispatch(
    fetchProducts({
      page: currentPage,
      size: PAGE_SIZE,
      search: search || undefined,
      collection:
        selectedCollection !== "Tất cả" ? selectedCollection : undefined,
      minPrice: priceRange.min !== 0 ? (priceRange.min / 1000) : undefined,
      maxPrice: priceRange.max ? (priceRange.max / 1000) : undefined,
    }),
  );
}, [dispatch, currentPage, search, selectedCollection, priceRange]);

  useEffect(() => {
    load();
  }, [load]);

  // Handlers
  const handleSearch = () => {
    setSearch(searchInput);
    setCurrentPage(0);
  };

  const handleCollectionChange = (col: string) => {
    setSelectedCollection(col);
    setCurrentPage(0);
  };

  const handlePriceChange = (idx: number) => {
    setSelectedPriceIdx(idx);
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSearchInput("");
    setSelectedCollection("Tất cả");
    setSelectedPriceIdx(0);
    setCurrentPage(0);
  };

  const hasActiveFilters =
    !!search || selectedCollection !== "Tất cả" || selectedPriceIdx !== 0;

  // Smart pagination range
  const getPaginationRange = () => {
    const total = productPage?.totalPages ?? 0;
    const delta = 2;
    const range: (number | "...")[] = [];
    const left = Math.max(0, currentPage - delta);
    const right = Math.min(total - 1, currentPage + delta);

    if (left > 0) {
      range.push(0);
      if (left > 1) range.push("...");
    }
    for (let i = left; i <= right; i++) range.push(i);
    if (right < total - 1) {
      if (right < total - 2) range.push("...");
      range.push(total - 1);
    }
    return range;
  };

  const totalElements = productPage?.totalElements ?? 0;
  const totalPages = productPage?.totalPages ?? 0;
  const products = productPage?.content ?? [];

  return (
    <main className="mt-24 mb-20 bg-[#fff8f3] min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <span className="text-primary text-[11px] uppercase tracking-[3px] font-semibold">
            The Signature Collection
          </span>
          <h1 className="font-lora text-[38px] mt-1.5 text-gray-800">
            Thực Đơn Của Chúng Tôi
          </h1>
          <p className="text-gray-400 mt-1.5 text-[14px]">
            {isLoadingList
              ? "Đang tải..."
              : `Khám phá ${totalElements.toLocaleString()} loại bánh thủ công tinh tế`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* ===== SIDEBAR ===== */}
          <aside
            className={`w-60 shrink-0 ${showFilter ? "block" : "hidden"} md:block`}
          >
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-28">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-lora text-[17px] font-semibold text-gray-800">
                  Bộ lọc
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-[11px] text-primary hover:underline flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faTimes} size="xs" />
                    Xóa tất cả
                  </button>
                )}
              </div>

              {/* Collection */}
              <div className="mb-6">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Danh mục
                </h4>
                <div className="space-y-1">
                  {COLLECTIONS.map((col) => (
                    <button
                      key={col}
                      onClick={() => handleCollectionChange(col)}
                      className={`w-full text-left text-[13px] px-3 py-2 rounded-xl transition-all ${
                        selectedCollection === col
                          ? "bg-primary text-white font-medium shadow-sm"
                          : "text-gray-500 hover:bg-[#fff0e8] hover:text-gray-800"
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Khoảng giá
                </h4>
                <div className="space-y-1">
                  {PRICE_RANGES.map((range, idx) => (
                    <button
                      key={range.label}
                      onClick={() => handlePriceChange(idx)}
                      className={`w-full text-left text-[13px] px-3 py-2 rounded-xl transition-all ${
                        selectedPriceIdx === idx
                          ? "bg-primary text-white font-medium shadow-sm"
                          : "text-gray-500 hover:bg-[#fff0e8] hover:text-gray-800"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ===== MAIN CONTENT ===== */}
          <div className="flex-1 min-w-0">
            {/* Search bar */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 flex items-center bg-white rounded-full px-4 py-3 shadow-sm border border-gray-100 focus-within:border-primary/30 transition-colors">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-gray-300 mr-3 shrink-0"
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm bánh..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 outline-none text-[14px] text-gray-700 bg-transparent placeholder:text-gray-300"
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput("");
                      setSearch("");
                      setCurrentPage(0);
                    }}
                    className="text-gray-300 hover:text-primary ml-2 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimes} size="xs" />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="bg-primary text-white px-6 rounded-full text-[13px] font-semibold hover:bg-[#7a0001] transition-all shadow-sm shadow-primary/20"
              >
                Tìm
              </button>
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="md:hidden bg-white border border-gray-100 px-4 rounded-full shadow-sm"
              >
                <FontAwesomeIcon icon={faFilter} className="text-primary" />
              </button>
            </div>

            {/* Active filter chips */}
            {hasActiveFilters && !isLoadingList && (
              <div className="mb-5 flex items-center gap-2 flex-wrap text-[13px] text-gray-500">
                <span>
                  Tìm thấy{" "}
                  <span className="font-semibold text-gray-800">
                    {totalElements}
                  </span>{" "}
                  sản phẩm
                </span>
                {search && (
                  <span className="bg-white border border-gray-100 rounded-full px-3 py-0.5 text-[12px] flex items-center gap-1.5 shadow-sm">
                    "{search}"
                    <button
                      onClick={() => {
                        setSearch("");
                        setSearchInput("");
                        setCurrentPage(0);
                      }}
                      className="text-gray-400 hover:text-primary"
                    >
                      <FontAwesomeIcon icon={faTimes} size="xs" />
                    </button>
                  </span>
                )}
                {selectedCollection !== "Tất cả" && (
                  <span className="bg-white border border-gray-100 rounded-full px-3 py-0.5 text-[12px] flex items-center gap-1.5 shadow-sm">
                    {selectedCollection}
                    <button
                      onClick={() => {
                        setSelectedCollection("Tất cả");
                        setCurrentPage(0);
                      }}
                      className="text-gray-400 hover:text-primary"
                    >
                      <FontAwesomeIcon icon={faTimes} size="xs" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Error */}
            {listError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[13px] rounded-2xl text-center">
                {listError}
                <button onClick={load} className="ml-3 underline font-semibold">
                  Thử lại
                </button>
              </div>
            )}

            {/* Grid */}
            {isLoadingList ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-5xl mb-4">🧁</div>
                <p className="text-gray-500 text-[15px] font-medium">
                  Không tìm thấy sản phẩm nào.
                </p>
                <p className="text-gray-400 text-[13px] mt-1 mb-6">
                  Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-primary text-white px-6 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#7a0001] transition-all"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 rounded-full text-[13px] border border-gray-200 bg-white disabled:opacity-30 hover:border-primary hover:text-primary transition-all shadow-sm"
                >
                  ← Trước
                </button>

                {getPaginationRange().map((item, idx) =>
                  item === "..." ? (
                    <span key={`e-${idx}`} className="px-2 text-gray-400">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item as number)}
                      className={`w-9 h-9 rounded-full text-[13px] font-medium transition-all shadow-sm ${
                        currentPage === item
                          ? "bg-primary text-white shadow-primary/20"
                          : "bg-white border border-gray-200 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {(item as number) + 1}
                    </button>
                  ),
                )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={currentPage === totalPages - 1}
                  className="px-4 py-2 rounded-full text-[13px] border border-gray-200 bg-white disabled:opacity-30 hover:border-primary hover:text-primary transition-all shadow-sm"
                >
                  Sau →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
