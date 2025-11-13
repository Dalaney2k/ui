// Transform API data to match current app format
export const transformProduct = (apiProduct) => {
  if (!apiProduct) return null;

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    description: apiProduct.shortDescription || "",
    price: apiProduct.price,
    originalPrice: apiProduct.originalPrice,
    stock: apiProduct.stock,
    mainImage: apiProduct.mainImage,
    brandId: apiProduct.brand?.id,
    categoryId: apiProduct.category?.id,

    // Statistics
    rating: apiProduct.rating,
    reviewCount: apiProduct.reviewCount,
    viewCount: apiProduct.viewCount,
    soldCount: apiProduct.soldCount,

    // Flags
    isFeatured: apiProduct.isFeatured,
    isNew: apiProduct.isNew,
    status: apiProduct.status,
    isActive: apiProduct.status === 1,

    // Additional fields for compatibility
    category: apiProduct.category?.slug || "all",

    // Nested objects
    brand: apiProduct.brand
      ? {
          id: apiProduct.brand.id,
          name: apiProduct.brand.name,
          slug: apiProduct.brand.slug,
          logoUrl: apiProduct.brand.logoUrl,
          isActive: apiProduct.brand.isActive,
        }
      : null,

    categoryInfo: apiProduct.category
      ? {
          id: apiProduct.category.id,
          name: apiProduct.category.name,
          slug: apiProduct.category.slug,
          imageUrl: apiProduct.category.imageUrl,
          isActive: apiProduct.category.isActive,
        }
      : null,

    // Images array (currently empty in API)
    images: apiProduct.images || [],

    // Additional API fields
    condition: apiProduct.condition,
    wishlistCount: apiProduct.wishlistCount,
    isInStock: apiProduct.isInStock,
    isOnSale: apiProduct.isOnSale,
    isBestseller: apiProduct.isBestseller,
    isLimitedEdition: apiProduct.isLimitedEdition,
    isGiftWrappingAvailable: apiProduct.isGiftWrappingAvailable,
    allowBackorder: apiProduct.allowBackorder,
    allowPreorder: apiProduct.allowPreorder,
    createdAt: apiProduct.createdAt,
    updatedAt: apiProduct.updatedAt,
  };
};

// Transform array of products
export const transformProducts = (apiProducts) => {
  if (!Array.isArray(apiProducts)) return [];
  return apiProducts.map(transformProduct);
};

// Transform category data
export const transformCategory = (apiCategory) => {
  if (!apiCategory) return null;

  return {
    id: apiCategory.id,
    name: apiCategory.name,
    slug: apiCategory.slug,
    description: apiCategory.description || "",
    imageUrl: apiCategory.imageUrl,
    icon: apiCategory.icon || "📦",
    parentId: apiCategory.parentId || null,
    displayOrder: apiCategory.displayOrder || 1,
    isActive: apiCategory.isActive,
    children: apiCategory.children
      ? apiCategory.children.map(transformCategory)
      : [],
  };
};

// Transform array of categories
export const transformCategories = (apiCategories) => {
  if (!Array.isArray(apiCategories)) return [];
  return apiCategories.map(transformCategory);
};

// Transform brand data
export const transformBrand = (apiBrand) => {
  if (!apiBrand) return null;

  return {
    id: apiBrand.id,
    name: apiBrand.name,
    slug: apiBrand.slug,
    logoUrl: apiBrand.logoUrl,
    description: apiBrand.description || "",
    country: apiBrand.country || "Japan",
    website: apiBrand.website || "",
    displayOrder: apiBrand.displayOrder || 1,
    isActive: apiBrand.isActive,
  };
};

// Transform array of brands
export const transformBrands = (apiBrands) => {
  if (!Array.isArray(apiBrands)) return [];
  return apiBrands.map(transformBrand);
};

// Get category options for filter dropdown
export const getCategoryOptions = (categories) => {
  const options = [{ value: "all", label: "Tất cả danh mục" }];

  categories.forEach((category) => {
    options.push({
      value: category.slug,
      label: category.name,
    });

    // Add children if exists
    if (category.children && category.children.length > 0) {
      category.children.forEach((child) => {
        options.push({
          value: child.slug,
          label: `  └ ${child.name}`,
        });
      });
    }
  });

  return options;
};

// Filter products by category (for local filtering if needed)
export const filterProductsByCategory = (products, categorySlug) => {
  if (!categorySlug || categorySlug === "all") {
    return products;
  }

  return products.filter(
    (product) =>
      product.category === categorySlug ||
      product.categoryInfo?.slug === categorySlug
  );
};

// Get price formatting (keeping existing format)
export const formatPrice = (price) => {
  // Handle invalid inputs
  if (price === null || price === undefined || isNaN(price)) {
    return "0đ";
  }

  // Convert to number if it's a string
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numPrice)) {
    return "0đ";
  }

  return numPrice.toLocaleString("vi-VN") + "đ";
};

// Get discount percentage
export const getDiscountPercentage = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) {
    return 0;
  }

  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Check if product is on sale
export const isProductOnSale = (product) => {
  return product.originalPrice && product.originalPrice > product.price;
};

// Get product status text
export const getProductStatusText = (product) => {
  if (!product.isInStock) return "Hết hàng";
  if (product.stock <= 5) return "Sắp hết hàng";
  if (product.isNew) return "Mới";
  if (product.isBestseller) return "Bán chạy";
  if (product.isFeatured) return "Nổi bật";
  return "Còn hàng";
};

// Get product badge info
export const getProductBadges = (product) => {
  const badges = [];

  if (product.isNew) {
    badges.push({ text: "Mới", className: "bg-green-500 text-white" });
  }

  if (product.isBestseller) {
    badges.push({ text: "Bán chạy", className: "bg-orange-500 text-white" });
  }

  if (product.isLimitedEdition) {
    badges.push({ text: "Giới hạn", className: "bg-purple-500 text-white" });
  }

  if (isProductOnSale(product)) {
    const discount = getDiscountPercentage(
      product.originalPrice,
      product.price
    );
    badges.push({ text: `-${discount}%`, className: "bg-red-500 text-white" });
  }

  return badges;
};

export default {
  transformProduct,
  transformProducts,
  transformCategory,
  transformCategories,
  transformBrand,
  transformBrands,
  getCategoryOptions,
  filterProductsByCategory,
  formatPrice,
  getDiscountPercentage,
  isProductOnSale,
  getProductStatusText,
  getProductBadges,
};
