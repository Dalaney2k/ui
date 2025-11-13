import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Plus,
  AlertCircle,
  CheckCircle,
  Camera,
  FileText,
  Package,
  DollarSign,
  Tags,
  Settings,
  Globe,
  Info,
  Image as ImageIcon,
  Trash2,
  Loader2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  adminProductService,
  adminBrandService,
  adminCategoryService,
} from "../services/AdminApiService.js";

// Import CSS
import "../styles/admin-product-add.css";

const AdminProductAdd = () => {
  const navigate = useNavigate();

  // 🎯 Form State Management
  const [formState, setFormState] = useState({
    // Basic Information
    name: "",
    sku: "",
    shortDescription: "",
    description: "",
    
    // Images
    mainImage: null,
    additionalImages: [],
    
    // Pricing & Inventory
    price: "",
    originalPrice: "",
    costPrice: "",
    stock: "",
    minStock: "",
    maxStock: "",
    trackInventory: true,
    allowBackorder: false,
    allowPreorder: false,
    
    // Classification
    brandId: "",
    categoryId: "",
    
    // Product Details
    origin: "Japan",
    japaneseRegion: "",
    authenticityLevel: 1,
    authenticityInfo: "",
    usageGuide: "",
    ingredients: "",
    expiryDate: "",
    manufactureDate: "",
    batchNumber: "",
    
    // Physical Properties
    weight: "",
    weightUnit: 1, // 1 = grams, 2 = kg
    length: "",
    width: "",
    height: "",
    dimensionUnit: 1, // 1 = cm, 2 = m
    
    // Age & Safety
    ageRestriction: 1,
    
    // Status & Visibility
    status: 1, // 1 = Active
    condition: 1, // 1 = New
    visibility: 1, // 1 = Public
    isFeatured: false,
    isNew: true,
    isBestseller: false,
    isLimitedEdition: false,
    
    // Gift & Special Options
    isGiftWrappingAvailable: false,
    giftWrappingFee: "",
    
    // Marketing
    tags: "",
    marketingDescription: "",
    availableFrom: "",
    availableUntil: "",
    
    // Additional attributes
    attributes: [],
  });

  // 📋 Supporting Data
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // 🎛️ UI State
  const [activeSection, setActiveSection] = useState("basic");
  const [validation, setValidation] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isGeneratingSku, setIsGeneratingSku] = useState(false);
  const [skuCheckResult, setSkuCheckResult] = useState(null);

    try {
      const [brandsResponse, categoriesResponse] = await Promise.all([
        adminBrandService.getBrands(),
        adminCategoryService.getCategories(),
      ]);

      if (brandsResponse.success) {
        setBrands(brandsResponse.data.brands || []);
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data.categories || []);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      showNotification("Có lỗi khi tải dữ liệu", "error");
    }
  }, []);

  // 💾 Auto-save functionality
  const loadDraftFromStorage = useCallback(() => {
    const draft = localStorage.getItem("product-add-draft");
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        setFormState(prev => ({ ...prev, ...draftData }));
        showNotification("Đã khôi phục bản nháp", "info");
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  };

  const saveDraftToStorage = useCallback(() => {
    if (isDirty) {
      localStorage.setItem("product-add-draft", JSON.stringify(formState));
      console.log("💾 Draft saved automatically");
    }
  }, [formState, isDirty]);

  const setupAutoSave = () => {
    const interval = setInterval(() => {
      if (window.isDirtyRef) {
        saveDraftToStorage();
      }
    }, 30000); // Auto-save every 30 seconds

    window.autoSaveTimer = interval;
  };

  // 🔄 Form Handlers
  const updateField = (field, value) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
    window.isDirtyRef = true;
    
    // Clear validation error for this field
    if (validation[field]) {
      setValidation(prev => ({
        ...prev,
        [field]: null
      }));
    }

    // Auto-generate SKU when name or brand changes
    if (field === "name" || field === "brandId") {
      setTimeout(() => autoGenerateSku(), 100);
    }
  };

  // 🔧 Utility Functions
  const autoGenerateSku = () => {
    const { name, brandId } = formState;
    if (name && brandId) {
      const brand = brands.find(b => b.id === parseInt(brandId));
      if (brand) {
        const sku = generateSku(name, brand.name);
        updateField("sku", sku);
        checkSkuAvailability(sku);
      }
    }
  };

  const generateSku = (productName, brandName) => {
    const cleanName = productName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 10);
    
    const cleanBrand = brandName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 5);
      
    const timestamp = Date.now().toString().slice(-6);
    
    return `${cleanBrand}-${cleanName}-${timestamp}`;
  };

  const checkSkuAvailability = async (sku) => {
    if (!sku) return;
    
    try {
      setIsGeneratingSku(true);
      const response = await adminProductService.checkSkuAvailability(sku);
      
      if (response.success) {
        setSkuCheckResult({
          available: response.data.available,
          message: response.data.available ? "SKU khả dụng" : "SKU đã tồn tại"
        });
      }
    } catch (error) {
      console.error("Error checking SKU:", error);
    } finally {
      setIsGeneratingSku(false);
    }
  };

  // 📝 Validation
  const validateForm = () => {
    const errors = {};

    // Required fields
    if (!formState.name.trim()) {
      errors.name = "Tên sản phẩm là bắt buộc";
    }

    if (!formState.sku.trim()) {
      errors.sku = "SKU là bắt buộc";
    } else if (!/^[A-Z0-9\-_]+$/.test(formState.sku)) {
      errors.sku = "SKU chỉ chấp nhận chữ hoa, số, dấu gạch ngang và gạch dưới";
    }

    if (!formState.price || parseFloat(formState.price) <= 0) {
      errors.price = "Giá bán phải lớn hơn 0";
    }

    if (!formState.brandId) {
      errors.brandId = "Vui lòng chọn thương hiệu";
    }

    if (!formState.categoryId) {
      errors.categoryId = "Vui lòng chọn danh mục";
    }

    // Price validation
    if (formState.originalPrice && parseFloat(formState.originalPrice) < parseFloat(formState.price)) {
      errors.originalPrice = "Giá gốc phải lớn hơn hoặc bằng giá bán";
    }

    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  // 🖼️ Image Handlers
  const handleImageUpload = async (file, type = "additional") => {
    if (!file || !file.type.startsWith("image/")) {
      showNotification("Vui lòng chọn file hình ảnh hợp lệ", "error");
      return;
    }

    // Mock image upload - replace with actual API
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          url: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type,
        };

        if (type === "main") {
          updateField("mainImage", imageData);
        } else {
          updateField("additionalImages", [
            ...formState.additionalImages,
            { ...imageData, id: Date.now() }
          ]);
        }

        resolve(imageData);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId, type = "additional") => {
    if (type === "main") {
      updateField("mainImage", null);
    } else {
      updateField("additionalImages", 
        formState.additionalImages.filter(img => img.id !== imageId)
      );
    }
  };

  // 💾 Save Handlers
  const handleSaveDraft = async () => {
    saveDraftToStorage();
    showNotification("Đã lưu bản nháp", "success");
  };

  const handlePublish = async () => {
    if (!validateForm()) {
      showNotification("Vui lòng kiểm tra lại thông tin", "error");
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for API
      const productData = {
        ...formState,
        price: parseFloat(formState.price),
        originalPrice: formState.originalPrice ? parseFloat(formState.originalPrice) : null,
        costPrice: formState.costPrice ? parseFloat(formState.costPrice) : null,
        stock: parseInt(formState.stock) || 0,
        minStock: formState.minStock ? parseInt(formState.minStock) : null,
        maxStock: formState.maxStock ? parseInt(formState.maxStock) : null,
        weight: formState.weight ? parseFloat(formState.weight) : null,
        length: formState.length ? parseFloat(formState.length) : null,
        width: formState.width ? parseFloat(formState.width) : null,
        height: formState.height ? parseFloat(formState.height) : null,
        giftWrappingFee: formState.giftWrappingFee ? parseFloat(formState.giftWrappingFee) : null,
        brandId: parseInt(formState.brandId),
        categoryId: parseInt(formState.categoryId),
        images: formState.additionalImages.map((img, index) => ({
          url: img.url,
          altText: img.name,
          isMain: false,
          displayOrder: index + 1
        }))
      };

      const response = await adminProductService.createProduct(productData);

      if (response.success) {
        // Clear draft
        localStorage.removeItem("product-add-draft");
        showNotification("Sản phẩm đã được tạo thành công!", "success");
        
        // Navigate back to products list
        setTimeout(() => {
          navigate("/admin/products");
        }, 1500);
      } else {
        throw new Error(response.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      showNotification(error.message || "Có lỗi khi tạo sản phẩm", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔔 Notification System
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // 📱 Responsive Sidebar Navigation
  const sidebarSections = [
    { id: "basic", label: "Thông tin cơ bản", icon: FileText },
    { id: "images", label: "Hình ảnh", icon: ImageIcon },
    { id: "pricing", label: "Giá cả & Kho hàng", icon: DollarSign },
    { id: "details", label: "Chi tiết sản phẩm", icon: Package },
    { id: "classification", label: "Phân loại", icon: Tags },
    { id: "advanced", label: "Tùy chọn nâng cao", icon: Settings },
    { id: "marketing", label: "Marketing & SEO", icon: Globe },
  ];

  // 🎨 Rich Text Editor Configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="admin-product-add">
      {/* 📱 Header */}
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/products")}
            className="btn-secondary-sm flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Quay lại</span>
          </button>
          
          <div>
            <h1 className="page-title">Thêm sản phẩm mới</h1>
            <p className="page-subtitle">
              Tạo sản phẩm mới cho cửa hàng Japanese E-commerce
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="btn-secondary-sm flex items-center gap-2"
          >
            <Eye size={16} />
            <span>Xem trước</span>
          </button>
          
          <button
            onClick={handleSaveDraft}
            className="btn-secondary-sm flex items-center gap-2"
          >
            <Save size={16} />
            <span>Lưu nháp</span>
          </button>
          
          <button
            onClick={handlePublish}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            <span>{loading ? "Đang tạo..." : "Xuất bản"}</span>
          </button>
        </div>
      </div>

      {/* 🔔 Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <div className="flex items-center gap-2">
            {notification.type === "success" && <CheckCircle size={16} />}
            {notification.type === "error" && <AlertCircle size={16} />}
            {notification.type === "info" && <Info size={16} />}
            <span>{notification.message}</span>
          </div>
          
          <button
            onClick={() => setNotification(null)}
            className="text-current opacity-70 hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 📱 Main Layout */}
      <div className="admin-layout-grid">
        {/* 📋 Sidebar Navigation */}
        <div className="sidebar-nav">
          <div className="nav-sections">
            {sidebarSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`nav-section-item ${
                    activeSection === section.id ? "active" : ""
                  }`}
                >
                  <Icon size={18} />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* Progress Indicator */}
          <div className="form-progress">
            <div className="progress-title">Tiến độ hoàn thành</div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${Math.round(
                    (Object.values(formState).filter(v => v && v !== "").length / 
                     Object.keys(formState).length) * 100
                  )}%` 
                }}
              />
            </div>
            <div className="progress-text">
              {Object.values(formState).filter(v => v && v !== "").length}/
              {Object.keys(formState).length} trường
            </div>
          </div>
        </div>

        {/* 📝 Main Content Area */}
        <div className="main-content">
          <div className="form-container">
            
            {/* 🎯 Basic Information Section */}
            {activeSection === "basic" && (
              <div className="form-section">
                <div className="section-header">
                  <div className="flex items-center gap-3">
                    <div className="section-icon">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h2 className="section-title">Thông tin cơ bản</h2>
                      <p className="section-subtitle">
                        Nhập thông tin cơ bản về sản phẩm
                      </p>
                    </div>
                  </div>
                </div>

                <div className="section-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label required">
                        Tên sản phẩm
                      </label>
                      <input
                        type="text"
                        value={formState.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="Nhập tên sản phẩm..."
                        className={`form-input ${
                          validation.name ? "error" : ""
                        }`}
                      />
                      {validation.name && (
                        <div className="form-error">{validation.name}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-row grid-2">
                    <div className="form-group">
                      <label className="form-label required">
                        SKU (Mã sản phẩm)
                      </label>
                      <div className="input-with-action">
                        <input
                          type="text"
                          value={formState.sku}
                          onChange={(e) => updateField("sku", e.target.value.toUpperCase())}
                          placeholder="VD: SHIS-SKINCARE-001"
                          className={`form-input ${
                            validation.sku ? "error" : 
                            skuCheckResult?.available === false ? "error" :
                            skuCheckResult?.available === true ? "success" : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={autoGenerateSku}
                          disabled={!formState.name || !formState.brandId || isGeneratingSku}
                          className="btn-icon-sm"
                          title="Tự động tạo SKU"
                        >
                          {isGeneratingSku ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Sparkles size={14} />
                          )}
                        </button>
                      </div>
                      {validation.sku && (
                        <div className="form-error">{validation.sku}</div>
                      )}
                      {skuCheckResult && (
                        <div className={`form-hint ${
                          skuCheckResult.available ? "success" : "error"
                        }`}>
                          {skuCheckResult.message}
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Mô tả ngắn</label>
                      <input
                        type="text"
                        value={formState.shortDescription}
                        onChange={(e) => updateField("shortDescription", e.target.value)}
                        placeholder="Mô tả ngắn gọn về sản phẩm..."
                        className="form-input"
                        maxLength={200}
                      />
                      <div className="form-hint">
                        {formState.shortDescription.length}/200 ký tự
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Mô tả chi tiết</label>
                      <ReactQuill
                        value={formState.description}
                        onChange={(value) => updateField("description", value)}
                        modules={quillModules}
                        placeholder="Nhập mô tả chi tiết về sản phẩm..."
                        className="quill-editor"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 🖼️ Images Section */}
            {activeSection === "images" && (
              <div className="form-section">
                <div className="section-header">
                  <div className="flex items-center gap-3">
                    <div className="section-icon">
                      <ImageIcon size={20} />
                    </div>
                    <div>
                      <h2 className="section-title">Hình ảnh sản phẩm</h2>
                      <p className="section-subtitle">
                        Thêm hình ảnh chất lượng cao để thu hút khách hàng
                      </p>
                    </div>
                  </div>
                </div>

                <div className="section-content">
                  {/* Main Image Upload */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Hình ảnh chính</label>
                      <div className="image-upload-main">
                        {formState.mainImage ? (
                          <div className="image-preview-main">
                            <img 
                              src={formState.mainImage.url} 
                              alt="Main product" 
                              className="preview-image"
                            />
                            <div className="image-overlay">
                              <button
                                type="button"
                                onClick={() => removeImage(null, "main")}
                                className="btn-remove"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="upload-zone main">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  handleImageUpload(e.target.files[0], "main");
                                }
                              }}
                              className="upload-input"
                            />
                            <div className="upload-content">
                              <Camera size={32} />
                              <div className="upload-text">
                                <div className="upload-primary">
                                  Chọn hình ảnh chính
                                </div>
                                <div className="upload-secondary">
                                  Kéo thả hoặc click để chọn
                                </div>
                              </div>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Images */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Hình ảnh bổ sung</label>
                      <div className="image-grid">
                        {formState.additionalImages.map((image) => (
                          <div key={image.id} className="image-preview">
                            <img 
                              src={image.url} 
                              alt={image.name}
                              className="preview-image"
                            />
                            <div className="image-overlay">
                              <button
                                type="button"
                                onClick={() => removeImage(image.id)}
                                className="btn-remove"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        {/* Add More Images */}
                        <label className="upload-zone additional">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              Array.from(e.target.files).forEach(file => {
                                handleImageUpload(file, "additional");
                              });
                            }}
                            className="upload-input"
                          />
                          <div className="upload-content">
                            <Plus size={20} />
                            <span>Thêm ảnh</span>
                          </div>
                        </label>
                      </div>
                      
                      <div className="form-hint">
                        Tối đa 10 hình ảnh. Định dạng: JPG, PNG. Kích thước tối đa: 5MB
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 💰 Pricing & Inventory Section */}
            {activeSection === "pricing" && (
              <div className="form-section">
                <div className="section-header">
                  <div className="flex items-center gap-3">
                    <div className="section-icon">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <h2 className="section-title">Giá cả & Kho hàng</h2>
                      <p className="section-subtitle">
                        Thiết lập giá bán và quản lý tồn kho
                      </p>
                    </div>
                  </div>
                </div>

                <div className="section-content">
                  {/* Pricing */}
                  <div className="form-subsection">
                    <h3 className="subsection-title">Giá cả</h3>
                    
                    <div className="form-row grid-3">
                      <div className="form-group">
                        <label className="form-label required">Giá bán (₫)</label>
                        <input
                          type="number"
                          value={formState.price}
                          onChange={(e) => updateField("price", e.target.value)}
                          placeholder="0"
                          min="0"
                          step="1000"
                          className={`form-input ${
                            validation.price ? "error" : ""
                          }`}
                        />
                        {validation.price && (
                          <div className="form-error">{validation.price}</div>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Giá gốc (₫)</label>
                        <input
                          type="number"
                          value={formState.originalPrice}
                          onChange={(e) => updateField("originalPrice", e.target.value)}
                          placeholder="0"
                          min="0"
                          step="1000"
                          className={`form-input ${
                            validation.originalPrice ? "error" : ""
                          }`}
                        />
                        {validation.originalPrice && (
                          <div className="form-error">{validation.originalPrice}</div>
                        )}
                        <div className="form-hint">
                          Để hiển thị % giảm giá
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Giá vốn (₫)</label>
                        <input
                          type="number"
                          value={formState.costPrice}
                          onChange={(e) => updateField("costPrice", e.target.value)}
                          placeholder="0"
                          min="0"
                          step="1000"
                          className="form-input"
                        />
                        <div className="form-hint">
                          Để tính toán lợi nhuận
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inventory */}
                  <div className="form-subsection">
                    <h3 className="subsection-title">Quản lý kho hàng</h3>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formState.trackInventory}
                            onChange={(e) => updateField("trackInventory", e.target.checked)}
                            className="form-checkbox"
                          />
                          Theo dõi tồn kho
                        </label>
                      </div>
                    </div>

                    {formState.trackInventory && (
                      <div className="form-row grid-3">
                        <div className="form-group">
                          <label className="form-label">Số lượng tồn kho</label>
                          <input
                            type="number"
                            value={formState.stock}
                            onChange={(e) => updateField("stock", e.target.value)}
                            placeholder="0"
                            min="0"
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Tồn kho tối thiểu</label>
                          <input
                            type="number"
                            value={formState.minStock}
                            onChange={(e) => updateField("minStock", e.target.value)}
                            placeholder="0"
                            min="0"
                            className="form-input"
                          />
                          <div className="form-hint">
                            Cảnh báo khi dưới mức này
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Tồn kho tối đa</label>
                          <input
                            type="number"
                            value={formState.maxStock}
                            onChange={(e) => updateField("maxStock", e.target.value)}
                            placeholder="0"
                            min="0"
                            className="form-input"
                          />
                        </div>
                      </div>
                    )}

                    <div className="form-row grid-2">
                      <div className="form-group">
                        <label className="form-label flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formState.allowBackorder}
                            onChange={(e) => updateField("allowBackorder", e.target.checked)}
                            className="form-checkbox"
                          />
                          Cho phép đặt hàng khi hết stock
                        </label>
                      </div>

                      <div className="form-group">
                        <label className="form-label flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formState.allowPreorder}
                            onChange={(e) => updateField("allowPreorder", e.target.checked)}
                            className="form-checkbox"
                          />
                          Cho phép đặt trước
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 📦 Product Details Section */}
            {activeSection === "details" && (
              <div className="form-section">
                <div className="section-header">
                  <div className="flex items-center gap-3">
                    <div className="section-icon">
                      <Package size={20} />
                    </div>
                    <div>
                      <h2 className="section-title">Chi tiết sản phẩm</h2>
                      <p className="section-subtitle">
                        Thông tin chi tiết và đặc tính sản phẩm
                      </p>
                    </div>
                  </div>
                </div>

                <div className="section-content">
                  {/* Origin & Authenticity */}
                  <div className="form-subsection">
                    <h3 className="subsection-title">Xuất xứ & Chính hãng</h3>
                    
                    <div className="form-row grid-3">
                      <div className="form-group">
                        <label className="form-label">Xuất xứ</label>
                        <select
                          value={formState.origin}
                          onChange={(e) => updateField("origin", e.target.value)}
                          className="form-select"
                        >
                          <option value="Japan">Nhật Bản</option>
                          <option value="Korea">Hàn Quốc</option>
                          <option value="China">Trung Quốc</option>
                          <option value="Thailand">Thái Lan</option>
                          <option value="Vietnam">Việt Nam</option>
                          <option value="Other">Khác</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Vùng miền (Nhật Bản)</label>
                        <input
                          type="text"
                          value={formState.japaneseRegion}
                          onChange={(e) => updateField("japaneseRegion", e.target.value)}
                          placeholder="VD: Tokyo, Osaka, Kyoto..."
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Mức độ chính hãng</label>
                        <select
                          value={formState.authenticityLevel}
                          onChange={(e) => updateField("authenticityLevel", parseInt(e.target.value))}
                          className="form-select"
                        >
                          <option value={1}>Chính hãng 100%</option>
                          <option value={2}>Chính hãng có xác thực</option>
                          <option value={3}>Hàng xách tay chính hãng</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Thông tin xác thực</label>
                        <textarea
                          value={formState.authenticityInfo}
                          onChange={(e) => updateField("authenticityInfo", e.target.value)}
                          placeholder="Mô tả về nguồn gốc, giấy tờ chứng nhận..."
                          className="form-textarea"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Information */}
                  <div className="form-subsection">
                    <h3 className="subsection-title">Thông tin sản phẩm</h3>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Hướng dẫn sử dụng</label>
                        <textarea
                          value={formState.usageGuide}
                          onChange={(e) => updateField("usageGuide", e.target.value)}
                          placeholder="Cách sử dụng sản phẩm..."
                          className="form-textarea"
                          rows={4}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Thành phần</label>
                        <textarea
                          value={formState.ingredients}
                          onChange={(e) => updateField("ingredients", e.target.value)}
                          placeholder="Danh sách thành phần của sản phẩm..."
                          className="form-textarea"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="form-row grid-3">
                      <div className="form-group">
                        <label className="form-label">Hạn sử dụng</label>
                        <input
                          type="date"
                          value={formState.expiryDate}
                          onChange={(e) => updateField("expiryDate", e.target.value)}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Ngày sản xuất</label>
                        <input
                          type="date"
                          value={formState.manufactureDate}
                          onChange={(e) => updateField("manufactureDate", e.target.value)}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Số lô sản xuất</label>
                        <input
                          type="text"
                          value={formState.batchNumber}
                          onChange={(e) => updateField("batchNumber", e.target.value)}
                          placeholder="VD: LOT001, BATCH2024A"
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Physical Properties */}
                  <div className="form-subsection">
                    <h3 className="subsection-title">Thuộc tính vật lý</h3>
                    
                    <div className="form-row grid-2">
                      <div className="form-group">
                        <label className="form-label">Trọng lượng</label>
                        <div className="input-group">
                          <input
                            type="number"
                            value={formState.weight}
                            onChange={(e) => updateField("weight", e.target.value)}
                            placeholder="0"
                            min="0"
                            step="0.1"
                            className="form-input"
                          />
                          <select
                            value={formState.weightUnit}
                            onChange={(e) => updateField("weightUnit", parseInt(e.target.value))}
                            className="form-select-addon"
                          >
                            <option value={1}>gram</option>
                            <option value={2}>kg</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Độ tuổi khuyến nghị</label>
                        <select
                          value={formState.ageRestriction}
                          onChange={(e) => updateField("ageRestriction", parseInt(e.target.value))}
                          className="form-select"
                        >
                          <option value={1}>Mọi lứa tuổi</option>
                          <option value={2}>13+ tuổi</option>
                          <option value={3}>16+ tuổi</option>
                          <option value={4}>18+ tuổi</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Kích thước (D x R x C)</label>
                        <div className="input-group-3">
                          <input
                            type="number"
                            value={formState.length}
                            onChange={(e) => updateField("length", e.target.value)}
                            placeholder="Dài"
                            min="0"
                            step="0.1"
                            className="form-input"
                          />
                          <span className="input-separator">×</span>
                          <input
                            type="number"
                            value={formState.width}
                            onChange={(e) => updateField("width", e.target.value)}
                            placeholder="Rộng"
                            min="0"
                            step="0.1"
                            className="form-input"
                          />
                          <span className="input-separator">×</span>
                          <input
                            type="number"
                            value={formState.height}
                            onChange={(e) => updateField("height", e.target.value)}
                            placeholder="Cao"
                            min="0"
                            step="0.1"
                            className="form-input"
                          />
                          <select
                            value={formState.dimensionUnit}
                            onChange={(e) => updateField("dimensionUnit", parseInt(e.target.value))}
                            className="form-select-addon"
                          >
                            <option value={1}>cm</option>
                            <option value={2}>m</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 🏷️ Classification Section */}
            {activeSection === "classification" && (
              <div className="form-section">
                <div className="section-header">
                  <div className="flex items-center gap-3">
                    <div className="section-icon">
                      <Tags size={20} />
                    </div>
                    <div>
                      <h2 className="section-title">Phân loại sản phẩm</h2>
                      <p className="section-subtitle">
                        Chọn thương hiệu và danh mục cho sản phẩm
                      </p>
                    </div>
                  </div>
                </div>

                <div className="section-content">
                  <div className="form-row grid-2">
                    <div className="form-group">
                      <label className="form-label required">Thương hiệu</label>
                      <select
                        value={formState.brandId}
                        onChange={(e) => updateField("brandId", e.target.value)}
                        className={`form-select ${
                          validation.brandId ? "error" : ""
                        }`}
                      >
                        <option value="">Chọn thương hiệu</option>
                        {brands.map(brand => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                      {validation.brandId && (
                        <div className="form-error">{validation.brandId}</div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label required">Danh mục</label>
                      <select
                        value={formState.categoryId}
                        onChange={(e) => updateField("categoryId", e.target.value)}
                        className={`form-select ${
                          validation.categoryId ? "error" : ""
                        }`}
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {validation.categoryId && (
                        <div className="form-error">{validation.categoryId}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Tags</label>
                      <input
                        type="text"
                        value={formState.tags}
                        onChange={(e) => updateField("tags", e.target.value)}
                        placeholder="VD: skincare, anti-aging, japanese, premium"
                        className="form-input"
                      />
                      <div className="form-hint">
                        Các từ khóa phân cách bằng dấu phẩy để dễ tìm kiếm
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ⚙️ Advanced Options Section */}
            {activeSection === "advanced" && (
              <div className="form-section">
                <div className="section-header">
                  <div className="flex items-center gap-3">
                    <div className="section-icon">
                      <Settings size={20} />
                    </div>
                    <div>
                      <h2 className="section-title">Tùy chọn nâng cao</h2>
                      <p className="section-subtitle">
                        Cài đặt trạng thái và tính năng đặc biệt
                      </p>
                    </div>
                  </div>
                </div>

                <div className="section-content">
                  {/* Status Settings */}
                  <div className="form-subsection">
                    <h3 className="subsection-title">Trạng thái sản phẩm</h3>
                    
                    <div className="form-row grid-3">
                      <div className="form-group">
                        <label className="form-label">Trạng thái</label>
                        <select
                          value={formState.status}
                          onChange={(e) => updateField("status", parseInt(e.target.value))}
                          className="form-select"
                        >
                          <option value={1}>Hoạt động</option>
                          <option value={0}>Tạm ngưng</option>
                          <option value={2}>Nháp</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Tình trạng</label>
                        <select
                          value={formState.condition}
                          onChange={(e) => updateField("condition", parseInt(e.target.value))}
                          className="form-select"
                        >
                          <option value={1}>Mới</option>
                          <option value={2}>Đã qua sử dụng - như mới</option>
                          <option value={3}>Đã qua sử dụng - tốt</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Hiển thị</label>
                        <select
                          value={formState.visibility}
                          onChange={(e) => updateField("visibility", parseInt(e.target.value))}
                          className="form-select"
                        >
                          <option value={1}>Công khai</option>
                          <option value={2}>Ẩn</option>
                          <option value={3}>Chỉ admin</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Special Features */}
                  <div className="form-subsection">
                    <h3 className="subsection-title">Tính năng đặc biệt</h3>
                    
                    <div className="form-row grid-2">
                      <div className="form-group">
                        <label className="form-label flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formState.isFeatured}
                            onChange={(e) => updateField("isFeatured", e.target.checked)}
                            className="form-checkbox"
                          />
                          Sản phẩm nổi bật
                        </label>
                      </div>

                      <div className="form-group">
                        <label className="form-label flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formState.isNew}
                            onChange={(e) => updateField("isNew", e.target.checked)}
                            className="form-checkbox"
                          />
                          Sản phẩm mới
                        </label>
                      </div>

                      <div className="form-group">
                        <label className="form-label flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formState.isBestseller}
                            onChange={(e) => updateField("isBestseller", e.target.checked)}
                            className="form-checkbox"
                          />
                          Bestseller
                        </label>
                      </div>

                      <div className="form-group">
                        <label className="form-label flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formState.isLimitedEdition}
                            onChange={(e) => updateField("isLimitedEdition", e.target.checked)}
                            className="form-checkbox"
                          />
                          Phiên bản giới hạn
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Gift Options */}
                  <div className="form-subsection">
                    <h3 className="subsection-title">Tùy chọn quà tặng</h3>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formState.isGiftWrappingAvailable}
                            onChange={(e) => updateField("isGiftWrappingAvailable", e.target.checked)}
                            className="form-checkbox"
                          />
                          Cho phép gói quà
                        </label>
                      </div>
                    </div>

                    {formState.isGiftWrappingAvailable && (
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Phí gói quà (₫)</label>
                          <input
                            type="number"
                            value={formState.giftWrappingFee}
                            onChange={(e) => updateField("giftWrappingFee", e.target.value)}
                            placeholder="0"
                            min="0"
                            step="1000"
                            className="form-input"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Availability Schedule */}
                  <div className="form-subsection">
                    <h3 className="subsection-title">Lịch trình bán hàng</h3>
                    
                    <div className="form-row grid-2">
                      <div className="form-group">
                        <label className="form-label">Có thể bán từ</label>
                        <input
                          type="datetime-local"
                          value={formState.availableFrom}
                          onChange={(e) => updateField("availableFrom", e.target.value)}
                          className="form-input"
                        />
                        <div className="form-hint">
                          Để trống nếu bán ngay
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Ngừng bán từ</label>
                        <input
                          type="datetime-local"
                          value={formState.availableUntil}
                          onChange={(e) => updateField("availableUntil", e.target.value)}
                          className="form-input"
                        />
                        <div className="form-hint">
                          Để trống nếu bán vô thời hạn
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 🌐 Marketing & SEO Section */}
            {activeSection === "marketing" && (
              <div className="form-section">
                <div className="section-header">
                  <div className="flex items-center gap-3">
                    <div className="section-icon">
                      <Globe size={20} />
                    </div>
                    <div>
                      <h2 className="section-title">Marketing & SEO</h2>
                      <p className="section-subtitle">
                        Tối ưu hóa cho marketing và tìm kiếm
                      </p>
                    </div>
                  </div>
                </div>

                <div className="section-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Mô tả marketing</label>
                      <textarea
                        value={formState.marketingDescription}
                        onChange={(e) => updateField("marketingDescription", e.target.value)}
                        placeholder="Mô tả hấp dẫn để thu hút khách hàng..."
                        className="form-textarea"
                        rows={4}
                      />
                      <div className="form-hint">
                        Sử dụng ngôn ngữ hấp dẫn, nhấn mạnh lợi ích
                      </div>
                    </div>
                  </div>

                  {/* SEO Preview */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Preview SEO</label>
                      <div className="seo-preview">
                        <div className="seo-title">
                          {formState.name || "Tên sản phẩm"}
                        </div>
                        <div className="seo-url">
                          japanese-ecommerce.com/products/{formState.sku?.toLowerCase() || "sku"}
                        </div>
                        <div className="seo-description">
                          {formState.shortDescription || "Mô tả ngắn của sản phẩm sẽ hiển thị ở đây..."}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* 🔍 Product Preview Modal */}
      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal-content product-preview" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Xem trước sản phẩm</h3>
              <button 
                onClick={() => setShowPreview(false)}
                className="btn-icon"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="product-preview-card">
                <div className="product-image">
                  {formState.mainImage ? (
                    <img src={formState.mainImage.url} alt="Product preview" />
                  ) : (
                    <div className="placeholder-image">
                      <ImageIcon size={48} />
                      <span>Chưa có hình ảnh</span>
                    </div>
                  )}
                </div>
                
                <div className="product-info">
                  <h4 className="product-name">
                    {formState.name || "Tên sản phẩm"}
                  </h4>
                  
                  <div className="product-price">
                    {formState.price ? (
                      <>
                        <span className="current-price">
                          {parseInt(formState.price).toLocaleString('vi-VN')}₫
                        </span>
                        {formState.originalPrice && (
                          <span className="original-price">
                            {parseInt(formState.originalPrice).toLocaleString('vi-VN')}₫
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="no-price">Chưa có giá</span>
                    )}
                  </div>
                  
                  <div className="product-description">
                    {formState.shortDescription || "Chưa có mô tả"}
                  </div>
                  
                  <div className="product-badges">
                    {formState.isNew && <span className="badge new">Mới</span>}
                    {formState.isFeatured && <span className="badge featured">Nổi bật</span>}
                    {formState.isBestseller && <span className="badge bestseller">Bestseller</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📱 Bottom Action Bar (Mobile) */}
      <div className="bottom-action-bar">
        <button
          onClick={() => navigate("/admin/products")}
          className="btn-secondary"
        >
          Hủy
        </button>
        
        <button
          onClick={handleSaveDraft}
          className="btn-secondary"
        >
          Lưu nháp
        </button>
        
        <button
          onClick={handlePublish}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Đang tạo..." : "Xuất bản"}
        </button>
      </div>
    </div>
  );
};

export default AdminProductAdd;
