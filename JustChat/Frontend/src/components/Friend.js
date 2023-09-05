import React from "react";
import { Stack } from "@mui/material";
import "../App.css";
import User from "./User";
import { friendlistStyles } from "../styles/styles";
import { Box } from "@mui/system";
import { theme } from "../theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Friend(props) {

   const onlineUsers = props.onlineUsers
   let userStatus
   if (onlineUsers) {
      userStatus = onlineUsers.some(user => user.userId === props.id) ? 'Online' : 'Offline'
   }

   return (
      <Stack {...friendlistStyles.friend} direction='row' alignItems='center' >
         <User key={props.id}
            id={props.id}
            username={props.username}
            firstName={props.firstName}
            lastName={props.lastName} />
         <Box height='10px' width='10px' borderRadius='50%' margin='0px 5px'
            bgcolor={userStatus === 'Online' ? theme.palette.secondary.main : theme.palette.grey.middle}></Box>

         <Box {...friendlistStyles.iconContainer} sx={friendlistStyles.rejectIcon} onClick={() => props.handleDelete(props.username)}>
            <FontAwesomeIcon icon={faXmark} />

         </Box>
      </Stack>
   )
}