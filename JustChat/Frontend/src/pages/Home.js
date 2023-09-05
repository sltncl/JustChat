import ActiveChat from "../components/ActiveChat";
import axios from 'axios';
import { useEffect, useState } from "react";
import '../App.css';
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import socket from "../socket";
import ChatsContainer from "../components/ChatsContainer";
import { generalStyles, sidebarStyles } from "../styles/styles";
import { useNavigate } from "react-router-dom";

export default function Home({ soundOn, toggleSound }) {
   const nav = useNavigate()
   const loggedUser = JSON.parse(localStorage.getItem('loggedUser')) && JSON.parse(localStorage.getItem('loggedUser')).user;
   const [chats, setChats] = useState([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(false)
   const [activeChat, setActiveChat] = useState({})
   const [unreadChats, setUnreadChats] = useState([])
   const [onlineUsers, setOnlineUsers] = useState([])

   // stato per mostrare activeChat e nascondere la Sidebar quando viene cliccata una chat (mobile)
   const [showActiveChat, setShowActiveChat] = useState(false)
   const [showSidebar, setShowSidebar] = useState(true)

   // comportamento sidebar mobile
   const xsShowSidebar = showSidebar ? 'block' : 'none'

   // Notifica nella sezione amici 
   const [friendsNotification, setFriendNotification] = useState(false)


   // Handler per l'invio di un nuovo messaggio invocato da ActiveChat
   const addMessage = (event, messageContent, receiverId) => {
      fetch('http://localhost:3000/api/messages/add', {
         method: 'post',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            "chatId": activeChat._id,
            "senderId": loggedUser._id,
            "content": messageContent
         })
      }).then(res => {
         if (res.ok) return res.json()
      }).then(obj => {
         // Emetto un evento al socket per comunicare l'invio di un nuovo messaggio
         socket.emit("newMessage", ({
            userId: loggedUser._id,
            receiverId: receiverId,
            chatId: activeChat._id,
            text: obj.message
         }));
         // console.log(obj)
         loadHome()
      }).catch((error) => {
         console.log('00000')
      })
   }

   // Handler per il click su un risultato della ricerca
   const handleSearchClick = (friend) => {
      const username1 = loggedUser.username; // Lo username1 sarà l'ID dell'utente loggato 
      const username2 = friend.username;

      axios
         .post('http://localhost:3000/api/chats/add', { username1, username2 })
         .then((response) => {
            // Sia che la chat esista o meno viene portata in activeChat
            loadHome()
            handleActiveChat(response.data.chat)
            // Controllo se la chat esiste già, in tal caso la risposta avrà un messaggio di errore
            if (!response.data.error) {
               /* Se la risposta non ha errori, la chat non esisteva ed è stata creata, perciò invio
                  un evento 'newChat' al socket per notificare l'utente (nel caso fosse online)
                  per fargli effettuare una fetch al DB per aggiornare le proprie chat
                  visualizzando quella appena creata */
               socket.emit('newChat', { receiverId: friend._id })
            }
         })
         .catch((error) => {
            console.error('Errore durante la creazione della chat', error);
         });
   };


   /** Handler per la rimozione di una chat, invocato dal bottone
    *  trashcan posto nella topbar di ActiveChat 
   */
   const handleRemoveChat = (chatId) => {
      axios.delete(`http://localhost:3000/api/chats/delete/${chatId}`)
         .then((response) => {
            if (response.statusText === "OK") {
               setActiveChat({})
               setShowActiveChat(false)
               setShowSidebar(true)
               loadHome()
               return response.data;
            } else throw new Error("Si è verificato un errore nella comunicazione con il server");
         });
      socket.emit('deleteChat', chatId)

   }

   /** Alla ricezione di un nuovo messaggio (evento 'messageReceived), evidenzia la chat 
    * corrispondente a meno che non sia già una chat non letta 
   */
   const handleUnreadChats = (chatId) => {
      if (!unreadChats.some(chat => chat.chatId === chatId)) {
         setUnreadChats([...unreadChats, {
            chatId: chatId
         }])
      }
   }

   /** 'Apertura' di una chat, controlla se la chat appena aperta (activeChat) è 
    * tra le unreadChats ed eventualmente setta il nuovo stato di unreadChats con 
    * il metodo filter
    */
   const handleReadChat = (chatId) => {
      if (unreadChats.some(chat => chat.chatId === chatId)) {
         setUnreadChats(unreadChats.filter(chat => chat.chatId !== chatId))
      }
   }

   /** Effettua una fetch al DB per ottenere tutte le chat dell'utente loggato */
   const loadHome = () => {
      axios.get(`http://localhost:3000/api/chats/list/${loggedUser._id}`)
         .then(res => {
            if (res.statusText === 'OK') return res.data
         })
         .then(obj => {
            setLoading(false)
            setChats(obj.chats)
         })
         .catch(error => {
            setLoading(false)
            setError(true)
         });
   }

   /** Al caricamento della home invia un evento al socket per aggiungere l'utente
    * loggato alla lista degli utenti online, carico le chat e per i dispositivi mobile
    * mostro Sidebar e nascondo ActiveChat
    */
   useEffect(() => {
      if (loggedUser) {
         socket.emit('userConnected', loggedUser._id)
         loadFriendList()
         loadHome();
         setShowActiveChat(false)
         setShowSidebar(true)
      } else
         nav('/')
   }, [])

   /** Handler per il logout al click dell'icona posta in Navbar */
   const handleLogout = () => {
      localStorage.removeItem('loggedUser');
      axios
         .get("http://localhost:3000/api/users/logout", { withCredentials: true })
         .then((res) => {
            if (res.data.error) {
               console.log(res.data.error);
            } else {
               console.log("Logut succesfull");
               // Se il logout va a buon fine invia l'evento corrispondente al socket
               socket.emit('logout')
            }
         })
         .catch((error) => {
            console.error("Error:", error);
            setError("An error occurred. Please try again later.");
         });
   };


   /** Handler per mostrare ActiveChat al click di una Chat in ChatsContainer */
   const handleActiveChat = (chat) => {
      setActiveChat(chat)
      handleReadChat(chat._id)
      // Nei dispositivi mobile mostra activeChat e nasconde Sidebar
      setShowActiveChat(true)
      setShowSidebar(false)
   };

   /** Handler per dispositivi mobile: cliccando la freccia per tornare indietro posta
    * nella topbar di Active chat viene mostrato ChatsContainer e nascosto ActiveChat */
   const handleBackOnMobile = () => {
      setShowActiveChat(false)
      setShowSidebar(true)
   }

   // Fetch al DB per controllare se l'utente loggato ha delle richieste di amicizia in sospeso
   const loadFriendList = () => {
      axios
         .get(`http://localhost:3000/api/friends/list/${loggedUser._id}`)
         .then((response) => {
            if (response.data.friendList)
               if (response.data.friendList.receivedRequests.length > 0) {
                  setFriendNotification(true)
               }
         })
   }

   /** SOCKET */
   // Utenti online
   socket.on('getUsers', utenti => setOnlineUsers(utenti))

   // Ricezione messaggi
   socket.on('messageReceived', ({ chatId, text }) => {
      loadHome()
      handleUnreadChats(chatId)
   })

   // Creazione nuova chat
   socket.on('chatCreated', () => loadHome())

   // Richieste di amicizia
   socket.on('requestReceived', () => setFriendNotification(true))

   // Rimozione chat
   socket.on('chatDeleted', chatId => {
      /* Se un utente ha rimosso la chat corrente dell'utente loggato
         viene resettata activeChat e riaggiornata la lista delle chat */
      if (chatId === activeChat._id) {
         setActiveChat({})
         setShowActiveChat(false)
         setShowSidebar(true)
         loadHome()
      }
      loadHome()
   })

   return (
      <Box {...generalStyles.homeContainer}>
         {loading ?
            <Box {...generalStyles.loadingContainer} >
               <CircularProgress />
               <Typography variant="h5" mt={2}>Caricamento in corso...</Typography>
            </Box> :
            error ?
               <Box height='100vh' flex={1} display='flex' justifyContent='center' alignItems='center'>
                  <Typography variant='h5'>C'è stato un errore durante il caricamento della pagina</Typography>
               </Box> :
               <>
                  {/* Sidebar */}
                  <Box {...sidebarStyles.sidebarContainer}
                     sx={{ display: { lg: 'block', md: 'block', sm: 'block', xs: `${xsShowSidebar}` } }}>
                     <Navbar loggedUser={loggedUser} handleLogout={handleLogout} notification={friendsNotification} toggleSound={toggleSound} soundOn={soundOn} />
                     <SearchBar
                        label="Cerca un utente..."
                        loggedUser={loggedUser}
                        handleClick={handleSearchClick}
                     />
                     <ChatsContainer chats={chats} loggedUser={loggedUser} handleActiveChat={handleActiveChat} unreadChats={unreadChats} />
                  </Box>
                  <ActiveChat loggedUser={loggedUser} data={activeChat} addMessage={addMessage} handleRemoveChat={handleRemoveChat} onlineUsers={onlineUsers} show={showActiveChat} goBack={handleBackOnMobile} soundOn={soundOn} />
               </>
         }
      </Box >
   )
}
