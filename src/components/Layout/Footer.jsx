import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => (
  <footer className="bg-gray-900 text-white pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
        {/* Company info */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">Sakura Home</span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Địa chỉ tin cậy hàng đầu về đồ gia dụng Nhật Bản chính hãng tại Việt
            Nam. Chất lượng - Uy tín - Dịch vụ tận tâm.
          </p>
          <div className="flex space-x-4">
            <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300">
              <span className="text-sm font-bold">f</span>
            </button>
            <button className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-300">
              <span className="text-sm font-bold">yt</span>
            </button>
            <button className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors duration-300">
              <span className="text-sm font-bold">ig</span>
            </button>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-lg font-semibold mb-6 text-red-400">
            Liên Kết Nhanh
          </h4>
          <div className="space-y-3">
            {[
              "Về Chúng Tôi",
              "Sản Phẩm",
              "Tin Tức",
              "Liên Hệ",
              "Tuyển Dụng",
            ].map((link, index) => (
              <a
                key={index}
                href="#"
                className="block text-gray-400 hover:text-white transition-colors duration-300"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Customer care */}
        <div>
          <h4 className="text-lg font-semibold mb-6 text-red-400">
            Chăm Sóc Khách Hàng
          </h4>
          <div className="space-y-3">
            {[
              "Hướng Dẫn Mua Hàng",
              "Chính Sách Đổi Trả",
              "Câu Hỏi Thường Gặp",
              "Bảo Mật Thông Tin",
              "Phương Thức Thanh Toán",
            ].map((link, index) => (
              <a
                key={index}
                href="#"
                className="block text-gray-400 hover:text-white transition-colors duration-300"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-lg font-semibold mb-6 text-red-400">
            Thông Tin Liên Hệ
          </h4>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
              <span className="text-gray-400">
                Tầng KT tòa CT1A Mễ Trì Plaza, Nam Từ Liêm, Hà Nội
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-gray-400">1900-1234</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-gray-400">info@sakurahome.vn</span>
            </div>
          </div>

          {/* Business hours */}
          <div className="mt-6 p-4 bg-gradient-to-r from-red-900/20 to-pink-900/20 rounded-xl border border-red-800/30">
            <h5 className="font-semibold text-red-400 mb-2">Giờ Làm Việc</h5>
            <p className="text-sm text-gray-400">
              T2-T6: 8:00 - 18:00
              <br />
              T7-CN: 9:00 - 17:00
            </p>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-gray-800 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            © 2025 Sakura Home. Tất cả quyền được bảo lưu.
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Điều Khoản Sử Dụng
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Chính Sách Bảo Mật
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </div>
    {/* Custom CSS for footer effects */}
    <style jsx>{`
      .bg-gradient-to-r {
        background-image: linear-gradient(to right, var(--tw-gradient-stops));
      }
      .hover\\:bg-blue-700:hover {
        background-color: #1d4ed8;
      }
      .hover\\:bg-red-700:hover {
        background-color: #b91c1c;
      }
      .hover\\:bg-pink-700:hover {
        background-color: #db2777;
      }
      .transition-colors {
        transition-property: color, background-color, border-color,
          text-decoration-color, fill, stroke;
      }
      .duration-300 {
        transition-duration: 300ms;
      }
    `}</style>
  </footer>
);

export default Footer;
