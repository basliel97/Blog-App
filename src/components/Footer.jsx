import { 
  Box, 
  Typography, 
  Link, 
  Container, 
  Stack, 
  useTheme,
  useMediaQuery 
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "Home", href: "/", isExternal: false },
    { label: "GitHub", href: "https://github.com/basliel97", isExternal: true },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: theme.palette.mode === "dark" 
          ? "linear-gradient(90deg, #1a237e 0%, #283593 100%)"
          : "linear-gradient(90deg, #1976d2 0%, #2196f3 100%)",
        color: "#fff",
        py: { xs: 4, md: 6 },
        mt: "auto",
        boxShadow: theme.shadows[8],
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "rgba(255, 255, 255, 0.1)",
        },
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems={isMobile ? "center" : "flex-start"}
          spacing={isMobile ? 3 : 0}
        >
          {/* Brand Section */}
          <Box sx={{ textAlign: isMobile ? "center" : "left" }}>
            <Typography
              variant="h5"
              component="h2"
              fontWeight={700}
              gutterBottom
              sx={{
                background: "linear-gradient(45deg, #fff 30%, #e3f2fd 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              BlogHub
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                fontWeight: 300,
                letterSpacing: "0.5px",
              }}
            >
              © {currentYear} BlogHub. All rights reserved.
            </Typography>
          </Box>

          {/* Links Section */}
          <Stack
            direction="row"
            spacing={3}
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                component={link.isExternal ? "a" : RouterLink}
                href={link.isExternal ? link.href : undefined}
                to={!link.isExternal ? link.href : undefined}
                color="inherit"
                underline="hover"
                target={link.isExternal ? "_blank" : undefined}
                rel={link.isExternal ? "noopener noreferrer" : undefined}
                sx={{
                  fontWeight: 500,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    opacity: 0.8,
                    transform: "translateY(-1px)",
                  },
                  "&::after": {
                    content: '""',
                    display: "block",
                    width: 0,
                    height: "2px",
                    background: "#fff",
                    transition: "width 0.3s ease",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>
        </Stack>

        {/* Bottom Section */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              opacity: 0.7,
              fontWeight: 300,
              letterSpacing: "0.5px",
            }}
          >
            Built with React, Material-UI & Zustand
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
