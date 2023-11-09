import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#282b3d',
    },
    secondary: {
      main: '#334A52',
    },
    info: {
      main: '#00C2FC',
      light: '#0fafdb',
    },
    darkBlue: {
      main: '#07829D',
      light: '#19aac6',
    },
    semiWhite: {
      main: '#cfd5d6',
      light: '#acafaf',
      dark: '#bec9ce',
    },
    body: {
      main: 'rgb(255,255,255)',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      xsm: 450,
      sm: 600,
      tablet: 800,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  transitions: {
    easing: {
      cubic1: 'cubic-bezier( 0.77, 0.12, 0.38, 0.83  )',
    },
  },
})
