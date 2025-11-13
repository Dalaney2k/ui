import React, { useState, useEffect } from "react";
import { Star, Quote, MapPin } from "lucide-react";

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Thị Mai",
      location: "Hà Nội",
      rating: 5,
      comment:
        "Sản phẩm chất lượng tuyệt vời, đúng như mô tả. Giao hàng nhanh chóng, đóng gói cẩn thận. Tôi sẽ tiếp tục ủng hộ shop!",
      avatar: "/api/placeholder/80/80",
      product: "Kem chống nắng Shiseido",
    },
    {
      id: 2,
      name: "Trần Văn Đức",
      location: "TP.HCM",
      rating: 5,
      comment:
        "Lần đầu mua hàng Nhật qua mạng, ban đầu còn lo lắng nhưng nhận được hàng thì rất hài lòng. Sản phẩm authentic 100%.",
      avatar: "/api/placeholder/80/80",
      product: "Máy cạo râu Panasonic",
    },
    {
      id: 3,
      name: "Lê Thị Hồng",
      location: "Đà Nẵng",
      rating: 5,
      comment:
        "Shop tư vấn rất nhiệt tình, sản phẩm đa dạng. Đặc biệt là có nhiều sản phẩm limited edition khó tìm ở nơi khác.",
      avatar: "/api/placeholder/80/80",
      product: "Set mỹ phẩm SK-II",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 via-white to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Hơn 1000+ khách hàng hài lòng với chất lượng sản phẩm và dịch vụ
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <Quote className="w-16 h-16 text-red-200 mx-auto mb-6" />

            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map(
                  (_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 text-yellow-400 fill-current"
                    />
                  )
                )}
              </div>

              <p className="text-xl text-gray-700 italic mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].comment}"
              </p>

              <div className="flex items-center justify-center space-x-4">
                <img
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full border-4 border-red-100"
                />
                <div className="text-left">
                  <h4 className="font-bold text-gray-800">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-gray-500 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {testimonials[currentTestimonial].location}
                  </p>
                  <p className="text-sm text-red-500 font-medium">
                    Đã mua: {testimonials[currentTestimonial].product}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentTestimonial ? "bg-red-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
