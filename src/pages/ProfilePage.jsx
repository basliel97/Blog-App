import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  Avatar,
  IconButton,
  Paper,
  useTheme
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import API from "../api/axiosInstance";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [profile, setProfile] = useState(user || null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [myPosts, setMyPosts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (!user) {
      API.get("/auth/me").then((res) => {
        setUser(res.data);
        setProfile(res.data);
        setEmail(res.data.email);
      });
    } else {
      setEmail(user.email);
      setProfile(user);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    
    // Fixed: Use the correct data structure from our backend
    API.get("/posts").then((res) => {
      const filtered = res.data.filter(post => {
        // Our backend returns authorId directly, not post.author.id
        return Number(post.authorId) === Number(user.id);
      });
      setMyPosts(filtered);
    }).catch(err => {
      console.error("Error fetching posts:", err);
    });
  }, [user]);

  const handleUpdate = async () => {
    try {
      const res = await API.put("/auth/me", {
        email,
        password: password || undefined,
      });
      alert("Profile updated!");
      setUser(res.data);
      setEditMode(false);
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await API.delete(`/posts/${postId}`);
      setMyPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      alert("Failed to delete post.");
    }
  };

  if (!profile) return <div>Loading...</div>;

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

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
      <Container maxWidth={false} sx={{ px: { xs: 0, sm: 2, md: 6, lg: 12 }, width: '100%' }}>
        {/* Profile Header */}
        <Box display="flex" alignItems="center" flexDirection="column" mt={4} mb={2}>
          <Avatar
            sx={{
              width: 70,
              height: 70,
              fontSize: 28,
              background: "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)",
              mb: 1.5,
            }}
          >
            {getInitials(profile.name || profile.email)}
          </Avatar>
          <Typography variant="h5" fontWeight={700}>
            {profile.name}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Content Creator &amp; Developer
          </Typography>
        </Box>

        {/* Profile Settings Card */}
        <Paper elevation={3} sx={{ borderRadius: 2, mb: 3, overflow: "hidden", width: { xs: '100%', sm: 420, md: 420 }, mx: "auto", background: theme.palette.background.paper }}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)",
              color: "#fff",
              px: 2,
              py: 1.2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <PersonIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600} fontSize={18}>
                Profile Settings
              </Typography>
            </Box>
            <IconButton
              onClick={() => setEditMode((v) => !v)}
              sx={{ color: "#fff" }}
              aria-label="Edit Profile"
            >
              <EditIcon />
            </IconButton>
          </Box>
          <Box px={3} py={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!editMode}
                  InputProps={{ readOnly: !editMode }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  helperText="Leave blank to keep existing password"
                  disabled={!editMode}
                  InputProps={{ readOnly: !editMode }}
                />
              </Grid>
            </Grid>
            {editMode && (
              <Button
                variant="contained"
                sx={{ mt: 2, minWidth: 120 }}
                onClick={handleUpdate}
              >
                Save Changes
              </Button>
            )}
          </Box>
        </Paper>

        {/* My Posts Card */}
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden", width: { xs: '100%', sm: 420, md: 420 }, mx: "auto", background: theme.palette.background.paper }}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)",
              color: "#fff",
              px: 2,
              py: 1.2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarMonthIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600} fontSize={18}>
                My Posts ({myPosts.length})
              </Typography>
            </Box>
          </Box>
          <Box px={2} py={2}>
            {myPosts.length === 0 ? (
              <Typography color="text.secondary">No posts found.</Typography>
            ) : (
              <Box display="flex" flexDirection="column" gap={2}>
                {myPosts.map((post) => (
                  <Card
                    key={post.id}
                    sx={{
                      borderRadius: 2,
                      boxShadow: 1,
                      px: 2,
                      py: 2,
                      background: theme.palette.background.default,
                      color: theme.palette.text.primary,
                      cursor: "pointer",
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: 4 },
                      width: '100%',
                      maxWidth: 400,
                      mx: "auto"
                    }}
                    variant="outlined"
                    onClick={() => navigate(`/posts/${post.id}`)}
                  >
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="h6" fontWeight={600} sx={{ flex: 1, fontSize: 17, color: theme.palette.text.primary }}>
                        {post.title}
                      </Typography>
                      {/* Fixed: Check authorId instead of post.author.id */}
                      {user && Number(post.authorId) === Number(user.id) && (
                        <IconButton
                          aria-label="Delete Post"
                          size="small"
                          sx={{ color: theme.palette.error.main, ml: 1 }}
                          onClick={e => {
                            e.stopPropagation();
                            handleDeletePost(post.id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }} mb={1}>
                      {post.excerpt || (post.content ? post.content.slice(0, 120) + "..." : "")}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={3} mt={1}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <CalendarMonthIcon fontSize="small" sx={{ opacity: 0.7, color: theme.palette.text.secondary }} />
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}