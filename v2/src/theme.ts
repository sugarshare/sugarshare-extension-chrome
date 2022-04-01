import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  typography: {
    fontFamily: 'Poppins',
  },
  palette: {
    primary: {
      // main: '#60594D', // Umber
      main: '#000000DE',
    },
    background: {
      default: '#EBA937',
    },
  },
});

export default theme;
