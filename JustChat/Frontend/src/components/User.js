import React from "react";
import { Stack, Typography } from "@mui/material";

import "../App.css";
import IconImage from "./IconImage";
import { friendlistStyles } from "../styles/styles";
export default function User(props) {

   return (
      <Stack direction="row" spacing={2} alignItems="center" sx={{ my: 1 }}>
         <IconImage username={props.username} />
         <Typography {...friendlistStyles.username} variant='h6' component='p'>{props.username}</Typography>
      </Stack>
   )
}