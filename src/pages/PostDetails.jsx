import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import usePostStore from "../store/PostStore";
import useCommentStore from "../store/CommentStore";
import {
  Typography, Box, Container, Button, Divider, TextField, Paper, Avatar, useTheme
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function PostDetails() {
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Updated store usage
  const { posts, loading, fetchPost, getPost, deletePost } = usePostStore();
  const { commentsMap, loadingCommentsMap, fetchComments, addComment } = useCommentStore();

  // Get post from store or fetch it
  const post = getPost(id);

  useEffect(() => {
    const loadPost = async () => {
      if (!post) {
        try {
          await fetchPost(id);
        } catch (error) {
          console.error("Error fetching post:", error);
        }
      }
    };

    if (id) {
      loadPost();
    }
  }, [id, post, fetchPost]);

  useEffect(() => {
    if (id) {
      fetchComments(id);
    }
  }, [id, fetchComments]);

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
    if (!confirmed) return;
    try {
      await deletePost(id, user?.token);
      alert("Post deleted.");
      navigate("/");
    } catch (err) {
      alert("Failed to delete post.");
    }
  };

  const handleCommentSubmit = async () => {
    try {
      await addComment(parseInt(id), newComment, user?.token);
      setNewComment("");
    } catch (err) {
      alert("Failed to post comment");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  // Fixed: Use authorId instead of post.author?.id
  const isOwner = user && Number(post.authorId) === Number(user.id);

  // Avatar initials helper
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Gradient for header
  const headerGradient = "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)";
  const cardBg = theme.palette.background.paper;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #23272f 0%, #1a1d23 100%)"
            : "linear-gradient(135deg, #f5f8ff 0%, #e8ecf7 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        {/* Post Card */}
        <Paper elevation={4} sx={{ borderRadius: 2, overflow: "hidden", mb: 4, background: cardBg }}>
          {/* Gradient Header */}
          <Box
            sx={{
              background: headerGradient,
              color: "#fff",
              px: 3,
              py: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4" fontWeight={700} sx={{ fontSize: 30, lineHeight: 1.2 }}>
              {post.title}
            </Typography>
            {isOwner && (
              <Box display="flex" alignItems="center" gap={1}>
                <Button
                  onClick={() => navigate(`/edit/${post.id}`)}
                  sx={{ minWidth: 0, color: "#fff" }}
                >
                  <EditIcon />
                </Button>
                <Button
                  onClick={handleDelete}
                  sx={{ minWidth: 0, color: "#fff" }}
                >
                  <DeleteIcon />
                </Button>
              </Box>
            )}
          </Box>
          {/* Author and Date */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 3, py: 1.5 }}>
            <Avatar sx={{ width: 32, height: 32, fontSize: 16, bgcolor: headerGradient }}>
              {getInitials(user?.username || user?.email || "Unknown")}
            </Avatar>
            <Typography fontWeight={500} color="text.primary">
              {user?.username || user?.email || "Unknown"}
            </Typography>
            <Typography color="text.secondary" fontSize={14}>
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
            </Typography>
          </Box>
          {/* Content */}
          <Box sx={{ px: 3, py: 2, background: theme.palette.background.default, minHeight: 60 }}>
            <Typography sx={{ color: theme.palette.text.primary, fontSize: 17 }}>
              {post.content}
            </Typography>
          </Box>
        </Paper>

        {/* Comments Card */}
        <Paper elevation={4} sx={{ borderRadius: 2, overflow: "hidden", background: cardBg }}>
          {/* Gradient Header */}
          <Box
            sx={{
              background: headerGradient,
              color: "#fff",
              px: 3,
              py: 1.7,
              display: "flex",
              alignItems: "center",
              gap: 1.2,
            }}
          >
            <Avatar sx={{ width: 26, height: 26, fontSize: 16, bgcolor: "#1565c0" }}>
              <span role="img" aria-label="comments">��</span>
            </Avatar>
            <Typography variant="h6" fontWeight={600} sx={{ fontSize: 20 }}>
              Comments ({commentsMap[id]?.length || 0})
            </Typography>
          </Box>
          {/* Add Comment */}
          {user && (
            <Box px={3} py={2}>
              <Typography fontWeight={600} sx={{ mb: 1 }}>
                Add a Comment
              </Typography>
              <TextField
                placeholder="Share your thoughts about this post..."
                fullWidth
                multiline
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mb: 2, background: theme.palette.background.default, borderRadius: 2 }}
              />
              <Button
                variant="contained"
                sx={{
                  background: headerGradient,
                  color: "#fff",
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                  py: 1.2,
                  fontSize: 16,
                  textTransform: "none",
                  boxShadow: "none",
                  '&:hover': { background: headerGradient }
                }}
                onClick={handleCommentSubmit}
                disabled={!newComment.trim()}
              >
                Post Comment
              </Button>
            </Box>
          )}
          {/* Comments List */}
          <Box px={3} py={2}>
            {loadingCommentsMap[id] ? (
              <Typography color="text.secondary">Loading comments...</Typography>
            ) : (commentsMap[id]?.length || 0) === 0 ? (
              <Typography color="text.secondary">No comments yet.</Typography>
            ) : (
              <Box display="flex" flexDirection="column" gap={2}>
                {commentsMap[id]?.map((comment) => (
                  <Paper key={comment.id} sx={{ p: 2, background: theme.palette.background.default, borderRadius: 2 }} elevation={0}>
                    <Typography variant="subtitle2" fontWeight={600} color={theme.palette.text.primary}>
                      {comment.authorId === user?.id ? user?.username : `User ${comment.authorId}`} 
                      <span style={{ color: theme.palette.text.secondary, fontWeight: 400 }}>— {new Date(comment.createdAt).toLocaleString()}</span>
                    </Typography>
                    <Typography color={theme.palette.text.secondary}>{comment.content}</Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}