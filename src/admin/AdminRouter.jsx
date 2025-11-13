import React from "react";
import { Routes, Route } from "react-router-dom";
import { AdminLayout } from "./components";
import { AdminLogin, AdminDashboard, AdminUsers, AdminProducts } from "./pages";
import AdminOrders from "./pages/AdminOrders.jsx";
import AdminMessageDashboard from "./pages/messages/AdminMessageDashboard";
import AdminBrands from "./pages/AdminBrands.jsx";
import AdminCategories from "./pages/AdminCategories.jsx";
import AdminProductAddNew from "./pages/AdminProductAddNew.jsx";

import AdminUserAdd from "./pages/AdminUserAdd.jsx";
import AdminUserSelectType from "./pages/AdminUserSelectType.jsx";

import AdminApiTesterBasic from "./components/AdminApiTesterBasic";
import AdminApiTesterComponent from "./components/AdminApiTesterComponent";
import AdminTokenManager from "./components/AdminTokenManager";
// Import admin CSS
import "./styles/admin.css";

// Placeholder components for other pages
// const AdminProducts = () => (
//   <div className="space-y-6">
//     <div className="page-header">
//       <h1 className="page-title">Quản lý sản phẩm</h1>
//       <p className="page-subtitle">Danh sách và quản lý sản phẩm</p>
//     </div>
//     <div className="card">
//       <div className="card-content">
//         <p>Trang quản lý sản phẩm đang được phát triển...</p>
//       </div>
//     </div>
//   </div>
// );

// Placeholder components removed - using actual implementations

const AdminRouter = () => {
  return (
    <Routes>
      {/* Admin Login - No layout */}
      <Route path="login" element={<AdminLogin />} />

      {/* Admin Panel with Layout */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/select-type" element={<AdminUserSelectType />} />
        <Route path="users/add" element={<AdminUserAdd />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/add" element={<AdminProductAddNew />} />
        <Route path="products/edit/:id" element={<AdminProductAddNew />} />
        <Route path="orders" element={<AdminOrders />} />
  <Route path="messages" element={<AdminMessageDashboard />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="api-tester-basic" element={<AdminApiTesterBasic />} />
        <Route path="api-tester" element={<AdminApiTesterComponent />} />
        <Route path="token-manager" element={<AdminTokenManager />} />
      </Route>
    </Routes>
  );
};

export default AdminRouter;
