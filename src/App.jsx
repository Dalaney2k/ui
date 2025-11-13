// App.jsx - Performance Optimized Version
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import "./styles/styles.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";

// Lazy load heavy components
const ProductDetailPage = React.lazy(() =>
  import("./components/Product/ProductDetailPage")
);
const CheckoutPage = React.lazy(() => import("./pages/CheckoutPage"));
const AdminRouter = React.lazy(() => import("./admin/AdminRouter"));

// Static imports for frequently used components
import Header from "./components/Header/MainHeader";
import { Footer } from "./components/Layout";
import { Home, ProductsPage, UserProfile, About } from "./pages";
import { LoginModal, SignupModal } from "./components/Auth";
import { QuickViewProduct } from "./components/Product";
import ProductFiltersDemo from "./examples/ProductFiltersDemo.jsx";
import { NotificationBar } from "./components/Common";
import ScrollToTop from "./components/Common/ScrollToTop";
import FloatingButtons from "./components/Common/FloatingButtons";
import ChatModal from "./components/Common/ChatModal";
import { ShoppingCart } from "./components/Cart";
import { CartProvider } from "./contexts/CartContext";
import {
  AuthProvider,
  useAuth as useAuthContext,
} from "./contexts/AuthContext";
import { MessageProvider } from "./contexts/MessageContext";
import { useCart } from "./hooks/useCart";
import { useWishlist } from "./hooks/useWishlist";

const initialUIState = {
  isMenuOpen: false,
  selectedCategory: "all",
  isUserMenuOpen: false,
  isLoginModalOpen: false,
  isSignupModalOpen: false,
  isQuickViewOpen: false,
  isChatModalOpen: false,
};

const initialFormState = {
  login: { email: "", password: "" },
  signup: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
};

const initialQuickViewState = {
  product: null,
  quantity: 1,
};

const useUIState = () => {
  const [uiState, setUIState] = useState(initialUIState);
  const [formState, setFormState] = useState(initialFormState);
  const [quickViewState, setQuickViewState] = useState(initialQuickViewState);

  const updateUI = useCallback((updates) => {
    setUIState((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateForm = useCallback((formType, updates) => {
    setFormState((prev) => ({
      ...prev,
      [formType]: { ...prev[formType], ...updates },
    }));
  }, []);

  const updateQuickView = useCallback((updates) => {
    setQuickViewState((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    uiState,
    formState,
    quickViewState,
    updateUI,
    updateForm,
    updateQuickView,
  };
};

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, title, message) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      type,
      title,
      message,
    };

    setNotifications((prev) => {
      // Check for recent duplicates
      const recentDuplicate = prev.find(
        (n) =>
          n.message === message &&
          n.type === type &&
          newNotification.id - n.id < 1000
      );

      if (recentDuplicate) return prev;

      return [...prev, newNotification];
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id)
      );
    }, 5000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { notifications, addNotification, removeNotification };
};

// 🎯 OPTIMIZATION 4: Memoized components
const MemoizedHeader = React.memo(Header);
const MemoizedFooter = React.memo(Footer);
const MemoizedFloatingButtons = React.memo(FloatingButtons);

// 🎯 OPTIMIZATION 5: Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <MessageProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Admin Routes - Lazy loaded */}
              <Route path="/admin/*" element={<AdminRouter />} />

              {/* Customer Routes */}
              <Route path="/*" element={<AppContent />} />
            </Routes>
          </Suspense>
        </Router>
        </MessageProvider>
      </CartProvider>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { user, login, register, logout, isAuthLoading } = useAuthContext();
  const {
    cartItems,
    isCartOpen,
    addToCart: addToCartContext,
    openCart,
    closeCart,
    loadCart,
    mergeGuestCart,
  } = useCart();

  const {
    wishlistItems,
    wishlistCount,
    toggleWishlist,
    isInWishlist,
    loadWishlist,
  } = useWishlist();

  const navigate = useNavigate();

  // 🎯 OPTIMIZATION 6: Use custom hooks instead of multiple useState
  const { notifications, addNotification, removeNotification } =
    useNotifications();
  const {
    uiState,
    formState,
    quickViewState,
    updateUI,
    updateForm,
    updateQuickView,
  } = useUIState();

  // 🎯 OPTIMIZATION 7: Memoized reload function
  const reloadUserData = useCallback(async () => {
    try {
      console.log("🔄 Starting reload process");

      // Run operations in parallel instead of sequential
      const operations = [];

      if (mergeGuestCart) {
        operations.push(
          mergeGuestCart().catch((error) => {
            console.warn("⚠️ Guest cart merge failed:", error);
            return null;
          })
        );
      }

      if (loadCart) {
        operations.push(
          loadCart().catch((error) => {
            console.warn("⚠️ Cart loading failed:", error);
            return null;
          })
        );
      }

      if (loadWishlist) {
        operations.push(
          loadWishlist().catch((error) => {
            console.warn("⚠️ Wishlist loading failed:", error);
            return null;
          })
        );
      }

      // Wait for all operations to complete
      await Promise.allSettled(operations);
      console.log("✅ Reload process completed");
    } catch (error) {
      console.error("❌ Error during reload:", error);
    }
  }, [mergeGuestCart, loadCart, loadWishlist]);

  const addToCart = useCallback(
    async (product) => {
      try {
        if (import.meta.env.DEV) {
          console.log("🛒 Adding to cart:", product.name);
        }

        const result = await addToCartContext(product);

        if (result?.success) {
          addNotification(
            "success",
            "Thành công!",
            `Đã thêm ${product.name} vào giỏ hàng`
          );
        } else {
          addNotification(
            "error",
            "Lỗi!",
            result?.message || "Không thể thêm sản phẩm"
          );
        }
      } catch (error) {
        console.error("🛒 Add to cart error:", error);
        addNotification(
          "error",
          "Lỗi!",
          "Không thể thêm sản phẩm vào giỏ hàng"
        );
      }
    },
    [addToCartContext, addNotification]
  );

  // 🎯 OPTIMIZATION 9: Memoized auth handlers
  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();

      const { email, password } = formState.login;
      if (!email || !password) {
        addNotification("error", "Lỗi!", "Vui lòng điền đầy đủ thông tin");
        return;
      }

      try {
        console.log("🔍 Starting login process");
        const response = await login({ email, password });

        if (response?.success) {
          updateUI({ isLoginModalOpen: false });
          updateForm("login", { email: "", password: "" });

          addNotification(
            "success",
            "Đăng nhập thành công!",
            `Chào mừng ${response.user?.name || "bạn"}!`
          );

          // Reload user data after successful login
          await reloadUserData();

          // Handle redirect
          const urlParams = new URLSearchParams(window.location.search);
          const redirect = urlParams.get("redirect");
          if (redirect === "/checkout") {
            setTimeout(() => navigate("/checkout"), 500);
          }
        } else {
          addNotification(
            "error",
            "Đăng nhập thất bại",
            response?.message || "Thông tin đăng nhập không chính xác"
          );
        }
      } catch (error) {
        console.error("🔴 Login error:", error);
        addNotification(
          "error",
          "Lỗi đăng nhập",
          "Không thể kết nối đến server"
        );
      }
    },
    [
      formState.login,
      login,
      addNotification,
      updateUI,
      updateForm,
      reloadUserData,
      navigate,
    ]
  );

  const handleSignup = useCallback(
    async (e) => {
      e.preventDefault();

      const { firstName, lastName, email, password, confirmPassword } =
        formState.signup;

      if (!firstName || !lastName || !email || !password) {
        addNotification("error", "Lỗi!", "Vui lòng điền đầy đủ thông tin");
        return;
      }

      if (password !== confirmPassword) {
        addNotification("error", "Lỗi!", "Mật khẩu không khớp");
        return;
      }

      try {
        const response = await register({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        });

        if (response?.success) {
          updateUI({ isSignupModalOpen: false });
          updateForm("signup", {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          });

          addNotification(
            "success",
            "Đăng ký thành công!",
            `Chào mừng ${response.user?.name || "bạn"}!`
          );

          await reloadUserData();

          const urlParams = new URLSearchParams(window.location.search);
          const redirect = urlParams.get("redirect");
          if (redirect === "/checkout") {
            setTimeout(() => navigate("/checkout"), 500);
          }
        } else {
          addNotification(
            "error",
            "Đăng ký thất bại",
            response?.message || "Không thể tạo tài khoản"
          );
        }
      } catch (error) {
        console.error("Signup error:", error);
        addNotification("error", "Lỗi đăng ký", "Không thể kết nối đến server");
      }
    },
    [
      formState.signup,
      register,
      addNotification,
      updateUI,
      updateForm,
      reloadUserData,
      navigate,
    ]
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      updateUI({ isUserMenuOpen: false });

      // Reload data after logout
      await Promise.allSettled([loadCart?.(), loadWishlist?.()]);

      addNotification("info", "Hẹn gặp lại!", "Đã đăng xuất thành công");

      if (window.location.pathname === "/checkout") {
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      addNotification("info", "Hẹn gặp lại!", "Đã đăng xuất thành công");

      if (window.location.pathname === "/checkout") {
        navigate("/");
      }
    }
  }, [logout, updateUI, loadCart, loadWishlist, addNotification, navigate]);

  // 🎯 OPTIMIZATION 10: Memoized handlers
  const handleQuickView = useCallback(
    (product) => {
      updateQuickView({ product, quantity: 1 });
      updateUI({ isQuickViewOpen: true });
    },
    [updateQuickView, updateUI]
  );

  const handleCheckout = useCallback(() => {
    if (!user) {
      addNotification(
        "warning",
        "Cần đăng nhập",
        "Vui lòng đăng nhập để tiếp tục thanh toán"
      );
      updateUI({ isLoginModalOpen: true });
      return;
    }

    closeCart();
    navigate("/checkout");
    addNotification(
      "info",
      "Chuyển đến trang thanh toán",
      "Đang chuyển hướng..."
    );
  }, [user, addNotification, updateUI, closeCart, navigate]);

  const handleChatClick = useCallback(() => {
    updateUI({ isChatModalOpen: true });
  }, [updateUI]);

  const handleShareClick = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "SakuraHome - Cửa hàng nội thất",
          text: "Khám phá những sản phẩm nội thất tuyệt vời tại SakuraHome!",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        addNotification(
          "success",
          "Thành công!",
          "Đã copy link vào clipboard!"
        );
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Share failed:", error);
        addNotification("error", "Lỗi!", "Không thể chia sẻ link");
      }
    }
  }, [addNotification]);

  // 🎯 OPTIMIZATION 11: Memoize props objects to prevent unnecessary re-renders
  const headerProps = useMemo(
    () => ({
      isMenuOpen: uiState.isMenuOpen,
      setIsMenuOpen: (value) => updateUI({ isMenuOpen: value }),
      selectedCategory: uiState.selectedCategory,
      setSelectedCategory: (value) => updateUI({ selectedCategory: value }),
      cartItems,
      wishlistItems,
      wishlistCount,
      user,
      isUserMenuOpen: uiState.isUserMenuOpen,
      setIsUserMenuOpen: (value) => updateUI({ isUserMenuOpen: value }),
      setIsLoginModalOpen: (value) => updateUI({ isLoginModalOpen: value }),
      setIsSignupModalOpen: (value) => updateUI({ isSignupModalOpen: value }),
      handleLogout,
      openCart,
      addToCart,
      onQuickView: handleQuickView,
    }),
    [
      uiState.isMenuOpen,
      uiState.selectedCategory,
      uiState.isUserMenuOpen,
      cartItems,
      wishlistItems,
      wishlistCount,
      user,
      updateUI,
      handleLogout,
      openCart,
      addToCart,
      handleQuickView,
    ]
  );

  const commonPageProps = useMemo(
    () => ({
      addToCart,
      toggleWishlist,
      wishlistItems,
      isInWishlist,
      onQuickView: handleQuickView,
      onNotification: addNotification,
    }),
    [
      addToCart,
      toggleWishlist,
      wishlistItems,
      isInWishlist,
      handleQuickView,
      addNotification,
    ]
  );

  return (
    <>
      <NotificationBar
        notifications={notifications}
        onClose={removeNotification}
      />

      <MemoizedHeader {...headerProps} />

      <div className="pt-0">
        <ScrollToTop />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home {...commonPageProps} />} />
            <Route
              path="/products"
              element={
                <ProductsPage
                  {...commonPageProps}
                  selectedCategory={uiState.selectedCategory}
                  setSelectedCategory={(value) =>
                    updateUI({ selectedCategory: value })
                  }
                />
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProductDetailWrapper
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                  wishlistItems={wishlistItems}
                  isInWishlist={isInWishlist}
                />
              }
            />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/about" element={<About />} />
            <Route path="/demo/filters" element={<ProductFiltersDemo />} />
          </Routes>
        </Suspense>
      </div>

      <MemoizedFooter />

      {/* 🎯 OPTIMIZATION 12: Conditional rendering for modals */}
      {uiState.isLoginModalOpen && (
        <LoginModal
          isOpen={uiState.isLoginModalOpen}
          onClose={() => updateUI({ isLoginModalOpen: false })}
          loginForm={formState.login}
          setLoginForm={(updates) => updateForm("login", updates)}
          handleLogin={handleLogin}
          setIsSignupModalOpen={(value) =>
            updateUI({ isSignupModalOpen: value })
          }
          isLoading={isAuthLoading}
        />
      )}

      {uiState.isSignupModalOpen && (
        <SignupModal
          isOpen={uiState.isSignupModalOpen}
          onClose={() => updateUI({ isSignupModalOpen: false })}
          signupForm={formState.signup}
          setSignupForm={(updates) => updateForm("signup", updates)}
          handleSignup={handleSignup}
          setIsLoginModalOpen={(value) => updateUI({ isLoginModalOpen: value })}
          isLoading={isAuthLoading}
        />
      )}

      {uiState.isQuickViewOpen && (
        <QuickViewProduct
          isOpen={uiState.isQuickViewOpen}
          onClose={() => updateUI({ isQuickViewOpen: false })}
          product={quickViewState.product}
          quantity={quickViewState.quantity}
          setQuantity={(value) => updateQuickView({ quantity: value })}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          wishlistItems={wishlistItems}
          isInWishlist={isInWishlist}
        />
      )}

      <ShoppingCart
        isOpen={isCartOpen}
        onClose={closeCart}
        onCheckout={handleCheckout}
      />

      <MemoizedFloatingButtons
        onMessageClick={handleChatClick}
        onShareClick={handleShareClick}
      />

      {uiState.isChatModalOpen && (
        <ChatModal
          isOpen={uiState.isChatModalOpen}
          onClose={() => updateUI({ isChatModalOpen: false })}
          productInfo={null}
        />
      )}
    </>
  );
};

const ProductDetailWrapper = React.memo(
  ({ addToCart, toggleWishlist, wishlistItems, isInWishlist }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleProductClick = useCallback(
      (product) => {
        navigate(`/product/${product.id}`);
      },
      [navigate]
    );

    return (
      <Suspense fallback={<LoadingFallback />}>
        <ProductDetailPage
          productId={parseInt(id, 10)}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          wishlistItems={wishlistItems}
          onProductClick={handleProductClick}
        />
      </Suspense>
    );
  }
);

ProductDetailWrapper.displayName = "ProductDetailWrapper";

export default App;
