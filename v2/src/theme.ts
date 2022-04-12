import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  typography: {
    fontFamily: 'Poppins',
  },
  palette: {
    primary: {
      main: '#eba937',
      contrastText: '#1E1608',
      light: '#ffda68',
      dark: '#b47a00',
    },
    secondary: {
      main: '#000000de',
      contrastText: '#FFFFFF',
      light: '#131d20',
      dark: '#201d13',
    }
  },
});

export default theme;
