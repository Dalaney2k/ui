import React from "react";
import { ShieldCheck, Truck, Clock } from "lucide-react";

const TrustBadges = () => {
  const badges = [
    {
      icon: ShieldCheck,
      title: "100% Chính Hãng",
      description: "Cam kết sản phẩm authentic từ Nhật Bản",
    },
    {
      icon: Truck,
      title: "Giao Hàng Nhanh",
      description: "Giao hàng toàn quốc trong 2-3 ngày",
    },
    {
      icon: Clock,
      title: "Hỗ Trợ 24/7",
      description: "Luôn sẵn sàng tư vấn và hỗ trợ khách hàng",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-red-500 to-pink-600">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {badges.map((badge, index) => {
            const IconComponent = badge.icon;
            return (
              <div key={index} className="text-center text-white">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{badge.title}</h3>
                <p className="opacity-90">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
