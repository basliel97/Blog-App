import { createTheme } from "@mui/material/styles";

// Named export: getTheme
export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
    },
  });
