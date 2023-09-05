import React from "react";
import { Box } from "@mui/material";
import "../App.css";
import IconImage from "./IconImage";
import { friendlistStyles } from "../styles/styles";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ReceivedRequest(props) {

   return (
      <Box {...friendlistStyles.entryContainer}>
         <IconImage username={props.user.username} />
         <span id="usernameSpan">{props.user.username}</span>
         <Box {...friendlistStyles.buttonsContainer}>
            <Box {...friendlistStyles.iconContainer} sx={friendlistStyles.acceptIcon} onClick={() => props.handleAccept(props.user)}>
               <FontAwesomeIcon icon={faCheck} />
            </Box>
            <Box {...friendlistStyles.iconContainer} sx={friendlistStyles.rejectIcon} onClick={() => props.handleReject(props.user)}>
               <FontAwesomeIcon icon={faXmark} />
            </Box>
         </Box>
      </Box >
   )
}