import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// List of public endpoints that do NOT need authentication
const PUBLIC_ENDPOINTS = [
  "/users/register/",
  "/users/login/",
  "/users/verifyEmail/",
    "/users/verifyPhone/",
    "/users/sendAuthEmail/",
    "/users/VerifyCode/",
    "/users/ResendCode/",
    "/users/ResetPassword1/",
    "/users/ResetPassword2/",
    "/users/ResetPassword3/",
    "/users/verifyEmailUsed/",
    "/store/products/",
    "/order/orders/",
  // Add any other public endpoints here
];

// Helper function to check if an endpoint is public
const isPublicEndpoint = (url) => {
  return PUBLIC_ENDPOINTS.some(endpoint => url?.includes(endpoint));
};

// Request interceptor - attach access token only for protected endpoints
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    // Only attach token if:
    // 1. It's not a public endpoint
    // 2. Token exists
    if (!isPublicEndpoint(config.url) && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh for protected endpoints only
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the endpoint is public, don't try to refresh token
    // Just let the error pass through
    if (isPublicEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    // Only attempt token refresh if:
    // 1. Response status is 401 (Unauthorized)
    // 2. It's a protected endpoint
    // 3. We haven't already tried to refresh (prevent infinite loop)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh");

      // No refresh token available - redirect to login
      if (!refreshToken) {
        console.warn("No refresh token available. Redirecting to login.");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the access token
        const tokenResponse = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          { refresh: refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Store the new access token
        const newAccessToken = tokenResponse.data.access;
        localStorage.setItem("access", newAccessToken);

        // Update the failed request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is invalid or expired
        console.error("Token refresh failed:", refreshError);

        // Clear tokens and redirect to login
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    // For all other errors, just reject
    return Promise.reject(error);
  }
);

export default api;