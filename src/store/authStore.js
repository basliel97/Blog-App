import { create } from "zustand";
import { persist } from "zustand/middleware";
import API from "../api/axiosInstance";

// Types for better type safety
const AUTH_STORAGE_KEY = "auth-storage";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      token: null,
      user: null,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await API.post("/auth/login", credentials);
          const { access_token, user } = response.data;
          
          set({ 
            token: access_token, 
            user: user || null, 
            isLoading: false,
            error: null 
          });

          // If user data wasn't in login response, fetch it
          if (!user && access_token) {
            try {
              const userResponse = await API.get("/auth/me");
              set({ user: userResponse.data });
            } catch (userError) {
              console.warn("Failed to fetch user data after login:", userError);
              // Don't fail the login if user fetch fails
            }
          }
          
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Login failed";
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          return { success: false, error: errorMessage };
        }
      },

      logout: () => {
        set({ 
          token: null, 
          user: null, 
          error: null,
          isLoading: false 
        });
      },

      setUser: (user) => {
        set({ user });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      loadUserFromToken: async () => {
        const { token } = get();
        if (!token) return;

        set({ isLoading: true });
        try {
          const response = await API.get("/auth/me");
          set({ 
            user: response.data, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          console.error("Failed to load user from token:", error);
          // Auto-logout on token failure
          get().logout();
        }
      },

      // Selectors
      isAuthenticated: () => {
        const { token } = get();
        // Only check for token - user data will be loaded separately if needed
        return !!token;
      },

      getUser: () => {
        return get().user;
      },

      getToken: () => {
        return get().token;
      },

      // Helper to check if we have complete user data
      hasUserData: () => {
        const { token, user } = get();
        return !!(token && user);
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user 
      }),
    }
  )
);

export default useAuthStore;
