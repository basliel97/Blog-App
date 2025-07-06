import { useForm } from "react-hook-form";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Link,
  useTheme,
  Alert,
  CircularProgress
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAuthStore from "../store/authStore";
import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
import { useState } from "react";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    clearError(); // Clear any previous errors
    
    try {
      const result = await login({
        email: data.email.trim(),
        password: data.password,
      });

      if (result.success) {
        // Navigate to the intended destination or home
        navigate(from, { replace: true });
      } else {
        // Error is already set in the store
        console.error("Login failed:", result.error);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gradient backgrounds for light/dark
  const bgGradient =
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #23272f 0%, #1a1d23 100%)"
      : "linear-gradient(135deg, #f5f8ff 0%, #e8ecf7 100%)";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: bgGradient,
        py: 4,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1.5,
              mb: 1,
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59z" fill="#fff"/>
                <path d="M19 3H5c-1.1 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="#fff"/>
              </svg>
            </Box>
            <Typography variant="h4" fontWeight={700}>
              Welcome Back
            </Typography>
          </Box>
          <Typography variant="subtitle1" color="text.secondary" fontSize={16}>
            Sign in to continue
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={clearError}
          >
            {error}
          </Alert>
        )}

        {/* Card */}
        <Card 
          sx={{ 
            width: "100%", 
            p: 3, 
            borderRadius: 3, 
            boxShadow: theme.shadows[8], 
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Email address"
                fullWidth
                margin="normal"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 20V8.99l8 7 8-7V20H4z" fill="#1976d2"/>
                      </svg>
                    </Box>
                  )
                }}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <path d="M12 17a2 2 0 002-2v-2a2 2 0 00-4 0v2a2 2 0 002 2zm6-6V9a6 6 0 10-12 0v2a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2zm-8-2a4 4 0 118 0v2H6V9z" fill="#1976d2"/>
                      </svg>
                    </Box>
                  )
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  background: "linear-gradient(90deg, #1976d2 0%, #2196f3 100%)", 
                  fontWeight: 600, 
                  borderRadius: 2, 
                  fontSize: "1rem", 
                  py: 1.5, 
                  boxShadow: 2,
                  "&:hover": {
                    background: "linear-gradient(90deg, #1565c0 0%, #1976d2 100%)",
                    transform: "translateY(-1px)",
                    boxShadow: 4,
                  },
                  "&:disabled": {
                    background: "linear-gradient(90deg, #1976d2 0%, #2196f3 100%)",
                    opacity: 0.7,
                  }
                }}
              >
                {isSubmitting ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Signing In...
                  </Box>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            
            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Don&apos;t have an account?{' '}
                <Link 
                  component={RouterLink} 
                  to="/register" 
                  underline="hover" 
                  sx={{ 
                    fontWeight: 600, 
                    color: theme.palette.primary.main, 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    "&:hover": {
                      color: theme.palette.primary.dark,
                    }
                  }}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm6-2v2h2v2h-2v2h-2v-2h-2v-2h2v-2h2z" fill="currentColor"/>
                  </svg>
                  Create Account
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
