import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00A90B",
      light: "#1AC625",
      dark: "#008A09",
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
});
