import { createTheme } from "@mui/material/styles";

/* Palette created here: https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=455A64&secondary.color=B2FF59 */

export const theme = createTheme({
  mode: "light",
  palette: {
    primary: {
      main: "#455a64",
      light: "#718792",
      dark: "#1c313a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#b2ff59",
      light: "#e7ff8c",
      dark: "#7ecb20",
      contrastText: "#000000",
    },
  },
});

/* export const theme = createTheme(adaptV4Theme({
  palette: {
    primary: {
      main: "#00A90B",
      light: "#1AC625",
      dark: "#008A09",
      verticalGradient:
        "linear-gradient(to bottom, #00a90b73 0%,#1ac6256b 50%,#00a90b69 92%,#1ac6256b 100%)",
    },
    secondary: {
      main: "#017C82",
      light: "#159298",
      veryLight: "#017C8270",
      veryVeryLight: "#017C824A",
      faint: "#017C820F",
      dark: "#01656A",
    },
    warning: {
      main: "#D76300",
    },
    error: {
      main: "#D70500",
    },
  },
})); */
