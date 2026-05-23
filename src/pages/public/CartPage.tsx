import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPlus, faMinus, faArrowLeft, faTicketAlt, faShoppingBag } from "@fortawesome/free-solid-svg-icons";

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  maxStock: number;
}

function CartPage() {
  // Dữ liệu mẫu giỏ hàng
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "The Signature Sourdough",
      category: "Artisan Bread Collection",
      price: 140000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=200",
      maxStock: 5,
    },
    {
      id: 3,
      name: "Chocolate Fudge Cheesecake",
      category: "Premium Collection",
      price: 450000,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=200",
      maxStock: 3,
    },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0); // Số tiền được giảm

  // Tăng / Giảm số lượng
  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty > item.maxStock) {
            alert(`Sản phẩm này chỉ còn tối đa ${item.maxStock} sản phẩm trong kho.`);
            return item;
          }
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  // Xóa sản phẩm khỏi giỏ
  const removeItem = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?")) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // Áp dụng mã giảm giá giả lập
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "VELVETMUSE") {
      setDiscount(50000); // Giảm 50k
      alert("Áp dụng mã giảm giá thành công!");
    } else {
      alert("Mã giảm giá không hợp lệ.");
    }
  };

  // Tính toán tiền bạc
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal > 500000 || subtotal === 0 ? 0 : 30000; // Freeship đơn trên 500k
  const total = Math.max(0, subtotal + shippingFee - discount);

  // Giao diện khi giỏ hàng trống trống
  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen pt-28 md:pt-32 pb-12 px-4 md:px-8 lg:px-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-5 text-2xl shadow-inner">
          <FontAwesomeIcon icon={faShoppingBag} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 font-lora mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-sm text-gray-500 mb-6 text-center max-w-xs">Hãy lấp đầy giỏ hàng bằng những mẻ bánh thơm ngon nóng hổi ngay nhé!</p>
        <Link to="/products" className="bg-primary hover:bg-opacity-90 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md transition-all">
          Quay lại Cửa hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-28 md:pt-32 pb-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        
        {/* Tiêu đề & Tiến trình đặt hàng */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-lora">Giỏ Hàng Của Bạn</h1>
            <p className="text-sm text-gray-500 mt-1">Kiểm tra lại danh sách bánh trước khi tiến hành thanh toán.</p>
          </div>
          {/* Thanh quy trình mua sắm */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <span className="text-primary font-bold">1. Giỏ hàng</span>
            <span className="text-gray-300">➔</span>
            <span className="text-gray-400">2. Đặt hàng</span>
            <span className="text-gray-300">➔</span>
            <span className="text-gray-400">3. Hoàn thành</span>
          </div>
        </div>

        {/* Nội dung chính: Cột Sản phẩm và Cột Tóm tắt hóa đơn */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cột danh sách sản phẩm (Bên trái) */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-4 md:gap-6 items-center relative group transition-all hover:shadow-md">
                
                {/* Ảnh sản phẩm */}
                <img src={item.image} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                
                {/* Thông tin sản phẩm */}
                <div className="flex-1 min-w-0 pr-6">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block mb-0.5">{item.category}</span>
                  <h3 className="text-sm md:text-base font-bold text-gray-800 truncate">{item.name}</h3>
                  <p className="text-sm font-semibold text-primary mt-1">{(item.price).toLocaleString("vi-VN")}đ</p>
                  
                  {/* Bộ điều khiển số lượng tăng giảm */}
                  <div className="flex items-center gap-1.5 border border-gray-200 w-max rounded-lg bg-gray-50 p-0.5 mt-3">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <FontAwesomeIcon icon={faMinus} size="xs" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-gray-800">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      <FontAwesomeIcon icon={faPlus} size="xs" />
                    </button>
                  </div>
                </div>

                {/* Tổng tiền của 1 loại bánh & Nút xóa */}
                <div className="text-right flex flex-col justify-between items-end h-20 md:h-24 py-1">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                    title="Xóa sản phẩm"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} size="sm" />
                  </button>
                  <p className="text-sm md:text-base font-bold text-gray-800">
                    {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            ))}

            {/* Nút quay lại mua hàng */}
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors pt-2">
              <FontAwesomeIcon icon={faArrowLeft} size="xs" /> Tiếp tục mua bánh
            </Link>
          </div>

          {/* Cột Tổng kết và Thanh toán (Bên phải) */}
          <div className="space-y-6">
            
            {/* Hộp áp dụng mã giảm giá */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faTicketAlt} className="text-gray-400" /> Mã Giảm Giá
              </h3>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã (Ví dụ: VELVETMUSE)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary uppercase font-medium tracking-wider"
                />
                <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all">
                  Áp dụng
                </button>
              </form>
            </div>

            {/* Bảng tính chi tiết tổng tiền hóa đơn */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3 font-lora">Tóm Tắt Đơn Hàng</h3>
              
              <div className="space-y-2.5 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-gray-800">{subtotal.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-gray-800">
                    {shippingFee === 0 ? <span className="text-green-600 font-medium">Miễn phí</span> : `${shippingFee.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span className="font-semibold">-{discount.toLocaleString("vi-VN")}đ</span>
                  </div>
                )}
              </div>

              {/* Đường kẻ phân cách */}
              <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-800">Tổng thanh toán</span>
                <span className="text-xl font-bold text-primary font-lora">{total.toLocaleString("vi-VN")}đ</span>
              </div>

              {/* Nút Checkout tiến tới cổng thanh toán */}
              <button className="w-full bg-primary hover:bg-opacity-90 text-white text-sm font-bold py-3.5 rounded-xl shadow-md shadow-primary/10 transition-all mt-2 tracking-wide uppercase">
                Tiến Hành Đặt Hàng
              </button>

              {/* Thông báo điều kiện phụ */}
              <p className="text-[11px] text-gray-400 text-center mt-2 italic">
                * Miễn phí giao hàng toàn quốc cho hóa đơn trị giá từ 500.000đ trở lên.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default CartPage;