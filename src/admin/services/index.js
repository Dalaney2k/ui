// Admin Services - Updated exports
export * from "./AdminApiService.js";
export { default as adminApi } from "./AdminApiService.js";

// Legacy support - keep old adminApi.js import working
export { default as adminApiLegacy } from "./adminApi.js";
