import { Box, Typography } from "@mui/material";
import IconImage from "./IconImage";
import { chatStyles } from "../styles/styles";
import { format } from 'date-fns';

export default function Chat({ data, loggedUser, handleActiveChat, unreadChats }) {
   let sender
   data.users.forEach(el => {
      if (el._id !== loggedUser._id) {
         sender = el.username
      }
   })

   let lastMessageContent
   let lastMessageTimestamp
   if (data.messages.length > 0) {
      lastMessageContent = data.messages[data.messages.length - 1].content
      lastMessageTimestamp = new Date(data.messages[data.messages.length - 1].timestamp)
   }

   let unread = false
   if (unreadChats.some(chat => chat.chatId === data._id))
      unread = true

   const getLastMessageTimestamp = (lastMessage) => {
      const today = new Date;
      const last = new Date(lastMessage)
      if (last.getFullYear() == today.getFullYear() && last.getMonth() === today.getMonth()) {
         if (last.getDate() == today.getDate()) {
            let h = last.getHours();
            let m = last.getMinutes();
            h = h < 10 ? '0' + h : h;
            m = m < 10 ? '0' + m : m;
            return (h + ':' + m)
         }
         else if (last.getDate() == today.getDate() - 1)
            return 'Ieri'
         else {
            return format(last, 'dd/MM/yyyy')
         }
      }
   }

   return (
      <Box {...chatStyles.chatWrapper} href='#' className="chat-wrapper" >
         <Box {...chatStyles.chatContainer}
            onClick={() => handleActiveChat(data)}>
            <IconImage username={sender} />
            <Box {...chatStyles.chatContentContainer} >
               <Box {...chatStyles.chatTextContainer} >
                  <Typography variant='body1' component='p' fontWeight={unread ? '600' : '400'} >
                     {sender}
                  </Typography>
                  <Typography {...chatStyles.Typstyle} fontWeight={unread ? '800' : '400'} noWrap>
                     {lastMessageContent != undefined ? lastMessageContent : 'Nessun messaggio...'}
                  </Typography>
               </Box>
               <Box {...chatStyles.timestampContainer}>
                  <Typography {...chatStyles.Typstyle} noWrap>
                     {
                        lastMessageContent != undefined ? getLastMessageTimestamp(lastMessageTimestamp) : ''
                     }
                  </Typography>
               </Box>
            </Box>
         </Box>
      </Box>


   )
}