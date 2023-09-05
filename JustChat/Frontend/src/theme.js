import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
   typography: {
      fontFamily: 'Inter',
   },
   palette: {
      background: '#FFFFFF',
      primary: {
         main: "#118DFF",
         middle: '#67B5DE',
         light: "#E1F0F9",
      },
      secondary: {
         main: '#72DD6F',
         light: '#E3F8E2'
      },
      grey: {
         light: '#E9EDEF',
         main: '#515151',
         middle: '#899EA9'
      },
      shadow: '0 5px 20px rgba(0,0,0,.1)'
   }
})
