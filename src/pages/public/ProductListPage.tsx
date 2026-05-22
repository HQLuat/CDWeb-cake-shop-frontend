import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faSearch, faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";

// ==================== TYPES ====================
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  collection: string;
  averageRating: number;
  totalReviews: number;
  imageUrls: string[];
}

interface PageResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
}

// ==================== CONSTANTS ====================
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
  { label: "Tất cả", min: 0, max: 999999 },
  { label: "Dưới $20", min: 0, max: 20 },
  { label: "$20 - $40", min: 20, max: 40 },
  { label: "$40 - $60", min: 40, max: 60 },
  { label: "Trên $60", min: 60, max: 999999 },
];

// ==================== PRODUCT CARD ====================
function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-50"
    >
      {/* Ảnh */}
      <div className="h-56 overflow-hidden bg-bg-surface">
        <img
          src={product.imageUrls?.[0] || "https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=400"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Nội dung */}
      <div className="p-5 flex flex-col flex-1">
        {/* Collection badge */}
        <span className="text-[10px] uppercase tracking-widest text-primary font-medium mb-2">
          {product.collection}
        </span>

        {/* Tên sản phẩm */}
        <h3 className="font-lora text-[18px] font-semibold text-text-dark mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Mô tả */}
        <p className="text-text-light text-[13px] leading-relaxed mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          <div className="text-yellow-500 text-xs">
            {[...Array(Math.round(product.averageRating || 0))].map((_, i) => (
              <FontAwesomeIcon key={i} icon={faStar} />
            ))}
          </div>
          <span className="text-text-light text-[12px]">({product.totalReviews})</span>
        </div>

        {/* Giá + Nút */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-primary font-bold text-[20px]">
            ${product.price.toFixed(2)}
          </span>
          <span className="bg-primary text-white text-[12px] font-semibold uppercase tracking-wider px-4 py-2 rounded-full group-hover:bg-opacity-90 transition-all">
            Xem chi tiết
          </span>
        </div>
      </div>
    </Link>
  );
}

// ==================== MAIN PAGE ====================
function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("Tất cả");
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilter, setShowFilter] = useState(false);

  const PAGE_SIZE = 9;

  // Fetch products
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("size", PAGE_SIZE.toString());
    if (search) params.append("search", search);
    if (selectedCollection !== "Tất cả") params.append("collection", selectedCollection);
    if (selectedPriceRange.max !== 999999 || selectedPriceRange.min !== 0) {
      params.append("minPrice", selectedPriceRange.min.toString());
      params.append("maxPrice", selectedPriceRange.max.toString());
    }

    fetch(`http://localhost:8080/api/products?${params.toString()}`)
      .then(res => res.json())
      .then((data: PageResponse) => {
        setProducts(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search, selectedCollection, selectedPriceRange, currentPage]);

  // Reset page khi đổi filter
  const handleCollectionChange = (col: string) => {
    setSelectedCollection(col);
    setCurrentPage(0);
  };

  const handlePriceChange = (range: typeof PRICE_RANGES[0]) => {
    setSelectedPriceRange(range);
    setCurrentPage(0);
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSearchInput("");
    setSelectedCollection("Tất cả");
    setSelectedPriceRange(PRICE_RANGES[0]);
    setCurrentPage(0);
  };

  const hasActiveFilters = search || selectedCollection !== "Tất cả" || selectedPriceRange.min !== 0 || selectedPriceRange.max !== 999999;

  return (
    <main className="mt-24 mb-20 bg-bg-main min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-[1200px] mx-auto px-5 py-10">
          <span className="text-primary text-[12px] uppercase tracking-[2px] font-medium">The Signature Collection</span>
          <h1 className="font-lora text-[40px] mt-2 text-text-dark">Thực Đơn Của Chúng Tôi</h1>
          <p className="text-text-light mt-2 text-[14px]">
            Khám phá {totalElements} loại bánh thủ công tinh tế
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 py-8">
        <div className="flex gap-8">

          {/* ===== SIDEBAR FILTER ===== */}
          <aside className={`
            w-64 flex-shrink-0
            ${showFilter ? "block" : "hidden"} md:block
          `}>
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
              {/* Header filter */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-lora text-[18px] font-semibold">Bộ lọc</h3>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-[12px] text-primary hover:underline flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faTimes} size="xs" />
                    Xóa tất cả
                  </button>
                )}
              </div>

              {/* Lọc theo Collection */}
              <div className="mb-6">
                <h4 className="text-[13px] font-semibold uppercase tracking-wider text-text-dark mb-3">
                  Danh mục
                </h4>
                <div className="space-y-2">
                  {COLLECTIONS.map(col => (
                    <button
                      key={col}
                      onClick={() => handleCollectionChange(col)}
                      className={`w-full text-left text-[13px] px-3 py-2 rounded-lg transition-all ${
                        selectedCollection === col
                          ? "bg-primary text-white font-medium"
                          : "text-text-light hover:bg-bg-surface hover:text-text-dark"
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lọc theo giá */}
              <div>
                <h4 className="text-[13px] font-semibold uppercase tracking-wider text-text-dark mb-3">
                  Khoảng giá
                </h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map(range => (
                    <button
                      key={range.label}
                      onClick={() => handlePriceChange(range)}
                      className={`w-full text-left text-[13px] px-3 py-2 rounded-lg transition-all ${
                        selectedPriceRange.label === range.label
                          ? "bg-primary text-white font-medium"
                          : "text-text-light hover:bg-bg-surface hover:text-text-dark"
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
          <div className="flex-1">

            {/* Thanh tìm kiếm + nút filter mobile */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 flex items-center bg-white rounded-full px-4 py-3 shadow-sm border border-gray-100">
                <FontAwesomeIcon icon={faSearch} className="text-text-light mr-3" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bánh..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  className="flex-1 outline-none text-[14px] text-text-dark bg-transparent"
                />
                {searchInput && (
                  <button onClick={() => { setSearchInput(""); setSearch(""); }} className="text-text-light hover:text-primary ml-2">
                    <FontAwesomeIcon icon={faTimes} size="xs" />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="bg-primary text-white px-6 rounded-full text-[13px] font-semibold hover:bg-opacity-90 transition-all"
              >
                Tìm
              </button>
              {/* Nút filter mobile */}
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="md:hidden bg-white border border-gray-100 px-4 rounded-full shadow-sm"
              >
                <FontAwesomeIcon icon={faFilter} className="text-primary" />
              </button>
            </div>

            {/* Kết quả tìm kiếm info */}
            {hasActiveFilters && (
              <div className="mb-4 text-[13px] text-text-light">
                Tìm thấy <span className="font-semibold text-text-dark">{totalElements}</span> sản phẩm
                {search && <> cho "<span className="text-primary font-medium">{search}</span>"</>}
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-text-light text-[16px]">Không tìm thấy sản phẩm nào.</p>
                <button onClick={handleClearFilters} className="mt-4 text-primary underline text-[14px]">
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 rounded-full text-[13px] border border-gray-200 disabled:opacity-40 hover:border-primary hover:text-primary transition-all"
                >
                  ← Trước
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-9 h-9 rounded-full text-[13px] font-medium transition-all ${
                      currentPage === i
                        ? "bg-primary text-white"
                        : "border border-gray-200 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-4 py-2 rounded-full text-[13px] border border-gray-200 disabled:opacity-40 hover:border-primary hover:text-primary transition-all"
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

export default ProductListPage;