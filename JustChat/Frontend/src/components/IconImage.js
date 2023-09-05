import React from "react";
import { Avatar, Stack } from "@mui/material";

import "../App.css";
export default function IconImage(props) {
   function stringToColor(string) {
      let hash = 0;
      let i;

      for (i = 0; i < string.length; i += 1) {
         hash = string.charCodeAt(i) + ((hash << 5) - hash);
      }

      let color = '#';

      for (i = 0; i < 3; i += 1) {
         const value = (hash >> (i * 8)) & 0xff;
         color += `00${value.toString(16)}`.slice(-2);
      }

      return color;
   }
   function stringAvatar(name) {
      return {
         sx: {
            bgcolor: stringToColor(name),
            color: '#FFFFFF',
            display: 'flex',
            justifiContent: 'center',
            alignItems: 'center'
         },
         children: `${name.split(' ')[0][0]}`,
      };
   }

   return (
      <Stack direction="row" spacing={2} alignItems="center" sx={{ my: 1 }}>
         <Avatar {...stringAvatar(`${props.username}`)} />
      </Stack>
   )
}