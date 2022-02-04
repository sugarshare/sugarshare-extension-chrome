import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  typography: {
    fontFamily: 'Poppins',
  },
  palette: {
    background: {
      // paper: '#009DDC',
      default: '#EBA937', // For buttons ##3779eb
    },
    text: {
      // primary: '#F0F6F6',
    },
  },
});

export default theme;
