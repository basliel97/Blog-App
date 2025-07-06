import { create } from "zustand";
import { devtools } from "zustand/middleware";
import API from "../api/axiosInstance";

const usePostStore = create(
  devtools(
    (set, get) => ({
      // State
      posts: [],
      currentPost: null,
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      error: null,

      // Actions
      fetchPosts: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await API.get("/posts");
          set({ 
            posts: response.data, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Failed to fetch posts";
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          throw error;
        }
      },

      createPost: async (postData) => {
        set({ isCreating: true, error: null });
        try {
          const response = await API.post("/posts", postData);
          set((state) => ({ 
            posts: [response.data, ...state.posts], 
            isCreating: false,
            error: null 
          }));
          return response.data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Failed to create post";
          set({ 
            error: errorMessage, 
            isCreating: false 
          });
          throw error;
        }
      },

      fetchPost: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await API.get(`/posts/${id}`);
          const postData = response.data;
          
          // Update posts array and set current post
          set((state) => {
            const existingPostIndex = state.posts.findIndex(post => post.id === postData.id);
            let newPosts;
            
            if (existingPostIndex >= 0) {
              newPosts = [...state.posts];
              newPosts[existingPostIndex] = postData;
            } else {
              newPosts = [postData, ...state.posts];
            }
            
            return { 
              posts: newPosts, 
              currentPost: postData,
              isLoading: false,
              error: null 
            };
          });
          
          return postData;
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Failed to fetch post";
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          throw error;
        }
      },

      updatePost: async (id, postData, token) => {
        set({ isUpdating: true, error: null });
        try {
          const response = await API.put(`/posts/${id}`, postData, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === response.data.id ? response.data : post
            ),
            currentPost: response.data,
            isUpdating: false,
            error: null
          }));
          
          return response.data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Failed to update post";
          set({ 
            error: errorMessage, 
            isUpdating: false 
          });
          throw error;
        }
      },

      deletePost: async (id, token) => {
        set({ isDeleting: true, error: null });
        try {
          await API.delete(`/posts/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          
          set((state) => ({
            posts: state.posts.filter((post) => post.id !== id),
            currentPost: state.currentPost?.id === id ? null : state.currentPost,
            isDeleting: false,
            error: null
          }));
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Failed to delete post";
          set({ 
            error: errorMessage, 
            isDeleting: false 
          });
          throw error;
        }
      },

      // Helper functions
      getPost: (id) => {
        const state = get();
        return state.posts.find(post => String(post.id) === String(id));
      },

      setCurrentPost: (post) => {
        set({ currentPost: post });
      },

      clearCurrentPost: () => {
        set({ currentPost: null });
      },

      clearPosts: () => {
        set({ posts: [], currentPost: null });
      },

      clearError: () => {
        set({ error: null });
      },

      // Selectors
      getPostsByUser: (userId) => {
        const { posts } = get();
        return posts.filter(post => post.author?.id === userId);
      },

      getPostsCount: () => {
        return get().posts.length;
      },
    }),
    {
      name: "post-store",
    }
  )
);

export default usePostStore;