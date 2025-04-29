import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemedLayout = ({ children }) => {
  const location = useLocation();
  const { mode } = useTheme();

  const whitePages = ['/login', '/register'];

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            text: {
              primary: '#040316',
            },
            background: {
              default: whitePages.includes(location.pathname)
                ? 'white'
                : '#fbfbfe', // background base color
              paper: '#ffffff',
            },
            primary: {
              main: '#2f27ce', // base primary
              50: '#eaeafb',
              100: '#d6d4f7',
              200: '#ada9ef',
              300: '#847ee7',
              400: '#5b54de',
              500: '#3129d6',
              600: '#2821ab',
              700: '#1e1881',
              800: '#141056',
              900: '#0a082b',
              950: '#050415',
            },
            secondary: {
              main: '#dddbff',
              50: '#e7e5ff',
              100: '#cfccff',
              200: '#9e99ff',
              300: '#6e66ff',
              400: '#3d33ff',
              500: '#0d00ff',
              600: '#0a00cc',
              700: '#080099',
              800: '#050066',
              900: '#030033',
              950: '#01001a',
            },
            accent: {
              main: '#443dff',
              50: '#e6e5ff',
              100: '#ceccff',
              200: '#9c99ff',
              300: '#6b66ff',
              400: '#3a33ff',
              500: '#0800ff',
              600: '#0700cc',
              700: '#050099',
              800: '#030066',
              900: '#020033',
              950: '#01001a',
            },
          }
        : {
            text: {
              primary: '#eae9fc',
            },
            background: {
              default: '#010104',
              paper: '#1e1e1e',
            },
            primary: {
              main: '#3a31d8',
              50: '#050415',
              100: '#0a082b',
              200: '#141056',
              300: '#1e1881',
              400: '#2821ab',
              500: '#3129d6',
              600: '#5b54de',
              700: '#847ee7',
              800: '#ada9ef',
              900: '#d6d4f7',
              950: '#eaeafb',
            },
            secondary: {
              main: '#020024',
              50: '#01001a',
              100: '#030033',
              200: '#050066',
              300: '#080099',
              400: '#0a00cc',
              500: '#0d00ff',
              600: '#3d33ff',
              700: '#6e66ff',
              800: '#9e99ff',
              900: '#cfccff',
              950: '#e7e5ff',
            },
            accent: {
              main: '#0600c2',
              50: '#01001a',
              100: '#020033',
              200: '#030066',
              300: '#050099',
              400: '#0700cc',
              500: '#0800ff',
              600: '#3a33ff',
              700: '#6b66ff',
              800: '#9c99ff',
              900: '#ceccff',
              950: '#e6e5ff',
            },
          }),
    },
    typography: {
      fontFamily: 'Poppins, sans-serif',
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemedLayout;
