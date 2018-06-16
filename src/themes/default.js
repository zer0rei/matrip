import { createMuiTheme } from "@material-ui/core/styles";
import blueGrey from "@material-ui/core/colors/blueGrey";
import red from "@material-ui/core/colors/red";
import deepOrange from "@material-ui/core/colors/deepOrange";

const primary = blueGrey;
const secondary = red;
const error = deepOrange;
const theme = createMuiTheme({
  palette: {
    primary: {
      main: primary[600],
    },
    secondary: {
      main: secondary[400],
    },
    error: {
      main: error[500],
    }
  }
});

export default theme;
