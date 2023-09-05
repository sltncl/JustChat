import { Box, Grow, Stack, Typography } from "@mui/material";
import { activeChatStyles } from '../styles/styles'
import { theme } from "../theme";
import { useEffect, useState } from "react";


export default function Message({ data, loggedUser }) {
   const [rendered, setRendered] = useState(false)

   useEffect(() => {
      setRendered(true)
   }, [])

   let h = new Date(data.timestamp).getHours();
   let m = new Date(data.timestamp).getMinutes();
   h = h < 10 ? '0' + h : h;
   m = m < 10 ? '0' + m : m;

   const isSent = data.sender === loggedUser._id ? true : false

   return (
      <Grow in={rendered} >
         <Stack width='100%' flexDirection='row' justifyContent={isSent ? 'flex-end' : 'flex-start'}>
            <Box {...activeChatStyles.messageBox} className="message-box"
               bgcolor={isSent ? theme.palette.primary.main : theme.palette.secondary.main}>
               <Typography {...activeChatStyles.messageContent} color={isSent ? theme.palette.background : '#000000'}>
                  {data.content}
               </Typography>
               <Typography {...activeChatStyles.messageTimestamp} variant="caption" color={isSent ? theme.palette.grey.light : theme.palette.grey.main}>
                  {h + ":" + m}
               </Typography>
            </Box>
         </Stack >
      </Grow>
   )
}