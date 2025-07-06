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
  useTheme
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import API from "../api/axiosInstance";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const schema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

export default function Register() {
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await API.post("/users/register", data); // sending username, email, password
      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      alert(error?.response?.data?.message || "Something went wrong");
    }
  };

  // Gradient backgrounds for light/dark (from Login)
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
              {/* Account creation icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm6-2v2h2v2h-2v2h-2v-2h-2v-2h2v-2h2z" fill="#fff"/></svg>
            </Box>
            <Typography variant="h4" fontWeight={700}>
              Create Account
            </Typography>
          </Box>
          <Typography variant="subtitle1" color="text.secondary" fontSize={16}>
            Sign up to get started
          </Typography>
        </Box>
        {/* Card */}
        <Card sx={{ width: "100%", p: 3, borderRadius: 2, boxShadow: 4, background: theme.palette.background.paper }}>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Username"
                fullWidth
                margin="normal"
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#1976d2"/></svg>
                    </Box>
                  )
                }}
              />
              <TextField
                label="Email address"
                fullWidth
                margin="normal"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 20V8.99l8 7 8-7V20H4z" fill="#1976d2"/></svg>
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
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 17a2 2 0 002-2v-2a2 2 0 00-4 0v2a2 2 0 002 2zm6-6V9a6 6 0 10-12 0v2a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2zm-8-2a4 4 0 118 0v2H6V9z" fill="#1976d2"/></svg>
                    </Box>
                  )
                }}
              />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, background: "linear-gradient(90deg, #1976d2 0%, #2196f3 100%)", fontWeight: 600, borderRadius: 2, fontSize: "1rem", py: 1, boxShadow: 2 }}>
                Register
              </Button>
            </form>
            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 600, color: '#1976d2', display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" style={{ marginRight: 4 }}><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59z" fill="#1976d2"/><path d="M19 3H5c-1.1 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="#1976d2"/></svg>
                  Sign In
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
