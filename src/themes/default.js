import { createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import pink from '@material-ui/core/colors/pink';

const primary = blueGrey;
const secondary = pink;
const theme = createMuiTheme({
  palette: {
    primary: {
      main: primary[600],
    },
    secondary: {
      main: secondary[300],
    },
  }
});

export default theme;
