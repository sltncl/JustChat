import { chatStyles, generalStyles } from "../styles/styles";
import Chat from "./Chat";
import { Box, Typography } from "@mui/material";


export default function ChatsContainer({ chats, loggedUser, handleActiveChat, unreadChats, show }) {

   // trova l'ultimo messaggio inviato
   const findLastMessage = (chat) => {

      let lastMessageDate = new Date('01/01/2000')
      let lastMessage
      let lastChat

      chat.messages.forEach((message) => {
         let messageDate = new Date(message.timestamp)
         if (messageDate > lastMessageDate)
            lastMessageDate = messageDate
      })
      return lastMessageDate
   }

   const findLastChat = (a, b) => {
      if (findLastMessage(a) > findLastMessage(b)) {
         return -1;
      }
      if (findLastMessage(a) < findLastMessage(b)) {
         return 1;
      }
      return 0;
   }

   if (chats) chats.sort(findLastChat);


   return (
      <Box {...chatStyles.chatsContainer} className="chats-container">
         {typeof chats !== "undefined" ?
            chats.map((el, index) => {
               return <Chat key={index} data={el} loggedUser={loggedUser}
                  handleActiveChat={handleActiveChat} unreadChats={unreadChats} />
            }) :
            <Box {...generalStyles.errorContainer}>
               <Typography variant='body2'>
                  Usa la barra di ricerca per iniziare una conversazione
               </Typography>
            </Box>
         }
      </Box>
   )
}