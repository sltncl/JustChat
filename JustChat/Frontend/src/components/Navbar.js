import React from "react";
import { Box, Stack } from "@mui/material";
import IconImage from "./IconImage";
import { Link } from "react-router-dom";
import "../App.css"
import { sidebarStyles } from '../styles/styles';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faUserGroup, faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons'

export default function Navbar({ loggedUser, handleLogout, notification, toggleSound, soundOn }) {
   return (
      <Stack {...sidebarStyles.navbar} className="navbar" >
         <Link to="/home">
            <IconImage username={loggedUser.username} />
         </Link>
         <Box {...sidebarStyles.buttonsContainer}>
            <Box {...sidebarStyles.iconContainer} onClick={toggleSound} >
               {
                  soundOn ? <FontAwesomeIcon icon={faVolumeUp} /> : <FontAwesomeIcon icon={faVolumeMute} />
               }
            </Box>
            <Link to="/friends">
               <Box {...sidebarStyles.iconContainer} >
                  {notification && <Box {...sidebarStyles.friendsNotification}></Box>}
                  <FontAwesomeIcon icon={faUserGroup} />
               </Box>
            </Link>
            <Link to="/" onClick={handleLogout}>
               <Box {...sidebarStyles.iconContainer}>
                  <FontAwesomeIcon icon={faArrowRightFromBracket} />
               </Box>
            </Link>
         </Box >
      </Stack >
   )
}