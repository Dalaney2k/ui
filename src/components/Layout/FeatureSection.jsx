import React from "react";
import { Shield, Zap, Clock, RefreshCw } from "lucide-react";
import { features, stats } from "../../constants/appConstants";

const FeatureSection = () => {
  const getIcon = (iconName) => {
    const iconMap = {
      Shield: Shield,
      Zap: Zap,
      Clock: Clock,
      RefreshCw: RefreshCw,
    };
    const IconComponent = iconMap[iconName];
    return IconComponent ? (
      <IconComponent className="w-10 h-10 text-white" />
    ) : null;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Tại Sao Chọn Sakura Home?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>
              <div className="relative">
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                >
                  {getIcon(feature.icon)}
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
                <div
                  className={`mt-4 h-1 w-12 bg-gradient-to-r ${feature.gradient} rounded-full mx-auto group-hover:w-16 transition-all duration-500`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
