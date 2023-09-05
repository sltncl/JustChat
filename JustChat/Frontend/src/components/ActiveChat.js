import React from 'react';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import Message from './Message';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import "../App.css"
import { format } from 'date-fns';
import { activeChatStyles } from "../styles/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons'
import { theme } from '../theme';

// sendMessage sound effect
import sound from '../assets/sendmessage.mp3'


export default function ActiveChat({ loggedUser, data, addMessage, handleRemoveChat, onlineUsers, show, goBack, soundOn }) {
   const [messageContent, setMessageContent] = useState('');
   const [messages, setMessages] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(false);

   // comportamento display su dispositivi mobile
   const xsOpacity = show ? '1' : '0'
   const xsFlex = show ? '1' : '0'

   // per scrollare in basso ai messaggi
   const lastMessageRef = useRef();


   // Stato dell'utente (Online/Offline)
   let otherUser;
   let otherUserStatus
   if (data.users) {
      data.users.forEach(el => {
         if (el._id !== loggedUser._id) {
            otherUser = el;
         }
      });
      otherUserStatus = onlineUsers.some(user => user.userId === otherUser._id) ? 'Online' : 'Offline'
   }

   // Handler per la digitazione: setta messageContent ad ogni cambiamento del contenuto dell'input
   const handleChange = (event) => {
      setMessageContent(event.target.value);
   };


   // Handler per la pressione del tasto Invio
   const handleEnter = (event) => {
      if (event.key === 'Enter') {
         if (messageContent !== '') {
            // Se è stato premuto Invio:
            // svuota la casella di testo
            event.target.value = '';
            // richiama l'handler (passato nelle props da Home) per l'aggiunta del messaggio
            addMessage(event, messageContent, otherUser._id);

            /* Per avere una risposta visiva immediata creo un nuovo messaggio e lo aggiungo ai messaggi 
               visualizzati a schermo (settando lo stato di messages), altrimenti bisognerebbe aspettare 
               il refresh dato dalla fetch al database situata in getMessages */
            const newMess = {
               chatId: data._id,
               content: messageContent,
               sender: loggedUser._id,
               timestamp: Date.now()
            }
            setMessages([...messages, newMess])

            // Riproduco suono di invio messaggio se i soundOn (stato di Home) è abilitato 
            soundOn && new Audio(sound).play()
         }
      }
      // Reset di messageContent
      setMessageContent('');
   };

   // Fetch al DB per ottenere i messaggi della chat corrente
   const getMessages = () => {
      axios
         .get(`http://localhost:3000/api/messages/${data._id}`)
         .then(res => {
            if (res.statusText === 'OK') return res.data;
         })
         .then(obj => {
            setLoading(false);
            setMessages(obj.messages);
         })
         .catch(error => {
            setLoading(false);
            setError(true);
         });
   }

   /** Ad ogni invio di messaggio chiama getMessages che fa una fetch al DB 
    * per ottenere i messaggi della chat corrente
   */
   useEffect(() => {
      if (otherUser)
         getMessages()
   }, [addMessage]);

   // Scroll automatico all'ultimo messaggio scambiato
   useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   // Autofocus sull'input all'aprirsi della chat
   useEffect(() => {
      if (!loading && otherUser)
         document.getElementById('message-input').focus()
   }, [data])

   // Funzione per ottenere la data nel formato dd/MM/yyyy 
   const getMessageDate = (timestamp) => {
      const date = new Date(timestamp);

      // controlla se i messaggi sono di oggi, ieri o giorni precedenti
      const today = new Date;
      const yesterday = new Date;
      yesterday.setDate(today.getDate() - 1);
      if (format(date, 'dd/MM/yyyy') === format(today, 'dd/MM/yyyy'))
         return 'OGGI'
      if (format(date, 'dd/MM/yyyy') === format(yesterday, 'dd/MM/yyyy'))
         return 'IERI'
      return format(date, 'dd/MM/yyyy');
   };

   // Funzione per verificare se un messaggio è il primo del giorno
   const isFirstMessageOfDay = (index) => {
      if (index === 0) {
         return true;
      }
      const currentDate = getMessageDate(messages[index].timestamp);
      const previousDate = getMessageDate(messages[index - 1].timestamp);
      return currentDate !== previousDate;
   };


   return (
      <Box {...activeChatStyles.activeChatContainer}
         sx={{
            display: 'flex',
            flex: { lg: '5', md: '5', sm: '5', xs: `${xsFlex}` },
            opacity: { lg: '1', md: '1', sm: '1', xs: `${xsOpacity}` }
         }}>

         {
            otherUser ?
               loading ?
                  <Box flex={1} display='flex' justifyContent='center' alignItems='center' height='100px'>
                     <CircularProgress />
                  </Box> :
                  error ?
                     <Box flex={1} display='flex' justifyContent='center' alignItems='center'>
                        <Typography variant='h5'>C'è stato un errore nel caricamento dei messaggi</Typography>
                     </Box> : (
                        <>
                           {
                              data.users && <>
                                 <Box {...activeChatStyles.topBar}>
                                    <Box {...activeChatStyles.iconContainer} marginLeft={1}
                                       sx={{ display: { xs: 'flex', sm: 'none', md: 'none', lg: 'none' } }}
                                       onClick={goBack}>
                                       <FontAwesomeIcon icon={faArrowLeft} />
                                    </Box>
                                    <Box display='flex' flexDirection='column' alignContent='flex-start'>
                                       <Typography variant='h5'>
                                          {otherUser.username}
                                       </Typography>
                                       <Box display='flex' flexDirection='row' alignItems='center' justifyContent='flex-start'>
                                          <Box height='10px' width='10px' borderRadius='50%' bgcolor={otherUserStatus === 'Online' ? theme.palette.secondary.main : theme.palette.grey.middle} margin='0px 5px'></Box>
                                          <Typography variant='body2'>
                                             {otherUserStatus}
                                          </Typography>
                                       </Box>
                                    </Box>
                                    <Box {...activeChatStyles.iconContainer} onClick={() => {
                                       setLoading(true)
                                       handleRemoveChat(data._id)
                                    }}>
                                       <FontAwesomeIcon icon={faTrash} />
                                    </Box>

                                 </Box>

                                 <Stack {...activeChatStyles.messagesContainer}>
                                    {messages && (
                                       <>
                                          {messages.map((el, index) => (
                                             <React.Fragment key={index} >
                                                {isFirstMessageOfDay(index) && (
                                                   <>
                                                      <Box height='10px'></Box>
                                                      <Box {...activeChatStyles.date} textAlign="center" mt={1}>
                                                         <Typography variant="caption" sx={{ color: 'black' }}>
                                                            {getMessageDate(el.timestamp)}
                                                         </Typography>
                                                      </Box>
                                                   </>
                                                )}
                                                <Message data={el} loggedUser={loggedUser} />
                                             </React.Fragment>
                                          ))}
                                          <div ref={lastMessageRef} />
                                       </>
                                    )}
                                 </Stack>
                                 {otherUser &&
                                    <Box {...activeChatStyles.inputContainer}>
                                       <input id='message-input' name="message-content" placeholder="Scrivi..."
                                          onKeyDown={handleEnter} onChange={handleChange} autoComplete='off' autoFocus />
                                    </Box>
                                 }
                              </>
                           }

                        </ >
                     )
               :
               <Box flex={1} display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                  <Typography variant='h4'>JustChat</Typography>
                  <Typography variant='h6'>Inizia a chattare!</Typography>
               </Box>
         }
      </Box >

   );
}
