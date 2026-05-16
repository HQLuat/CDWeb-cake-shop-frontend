import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faStar, 
  faTruckFast, 
  faCheckCircle, 
  faMinus, 
  faPlus,
  faLeaf
} from "@fortawesome/free-solid-svg-icons";
import { bake1 } from "../../assets/homePage"; 

function ProductDetail() {
  const [quantity, setQuantity] = useState(1);

  const product = {
    name: "Red Velvet Muse Cake",
    price: 45.00,
    rating: 5,
    reviews: 128,
    description: "Chiếc bánh Red Velvet đặc trưng của chúng tôi mang đến trải nghiệm vị giác khó quên. Với kết cấu mềm mịn như nhung, kết hợp cùng lớp kem cheese tươi mát và một chút hương cacao nhẹ nhàng, đây chính là hiện thân của sự tinh tế và ngọt ngào.",
    ingredients: ["Bơ hữu cơ AOP", "Bột mì thượng hạng", "Phô mai tươi", "Trứng gà thả vườn"],
    shipping: "Giao hàng nhanh trong 2h tại nội thành"
  };

  return (
    <main className="mt-28 mb-20">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* 1. Hình ảnh sản phẩm (Bên trái) */}
          <div className="w-full md:w-1/2">
            <div className="sticky top-28">
              <div className="rounded-2xl overflow-hidden shadow-lg bg-bg-surface">
                <img 
                  src={bake1} 
                  alt={product.name} 
                  className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Ảnh nhỏ phụ (Thumbnails) */}
              <div className="flex gap-4 mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-20 h-20 border-2 border-primary rounded-lg overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-all">
                    <img src={bake1} alt="thumb" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Thông tin sản commerce (Bên phải) */}
          <div className="w-full md:w-1/2">
            <span className="text-primary font-medium uppercase tracking-widest text-xs">Signature Collection</span>
            <h1 className="font-lora text-4xl mt-2 mb-4 text-text-dark">{product.name}</h1>
            
            {/* Đánh giá */}
            <div className="flex items-center gap-2 mb-6">
              <div className="text-yellow-500 text-sm">
                {[...Array(product.rating)].map((_, i) => <FontAwesomeIcon key={i} icon={faStar} />)}
              </div>
              <span className="text-text-light text-sm">({product.reviews} đánh giá từ khách hàng)</span>
            </div>

            {/* Giá */}
            <div className="text-3xl font-semibold text-primary mb-6">
              ${(product.price * quantity).toFixed(2)}
            </div>

            {/* Mô tả ngắn */}
            <p className="text-text-light leading-relaxed mb-8 border-b pb-8">
              {product.description}
            </p>

            {/* Lựa chọn số lượng */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center border border-gray-200 rounded-full px-4 py-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-text-light hover:text-primary p-2"
                >
                  <FontAwesomeIcon icon={faMinus} size="xs" />
                </button>
                <span className="px-6 font-semibold w-12 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-text-light hover:text-primary p-2"
                >
                  <FontAwesomeIcon icon={faPlus} size="xs" />
                </button>
              </div>
              <button className="flex-1 bg-primary text-white py-4 rounded-full font-semibold uppercase tracking-wider hover:bg-opacity-90 transition-all shadow-lg active:scale-95">
                Thêm vào giỏ hàng
              </button>
            </div>

            {/* Thông tin thêm */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-3 text-sm text-text-dark">
                <FontAwesomeIcon icon={faTruckFast} className="text-primary" />
                <span>{product.shipping}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-dark">
                <FontAwesomeIcon icon={faLeaf} className="text-green-600" />
                <span>Thành phần: {product.ingredients.join(", ")}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-dark">
                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500" />
                <span>Đảm bảo bánh tươi mới nướng trong ngày</span>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Phần Tabs (Mô tả chi tiết / Đánh giá) */}
        <div className="mt-20">
          <div className="flex border-b gap-10 mb-8">
            <button className="border-b-2 border-primary pb-2 font-lora font-semibold">Mô tả chi tiết</button>
            <button className="text-text-light pb-2 font-lora hover:text-primary transition-colors">Hướng dẫn bảo quản</button>
          </div>
          <div className="text-text-light leading-loose max-w-3xl">
            <p className="mb-4">
              Mỗi chiếc bánh <strong>Red Velvet Muse</strong> là một tác phẩm nghệ thuật thủ công. Chúng tôi sử dụng phương pháp trộn bột truyền thống để giữ được độ ẩm tự nhiên, kết hợp với màu đỏ chiết xuất từ củ dền hữu cơ, không sử dụng phẩm màu độc hại.
            </p>
            <p>
              Lớp kem Cream Cheese được đánh bông mịn với bơ Pháp AOP, tạo nên vị chua nhẹ cân bằng hoàn hảo với độ ngọt của cốt bánh. Đây là lựa chọn lý tưởng cho các buổi tiệc kỷ niệm, quà tặng hoặc đơn giản là một buổi trà chiều sang trọng.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetail;