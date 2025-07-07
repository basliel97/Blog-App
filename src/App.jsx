import { Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { getTheme } from "./theme/theme";
import useThemeStore from "./store/themeStore";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetails from "./pages/PostDetails";
import CreatePost from "./pages/CreatePost";
import ProfilePage from "./pages/ProfilePage";
import EditPost from "./pages/EditPost";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import useAuthStore from "./store/authStore";
import { useEffect } from "react";

const App = () => {
  const { mode } = useThemeStore();
  const theme = getTheme(mode);
  const loadUserFromToken = useAuthStore((state) => state.loadUserFromToken);

  useEffect(() => {
    loadUserFromToken(); // Auto-login on app start
  }, [loadUserFromToken]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        <Box component="main" sx={{ flex: 1 }}>
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/posts/:id" 
              element={
                <ProtectedRoute>
                  <PostDetails />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <EditPost />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
        <Footer />
      </Box>
      
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
