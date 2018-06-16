import { createMuiTheme } from "@material-ui/core/styles";
import theme from "./default";

const darkTheme = createMuiTheme({
  palette: {
    primary: {
      main: theme.palette.primary.main,
      light: "white"
    },
    secondary: theme.palette.secondary,
    error: theme.palette.error,
    type: "dark"
  }
});

export default darkTheme;
