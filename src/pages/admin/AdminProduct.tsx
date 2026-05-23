import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faEdit, faTrashAlt, faFilter } from "@fortawesome/free-solid-svg-icons";

interface AdminProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "Còn hàng" | "Hết hàng";
  image: string;
}

function AdminProductManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  // Dữ liệu mẫu sản phẩm
  const [products, setProducts] = useState<AdminProduct[]>([
    { id: 1, name: "The Signature Sourdough", category: "Artisan Bread Collection", price: 140000, stock: 25, status: "Còn hàng", image: "https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=100" },
    { id: 2, name: "Strawberry Macaron", category: "French Patisserie Collection", price: 75000, stock: 0, status: "Hết hàng", image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=100" },
    { id: 3, name: "Chocolate Fudge Cheesecake", category: "Premium Collection", price: 450000, stock: 12, status: "Còn hàng", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=100" },
  ]);

  const categories = ["Tất cả", "Signature Collection", "Premium Collection", "French Patisserie Collection", "Artisan Bread Collection"];

  // Xóa sản phẩm mẫu
  const handleDelete = (id: number) => {
    if(window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Tiêu đề & Nút Thêm mới */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-lora">Quản Lý Sản Phẩm</h1>
          <p className="text-sm text-gray-500">Thêm, sửa, xóa và kiểm soát số lượng tồn kho của bánh.</p>
        </div>
        <button className="bg-primary hover:bg-opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all">
          <FontAwesomeIcon icon={faPlus} /> Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* Thanh bộ lọc & Tìm kiếm */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Tìm tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-700"
          />
        </div>
        <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 min-w-[200px]">
          <FontAwesomeIcon icon={faFilter} className="text-gray-400 mr-2.5 text-xs" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-700 cursor-pointer"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bảng danh sách sản phẩm */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Sản phẩm</th>
                <th className="py-4 px-6">Danh mục</th>
                <th className="py-4 px-6">Giá bán</th>
                <th className="py-4 px-6">Kho kho</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {products
                .filter(p => selectedCategory === "Tất cả" || p.category === selectedCategory)
                .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-4">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                      <span className="font-semibold text-gray-800">{product.name}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-500">{product.category}</td>
                    <td className="py-4 px-6 font-medium text-gray-800">{product.price.toLocaleString("vi-VN")}đ</td>
                    <td className="py-4 px-6 text-gray-500">{product.stock} cái</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.status === "Còn hàng" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-3">
                        <button className="text-blue-500 hover:text-blue-700 p-1 transition-colors" title="Sửa">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 p-1 transition-colors" title="Xóa">
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminProductManagement;