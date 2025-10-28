import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#F9F7F0',
      paper: '#F8EDD3',
    },
    primary: {
      main: '#F9C54D',
    },
    text: {
      primary: '#131414',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

export default theme;
