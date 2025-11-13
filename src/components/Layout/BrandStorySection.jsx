import React, { useState } from "react";
import { Award, Users, Heart, Gift, Play, X } from "lucide-react";

const BrandStorySection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // YouTube video configuration
  const youtubeVideoId = "LiF1ulKMNHw";
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`;

  const achievements = [
    { icon: Award, number: "5", label: "Năm Kinh Nghiệm" },
    { icon: Users, number: "1000+", label: "Khách Hàng Tin Tưởng" },
    { icon: Heart, number: "50+", label: "Thương Hiệu Nhật" },
    { icon: Gift, number: "10000+", label: "Đơn Hàng Thành Công" },
  ];

  // Tùy chọn hiển thị: 'local' = ảnh local, 'youtube' = YouTube thumbnail, 'custom' = placeholder animated
  const [imageType, setImageType] = useState("local");
  const [imageError, setImageError] = useState(false);
  const [currentThumbnail, setCurrentThumbnail] = useState(
    `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`
  );

  // Local image path
  const localImagePath =
    "/images/PlaceHolerVideoHome/PlaceHolderVideoHome.jpeg";

  const handleImageError = (e) => {
    console.log("Image error, current src:", e.target.src);

    if (imageType === "local") {
      // Nếu local image fail, chuyển sang YouTube thumbnail
      console.log("Local image failed, trying YouTube thumbnail");
      setImageType("youtube");
    } else if (imageType === "youtube") {
      // YouTube thumbnail fallback chain
      const currentSrc = e.target.src;
      const videoId = youtubeVideoId;

      if (currentSrc.includes("maxresdefault")) {
        const newSrc = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        console.log("Trying hqdefault:", newSrc);
        setCurrentThumbnail(newSrc);
      } else if (currentSrc.includes("hqdefault")) {
        const newSrc = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        console.log("Trying mqdefault:", newSrc);
        setCurrentThumbnail(newSrc);
      } else if (currentSrc.includes("mqdefault")) {
        const newSrc = `https://img.youtube.com/vi/${videoId}/default.jpg`;
        console.log("Trying default:", newSrc);
        setCurrentThumbnail(newSrc);
      } else {
        console.log("All thumbnails failed, using custom placeholder");
        setImageType("custom");
      }
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Câu Chuyện Của <span className="text-red-500">Sakura Home</span>
            </h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                Bắt đầu từ tình yêu dành cho văn hóa và sản phẩm Nhật Bản,
                Sakura Home được thành lập với sứ mệnh mang đến những sản phẩm
                chất lượng cao từ đất nước mặt trời mọc.
              </p>
              <p>
                Chúng tôi tin rằng mỗi sản phẩm không chỉ là hàng hóa, mà còn là
                cầu nối văn hóa, mang đến cho bạn trải nghiệm authentic của
                lifestyle Nhật Bản.
              </p>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3 hover:bg-red-200 transition-colors">
                      <IconComponent className="w-8 h-8 text-red-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {achievement.number}
                    </div>
                    <div className="text-gray-600">{achievement.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Video/Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              {/* Ba options: Local image, YouTube thumbnail, hoặc Custom placeholder */}
              {imageType === "local" ? (
                // Local image
                <img
                  src={localImagePath}
                  alt="Sakura Home Brand Story Video"
                  className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="eager"
                  onError={handleImageError}
                />
              ) : imageType === "youtube" ? (
                // YouTube thumbnail với fallback chain
                <img
                  key={currentThumbnail}
                  src={currentThumbnail}
                  alt="Sakura Home Brand Story Video"
                  className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="eager"
                  onError={handleImageError}
                  crossOrigin="anonymous"
                />
              ) : (
                // Custom animated placeholder
                <div className="w-full h-96 bg-gradient-to-br from-red-500 via-pink-500 to-red-600 flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  {/* Animated background elements */}
                  <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-16 right-12 w-16 h-16 bg-white bg-opacity-15 rounded-full animate-bounce"></div>
                  <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-white bg-opacity-10 rounded-full animate-ping"></div>
                  <div className="absolute top-1/2 left-1/3 w-8 h-8 bg-white bg-opacity-10 rounded-full animate-pulse delay-1000"></div>
                  <div className="absolute bottom-1/3 left-16 w-6 h-6 bg-white bg-opacity-15 rounded-full animate-bounce delay-500"></div>

                  {/* Main content */}
                  <div className="text-center text-white z-10">
                    <div className="text-7xl mb-4 animate-bounce">🌸</div>
                    <h3 className="text-3xl font-bold mb-2 tracking-wide drop-shadow-lg">
                      Sakura Home
                    </h3>
                    <p className="text-xl opacity-90 font-light">
                      Brand Story Video
                    </p>
                    <div className="mt-4 w-24 h-1 bg-white bg-opacity-50 mx-auto rounded-full"></div>
                  </div>

                  {/* Overlay pattern */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black bg-opacity-10 via-transparent to-transparent"></div>
                </div>
              )}

              {/* Video overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-50">
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 hover:bg-red-50 transition-all duration-300"
                  aria-label="Play video"
                >
                  <Play className="w-8 h-8 text-red-500 ml-1" />
                </button>
              </div>

              {/* Video title overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Khám Phá Câu Chuyện Sakura Home
                  </h3>
                  <p className="text-sm text-gray-600">
                    Hành trình mang văn hóa Nhật Bản đến Việt Nam
                  </p>
                </div>
              </div>
            </div>

            {/* Floating decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-red-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-pink-500 rounded-full opacity-30 animate-bounce"></div>

            {/* Video Modal */}
            {isVideoOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
                onClick={() => setIsVideoOpen(false)}
              >
                <div className="relative bg-black rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                  {/* Close button */}
                  <button
                    onClick={() => setIsVideoOpen(false)}
                    className="absolute top-4 right-4 z-10 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    aria-label="Close video"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* YouTube iframe */}
                  <iframe
                    className="w-full h-96 md:h-[500px] lg:h-[600px]"
                    src={youtubeEmbedUrl}
                    title="Sakura Home Brand Story - Video Giới Thiệu"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onClick={(e) => e.stopPropagation()}
                  ></iframe>

                  {/* Video info */}
                  <div className="bg-white p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Sakura Home - Câu Chuyện Thương Hiệu
                    </h3>
                    <p className="text-gray-600">
                      Khám phá hành trình 5 năm xây dựng và phát triển thương
                      hiệu, mang đến những sản phẩm Nhật Bản chính hãng cho
                      khách hàng Việt Nam.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional content below */}
        <div className="mt-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Tại Sao Chọn Sakura Home?
            </h3>
            <p className="text-gray-600 text-lg">
              Với đam mê và cam kết mang đến những sản phẩm chất lượng nhất từ
              Nhật Bản, chúng tôi không ngừng nỗ lực để trở thành cầu nối tin
              cậy giữa văn hóa Nhật Bản và khách hàng Việt Nam.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStorySection;
