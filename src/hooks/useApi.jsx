import { useState, useEffect, useCallback } from "react";
import {
  productService,
  categoryService,
  brandService,
} from "../services/index.js";

// Custom hook for fetching products
export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await productService.getProducts({
          ...initialParams,
          ...params,
        });
        console.log("🐛 API Response:", response); // Debug log
        setProducts(response.products || []);
        setPagination(response.pagination || {});
      } catch (err) {
        console.error("🐛 API Error:", err); // Debug log
        setError(err.message || "Failed to fetch products");
        setProducts([]);
        setPagination({});
      } finally {
        setLoading(false);
      }
    },
    [initialParams]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    pagination,
    loading,
    error,
    refetch: fetchProducts,
    setProducts,
  };
};

// Custom hook for fetching single product
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await productService.getProductById(productId);
      setProduct(response.product);
    } catch (err) {
      setError(err.message || "Failed to fetch product");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
};

// Custom hook for featured products
export const useFeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeaturedProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await productService.getFeaturedProducts();
      setProducts(response.products);
    } catch (err) {
      setError(err.message || "Failed to fetch featured products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchFeaturedProducts,
  };
};

// Custom hook for categories
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await categoryService.getCategories();
      setCategories(response.categories);
    } catch (err) {
      setError(err.message || "Failed to fetch categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};

// Custom hook for brands
export const useBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await brandService.getBrands();
      setBrands(response.brands);
    } catch (err) {
      setError(err.message || "Failed to fetch brands");
      setBrands([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return {
    brands,
    loading,
    error,
    refetch: fetchBrands,
  };
};

// Custom hook for products by category (Updated to use categoryId)
export const useProductsByCategory = (categoryId, params = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProductsByCategory = useCallback(async () => {
    if (!categoryId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await productService.getProductsByCategory(
        categoryId,
        params
      );
      setProducts(response.products);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || "Failed to fetch products by category");
      setProducts([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  }, [categoryId, params]);

  useEffect(() => {
    fetchProductsByCategory();
  }, [fetchProductsByCategory]);

  return {
    products,
    pagination,
    loading,
    error,
    refetch: fetchProductsByCategory,
  };
};

// Custom hook for search products
export const useProductSearch = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchProducts = useCallback(async (query, params = {}) => {
    if (!query) {
      setProducts([]);
      setPagination({});
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await productService.searchProducts(query, params);
      setProducts(response.products);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || "Failed to search products");
      setProducts([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    pagination,
    loading,
    error,
    searchProducts,
  };
};
