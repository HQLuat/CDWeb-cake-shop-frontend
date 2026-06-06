import { useState, useEffect, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faEdit, faTrashAlt, faFilter,
  faTimes, faSpinner, faCheck, faImage, faChevronDown,
  faUpload, faArrowLeft, faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../api/axiosClient";

// ==================== TYPES ====================
interface ImageEntry {
  url: string;
  publicId: string | null;
  uploading?: boolean;   // đang upload
  error?: string;        // lỗi upload
  localPreview?: string; // blob URL tạm
  isExisting?: boolean;  // ảnh đã có sẵn từ trước (đã lưu DB)
}

interface ProductForm {
  name: string;
  price: string;
  description: string;
  detailDescription: string;
  storageGuide: string;
  collection: string;
  shippingInfo: string;
  ingredients: string;
  freshGuarantee: boolean;
  images: ImageEntry[];
}

interface AdminProductItem {
  id: number;
  name: string;
  price: number;
  currentPrice: number;
  discountPercent: number | null;
  description: string;
  detailDescription: string;
  storageGuide: string;
  collection: string;
  shippingInfo: string;
  ingredients: string[];
  freshGuarantee: boolean;
  averageRating: number;
  totalReviews: number;
  imageUrls: string[];
  images?: { imageUrl: string; cloudinaryPublicId: string | null; sortOrder: number }[];
}

interface PageResponse {
  content: AdminProductItem[];
  totalElements: number;
  totalPages: number;
  number: number;
}

// ==================== CONSTANTS ====================
const COLLECTIONS = [
  "Signature Collection", "Premium Collection", "French Patisserie Collection",
  "Japanese Collection", "Italian Collection", "Artisan Bread Collection",
  "Classic Collection", "Seasonal Collection",
];

const EMPTY_FORM: ProductForm = {
  name: "", price: "", description: "", detailDescription: "",
  storageGuide: "", collection: "Signature Collection",
  shippingInfo: "Giao hàng nhanh trong 2h tại nội thành",
  ingredients: "", freshGuarantee: true, images: [],
};

const fmtVND = (v: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

// ==================== IMAGE UPLOAD GRID ====================
function ImageUploadGrid({
  images,
  onChange,
  onUploadSuccess,
  onImageRemoved,
}: {
  images: ImageEntry[];
  onChange: (images: ImageEntry[] | ((prev: ImageEntry[]) => ImageEntry[])) => void;
  onUploadSuccess?: (publicId: string) => void;
  onImageRemoved?: (publicId: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList) => {
    const remaining = 5 - images.length;
    const selected = Array.from(files).slice(0, remaining);
    if (selected.length === 0) return;

    // Thêm placeholder "đang upload"
    const placeholders: ImageEntry[] = selected.map((file) => ({
      url: "",
      publicId: null,
      uploading: true,
      localPreview: URL.createObjectURL(file),
    }));
    const startIndex = images.length;
    onChange([...images, ...placeholders]);

    // Upload từng file song song
    const uploaded = await Promise.all(
      selected.map(async (file, idx) => {
        try {
          const formData = new FormData();
          formData.append("file", file);
          const res = await axiosClient.post<{ url: string; publicId: string }>(
            "/admin/products/upload-image",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          if (res.data.publicId && onUploadSuccess) {
            onUploadSuccess(res.data.publicId);
          }
          return { url: res.data.url, publicId: res.data.publicId, uploading: false } as ImageEntry;
        } catch {
          return {
            url: "",
            publicId: null,
            uploading: false,
            error: "Upload thất bại",
            localPreview: placeholders[idx].localPreview,
          } as ImageEntry;
        }
      })
    );

    // Thay thế placeholder bằng kết quả thật
    onChange((prev: ImageEntry[]) => {
      const next = [...prev];
      uploaded.forEach((entry, i) => {
        next[startIndex + i] = entry;
      });
      return next;
    });
  };

  const removeImage = async (idx: number) => {
    const img = images[idx];
    if (!img.isExisting && img.publicId) {
      try {
        await axiosClient.delete(`/admin/products/delete-image?publicId=${img.publicId}`);
        if (onImageRemoved) {
          onImageRemoved(img.publicId);
        }
      } catch (err) {
        console.error("Lỗi khi xóa ảnh trên Cloudinary:", err);
      }
    }
    const next = [...images];
    if (next[idx].localPreview) URL.revokeObjectURL(next[idx].localPreview!);
    next.splice(idx, 1);
    onChange(next);
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };

  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
        <FontAwesomeIcon icon={faImage} className="mr-1.5" />
        Ảnh sản phẩm
        <span className="ml-2 font-normal normal-case text-gray-300">(tối đa 5 ảnh · ảnh đầu = ảnh chính)</span>
      </label>

      <div className="grid grid-cols-5 gap-2">
        {images.map((img, i) => (
          <div
            key={i}
            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
              i === 0 ? "border-primary/60 ring-2 ring-primary/20" : "border-gray-200"
            }`}
          >
            {/* Preview */}
            {img.uploading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-primary text-lg" />
              </div>
            ) : img.error ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 p-1">
                <span className="text-red-400 text-[10px] text-center">{img.error}</span>
              </div>
            ) : (
              <img
                src={img.url || img.localPreview}
                alt={`Ảnh ${i + 1}`}
                className="w-full h-full object-cover"
              />
            )}

            {/* Badge ảnh chính */}
            {i === 0 && !img.uploading && !img.error && (
              <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[9px] font-bold text-center py-0.5">
                Ảnh chính
              </span>
            )}

            {/* Controls */}
            {!img.uploading && (
              <div className="absolute top-1 right-1 flex gap-1">
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} style={{ fontSize: "8px" }} />
                </button>
              </div>
            )}

            {/* Move left / right */}
            {!img.uploading && images.length > 1 && (
              <div className="absolute bottom-5 left-0 right-0 flex justify-between px-0.5">
                {i > 0 ? (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i - 1)}
                    className="w-5 h-5 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: "8px" }} />
                  </button>
                ) : <span />}
                {i < images.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i + 1)}
                    className="w-5 h-5 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
                  >
                    <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: "8px" }} />
                  </button>
                ) : <span />}
              </div>
            )}
          </div>
        ))}

        {/* Add slot */}
        {images.length < 5 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 hover:border-primary/50 hover:bg-primary/5 transition-all text-gray-400 hover:text-primary"
          >
            <FontAwesomeIcon icon={faUpload} className="text-lg" />
            <span className="text-[10px] font-medium">Thêm ảnh</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
      />

      {images.length === 0 && (
        <p className="mt-2 text-[11px] text-gray-400">
          Click ô "Thêm ảnh" hoặc kéo thả file ảnh vào đây.
        </p>
      )}
    </div>
  );
}

// ==================== MODAL COMPONENT ====================
function ProductModal({
  mode, initial, onClose, onSaved,
}: {
  mode: "create" | "edit";
  initial?: AdminProductItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const uploadedNewPublicIds = useRef<Set<string>>(new Set());
  const isSaved = useRef(false);

  const [form, setForm] = useState<ProductForm>(() => {
    if (mode === "edit" && initial) {
      // Ưu tiên dùng images (có publicId), fallback về imageUrls
      const images: ImageEntry[] = initial.images?.length
        ? initial.images
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((img) => ({
              url: img.imageUrl,
              publicId: img.cloudinaryPublicId,
              isExisting: true,
            }))
        : (initial.imageUrls || []).map((url) => ({ url, publicId: null, isExisting: true }));

      return {
        name: initial.name,
        price: String(initial.price),
        description: initial.description,
        detailDescription: initial.detailDescription || "",
        storageGuide: initial.storageGuide || "",
        collection: initial.collection,
        shippingInfo: initial.shippingInfo || "",
        ingredients: initial.ingredients?.join(", ") || "",
        freshGuarantee: initial.freshGuarantee ?? true,
        images,
      };
    }
    return EMPTY_FORM;
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (!isSaved.current && uploadedNewPublicIds.current.size > 0) {
        const pidsToDelete = Array.from(uploadedNewPublicIds.current);
        pidsToDelete.forEach(async (pid) => {
          try {
            await axiosClient.delete(`/admin/products/delete-image?publicId=${pid}`);
          } catch (err) {
            console.error(`Lỗi khi dọn dẹp ảnh tạm ${pid} trên Cloudinary:`, err);
          }
        });
      }
    };
  }, []);

  const set = <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K] | ((prev: ProductForm[K]) => ProductForm[K])
  ) =>
    setForm((f) => ({
      ...f,
      [field]: typeof value === "function" ? (value as any)(f[field]) : value,
    }));

  const hasUploadingImages = form.images.some((img) => img.uploading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;
    if (hasUploadingImages) {
      setError("Vui lòng đợi ảnh upload xong trước khi lưu.");
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      price: parseFloat(form.price),
      description: form.description.trim(),
      detailDescription: form.detailDescription.trim(),
      storageGuide: form.storageGuide.trim(),
      collection: form.collection,
      shippingInfo: form.shippingInfo.trim(),
      ingredients: form.ingredients.trim(),
      freshGuarantee: form.freshGuarantee,
      images: form.images
        .filter((img) => img.url && !img.error)
        .map((img) => ({ url: img.url, publicId: img.publicId ?? "" })),
    };

    try {
      if (mode === "create") {
        await axiosClient.post("/admin/products", payload);
      } else {
        await axiosClient.put(`/admin/products/${initial!.id}`, payload);
      }
      isSaved.current = true;
      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg || "Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-lora text-xl font-bold text-gray-800">
            {mode === "create" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100 transition-all">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          {/* Tên + Giá */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                Tên sản phẩm *
              </label>
              <input
                type="text" required value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="VD: Red Velvet Muse Cake"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                Giá (VND) *
              </label>
              <input
                type="number" required min="0" step="1" value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="VD: 45000 (= 45.000đ)"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Collection */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              Danh mục
            </label>
            <div className="relative">
              <select
                value={form.collection}
                onChange={(e) => set("collection", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary/50 appearance-none bg-white"
              >
                {COLLECTIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
              <FontAwesomeIcon icon={faChevronDown} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>
          </div>

          {/* Mô tả ngắn */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              Mô tả ngắn
            </label>
            <textarea
              rows={2} value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Mô tả ngắn gọn về sản phẩm..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all resize-none"
            />
          </div>

          {/* Mô tả chi tiết */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              Mô tả chi tiết
            </label>
            <textarea
              rows={3} value={form.detailDescription}
              onChange={(e) => set("detailDescription", e.target.value)}
              placeholder="Nội dung tab 'Mô tả chi tiết' trong trang sản phẩm..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all resize-none"
            />
          </div>

          {/* Bảo quản + Vận chuyển */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                Hướng dẫn bảo quản
              </label>
              <textarea
                rows={2} value={form.storageGuide}
                onChange={(e) => set("storageGuide", e.target.value)}
                placeholder="VD: Bảo quản ngăn mát..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary/50 transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                Thông tin vận chuyển
              </label>
              <textarea
                rows={2} value={form.shippingInfo}
                onChange={(e) => set("shippingInfo", e.target.value)}
                placeholder="VD: Giao hàng trong 2h..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary/50 transition-all resize-none"
              />
            </div>
          </div>

          {/* Thành phần */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              Thành phần (cách nhau bởi dấu phẩy)
            </label>
            <input
              type="text" value={form.ingredients}
              onChange={(e) => set("ingredients", e.target.value)}
              placeholder="VD: Bơ hữu cơ, Bột mì, Trứng gà..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary/50 transition-all"
            />
          </div>

          {/* Ảnh sản phẩm — Upload Grid */}
          <ImageUploadGrid
            images={form.images}
            onChange={(imgs) => set("images", imgs)}
            onUploadSuccess={(pid) => uploadedNewPublicIds.current.add(pid)}
            onImageRemoved={(pid) => uploadedNewPublicIds.current.delete(pid)}
          />

          {/* Tươi nguyên chất */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => set("freshGuarantee", !form.freshGuarantee)}
              className={`w-10 h-5 rounded-full transition-colors relative ${form.freshGuarantee ? "bg-primary" : "bg-gray-200"}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.freshGuarantee ? "left-5" : "left-0.5"}`} />
            </div>
            <span className="text-sm text-gray-600">Đảm bảo bánh tươi nướng trong ngày</span>
          </label>

          {/* Footer */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-all">
              Hủy
            </button>
            <button type="submit" disabled={saving || hasUploadingImages}
              className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-[#7a0001] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {saving
                ? <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Đang lưu...</>
                : hasUploadingImages
                  ? <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Đang upload ảnh...</>
                  : <><FontAwesomeIcon icon={faCheck} /> {mode === "create" ? "Thêm sản phẩm" : "Lưu thay đổi"}</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function AdminProductManagement() {
  const [products, setProducts] = useState<AdminProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination + filter
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Modal state
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingProduct, setEditingProduct] = useState<AdminProductItem | undefined>();

  // Delete confirm
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        size: "10",
        search: searchTerm,
        collection: selectedCollection !== "Tất cả" ? selectedCollection : "",
        minPrice: "0",
        maxPrice: "999999",
      });
      const res = await axiosClient.get<PageResponse>(`/products?${params}`);
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch {
      setError("Không thể tải danh sách sản phẩm.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, selectedCollection]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(0);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await axiosClient.delete(`/admin/products/${id}`);
      setDeleteConfirmId(null);
      loadProducts();
    } catch {
      alert("Xóa thất bại. Vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Modal */}
      {modalMode && (
        <ProductModal
          mode={modalMode}
          initial={editingProduct}
          onClose={() => { setModalMode(null); setEditingProduct(undefined); }}
          onSaved={loadProducts}
        />
      )}

      {/* Delete confirm dialog */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="font-lora text-lg font-bold text-gray-800 mb-2">Xóa sản phẩm?</h3>
            <p className="text-sm text-gray-500 mb-5">Hành động này không thể hoàn tác. Ảnh sản phẩm sẽ bị xóa khỏi Cloudinary.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-all">
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deletingId === deleteConfirmId}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {deletingId === deleteConfirmId
                  ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  : "Xóa"
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-lora">Quản Lý Sản Phẩm</h1>
          <p className="text-sm text-gray-500">
            {isLoading ? "Đang tải..." : `${totalElements} sản phẩm trong hệ thống`}
          </p>
        </div>
        <button
          onClick={() => { setEditingProduct(undefined); setModalMode("create"); }}
          className="bg-primary hover:bg-[#7a0001] text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all">
          <FontAwesomeIcon icon={faPlus} /> Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 gap-3">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400 shrink-0" />
          <input
            type="text" placeholder="Tìm tên sản phẩm..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full bg-transparent outline-none text-sm text-gray-700"
          />
          {searchInput && (
            <button onClick={() => { setSearchInput(""); setSearchTerm(""); setCurrentPage(0); }}
              className="text-gray-400 hover:text-gray-700">
              <FontAwesomeIcon icon={faTimes} size="xs" />
            </button>
          )}
        </div>
        <button onClick={handleSearch}
          className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#7a0001] transition-all">
          Tìm
        </button>
        {/* Collection filter */}
        <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 min-w-[200px] gap-2 relative">
          <FontAwesomeIcon icon={faFilter} className="text-gray-400 text-xs shrink-0" />
          <select
            value={selectedCollection}
            onChange={(e) => { setSelectedCollection(e.target.value); setCurrentPage(0); }}
            className="w-full bg-transparent outline-none text-sm text-gray-700 cursor-pointer appearance-none">
            <option>Tất cả</option>
            {COLLECTIONS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <FontAwesomeIcon icon={faChevronDown} className="text-gray-400 text-xs pointer-events-none shrink-0" />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl text-center">
          {error}
          <button onClick={loadProducts} className="ml-2 underline font-semibold">Thử lại</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-primary mb-3 block mx-auto" />
            <p className="text-sm text-gray-400">Đang tải sản phẩm...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <div className="text-4xl mb-3">🧁</div>
            <p className="text-sm">Không tìm thấy sản phẩm nào.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-4 px-5">Sản phẩm</th>
                  <th className="py-4 px-5">Danh mục</th>
                  <th className="py-4 px-5">Giá gốc</th>
                  <th className="py-4 px-5">Giá hiện tại</th>
                  <th className="py-4 px-5">Đánh giá</th>
                  <th className="py-4 px-5 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {products.map((product) => {
                  const hasDiscount = product.discountPercent != null && product.discountPercent > 0;
                  return (
                    <tr key={product.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Product */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrls?.[0] || "https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=100"}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=100"; }}
                          />
                          <div>
                            <p className="font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">ID #{product.id}</p>
                          </div>
                        </div>
                      </td>
                      {/* Collection */}
                      <td className="py-4 px-5">
                        <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                          {product.collection}
                        </span>
                      </td>
                      {/* Original price */}
                      <td className="py-4 px-5 font-medium text-gray-700">
                        {fmtVND(product.price)}
                      </td>
                      {/* Current price */}
                      <td className="py-4 px-5">
                        {hasDiscount ? (
                          <div>
                            <p className="font-bold text-red-500">{fmtVND(product.currentPrice)}</p>
                            <p className="text-[11px] text-gray-400">
                              <span className="bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full font-semibold">
                                -{product.discountPercent}%
                              </span>
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-500">{fmtVND(product.price)}</span>
                        )}
                      </td>
                      {/* Rating */}
                      <td className="py-4 px-5">
                        <span className="text-amber-500 font-semibold text-sm">
                          ★ {product.averageRating?.toFixed(1) ?? "0.0"}
                        </span>
                        <span className="text-gray-400 text-xs ml-1">({product.totalReviews})</span>
                      </td>
                      {/* Actions */}
                      <td className="py-4 px-5">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => { setEditingProduct(product); setModalMode("edit"); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors text-xs font-semibold border border-blue-100">
                            <FontAwesomeIcon icon={faEdit} /> Sửa
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-xs font-semibold border border-red-100">
                            <FontAwesomeIcon icon={faTrashAlt} /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 rounded-xl text-sm border border-gray-200 bg-white disabled:opacity-30 hover:border-primary hover:text-primary transition-all">
            ← Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setCurrentPage(i)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                currentPage === i ? "bg-primary text-white" : "bg-white border border-gray-200 hover:border-primary hover:text-primary"
              }`}>
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 rounded-xl text-sm border border-gray-200 bg-white disabled:opacity-30 hover:border-primary hover:text-primary transition-all">
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}