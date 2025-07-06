import { Navigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { token, user, isLoading, loadUserFromToken, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Load user data if token exists but no user data
    if (token && !user && !isLoading) {
      loadUserFromToken();
    }
  }, [token, user, isLoading, loadUserFromToken]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
