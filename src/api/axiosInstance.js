import axios from "axios";
import useAuthStore from "../store/authStore";

// API Configuration
const API_CONFIG = {
  baseURL: "https://blog-api-1-r23t.onrender.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

// Create axios instance
const API = axios.create(API_CONFIG);

// Request interceptor
API.interceptors.request.use(
  (config) => {
    // Get token from store
    const token = useAuthStore.getState().getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    // Log response time for debugging
    const endTime = new Date();
    const startTime = response.config.metadata?.startTime;
    if (startTime) {
      const duration = endTime.getTime() - startTime.getTime();
      console.debug(`API Request completed in ${duration}ms:`, response.config.url);
    }
    
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          useAuthStore.getState().logout();
          window.location.href = "/login";
          break;
        case 403:
          console.error("Access forbidden:", data);
          break;
        case 404:
          console.error("Resource not found:", data);
          break;
        case 500:
          console.error("Server error:", data);
          break;
        default:
          console.error(`HTTP ${status} error:`, data);
      }
    } else if (error.request) {
      // Network error
      console.error("Network error - no response received:", error.request);
    } else {
      // Other error
      console.error("Request setup error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

// API helper functions
export const apiHelpers = {
  // Handle API errors consistently
  handleError: (error) => {
    const message = error.response?.data?.message || error.message || "An error occurred";
    return { success: false, error: message };
  },

  // Create success response
  createSuccessResponse: (data) => {
    return { success: true, data };
  },

  // Validate response
  validateResponse: (response) => {
    if (!response || !response.data) {
      throw new Error("Invalid response format");
    }
    return response.data;
  },
};

export default API;
