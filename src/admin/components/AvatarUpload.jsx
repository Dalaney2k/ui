import React, { useState } from "react";
import { Upload, X, Camera, User } from "lucide-react";

const AvatarUpload = ({
  avatarPreview,
  onAvatarChange,
  onAvatarRemove,
  error,
  className = "",
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      if (onAvatarChange) {
        onAvatarChange(null, "Chỉ chấp nhận file ảnh");
      }
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      if (onAvatarChange) {
        onAvatarChange(null, "Ảnh không được quá 2MB");
      }
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (onAvatarChange) {
        onAvatarChange(file, null, e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onAvatarRemove) {
      onAvatarRemove();
    }
  };

  return (
    <div className={`avatar-upload ${className}`}>
      <div
        className={`
          relative w-32 h-32 border-2 border-dashed rounded-full overflow-hidden cursor-pointer
          transition-all duration-200 group
          ${
            isDragOver
              ? "border-sakura-primary bg-sakura-50"
              : avatarPreview
              ? "border-zen-gray-300 hover:border-sakura-primary"
              : "border-zen-gray-300 hover:border-sakura-primary hover:bg-zen-gray-50"
          }
          ${error ? "border-error bg-red-50" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("avatar-input").click()}
      >
        {/* File Input */}
        <input
          id="avatar-input"
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />

        {/* Avatar Preview or Placeholder */}
        {avatarPreview ? (
          <>
            <img
              src={avatarPreview}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />

            {/* Remove Button */}
            <button
              type="button"
              onClick={handleRemove}
              className="
                absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                flex items-center justify-center hover:bg-red-600
                text-xs font-bold
              "
              title="Xóa ảnh"
            >
              <X className="h-3 w-3" />
            </button>

            {/* Overlay on Hover */}
            <div
              className="
              absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-opacity duration-200
            "
            >
              <div className="text-white text-center">
                <Camera className="h-6 w-6 mx-auto mb-1" />
                <div className="text-xs font-medium">Thay đổi</div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zen-gray-400 group-hover:text-sakura-primary transition-colors">
            {isDragOver ? (
              <>
                <Upload className="h-8 w-8 mb-2" />
                <div className="text-xs font-medium text-center px-2">
                  Thả ảnh vào đây
                </div>
              </>
            ) : (
              <>
                <User className="h-8 w-8 mb-2" />
                <div className="text-xs font-medium text-center px-2">
                  Tải ảnh lên
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="text-center mt-3">
        <label
          htmlFor="avatar-input"
          className="btn btn-outline btn-sm cursor-pointer"
        >
          <Upload className="h-4 w-4 mr-2" />
          Chọn ảnh
        </label>
        <p className="text-xs text-zen-gray-500 mt-2">
          JPG, PNG, GIF tối đa 2MB
        </p>
        <p className="text-xs text-zen-gray-400">Kéo thả hoặc click để chọn</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center mt-2">
          <p className="text-xs text-error font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
