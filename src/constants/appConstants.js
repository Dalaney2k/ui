// =====================================================
// ENHANCED MOCK DATA - NIHON STORE
// Based on Database Models
// =====================================================

// Brands data
export const brands = [
  {
    id: 1,
    name: "Shiseido",
    logoUrl:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=100&fit=crop",
    description:
      "Thương hiệu mỹ phẩm hàng đầu Nhật Bản với hơn 150 năm lịch sử",
    country: "Japan",
    website: "https://www.shiseido.com",
    displayOrder: 1,
    isActive: true,
    slug: "shiseido",
  },
  {
    id: 2,
    name: "Klairs",
    logoUrl:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=100&fit=crop",
    description:
      "Thương hiệu skincare Hàn Quốc nổi tiếng với các sản phẩm gentle",
    country: "Korea",
    website: "https://www.klairs.com",
    displayOrder: 2,
    isActive: true,
    slug: "klairs",
  },
  {
    id: 3,
    name: "Ichiran",
    logoUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=100&fit=crop",
    description: "Chuỗi ramen nổi tiếng Nhật Bản",
    country: "Japan",
    website: "https://www.ichiran.com",
    displayOrder: 3,
    isActive: true,
    slug: "ichiran",
  },
  {
    id: 4,
    name: "Santoku",
    logoUrl:
      "https://images.unsplash.com/photo-1594736797933-d0201ba2fe65?w=200&h=100&fit=crop",
    description: "Thương hiệu dao nhật truyền thống",
    country: "Japan",
    website: "https://www.santoku.jp",
    displayOrder: 4,
    isActive: true,
    slug: "santoku",
  },
  {
    id: 5,
    name: "Fujifilm",
    logoUrl:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&h=100&fit=crop",
    description: "Công ty công nghệ hình ảnh hàng đầu Nhật Bản",
    country: "Japan",
    website: "https://www.fujifilm.com",
    displayOrder: 5,
    isActive: true,
    slug: "fujifilm",
  },
];

// Categories with hierarchy
export const categories = [
  {
    id: 1,
    name: "Đồ Ăn & Thức Uống",
    description: "Các sản phẩm thực phẩm nhập khẩu từ Nhật Bản",
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    icon: "🍜",
    parentId: null,
    displayOrder: 1,
    isActive: true,
    slug: "do-an-thuc-uong",
    children: [
      {
        id: 11,
        name: "Mì Ramen",
        description: "Các loại mì ramen instant và fresh",
        imageUrl:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
        icon: "🍜",
        parentId: 1,
        displayOrder: 1,
        isActive: true,
        slug: "mi-ramen",
      },
      {
        id: 12,
        name: "Trà & Matcha",
        description: "Trà xanh và matcha chính hãng Nhật Bản",
        imageUrl:
          "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=300&fit=crop",
        icon: "🍵",
        parentId: 1,
        displayOrder: 2,
        isActive: true,
        slug: "tra-matcha",
      },
    ],
  },
  {
    id: 2,
    name: "Làm Đẹp & Chăm Sóc Da",
    description: "Mỹ phẩm và sản phẩm chăm sóc da cao cấp",
    imageUrl:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop",
    icon: "💄",
    parentId: null,
    displayOrder: 2,
    isActive: true,
    slug: "lam-dep-cham-soc-da",
    children: [
      {
        id: 21,
        name: "Serum & Tinh Chất",
        description: "Các loại serum dưỡng da chuyên sâu",
        imageUrl:
          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop",
        icon: "💧",
        parentId: 2,
        displayOrder: 1,
        isActive: true,
        slug: "serum-tinh-chat",
      },
      {
        id: 22,
        name: "Kem Dưỡng",
        description: "Kem dưỡng ẩm và chống lão hóa",
        imageUrl:
          "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop",
        icon: "🧴",
        parentId: 2,
        displayOrder: 2,
        isActive: true,
        slug: "kem-duong",
      },
    ],
  },
  {
    id: 3,
    name: "Đồ Gia Dụng",
    description: "Đồ dùng gia đình chất lượng cao từ Nhật Bản",
    imageUrl:
      "https://images.unsplash.com/photo-1594736797933-d0201ba2fe65?w=400&h=300&fit=crop",
    icon: "🏠",
    parentId: null,
    displayOrder: 3,
    isActive: true,
    slug: "do-gia-dung",
    children: [
      {
        id: 31,
        name: "Dao & Dụng Cụ Nhà Bếp",
        description: "Dao và các dụng cụ nhà bếp chuyên nghiệp",
        imageUrl:
          "https://images.unsplash.com/photo-1594736797933-d0201ba2fe65?w=400&h=300&fit=crop",
        icon: "🔪",
        parentId: 3,
        displayOrder: 1,
        isActive: true,
        slug: "dao-dung-cu-nha-bep",
      },
    ],
  },
  {
    id: 4,
    name: "Thời Trang",
    description: "Trang phục truyền thống và hiện đại Nhật Bản",
    imageUrl:
      "https://images.unsplash.com/photo-1578662996308-2c9473eaab08?w=400&h=300&fit=crop",
    icon: "👘",
    parentId: null,
    displayOrder: 4,
    isActive: true,
    slug: "thoi-trang",
  },
  {
    id: 5,
    name: "Điện Tử",
    description: "Thiết bị điện tử công nghệ cao",
    imageUrl:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
    icon: "📱",
    parentId: null,
    displayOrder: 5,
    isActive: true,
    slug: "dien-tu",
  },
];

// Enhanced Products with full ProductDetailDto data
export const products = [
  {
    id: 1,
    name: "Mì Ramen Ichiran Instant Premium",
    sku: "ICH-RAM-001",
    description:
      "Mì ramen instant cao cấp từ thương hiệu Ichiran nổi tiếng, với nước dùng đậm đà và mì dai ngon. Được chế biến theo công thức bí mật truyền thống của Nhật Bản.",
    price: 450000,
    originalPrice: 520000,
    stock: 150,
    mainImage:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=500&fit=crop",
    brandId: 3,
    categoryId: 11,

    // Japanese Product Specific
    origin: "Fukuoka, Japan",
    isAuthentic: true,
    authenticityInfo:
      "Sản phẩm chính hãng được nhập khẩu trực tiếp từ Ichiran Japan. Có tem chống hàng giả và mã QR kiểm tra trên bao bì.",
    usageGuide:
      "1. Đun sôi 550ml nước. 2. Cho mì và gói gia vị vào nước sôi. 3. Nấu trong 3 phút, khuấy đều. 4. Thưởng thức ngay khi còn nóng.",
    expiryDate: "2025-12-31T00:00:00Z",
    weight: 180,
    dimensions: "15cm x 12cm x 8cm",

    // SEO
    metaTitle: "Mì Ramen Ichiran Instant Premium - Chính Hãng Nhật Bản",
    metaDescription:
      "Mì ramen Ichiran instant chính hãng với hương vị đặc trưng của Nhật Bản. Nước dùng đậm đà, mì dai ngon. Giao hàng tận nơi.",
    slug: "mi-ramen-ichiran-instant-premium",

    // Statistics
    rating: 4.8,
    reviewCount: 234,
    viewCount: 1540,
    soldCount: 89,

    // Flags
    isFeatured: true,
    isNew: false,
    status: 1, // Active
    isActive: true,

    // Images
    images: [
      {
        id: 1,
        productId: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=500&fit=crop",
        altText: "Mì Ramen Ichiran - Góc nhìn chính",
        displayOrder: 1,
        isMain: true,
      },
      {
        id: 2,
        productId: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500&h=500&fit=crop",
        altText: "Mì Ramen Ichiran - Bao bì sản phẩm",
        displayOrder: 2,
        isMain: false,
      },
      {
        id: 3,
        productId: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1563379091339-03246963d1d4?w=500&h=500&fit=crop",
        altText: "Mì Ramen Ichiran - Thành phẩm",
        displayOrder: 3,
        isMain: false,
      },
    ],

    // Reviews
    reviews: [
      {
        id: 1,
        userId: 1,
        productId: 1,
        rating: 5,
        title: "Rất ngon, đúng vị Nhật Bản",
        comment:
          "Mì có độ dai vừa phải, nước dùng đậm đà. Đúng như mong đợi từ thương hiệu Ichiran nổi tiếng.",
        isApproved: true,
        isVerifiedPurchase: true,
        helpfulCount: 12,
        createdAt: "2024-01-15T10:30:00Z",
        user: {
          id: 1,
          firstName: "Minh",
          lastName: "Anh",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b098?w=100&h=100&fit=crop",
        },
      },
      {
        id: 2,
        userId: 2,
        productId: 1,
        rating: 4,
        title: "Chất lượng tốt",
        comment: "Sản phẩm đúng mô tả, giao hàng nhanh. Sẽ mua lại lần sau.",
        isApproved: true,
        isVerifiedPurchase: true,
        helpfulCount: 8,
        createdAt: "2024-01-10T15:20:00Z",
        user: {
          id: 2,
          firstName: "Thu",
          lastName: "Thảo",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        },
      },
    ],

    // Related products
    relatedProducts: [
      {
        id: 2,
        name: "Serum Vitamin C Klairs Freshly Juiced",
        price: 380000,
        originalPrice: 450000,
        mainImage:
          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop",
        rating: 4.7,
        reviewCount: 156,
        slug: "serum-vitamin-c-klairs",
      },
      {
        id: 6,
        name: "Trà Matcha Kyoto Premium Organic",
        price: 680000,
        originalPrice: 750000,
        mainImage:
          "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=300&h=300&fit=crop",
        rating: 4.8,
        reviewCount: 267,
        slug: "tra-matcha-kyoto-premium",
      },
    ],
  },

  {
    id: 2,
    name: "Serum Vitamin C Klairs Freshly Juiced",
    sku: "KLA-SER-002",
    description:
      "Serum Vitamin C Klairs với 5% Vitamin C tự nhiên, giúp làm sáng da, chống oxy hóa và cải thiện tông màu da hiệu quả. Công thức gentle phù hợp cho da nhạy cảm.",
    price: 380000,
    originalPrice: 450000,
    stock: 85,
    mainImage:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=500&fit=crop",
    brandId: 2,
    categoryId: 21,

    // Japanese Product Specific
    origin: "Seoul, Korea",
    isAuthentic: true,
    authenticityInfo:
      "Sản phẩm chính hãng được nhập khẩu trực tiếp từ Klairs Korea. Có tem chống hàng giả và mã QR kiểm tra.",
    usageGuide:
      "Sử dụng 2-3 giọt serum sau bước toner, massage nhẹ nhàng lên mặt và cổ. Sử dụng 1-2 lần/ngày, tốt nhất là buổi tối.",
    expiryDate: "2026-12-31T00:00:00Z",
    weight: 35,
    dimensions: "3.5cm x 3.5cm x 10cm",

    // SEO
    metaTitle: "Serum Vitamin C Klairs - Làm sáng da chính hãng",
    metaDescription:
      "Serum Vitamin C Klairs chính hãng, làm sáng da, chống oxy hóa hiệu quả. Xuất xứ Hàn Quốc, cam kết 100% authentic.",
    slug: "serum-vitamin-c-klairs-freshly-juiced",

    // Statistics
    rating: 4.7,
    reviewCount: 156,
    viewCount: 2340,
    soldCount: 67,

    // Flags
    isFeatured: true,
    isNew: true,
    status: 1, // Active
    isActive: true,

    // Images
    images: [
      {
        id: 4,
        productId: 2,
        imageUrl:
          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=500&fit=crop",
        altText: "Serum Vitamin C Klairs - Sản phẩm chính",
        displayOrder: 1,
        isMain: true,
      },
      {
        id: 5,
        productId: 2,
        imageUrl:
          "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=500&fit=crop",
        altText: "Serum Vitamin C Klairs - Texture",
        displayOrder: 2,
        isMain: false,
      },
    ],

    // Reviews
    reviews: [
      {
        id: 3,
        userId: 3,
        productId: 2,
        rating: 5,
        title: "Da sáng lên rõ rệt",
        comment:
          "Sau 2 tuần sử dụng, da mình sáng lên rõ rệt và mịn màng hơn. Sản phẩm rất gentle, không gây kích ứng.",
        isApproved: true,
        isVerifiedPurchase: true,
        helpfulCount: 15,
        createdAt: "2024-01-20T09:15:00Z",
        user: {
          id: 3,
          firstName: "Lan",
          lastName: "Huong",
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
        },
      },
    ],

    // Related products
    relatedProducts: [
      {
        id: 1,
        name: "Mì Ramen Ichiran Instant Premium",
        price: 450000,
        originalPrice: 520000,
        mainImage:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=300&fit=crop",
        rating: 4.8,
        reviewCount: 234,
        slug: "mi-ramen-ichiran-instant-premium",
      },
    ],
  },

  {
    id: 3,
    name: "Dao Nhật Santoku Professional Chef",
    sku: "SAN-DAO-003",
    description:
      "Dao Santoku chuyên nghiệp được rèn theo truyền thống Nhật Bản. Lưỡi dao sắc bén, thiết kế cân đối, phù hợp cho mọi công việc trong nhà bếp.",
    price: 2800000,
    originalPrice: 3200000,
    stock: 25,
    mainImage:
      "https://images.unsplash.com/photo-1594736797933-d0201ba2fe65?w=500&h=500&fit=crop",
    brandId: 4,
    categoryId: 31,

    // Japanese Product Specific
    origin: "Sakai, Japan",
    isAuthentic: true,
    authenticityInfo:
      "Dao được rèn thủ công bởi các nghệ nhân lành nghề tại Sakai, Nhật Bản. Đi kèm giấy chứng nhận xuất xứ và bảo hành chính hãng.",
    usageGuide:
      "Rửa sạch và lau khô sau mỗi lần sử dụng. Bảo quản ở nơi khô ráo, tránh để dao chạm vào các vật cứng. Mài định kỳ để duy trì độ sắc.",
    expiryDate: null,
    weight: 180,
    dimensions: "33cm x 5cm x 2cm",

    // SEO
    metaTitle: "Dao Santoku Nhật Bản Professional - Chính Hãng",
    metaDescription:
      "Dao Santoku professional chính hãng Nhật Bản, rèn thủ công truyền thống. Lưỡi sắc bén, thiết kế ergonomic.",
    slug: "dao-nhat-santoku-professional-chef",

    // Statistics
    rating: 4.9,
    reviewCount: 78,
    viewCount: 890,
    soldCount: 12,

    // Flags
    isFeatured: false,
    isNew: false,
    status: 1, // Active
    isActive: true,

    // Images
    images: [
      {
        id: 6,
        productId: 3,
        imageUrl:
          "https://images.unsplash.com/photo-1594736797933-d0201ba2fe65?w=500&h=500&fit=crop",
        altText: "Dao Santoku - Toàn cảnh",
        displayOrder: 1,
        isMain: true,
      },
    ],

    // Reviews
    reviews: [
      {
        id: 4,
        userId: 4,
        productId: 3,
        rating: 5,
        title: "Dao cực kỳ sắc bén",
        comment:
          "Chất lượng dao tuyệt vời, cắt rau củ và thịt rất mượt. Thiết kế đẹp, cầm rất chắc tay.",
        isApproved: true,
        isVerifiedPurchase: true,
        helpfulCount: 6,
        createdAt: "2024-01-18T14:45:00Z",
        user: {
          id: 4,
          firstName: "Hoàng",
          lastName: "Nam",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        },
      },
    ],

    // Related products
    relatedProducts: [],
  },

  {
    id: 4,
    name: "Kimono Truyền Thống Sakura",
    sku: "KIM-SAK-004",
    description:
      "Kimono truyền thống Nhật Bản với họa tiết hoa anh đào tinh tế. Chất liệu silk cao cấp, may thủ công tỉ mỉ theo phong cách truyền thống.",
    price: 3500000,
    originalPrice: 4000000,
    stock: 12,
    mainImage:
      "https://images.unsplash.com/photo-1578662996308-2c9473eaab08?w=500&h=500&fit=crop",
    brandId: 1, // Assumed brand
    categoryId: 4,

    // Japanese Product Specific
    origin: "Kyoto, Japan",
    isAuthentic: true,
    authenticityInfo:
      "Kimono được may thủ công tại Kyoto bởi các nghệ nhân truyền thống. Đi kèm giấy chứng nhận xuất xứ và hướng dẫn bảo quản.",
    usageGuide:
      "Giặt khô hoặc giặt tay nhẹ nhàng với nước lạnh. Phơi trong bóng râm, tránh ánh nắng trực tiếp. Bảo quản treo thẳng hoặc gấp cẩn thận.",
    expiryDate: null,
    weight: 800,
    dimensions: "150cm x 120cm",

    // SEO
    metaTitle: "Kimono Truyền Thống Sakura - Chính Hãng Kyoto",
    metaDescription:
      "Kimono truyền thống Nhật Bản họa tiết hoa anh đào, chất liệu silk cao cấp, may thủ công tại Kyoto.",
    slug: "kimono-truyen-thong-sakura",

    // Statistics
    rating: 4.6,
    reviewCount: 23,
    viewCount: 560,
    soldCount: 5,

    // Flags
    isFeatured: true,
    isNew: false,
    status: 1, // Active
    isActive: true,

    // Images
    images: [
      {
        id: 7,
        productId: 4,
        imageUrl:
          "https://images.unsplash.com/photo-1578662996308-2c9473eaab08?w=500&h=500&fit=crop",
        altText: "Kimono Sakura - Mặc thử",
        displayOrder: 1,
        isMain: true,
      },
    ],

    // Reviews
    reviews: [],
    relatedProducts: [],
  },

  {
    id: 5,
    name: "Máy Ảnh Fujifilm X-T4 Mirrorless",
    sku: "FUJ-XT4-005",
    description:
      "Máy ảnh mirrorless cao cấp với cảm biến APS-C 26.1MP, khả năng quay video 4K/60p và hệ thống chống rung IBIS tiên tiến.",
    price: 28000000,
    originalPrice: 32000000,
    stock: 8,
    mainImage:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop",
    brandId: 5,
    categoryId: 5,

    // Japanese Product Specific
    origin: "Tokyo, Japan",
    isAuthentic: true,
    authenticityInfo:
      "Máy ảnh chính hãng Fujifilm với bảo hành quốc tế 24 tháng. Đi kèm tài liệu hướng dẫn và phụ kiện chính hãng.",
    usageGuide:
      "Đọc kỹ hướng dẫn sử dụng trước khi sử dụng. Sạc đầy pin trước lần đầu sử dụng. Bảo quản ở nơi khô ráo, tránh va đập.",
    expiryDate: null,
    weight: 607,
    dimensions: "13.5cm x 9.3cm x 8.4cm",

    // SEO
    metaTitle: "Máy Ảnh Fujifilm X-T4 Mirrorless - Chính Hãng",
    metaDescription:
      "Máy ảnh Fujifilm X-T4 mirrorless chính hãng, cảm biến APS-C 26.1MP, quay 4K/60p, IBIS chống rung.",
    slug: "may-anh-fujifilm-x-t4-mirrorless",

    // Statistics
    rating: 4.9,
    reviewCount: 45,
    viewCount: 1200,
    soldCount: 3,

    // Flags
    isFeatured: true,
    isNew: true,
    status: 1, // Active
    isActive: true,

    // Images
    images: [
      {
        id: 8,
        productId: 5,
        imageUrl:
          "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop",
        altText: "Fujifilm X-T4 - Góc chính",
        displayOrder: 1,
        isMain: true,
      },
    ],

    // Reviews
    reviews: [],
    relatedProducts: [],
  },

  {
    id: 6,
    name: "Trà Matcha Kyoto Premium Organic",
    sku: "MAT-KYO-006",
    description:
      "Bột trà xanh Matcha cao cấp từ Kyoto, được trồng và chế biến theo phương pháp truyền thống. Hương vị thanh mát, giàu chất chống oxy hóa.",
    price: 680000,
    originalPrice: 750000,
    stock: 45,
    mainImage:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500&h=500&fit=crop",
    brandId: 1, // Assumed brand
    categoryId: 12,

    // Japanese Product Specific
    origin: "Kyoto, Japan",
    isAuthentic: true,
    authenticityInfo:
      "Matcha organic chính hãng từ các vườn trà truyền thống tại Kyoto. Có giấy chứng nhận organic và xuất xứ.",
    usageGuide:
      "Pha với nước 70-80°C, tỷ lệ 1-2g bột matcha với 60ml nước. Đánh đều bằng chasen (que đánh trà) cho đến khi tạo bọt mịn. Có thể pha chế làm latte, bánh kẹo.",
    expiryDate: "2025-06-30T00:00:00Z",
    weight: 100,
    dimensions: "8cm x 8cm x 10cm",

    // SEO
    metaTitle: "Trà Matcha Kyoto Premium Organic - Chính Hãng Nhật",
    metaDescription:
      "Bột trà xanh Matcha premium organic từ Kyoto, Nhật Bản. Hương vị thanh mát, giàu chất chống oxy hóa.",
    slug: "tra-matcha-kyoto-premium-organic",

    // Statistics
    rating: 4.8,
    reviewCount: 267,
    viewCount: 1890,
    soldCount: 156,

    // Flags
    isFeatured: true,
    isNew: false,
    status: 1, // Active
    isActive: true,

    // Images
    images: [
      {
        id: 9,
        productId: 6,
        imageUrl:
          "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500&h=500&fit=crop",
        altText: "Matcha Kyoto - Bột trà xanh",
        displayOrder: 1,
        isMain: true,
      },
      {
        id: 10,
        productId: 6,
        imageUrl:
          "https://images.unsplash.com/photo-1544787219-7f47cc1b6a0e?w=500&h=500&fit=crop",
        altText: "Matcha Kyoto - Trà đã pha",
        displayOrder: 2,
        isMain: false,
      },
    ],

    // Reviews
    reviews: [
      {
        id: 5,
        userId: 5,
        productId: 6,
        rating: 5,
        title: "Matcha chất lượng cao",
        comment:
          "Vị rất thơm và đậm đà, màu xanh đẹp. Pha latte rất ngon. Đáng đồng tiền bát gạo.",
        isApproved: true,
        isVerifiedPurchase: true,
        helpfulCount: 23,
        createdAt: "2024-01-12T11:20:00Z",
        user: {
          id: 5,
          firstName: "Phương",
          lastName: "Linh",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        },
      },
    ],

    // Related products
    relatedProducts: [
      {
        id: 1,
        name: "Mì Ramen Ichiran Instant Premium",
        price: 450000,
        originalPrice: 520000,
        mainImage:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=300&fit=crop",
        rating: 4.8,
        reviewCount: 234,
        slug: "mi-ramen-ichiran-instant-premium",
      },
    ],
  },
];

// Users data
export const users = [
  {
    id: 1,
    email: "minhanh@example.com",
    firstName: "Minh",
    lastName: "Anh",
    phoneNumber: "0987654321",
    dateOfBirth: "1990-05-15T00:00:00Z",
    gender: 2, // Female
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b098?w=100&h=100&fit=crop",
    preferredLanguage: "vi",
    emailVerified: true,
    phoneVerified: true,
    points: 1250,
    totalSpent: 2800000,
    tier: 2, // Silver
    role: 1, // Customer
    isActive: true,
    createdAt: "2023-06-15T09:30:00Z",
  },
  {
    id: 2,
    email: "thuthao@example.com",
    firstName: "Thu",
    lastName: "Thảo",
    phoneNumber: "0912345678",
    dateOfBirth: "1995-08-22T00:00:00Z",
    gender: 2, // Female
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    preferredLanguage: "vi",
    emailVerified: true,
    phoneVerified: false,
    points: 580,
    totalSpent: 1200000,
    tier: 1, // Bronze
    role: 1, // Customer
    isActive: true,
    createdAt: "2023-09-10T14:20:00Z",
  },
  {
    id: 3,
    email: "lanhuong@example.com",
    firstName: "Lan",
    lastName: "Hương",
    phoneNumber: "0901234567",
    dateOfBirth: "1988-12-03T00:00:00Z",
    gender: 2, // Female
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    preferredLanguage: "vi",
    emailVerified: true,
    phoneVerified: true,
    points: 2340,
    totalSpent: 5600000,
    tier: 3, // Gold
    role: 1, // Customer
    isActive: true,
    createdAt: "2023-03-20T08:15:00Z",
  },
  {
    id: 4,
    email: "hoangnam@example.com",
    firstName: "Hoàng",
    lastName: "Nam",
    phoneNumber: "0978123456",
    dateOfBirth: "1985-07-18T00:00:00Z",
    gender: 1, // Male
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    preferredLanguage: "vi",
    emailVerified: true,
    phoneVerified: true,
    points: 890,
    totalSpent: 3200000,
    tier: 2, // Silver
    role: 1, // Customer
    isActive: true,
    createdAt: "2023-04-12T16:45:00Z",
  },
  {
    id: 5,
    email: "phuonglinh@example.com",
    firstName: "Phương",
    lastName: "Linh",
    phoneNumber: "0965432109",
    dateOfBirth: "1992-11-28T00:00:00Z",
    gender: 2, // Female
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    preferredLanguage: "vi",
    emailVerified: true,
    phoneVerified: true,
    points: 1650,
    totalSpent: 4100000,
    tier: 3, // Gold
    role: 1, // Customer
    isActive: true,
    createdAt: "2023-07-08T10:30:00Z",
  },
];

// Orders data
export const orders = [
  {
    id: 1,
    userId: 1,
    orderNumber: "ORD-2024-001234",
    subTotal: 830000,
    shippingFee: 30000,
    discountAmount: 50000,
    taxAmount: 0,
    totalAmount: 810000,
    status: 4, // Shipped
    paymentStatus: 2, // Paid
    shippingAddress: "123 Đường Nguyễn Du, Phường Bến Nghé, Quận 1, TP.HCM",
    receiverName: "Nguyễn Minh Anh",
    receiverPhone: "0987654321",
    deliveryMethod: 2, // Express
    estimatedDeliveryDate: "2024-01-25T00:00:00Z",
    trackingNumber: "VNP123456789",
    orderDate: "2024-01-20T10:30:00Z",
    confirmedDate: "2024-01-20T14:20:00Z",
    shippedDate: "2024-01-21T09:15:00Z",
    items: [
      {
        id: 1,
        orderId: 1,
        productId: 1,
        quantity: 2,
        unitPrice: 450000,
        totalPrice: 900000,
        productName: "Mì Ramen Ichiran Instant Premium",
        productSku: "ICH-RAM-001",
        productImage:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=300&fit=crop",
      },
    ],
  },
  {
    id: 2,
    userId: 2,
    orderNumber: "ORD-2024-001235",
    subTotal: 380000,
    shippingFee: 30000,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 410000,
    status: 5, // Delivered
    paymentStatus: 2, // Paid
    shippingAddress: "456 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM",
    receiverName: "Trần Thu Thảo",
    receiverPhone: "0912345678",
    deliveryMethod: 1, // Standard
    estimatedDeliveryDate: "2024-01-28T00:00:00Z",
    trackingNumber: "VNP987654321",
    orderDate: "2024-01-18T15:20:00Z",
    confirmedDate: "2024-01-18T16:30:00Z",
    shippedDate: "2024-01-19T08:45:00Z",
    deliveredDate: "2024-01-22T14:20:00Z",
    items: [
      {
        id: 2,
        orderId: 2,
        productId: 2,
        quantity: 1,
        unitPrice: 380000,
        totalPrice: 380000,
        productName: "Serum Vitamin C Klairs Freshly Juiced",
        productSku: "KLA-SER-002",
        productImage:
          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop",
      },
    ],
  },
];

// Hero slides data (keeping from original)
export const heroSlides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1528164344705-47542687000d?w=1200&h=600&fit=crop",
    title: "Khám Phá Văn Hóa Nhật Bản",
    subtitle: "Những sản phẩm chính hãng từ xứ sở hoa anh đào",
    cta: "Mua Ngay",
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Đồ Ăn Nhật Bản Cao Cấp",
    subtitle: "Trải nghiệm hương vị đích thực Nhật Bản",
    cta: "Khám Phá",
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1740679953649-2b30f3fa0314?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Đồ Dùng Gia Đình Nhật",
    subtitle: "Chất lượng vượt trội, thiết kế tinh tế",
    cta: "Xem Thêm",
    isActive: true,
    displayOrder: 3,
  },
];

// Features data
export const features = [
  {
    id: 1,
    icon: "Shield",
    title: "Chính Hãng 100%",
    description: "Nhập khẩu trực tiếp từ Nhật Bản, cam kết chất lượng",
    gradient: "from-red-400 to-red-600",
    bgGradient: "from-red-500/5 to-pink-500/5",
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 2,
    icon: "Zap",
    title: "Miễn Phí Vận Chuyển",
    description: "Đơn hàng từ 500.000đ, giao hàng nhanh chóng",
    gradient: "from-blue-400 to-blue-600",
    bgGradient: "from-blue-500/5 to-cyan-500/5",
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 3,
    icon: "Clock",
    title: "Hỗ Trợ 24/7",
    description: "Tư vấn nhiệt tình, giải đáp mọi thắc mắc",
    gradient: "from-green-400 to-green-600",
    bgGradient: "from-green-500/5 to-emerald-500/5",
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 4,
    icon: "RefreshCw",
    title: "Đổi Trả Dễ Dàng",
    description: "Trong vòng 7 ngày, không cần lý do",
    gradient: "from-purple-400 to-purple-600",
    bgGradient: "from-purple-500/5 to-pink-500/5",
    isActive: true,
    displayOrder: 4,
  },
];

// Statistics data
export const stats = [
  {
    id: 1,
    value: "10K+",
    label: "Khách Hàng",
    color: "text-red-600",
    icon: "Users",
  },
  {
    id: 2,
    value: "5K+",
    label: "Sản Phẩm",
    color: "text-blue-600",
    icon: "Package",
  },
  {
    id: 3,
    value: "99%",
    label: "Hài Lòng",
    color: "text-green-600",
    icon: "Heart",
  },
  {
    id: 4,
    value: "24/7",
    label: "Hỗ Trợ",
    color: "text-purple-600",
    icon: "Headphones",
  },
];

// Coupons data
export const coupons = [
  {
    id: 1,
    code: "WELCOME10",
    name: "Chào mừng khách hàng mới",
    description: "Giảm 10% cho đơn hàng đầu tiên",
    type: 1, // Percentage
    value: 10,
    minimumAmount: 500000,
    maximumDiscount: 100000,
    usageLimit: 1000,
    usageCount: 245,
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z",
    isActive: true,
  },
  {
    id: 2,
    code: "FREESHIP",
    name: "Miễn phí vận chuyển",
    description: "Miễn phí ship cho đơn từ 300k",
    type: 3, // FreeShipping
    value: 0,
    minimumAmount: 300000,
    maximumDiscount: 50000,
    usageLimit: null,
    usageCount: 1567,
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z",
    isActive: true,
  },
];

// Shipping zones data
export const shippingZones = [
  {
    id: 1,
    name: "Nội thành TP.HCM",
    description:
      "Quận 1, 2, 3, 4, 5, 7, 10, 11, Bình Thạnh, Tân Bình, Phú Nhuận",
    standardFee: 25000,
    expressFee: 40000,
    superFastFee: 60000,
    isActive: true,
  },
  {
    id: 2,
    name: "Ngoại thành TP.HCM",
    description: "Các quận/huyện còn lại của TP.HCM",
    standardFee: 35000,
    expressFee: 50000,
    superFastFee: 80000,
    isActive: true,
  },
  {
    id: 3,
    name: "Miền Nam (trừ TP.HCM)",
    description: "Các tỉnh miền Nam",
    standardFee: 45000,
    expressFee: 70000,
    superFastFee: null, // Không hỗ trợ
    isActive: true,
  },
  {
    id: 4,
    name: "Miền Bắc & Miền Trung",
    description: "Các tỉnh miền Bắc và miền Trung",
    standardFee: 60000,
    expressFee: 90000,
    superFastFee: null, // Không hỗ trợ
    isActive: true,
  },
];

// Payment methods data
export const paymentMethods = [
  {
    id: 1,
    name: "Thanh toán khi nhận hàng (COD)",
    description: "Thanh toán bằng tiền mặt khi nhận hàng",
    type: "COD",
    isActive: true,
    displayOrder: 1,
    fee: 0,
    icon: "💵",
  },
  {
    id: 2,
    name: "Chuyển khoản ngân hàng",
    description: "Chuyển khoản qua các ngân hàng trong nước",
    type: "BANK_TRANSFER",
    isActive: true,
    displayOrder: 2,
    fee: 0,
    icon: "🏦",
  },
  {
    id: 3,
    name: "Ví điện tử MoMo",
    description: "Thanh toán qua ví MoMo",
    type: "MOMO",
    isActive: true,
    displayOrder: 3,
    fee: 0,
    icon: "📱",
  },
  {
    id: 4,
    name: "Thẻ tín dụng/ghi nợ",
    description: "Visa, Mastercard, JCB",
    type: "CREDIT_CARD",
    isActive: true,
    displayOrder: 4,
    fee: 0,
    icon: "💳",
  },
];

// Footer links data
export const footerLinks = {
  quickLinks: [
    { name: "Về Chúng Tôi", href: "/about", icon: "Info" },
    { name: "Sản Phẩm", href: "/products", icon: "Package" },
    { name: "Tin Tức", href: "/news", icon: "Newspaper" },
    { name: "Liên Hệ", href: "/contact", icon: "Phone" },
  ],
  customerService: [
    { name: "Hướng Dẫn Mua Hàng", href: "/guide", icon: "HelpCircle" },
    { name: "Chính Sách Đổi Trả", href: "/return-policy", icon: "RotateCcw" },
    { name: "Câu Hỏi Thường Gặp", href: "/faq", icon: "MessageCircle" },
    { name: "Bảo Mật Thông Tin", href: "/privacy", icon: "Shield" },
  ],
  policies: [
    { name: "Điều Khoản Sử Dụng", href: "/terms", icon: "FileText" },
    { name: "Chính Sách Bảo Mật", href: "/privacy-policy", icon: "Lock" },
    { name: "Chính Sách Cookie", href: "/cookie-policy", icon: "Cookie" },
    { name: "Quy Định Giao Hàng", href: "/shipping-policy", icon: "Truck" },
  ],
};

// Contact information
export const contactInfo = {
  company: "Nihon Store Vietnam",
  address: "Tầng KT tòa Ct1A Mễ Trì Plaza, Nam Từ Liêm, Hà Nội",
  phone: "1900-1234",
  email: "info@nihonstore.vn",
  website: "https://nihonstore.vn",
  businessHours: "8:00 - 22:00 (Thứ 2 - Chủ Nhật)",
  socialMedia: {
    facebook: "https://facebook.com/nihonstorevi",
    instagram: "https://instagram.com/nihonstore.vn",
    youtube: "https://youtube.com/@nihonstore",
    tiktok: "https://tiktok.com/@nihonstore.vn",
  },
};

// Notifications data
export const notifications = [
  {
    id: 1,
    userId: 1,
    title: "Đơn hàng đã được giao thành công",
    message:
      "Đơn hàng #ORD-2024-001234 đã được giao thành công. Cảm ơn bạn đã mua sắm tại Nihon Store!",
    type: "ORDER_DELIVERED",
    isRead: false,
    createdAt: "2024-01-22T14:20:00Z",
  },
  {
    id: 2,
    userId: 1,
    title: "Khuyến mãi đặc biệt dành cho bạn",
    message:
      "Giảm 15% cho tất cả sản phẩm làm đẹp. Sử dụng mã BEAUTY15. Có hiệu lực đến 31/01.",
    type: "PROMOTION",
    isRead: true,
    createdAt: "2024-01-20T09:00:00Z",
  },
];

// Product attributes for filtering/variants
export const productAttributes = [
  {
    id: 1,
    name: "Kích thước",
    slug: "size",
    type: "SELECT",
    isRequired: false,
    displayOrder: 1,
    values: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 2,
    name: "Màu sắc",
    slug: "color",
    type: "COLOR",
    isRequired: false,
    displayOrder: 2,
    values: ["Đỏ", "Xanh", "Vàng", "Trắng", "Đen"],
  },
  {
    id: 3,
    name: "Trọng lượng",
    slug: "weight",
    type: "NUMBER",
    isRequired: false,
    displayOrder: 3,
    values: ["50g", "100g", "200g", "500g"],
  },
];

// Helper functions for getting related data
export const getProductById = (id) => products.find((p) => p.id === id);
export const getBrandById = (id) => brands.find((b) => b.id === id);
export const getCategoryById = (id) => categories.find((c) => c.id === id);
export const getUserById = (id) => users.find((u) => u.id === id);
export const getOrderById = (id) => orders.find((o) => o.id === id);

export const getProductsByCategory = (categoryId) =>
  products.filter((p) => p.categoryId === categoryId);

export const getProductsByBrand = (brandId) =>
  products.filter((p) => p.brandId === brandId);

export const getFeaturedProducts = () =>
  products.filter((p) => p.isFeatured && p.isActive);

export const getNewProducts = () =>
  products.filter((p) => p.isNew && p.isActive);

export const getBestSellingProducts = () =>
  products.sort((a, b) => b.soldCount - a.soldCount).slice(0, 10);

export const getTopRatedProducts = () =>
  products.sort((a, b) => b.rating - a.rating).slice(0, 10);

// Default export with all data
export default {
  brands,
  categories,
  products,
  users,
  orders,
  heroSlides,
  features,
  stats,
  coupons,
  shippingZones,
  paymentMethods,
  footerLinks,
  contactInfo,
  notifications,
  productAttributes,
  // Helper functions
  getProductById,
  getBrandById,
  getCategoryById,
  getUserById,
  getOrderById,
  getProductsByCategory,
  getProductsByBrand,
  getFeaturedProducts,
  getNewProducts,
  getBestSellingProducts,
  getTopRatedProducts,
};
