import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Paper,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
  Badge,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  LogIn,
  UserRoundPlus,
  SquarePlus,
  SquareUserRound,
  LogOut,
  Home,
  BookText,
  Menu,
} from "lucide-react";
import { memo, useState, useMemo, useCallback } from "react";
import useThemeStore from "../store/themeStore";
import useAuthStore from "../store/authStore";

// Navigation item component for better reusability
const NavItem = memo(({ 
  path, 
  label, 
  icon: Icon, 
  isActive, 
  onClick, 
  variant = "outlined",
  color = "primary" 
}) => (
  <Button
    variant={isActive ? "contained" : variant}
    color={color}
    startIcon={<Icon size={20} />}
    onClick={onClick}
    sx={{
      fontWeight: 600,
      textTransform: "none",
      borderRadius: 2,
      px: 3,
      py: 1,
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: 2,
      },
    }}
  >
    {label}
  </Button>
));

NavItem.displayName = "NavItem";

// Mobile menu item component
const MobileMenuItem = memo(({ 
  path, 
  label, 
  icon: Icon, 
  onClick, 
  color = "inherit" 
}) => (
  <ListItem disablePadding>
    <ListItemButton onClick={onClick} sx={{ borderRadius: 1, mx: 1, mb: 0.5 }}>
      <ListItemIcon>
        <Icon color={color} size={20} />
      </ListItemIcon>
      <ListItemText 
        primary={label} 
        sx={{ 
          color,
          "& .MuiListItemText-primary": {
            fontWeight: 500,
          },
        }} 
      />
    </ListItemButton>
  </ListItem>
));

MobileMenuItem.displayName = "MobileMenuItem";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  
  const { mode, toggleTheme } = useThemeStore();
  const { token, user, logout } = useAuthStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Memoized navigation items
  const navigationItems = useMemo(() => {
    const items = [
      { path: "/", label: "Home", icon: Home },
    ];

    if (isAuthenticated) {
      items.push(
        { path: "/create", label: "Create Post", icon: SquarePlus },
        { path: "/profile", label: "Profile", icon: SquareUserRound }
      );
    } else {
      items.push(
        { path: "/login", label: "Login", icon: LogIn },
        { path: "/register", label: "Register", icon: UserRoundPlus }
      );
    }

    return items;
  }, [isAuthenticated]);

  // Memoized user info
  const userInfo = useMemo(() => {
    if (!user) return { initials: "U", name: "User" };
    
    const name = user.username || user.email || "User";
    const initials = name.charAt(0).toUpperCase();
    
    return { initials, name };
  }, [user]);

  // Helper to determine active button
  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  // Handlers
  const handleLogout = useCallback(() => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;
    
    logout();
    navigate("/login");
  }, [logout, navigate]);

  const handleNavigation = useCallback((path) => {
    navigate(path);
    setDrawerOpen(false);
  }, [navigate]);

  const handleThemeToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  return (
    <Paper
      elevation={theme.palette.mode === "dark" ? 1 : 2}
      sx={{
        borderRadius: 0,
        background: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: "sticky",
        top: 0,
        zIndex: theme.zIndex.appBar,
      }}
    >
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          background: "transparent",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ minHeight: 70, px: { xs: 2, md: 3 } }}>
          {/* Logo and Brand */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mr: { xs: 2, md: 4 },
              cursor: "pointer",
              flexShrink: 0,
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
            onClick={() => navigate("/")}
          >
            <Badge
              badgeContent=""
              color="primary"
              sx={{
                "& .MuiBadge-badge": {
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                },
              }}
            >
              <BookText 
                size={32} 
                color={theme.palette.primary.main} 
              />
            </Badge>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 800,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: 1,
                userSelect: "none",
                fontSize: { xs: "1.25rem", md: "1.5rem" },
              }}
            >
              BlogHub
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Stack
              direction="row"
              spacing={2}
              sx={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {navigationItems.map((item) => (
                <NavItem
                  key={item.path}
                  path={item.path}
                  label={item.label}
                  icon={item.icon}
                  isActive={isActive(item.path)}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </Stack>
          )}

          {/* Right Section */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ ml: "auto" }}
          >
            {/* Theme Toggle */}
            <Tooltip title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}>
              <IconButton
                onClick={handleThemeToggle}
                sx={{
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    color: theme.palette.primary.main,
                    transform: "rotate(180deg)",
                    transition: "all 0.3s ease-in-out",
                  },
                }}
              >
                {mode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </IconButton>
            </Tooltip>

            {/* User Avatar (Desktop) */}
            {!isMobile && isAuthenticated && (
              <Tooltip title={userInfo.name}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: theme.palette.primary.main,
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                  onClick={() => navigate("/profile")}
                >
                  {userInfo.initials}
                </Avatar>
              </Tooltip>
            )}

            {/* Logout Button (Desktop) */}
            {!isMobile && isAuthenticated && (
              <Tooltip title="Logout">
                <IconButton
                  onClick={handleLogout}
                  sx={{
                    color: theme.palette.error.main,
                    "&:hover": {
                      bgcolor: theme.palette.error.light,
                      color: theme.palette.error.contrastText,
                    },
                  }}
                >
                  <LogOut size={20} />
                </IconButton>
              </Tooltip>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{
                  color: theme.palette.text.primary,
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                <Menu size={24} />
              </IconButton>
            )}
          </Stack>

          {/* Mobile Drawer */}
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                width: 280,
                background: theme.palette.background.paper,
                borderLeft: `1px solid ${theme.palette.divider}`,
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              {/* User Info in Drawer */}
              {isAuthenticated && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    bgcolor: theme.palette.mode === "dark" 
                      ? "rgba(255, 255, 255, 0.05)" 
                      : "rgba(0, 0, 0, 0.02)",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: theme.palette.primary.main,
                    }}
                  >
                    {userInfo.initials}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {userInfo.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>
              )}

              <List sx={{ pt: 0 }}>
                {navigationItems.map((item) => (
                  <MobileMenuItem
                    key={item.path}
                    path={item.path}
                    label={item.label}
                    icon={item.icon}
                    onClick={() => handleNavigation(item.path)}
                    color={isActive(item.path) ? theme.palette.primary.main : "inherit"}
                  />
                ))}

                {isAuthenticated && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <MobileMenuItem
                      path="/logout"
                      label="Logout"
                      icon={LogOut}
                      onClick={handleLogout}
                      color={theme.palette.error.main}
                    />
                  </>
                )}
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </AppBar>
    </Paper>
  );
};

export default memo(Navbar);
