import { createMuiTheme } from '@material-ui/core/styles';

/// Slate and Blue theme
const slateTheme = createMuiTheme({
  palette: {
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
    background: {
      paper: '#FFFFFF',
      default: '#E7E7E7'
    },
    primary: {
      light: 'rgba(144, 19, 254, 1)',
      main: '#3E3E3E',
      dark: 'rgba(62, 0, 117, 1)',
      contrastText: '#FFFFFF',
    },
    secondary: {
      light: 'rgba(74, 144, 226, 1)',
      main: 'rgba(0, 109, 200, 1)',
      dark: 'rgba(0, 50, 109, 1)',
      contrastText: '#FFFFFF',
    },
    error: {
      light: '#e57373',
      main: '#F44336',
      dark: '#D32f2f',
      constrastText: '#FFFFFF',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
    },
  },
});

/// Hacker theme
const hackerTheme = createMuiTheme({
  palette: {
    type: 'dark',
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
    background: {
      paper: '#151515',
      default: '#232323'
    },
    primary: {
      light: 'rgba(144, 19, 254, 1)',
      main: '#888888',
      dark: '#2cb42c',
      contrastText: '#FFFFFF',
    },
    secondary: {
      light: 'rgba(74, 144, 226, 1)',
      main: 'rgba(0, 109, 200, 1)',
      dark: 'rgba(0, 50, 109, 1)',
      contrastText: '#FFFFFF',
    },
    error: {
      light: '#e57373',
      main: '#F44336',
      dark: '#D32f2f',
      constrastText: '#FFFFFF',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
      secondary: 'rgba(255, 255, 255, 0.54)',
      disabled: 'rgba(255, 255, 255, 0.38)',
      hint: 'rgba(255, 255, 255, 0.38)',
    },
  },
});

export {
  slateTheme,
  hackerTheme,
};
