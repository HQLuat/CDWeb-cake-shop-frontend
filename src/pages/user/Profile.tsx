import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faSignOutAlt, faCamera } from '@fortawesome/free-solid-svg-icons';

function Profile() {
  const [user] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0987654321",
    address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
    avatar: "https://meanhanime.edu.vn/wp-content/uploads/2026/02/Anh-bot-bien-nem-bong-bong-xa-phong-ra-ngoai-dong.jpg"
  });

  const [activeTab, setActiveTab] = useState('info');

  const handleLogout = () => {
    alert("Đã đăng xuất!");
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-30 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* SIDERBAR - DIỄN HOẠ THÔNG TIN TÓM TẮT & MENU */}
          <div className="md:col-span-1 bg-white rounded-2xl p-6 shadow-sm h-fit">
            <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
              {/* Avatar */}
              <div className="relative group cursor-pointer mb-4">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#8b0e15]/20"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FontAwesomeIcon icon={faCamera} className="text-white text-sm" />
                </div>
              </div>
              {/* Tên User ở Sidebar - Đã đồng bộ font-lora */}
              <h3 className="font-lora font-semibold text-lg text-gray-800">{user.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{user.email}</p>
            </div>

            {/* Menu Tabs */}
            <nav className="mt-6 space-y-2">
              <button 
                onClick={() => setActiveTab('info')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'info' 
                    ? 'bg-[#8b0e15]/10 text-[#8b0e15]' 
                    : 'text-gray-600 hover:bg-[#8b0e15]/5 hover:text-[#8b0e15]'
                }`}
              >
                <FontAwesomeIcon icon={faUser} className="w-4" />
                Thông tin cá nhân
              </button>

              <button 
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'password' 
                    ? 'bg-[#8b0e15]/10 text-[#8b0e15]' 
                    : 'text-gray-600 hover:bg-[#8b0e15]/5 hover:text-[#8b0e15]'
                }`}
              >
                <FontAwesomeIcon icon={faLock} className="w-4" />
                Đổi mật khẩu
              </button>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-4 border-t border-gray-100 pt-4"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
                Đăng xuất
              </button>
            </nav>
          </div>

          {/* NỘI DUNG CHÍNH (THAY ĐỔI THEO TAB) */}
          <div className="md:col-span-3 bg-white rounded-2xl p-8 shadow-sm">
            
            {/* TAB 1: THÔNG TIN CÁ NHÂN */}
            {activeTab === 'info' && (
              <div>
                {/* Tiêu đề Tab 1 - Đã đồng bộ font-lora */}
                <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-6">Thông tin cá nhân</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Họ và tên</label>
                      <input type="text" defaultValue={user.name} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8b0e15] text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Số điện thoại</label>
                      <input type="text" defaultValue={user.phone} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8b0e15] text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Địa chỉ Email</label>
                    <input type="email" defaultValue={user.email} disabled className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 text-sm cursor-not-allowed" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Địa chỉ giao hàng</label>
                    <input type="text" defaultValue={user.address} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8b0e15] text-sm" />
                  </div>

                  <button type="button" className="px-6 py-3 bg-[#8b0e15] text-white font-medium rounded-xl text-sm hover:opacity-90 transition-opacity shadow-sm">
                    Lưu thay đổi
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: ĐỔI MẬT KHẨU */}
            {activeTab === 'password' && (
              <div>
                {/* Tiêu đề Tab 2 - Đã đồng bộ font-lora */}
                <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-6">Đổi mật khẩu</h2>
                <form className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mật khẩu hiện tại</label>
                    <input type="password" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8b0e15] text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mật khẩu mới</label>
                    <input type="password" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8b0e15] text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Xác nhận mật khẩu mới</label>
                    <input type="password" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8b0e15] text-sm" />
                  </div>
                  <button type="button" className="px-6 py-3 bg-[#8b0e15] text-white font-medium rounded-xl text-sm hover:opacity-90 transition-opacity shadow-sm">
                    Cập nhật mật khẩu
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;