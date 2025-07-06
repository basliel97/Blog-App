import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import {
  Container, Typography, TextField, Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import PostCard from "../components/PostCard";
import useAuthStore from "../store/authStore";
import ArticleIcon from "@mui/icons-material/Article"; // Add this import
import { useTheme } from "@mui/material";
import usePostStore from "../store/PostStore";

export default function Home() {
  const [search, setSearch] = useState("");
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentsMap, setCommentsMap] = useState({});
  const [loadingCommentsMap, setLoadingCommentsMap] = useState({});
  const [newCommentValues, setNewCommentValues] = useState({});

  const navigate = useNavigate();
  const { token } = useAuthStore();
  const theme = useTheme();
  const { posts, fetchPosts } = usePostStore();

  useEffect(() => {
    const fetch = async () => {
      await fetchPosts();
    };
    fetch();
  }, [fetchPosts]);

  // Optionally, you can add search support to the store, but for now, filter locally:
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleComments = async (postId) => {
    const alreadyShown = expandedPostId === postId;
    setExpandedPostId(alreadyShown ? null : postId);

    if (!alreadyShown && !commentsMap[postId]) {
      setLoadingCommentsMap((prev) => ({ ...prev, [postId]: true }));
      try {
        const res = await API.get(`/comments/post/${postId}`);
        setCommentsMap((prev) => ({ ...prev, [postId]: res.data }));
      } catch (err) {
        console.error("Failed to load comments", err);
      } finally {
        setLoadingCommentsMap((prev) => ({ ...prev, [postId]: false }));
      }
    }
  };

  const handleAddComment = async (postId) => {
    const content = newCommentValues[postId]?.trim();
    if (!content) return;

    try {
      await API.post(
        `/comments`,
        { postId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await API.get(`/comments/post/${postId}`);
      setCommentsMap((prev) => ({ ...prev, [postId]: res.data }));
      setNewCommentValues((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      alert("Failed to post comment");
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={7}
        mb={5}
      >
        <Box
          display="flex"
          alignItems="center"
          mb={1}
        >
          <ArticleIcon sx={{ fontSize: 40, color: "primary.main", mr: 1 }} />
          <Typography variant="h3" fontWeight={700}>
            All Posts
          </Typography>
        </Box>
        <Typography
          variant="h6"
          color="text.secondary"
          align="center"
          mb={3}
          sx={{ maxWidth: 600 }}
        >
          Discover insightful articles, tutorials, and discussions from our
          community of developers and creators.
        </Typography>
        <TextField
          placeholder="Search posts..."
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            maxWidth: 400,
            background: "#fff",
            borderRadius: 2,
            mb: 2,
            "& .MuiInputBase-root": { pl: 1.5 },
            "& .MuiInputBase-input": {
              color: theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.text.primary,
              background: "transparent",
              '::placeholder': {
                color: theme.palette.mode === "dark" ? theme.palette.grey[400] : theme.palette.text.disabled,
                opacity: 1,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <Box mr={1} color="text.secondary">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Box>
            ),
          }}
        />
      </Box>

      {/* Remove Grid, show posts one by one */}
      {filteredPosts.map((post) => (
        <Box key={post.id} mb={3}>
          <PostCard
            post={post}
            comments={commentsMap[post.id] || []}
            isLoadingComments={loadingCommentsMap[post.id]}
            showComments={expandedPostId === post.id}
            newCommentValue={newCommentValues[post.id] || ""}
            setNewCommentValue={(val) =>
              setNewCommentValues((prev) => ({ ...prev, [post.id]: val }))
            }
            onReadMore={() => navigate(`/posts/${post.id}`)}
            onShowComments={() => handleToggleComments(post.id)}
            onAddComment={() => handleAddComment(post.id)}
          />
        </Box>
      ))}
    </Container>
  );
}
