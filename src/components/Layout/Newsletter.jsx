import React, { useState } from "react";
import { Mail } from "lucide-react";

const Newsletter = ({ onSubscribe }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      onSubscribe(email);
      setEmail("");
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
          <Mail className="w-12 h-12 text-red-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">
            Đăng Ký Nhận Tin Khuyến Mãi
          </h3>
          <p className="text-gray-300 mb-8">
            Nhận ngay voucher 10% và cập nhật sản phẩm mới nhất từ Nhật Bản
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-400 transition-colors duration-300"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-xl font-semibold text-white hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
            >
              Đăng Ký
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-4">
            * Chúng tôi cam kết không spam và bảo mật thông tin của bạn
          </p>
        </div>
      </div>
    </section>
  );
};
export default Newsletter;
