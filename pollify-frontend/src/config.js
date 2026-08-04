const rawUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3500/api";

// Auto-cleans trailing slashes so you never get double slashes like '//auth/login'
export const API_BASE_URL = rawUrl.replace(/\/+$/, "");