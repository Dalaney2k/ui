import React, { useState, useEffect } from "react";
import {
  Heart,
  Shield,
  Truck,
  Award,
  Users,
  MapPin,
  Phone,
  Mail,
  Star,
  CheckCircle,
  Globe,
  Sparkles,
  ArrowRight,
  Play,
  TrendingUp,
  Zap,
  Gift,
} from "lucide-react";

const About = () => {
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax mouse effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      number: "10,000+",
      label: "Khách hàng tin tưởng",
      icon: Users,
      color: "from-blue-500 to-purple-600",
    },
    {
      number: "5,000+",
      label: "Sản phẩm chính hãng",
      icon: Award,
      color: "from-green-500 to-teal-600",
    },
    {
      number: "99.9%",
      label: "Tỷ lệ hài lòng",
      icon: Star,
      color: "from-yellow-500 to-orange-600",
    },
    {
      number: "24/7",
      label: "Hỗ trợ khách hàng",
      icon: Phone,
      color: "from-red-500 to-pink-600",
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "Chính Hãng 100%",
      description:
        "Cam kết tất cả sản phẩm đều được nhập khẩu trực tiếp từ Nhật Bản, có đầy đủ giấy tờ chứng nhận.",
      color: "from-emerald-400 to-cyan-400",
      delay: "0ms",
    },
    {
      icon: Zap,
      title: "Chất Lượng Cao Cấp",
      description:
        "Chúng tôi chỉ lựa chọn những sản phẩm tốt nhất, được kiểm tra kỹ lưỡng trước khi đến tay khách hàng.",
      color: "from-purple-400 to-pink-400",
      delay: "200ms",
    },
    {
      icon: Truck,
      title: "Giao Hàng Nhanh Chóng",
      description:
        "Dịch vụ giao hàng toàn quốc, cam kết giao hàng trong 1-3 ngày làm việc.",
      color: "from-blue-400 to-indigo-400",
      delay: "400ms",
    },
    {
      icon: Gift,
      title: "Dịch Vụ Tận Tâm",
      description:
        "Đội ngũ tư vấn chuyên nghiệp, hỗ trợ khách hàng 24/7 với tất cả sự nhiệt tình.",
      color: "from-orange-400 to-red-400",
      delay: "600ms",
    },
  ];

  const milestones = [
    {
      year: "2018",
      title: "Khởi Đầu Hành Trình",
      description:
        "Sakura Home được thành lập với sứ mệnh mang đến những sản phẩm Nhật Bản chính hãng.",
      icon: Sparkles,
      color: "from-pink-500 to-rose-500",
    },
    {
      year: "2020",
      title: "Bứt Phá Phát Triển",
      description:
        "Khai trương showroom đầu tiên tại Hà Nội và ra mắt website thương mại điện tử.",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
    },
    {
      year: "2022",
      title: "Vươn Tầm Quốc Gia",
      description:
        "Mở rộng hệ thống phân phối và giao hàng toàn quốc với hơn 5000 sản phẩm.",
      icon: Globe,
      color: "from-green-500 to-teal-500",
    },
    {
      year: "2025",
      title: "Dẫn Đầu Thị Trường",
      description:
        "Trở thành địa chỉ tin cậy hàng đầu về đồ gia dụng Nhật Bản tại Việt Nam.",
      icon: Award,
      color: "from-purple-500 to-indigo-500",
    },
  ];

  const team = [
    {
      name: "Nguyễn Thị Mai",
      role: "CEO & Founder",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=400&h=400&fit=crop&crop=face",
      description:
        "15 năm kinh nghiệm trong lĩnh vực nhập khẩu và phân phối đồ Nhật Bản.",
      social: ["linkedin", "twitter"],
    },
    {
      name: "Trần Văn Hải",
      role: "Sales Director",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      description:
        "Chuyên gia về thị trường đồ gia dụng Nhật Bản tại Việt Nam.",
      social: ["linkedin", "twitter"],
    },
    {
      name: "Phạm Thị Lan",
      role: "Customer Success Manager",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      description: "Đảm bảo trải nghiệm mua sắp hoàn hảo cho mọi khách hàng.",
      social: ["linkedin", "twitter"],
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-red-200/30 to-pink-200/30 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${
              mousePosition.y * 0.02
            }px)`,
            left: "10%",
            top: "20%",
          }}
        />
        <div
          className="absolute w-80 h-80 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${
              mousePosition.y * -0.015
            }px)`,
            right: "10%",
            bottom: "20%",
          }}
        />
        <div
          className="absolute w-64 h-64 bg-gradient-to-r from-green-200/30 to-teal-200/30 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${
              mousePosition.y * 0.01
            }px)`,
            left: "60%",
            top: "60%",
          }}
        />
      </div>

      {/* Hero Section with Premium Design */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-red-500/20 backdrop-blur-sm rounded-full text-red-200 text-sm font-medium mb-8 border border-red-400/30">
            <Sparkles className="w-4 h-4 mr-2" />
            Đồ Nhật Chính Hãng #1 Việt Nam
          </div>

          <h1 className="text-6xl lg:text-8xl font-bold mb-8">
            <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
              Sakura
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-pulse">
              Home
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Nơi hội tụ tinh hoa đồ gia dụng Nhật Bản, mang đến trải nghiệm sống
            <span className="text-red-400 font-semibold"> hoàn hảo </span>
            cho mọi gia đình Việt
          </p>

          {/* Glowing Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="relative group"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300`}
                  />
                  <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-white mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl font-semibold text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <span className="relative z-10 flex items-center">
                Khám Phá Ngay
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <button className="group px-8 py-4 bg-white/10 backdrop-blur-sm rounded-2xl font-semibold text-white border border-white/20 hover:bg-white/20 transition-all duration-300">
              <span className="flex items-center">
                <Play className="mr-2 w-5 h-5" />
                Xem Video
              </span>
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Story Section with Premium Design */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              data-animate
              id="story-text"
              className={`transition-all duration-1000 ${
                isVisible["story-text"]
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="inline-flex items-center px-4 py-2 bg-red-100 rounded-full text-red-600 text-sm font-medium mb-6">
                <Heart className="w-4 h-4 mr-2" />
                Câu Chuyện Của Chúng Tôi
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-8">
                Từ{" "}
                <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Tình Yêu
                </span>
                <br />
                Đến{" "}
                <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Sứ Mệnh
                </span>
              </h2>

              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p className="relative pl-6">
                  <span className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-red-400 to-pink-400 rounded-full" />
                  Sakura Home được ra đời từ niềm đam mê với văn hóa và sản phẩm
                  Nhật Bản tinh tế. Chúng tôi tin rằng mỗi món đồ gia dụng không
                  chỉ là vật dụng, mà là nghệ thuật sống.
                </p>
                <p className="relative pl-6">
                  <span className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-pink-400 to-red-400 rounded-full" />
                  Với cam kết mang đến 100% sản phẩm chính hãng, chúng tôi xây
                  dựng mối quan hệ trực tiếp với các nhà sản xuất hàng đầu tại
                  Nhật Bản.
                </p>
                <p className="relative pl-6">
                  <span className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-red-400 to-pink-400 rounded-full" />
                  Hôm nay, Sakura Home tự hào là cầu nối tin cậy, mang tinh hoa
                  Nhật Bản đến từng gia đình Việt Nam.
                </p>
              </div>
            </div>

            <div
              data-animate
              id="story-image"
              className={`relative transition-all duration-1000 ${
                isVisible["story-image"]
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <div className="relative group">
                {/* Glowing border */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                {/* Main image */}
                <div className="relative overflow-hidden rounded-3xl">
                  <img
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"
                    alt="Sakura Home Story"
                    className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100">
                  <Globe className="w-10 h-10 text-red-600 mb-3" />
                  <div className="text-sm font-bold text-gray-800">
                    Nhật Bản
                  </div>
                  <div className="text-xs text-gray-600">→ Việt Nam</div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse" />
                <div
                  className="absolute top-1/4 -right-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
                <div
                  className="absolute bottom-1/4 -left-2 w-4 h-4 bg-gradient-to-r from-green-400 to-teal-400 rounded-full animate-pulse"
                  style={{ animationDelay: "2s" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section with Modern Cards */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-red-500/20 backdrop-blur-sm rounded-full text-red-200 text-sm font-medium mb-6 border border-red-400/30">
              <Award className="w-4 h-4 mr-2" />
              Giá Trị Cốt Lõi
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Tại Sao Chọn{" "}
              <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                Sakura Home
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Những nguyên tắc vàng định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  data-animate
                  id={`value-${index}`}
                  className={`relative group transition-all duration-1000 ${
                    isVisible[`value-${index}`]
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: value.delay }}
                >
                  {/* Glowing background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${value.color} rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                  />

                  {/* Card */}
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 group-hover:border-white/20 transition-all duration-500 h-full">
                    {/* Icon container */}
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-200 transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {value.description}
                    </p>

                    {/* Hover indicator */}
                    <div className="absolute bottom-6 right-6 w-0 h-0.5 bg-gradient-to-r from-red-400 to-pink-400 group-hover:w-8 transition-all duration-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section with Premium Design */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 rounded-full text-red-600 text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Hành Trình Phát Triển
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Cột Mốc
              </span>{" "}
              Đáng Nhớ
            </h2>
          </div>

          <div className="relative">
            {/* Animated timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-1 bg-gradient-to-b from-red-200 via-red-400 to-red-200" />

            <div className="space-y-16">
              {milestones.map((milestone, index) => {
                const IconComponent = milestone.icon;
                return (
                  <div
                    key={index}
                    data-animate
                    id={`milestone-${index}`}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? "justify-start" : "justify-end"
                    } transition-all duration-1000 ${
                      isVisible[`milestone-${index}`]
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <div
                      className={`w-5/12 ${
                        index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"
                      }`}
                    >
                      <div className="relative group">
                        {/* Glowing border */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${milestone.color} rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                        />

                        <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 group-hover:shadow-2xl transition-all duration-500">
                          <div
                            className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${milestone.color} rounded-xl mb-4`}
                          >
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-3">
                            {milestone.year}
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3">
                            {milestone.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div
                      className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r ${milestone.color} rounded-full border-4 border-white shadow-lg z-10`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section with Modern Design */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 rounded-full text-red-600 text-sm font-medium mb-6">
              <Users className="w-4 h-4 mr-2" />
              Đội Ngũ Xuất Sắc
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Những Người
              </span>{" "}
              Kiến Tạo
            </h2>
            <p className="text-xl text-gray-600">
              Những tài năng đằng sau thành công của Sakura Home
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {team.map((member, index) => (
              <div
                key={index}
                data-animate
                id={`team-${index}`}
                className={`relative group transition-all duration-1000 ${
                  isVisible[`team-${index}`]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Glowing background */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 group-hover:shadow-2xl transition-all duration-500">
                  <div className="relative mb-8">
                    {/* Avatar with glowing ring */}
                    <div className="relative w-32 h-32 mx-auto">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-pulse" />
                      <img
                        src={member.image}
                        alt={member.name}
                        className="relative w-30 h-30 rounded-full mx-auto object-cover m-1 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Status indicator */}
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {member.name}
                    </h3>
                    <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 rounded-full text-red-600 font-semibold text-sm mb-4">
                      {member.role}
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {member.description}
                    </p>

                    {/* Social links */}
                    <div className="flex justify-center space-x-3">
                      <button className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300">
                        <span className="text-xs font-bold">in</span>
                      </button>
                      <button className="w-10 h-10 bg-gradient-to-r from-sky-400 to-sky-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300">
                        <span className="text-xs font-bold">tw</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-red-600 via-red-700 to-red-800 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Sparkles className="w-16 h-16 text-red-200 mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Sẵn Sàng{" "}
              <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Trải Nghiệm
              </span>
              ?
            </h2>
            <p className="text-xl text-red-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Khám phá bộ sưu tập đồ gia dụng Nhật Bản chính hãng tuyệt vời
              nhất. Hãy để Sakura Home biến ngôi nhà của bạn thành thiên đường!
            </p>
          </div>

          {/* Premium contact cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur opacity-50" />
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                <MapPin className="w-8 h-8 text-white mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">
                  Địa Chỉ Showroom
                </h3>
                <p className="text-red-100 text-sm">
                  Tầng KT tòa CT1A Mễ Trì Plaza
                  <br />
                  Nam Từ Liêm, Hà Nội
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur opacity-50" />
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                <Phone className="w-8 h-8 text-white mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Hotline 24/7</h3>
                <p className="text-red-100 text-sm">
                  1900-1234
                  <br />
                  Hỗ trợ khách hàng
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur opacity-50" />
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                <Mail className="w-8 h-8 text-white mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Email Hỗ Trợ</h3>
                <p className="text-red-100 text-sm">
                  info@sakurahome.vn
                  <br />
                  Phản hồi trong 2 giờ
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group relative px-10 py-4 bg-white rounded-2xl font-bold text-red-600 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300">
              <span className="relative z-10 flex items-center">
                🛍️ Mua Sắm Ngay
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <button className="group px-10 py-4 bg-white/20 backdrop-blur-sm rounded-2xl font-bold text-white border-2 border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300">
              <span className="flex items-center">
                <Phone className="mr-3 w-5 h-5" />
                📞 Tư Vấn Miễn Phí
              </span>
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="flex items-center text-red-100 text-sm">
              <Shield className="w-4 h-4 mr-2" />
              100% Chính Hãng
            </div>
            <div className="flex items-center text-red-100 text-sm">
              <Truck className="w-4 h-4 mr-2" />
              Miễn Phí Vận Chuyển
            </div>
            <div className="flex items-center text-red-100 text-sm">
              <Award className="w-4 h-4 mr-2" />
              Bảo Hành Chính Hãng
            </div>
            <div className="flex items-center text-red-100 text-sm">
              <Heart className="w-4 h-4 mr-2" />
              10,000+ Khách Hài Lòng
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
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

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-400 transition-colors duration-300"
              />
              <button className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-xl font-semibold text-white hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105">
                Đăng Ký
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              * Chúng tôi cam kết không spam và bảo mật thông tin của bạn
            </p>
          </div>
        </div>
      </section>
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(120deg);
          }
          66% {
            transform: translateY(5px) rotate(240deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }

        /* Smooth scrolling for the entire page */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #dc2626, #ec4899);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #b91c1c, #db2777);
        }
      `}</style>
    </div>
  );
};

export default About;
