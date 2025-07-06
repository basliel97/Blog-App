import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { PencilLine } from "lucide-react";
import usePostStore from "../store/postStore";

// ✅ Validation schema
const schema = yup.object({
  title: yup.string().required("Title is required"),
  content: yup
    .string()
    .min(10, "Content must be at least 10 characters")
    .required(),
});

export default function CreatePost() {
  const navigate = useNavigate();
  const theme = useTheme();
  const createPost = usePostStore((state) => state.createPost);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await createPost(data);
      navigate("/");
    } catch (err) {
      alert("Something went wrong!");
    }
  };

  // Gradient backgrounds for light/dark
  const bgGradient =
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #23272f 0%, #1a1d23 100%)"
      : "linear-gradient(135deg, #f5f8ff 0%, #e8ecf7 100%)";

  // Placeholder color for both modes
  const placeholderColor =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.6)"
      : "rgba(0,0,0,0.4)";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: bgGradient,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1.5,
              mb: 0.5,
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)",
                borderRadius: 2,
                p: 0.7,
                display: "flex",
                alignItems: "center",
              }}
            >
              <PencilLine size={24} color="#fff" />
            </Box>
            <Typography variant="h4" fontWeight={700}>
              Create New Post
            </Typography>
          </Box>
          <Typography variant="subtitle1" color="text.secondary" fontSize={16}>
            Share your thoughts, ideas, and stories with the community
          </Typography>
        </Box>

        {/* Card */}
        <Paper
          elevation={4}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            maxWidth: 540,
            mx: "auto",
            background: theme.palette.background.paper,
          }}
        >
          {/* Gradient Header */}
          <Box
            sx={{
              background: "linear-gradient(90deg, #1976d2 0%, #2196f3 100%)",
              px: 2.5,
              py: 1.5,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={700} color="#fff" fontSize={20}>
              Write Your Post
            </Typography>
          </Box>

          {/* Form */}
          <Box sx={{ p: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ mb: 0.5, mt: 1.5, fontSize: 15 }}
              >
                Post Title
              </Typography>
              <TextField
                placeholder="Enter an engaging title for your post..."
                fullWidth
                margin="normal"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
                sx={{
                  mb: 2,
                  background: theme.palette.background.default,
                  borderRadius: 2,
                  fontSize: 15,
                }}
                inputProps={{
                  style: {
                    fontSize: 15,
                    color: theme.palette.text.primary,
                  },
                }}
                InputProps={{
                  sx: {
                    "& input::placeholder": {
                      color: placeholderColor,
                      opacity: 1,
                    },
                  },
                }}
              />

              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ mb: 0.5, mt: 1.5, fontSize: 15 }}
              >
                Post Content
              </Typography>
              <TextField
                placeholder="Write your post content here... Share your thoughts, experiences, and insights with the community."
                fullWidth
                margin="normal"
                multiline
                rows={5}
                {...register("content")}
                error={!!errors.content}
                helperText={errors.content?.message}
                sx={{
                  mb: 2,
                  background: theme.palette.background.default,
                  borderRadius: 2,
                  fontSize: 15,
                }}
                inputProps={{
                  style: {
                    fontSize: 15,
                    color: theme.palette.text.primary,
                  },
                }}
                InputProps={{
                  sx: {
                    "& textarea::placeholder": {
                      color: placeholderColor,
                      opacity: 1,
                    },
                  },
                }}
              />

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  size="medium"
                  color="error"
                  sx={{
                    fontWeight: 600,
                    borderRadius: 2,
                    py: 1,
                    fontSize: "1rem",
                    flex: 1,
                    borderColor: theme.palette.error.main,
                    color: theme.palette.error.main,
                    "&:hover": {
                      borderColor: theme.palette.error.dark,
                      background: theme.palette.action.hover,
                    },
                  }}
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  sx={{
                    fontWeight: 600,
                    borderRadius: 2,
                    py: 1,
                    fontSize: "1rem",
                    flex: 1,
                  }}
                >
                  Create Post
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
