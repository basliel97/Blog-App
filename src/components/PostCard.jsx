// src/components/PostCard.jsx
import { 
  useTheme, 
  Avatar, 
  Paper, 
  Divider, 
  Box, 
  Typography, 
  Button, 
  Collapse, 
  TextField, 
  CircularProgress,
  Stack,
  Chip,
  IconButton,
  useMediaQuery
} from "@mui/material";
import { 
  MessageCircle, 
  Eye, 
  Calendar,
  User,
  Send
} from "lucide-react";
import { memo, useMemo } from "react";
import useAuthStore from "../store/authStore";

// Memoized comment component for better performance
const CommentItem = memo(({ comment, theme, getCommentAuthorInfo }) => (
  <Box 
    sx={{ 
      mb: 2, 
      p: 2, 
      background: theme.palette.mode === "dark" 
        ? "rgba(255, 255, 255, 0.05)" 
        : "rgba(0, 0, 0, 0.02)",
      borderRadius: 2,
      border: `1px solid ${theme.palette.divider}`,
    }}
  >
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
      <Avatar 
        sx={{ 
          width: 24, 
          height: 24, 
          fontSize: 12,
          bgcolor: theme.palette.primary.main 
        }}
      >
        {getCommentAuthorInfo(comment)[0]?.toUpperCase()}
      </Avatar>
      <Typography variant="subtitle2" fontWeight={600}>
        {getCommentAuthorInfo(comment)}
      </Typography>
      <Chip
        icon={<Calendar size={12} />}
        label={new Date(comment.createdAt).toLocaleDateString()}
        size="small"
        variant="outlined"
        sx={{ ml: "auto", fontSize: "0.7rem" }}
      />
    </Stack>
    <Typography 
      variant="body2" 
      color="text.secondary"
      sx={{ lineHeight: 1.6 }}
    >
      {comment.content}
    </Typography>
  </Box>
));

CommentItem.displayName = "CommentItem";

const PostCard = memo(({
  post,
  comments = [],
  onReadMore,
  onShowComments,
  showComments,
  isLoadingComments,
  newCommentValue,
  setNewCommentValue,
  onAddComment
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuthStore();

  // Memoized values for better performance
  const headerGradient = useMemo(() => 
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #1a237e 0%, #283593 100%)"
      : "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)",
    [theme.palette.mode]
  );

  const authorInfo = useMemo(() => {
    if (post.author?.username) {
      return {
        name: post.author.username,
        initial: post.author.username[0].toUpperCase()
      };
    }
    
    if (user && Number(post.authorId) === Number(user.id)) {
      return {
        name: user.username || user.email,
        initial: (user.username || user.email || "U")[0].toUpperCase()
      };
    }
    
    return {
      name: `User ${post.authorId}`,
      initial: "U"
    };
  }, [post.author, post.authorId, user]);

  const getCommentAuthorInfo = useMemo(() => (comment) => {
    if (comment.author?.username) {
      return comment.author.username;
    }
    
    if (user && Number(comment.authorId) === Number(user.id)) {
      return user.username || user.email;
    }
    
    return `User ${comment.authorId}`;
  }, [user]);

  const formattedDate = useMemo(() => {
    if (!post.createdAt) return "";
    return new Date(post.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }, [post.createdAt]);

  const truncatedContent = useMemo(() => {
    const maxLength = 200;
    return post.content?.length > maxLength 
      ? `${post.content.slice(0, maxLength)}...` 
      : post.content;
  }, [post.content]);

  const handleAddComment = () => {
    if (newCommentValue.trim()) {
      onAddComment();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAddComment();
    }
  };

  return (
    <Paper
      elevation={theme.palette.mode === "dark" ? 1 : 3}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        maxWidth: 800,
        mx: "auto",
        mb: 4,
        background: theme.palette.background.paper,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[8],
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: headerGradient,
          color: "#fff",
          px: { xs: 2, md: 3 },
          py: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar 
            sx={{ 
              width: 48, 
              height: 48, 
              fontSize: 20,
              bgcolor: "rgba(255, 255, 255, 0.2)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            {authorInfo.initial}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              fontWeight={600} 
              sx={{ 
                fontSize: { xs: "1rem", md: "1.1rem" },
                mb: 0.5 
              }}
            >
              {authorInfo.name}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Calendar size={16} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {formattedDate}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
        <Typography 
          variant="h5" 
          component="h2"
          fontWeight={700} 
          sx={{ 
            mb: 2, 
            fontSize: { xs: "1.3rem", md: "1.5rem" },
            lineHeight: 1.3,
          }}
        >
          {post.title}
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: 2, 
            lineHeight: 1.7,
            fontSize: { xs: "0.95rem", md: "1rem" },
          }}
        >
          {truncatedContent}
        </Typography>
      </Box>

      <Divider />

      {/* Actions */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        px: { xs: 2, md: 3 }, 
        py: 2 
      }}>
        <Button 
          onClick={onReadMore} 
          startIcon={<Eye size={20} />} 
          variant="outlined"
          sx={{ 
            fontWeight: 600, 
            borderRadius: 2,
            textTransform: "none",
            px: 3,
          }}
        >
          Read More
        </Button>
        <Button
          onClick={onShowComments}
          startIcon={<MessageCircle size={20} />}
          variant="text"
          sx={{ 
            fontWeight: 600, 
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          {showComments ? "Hide Comments" : `${comments.length} Comments`}
        </Button>
      </Box>

      {/* Comments Section */}
      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Box sx={{ px: { xs: 2, md: 3 }, pb: 3 }}>
          <Divider sx={{ mb: 3 }} />
          
          {isLoadingComments ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress size={32} />
            </Box>
          ) : (
            <>
              {comments.length === 0 ? (
                <Box 
                  sx={{ 
                    textAlign: "center", 
                    py: 4,
                    color: "text.secondary" 
                  }}
                >
                  <MessageCircle size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                  <Typography variant="body2">
                    No comments yet. Be the first to comment!
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2} sx={{ mb: 3 }}>
                  {comments.map((comment, index) => (
                    <CommentItem
                      key={comment.id || index}
                      comment={comment}
                      theme={theme}
                      getCommentAuthorInfo={getCommentAuthorInfo}
                    />
                  ))}
                </Stack>
              )}

              {/* Add Comment Form */}
              <Box sx={{ 
                background: theme.palette.mode === "dark" 
                  ? "rgba(255, 255, 255, 0.05)" 
                  : "rgba(0, 0, 0, 0.02)",
                borderRadius: 2,
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add a comment..."
                    value={newCommentValue}
                    onChange={(e) => setNewCommentValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    multiline
                    maxRows={3}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                  <IconButton
                    onClick={handleAddComment}
                    disabled={!newCommentValue.trim()}
                    color="primary"
                    sx={{
                      alignSelf: "flex-end",
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "action.disabledBackground",
                        color: "action.disabled",
                      },
                    }}
                  >
                    <Send size={20} />
                  </IconButton>
                </Stack>
              </Box>
            </>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
});

PostCard.displayName = "PostCard";

export default PostCard;