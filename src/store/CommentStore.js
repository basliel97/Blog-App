import { create } from "zustand";
import { devtools } from "zustand/middleware";
import API from "../api/axiosInstance";

const useCommentStore = create(
  devtools(
    (set, get) => ({
      // State
      commentsMap: {},
      loadingCommentsMap: {},
      error: null,

      // Actions
      fetchComments: async (postId) => {
        set((state) => ({
          loadingCommentsMap: { ...state.loadingCommentsMap, [postId]: true },
          error: null
        }));
        
        try {
          const response = await API.get(`/comments/post/${postId}`);
          set((state) => ({
            commentsMap: { ...state.commentsMap, [postId]: response.data },
            loadingCommentsMap: { ...state.loadingCommentsMap, [postId]: false },
            error: null
          }));
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Failed to fetch comments";
          set((state) => ({
            error: errorMessage,
            loadingCommentsMap: { ...state.loadingCommentsMap, [postId]: false }
          }));
          throw error;
        }
      },

      addComment: async (postId, content, token) => {
        set((state) => ({
          loadingCommentsMap: { ...state.loadingCommentsMap, [postId]: true },
          error: null
        }));
        
        try {
          await API.post(
            "/comments",
            { postId, content },
            { headers: token ? { Authorization: `Bearer ${token}` } : {} }
          );
          
          // Refetch comments after adding
          const response = await API.get(`/comments/post/${postId}`);
          set((state) => ({
            commentsMap: { ...state.commentsMap, [postId]: response.data },
            loadingCommentsMap: { ...state.loadingCommentsMap, [postId]: false },
            error: null
          }));
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Failed to add comment";
          set((state) => ({
            error: errorMessage,
            loadingCommentsMap: { ...state.loadingCommentsMap, [postId]: false }
          }));
          throw error;
        }
      },

      deleteComment: async (commentId, postId, token) => {
        set((state) => ({
          loadingCommentsMap: { ...state.loadingCommentsMap, [postId]: true },
          error: null
        }));
        
        try {
          await API.delete(`/comments/${commentId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          
          // Refetch comments after deletion
          const response = await API.get(`/comments/post/${postId}`);
          set((state) => ({
            commentsMap: { ...state.commentsMap, [postId]: response.data },
            loadingCommentsMap: { ...state.loadingCommentsMap, [postId]: false },
            error: null
          }));
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Failed to delete comment";
          set((state) => ({
            error: errorMessage,
            loadingCommentsMap: { ...state.loadingCommentsMap, [postId]: false }
          }));
          throw error;
        }
      },

      // Helper functions
      clearComments: (postId) => {
        set((state) => {
          const newCommentsMap = { ...state.commentsMap };
          delete newCommentsMap[postId];
          return { commentsMap: newCommentsMap };
        });
      },

      clearAllComments: () => {
        set({ commentsMap: {}, loadingCommentsMap: {} });
      },

      clearError: () => {
        set({ error: null });
      },

      // Selectors
      getComments: (postId) => {
        const { commentsMap } = get();
        return commentsMap[postId] || [];
      },

      getCommentsCount: (postId) => {
        const { commentsMap } = get();
        return commentsMap[postId]?.length || 0;
      },

      isLoadingComments: (postId) => {
        const { loadingCommentsMap } = get();
        return loadingCommentsMap[postId] || false;
      },
    }),
    {
      name: "comment-store",
    }
  )
);

export default useCommentStore;
