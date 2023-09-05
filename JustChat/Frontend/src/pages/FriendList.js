import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import { CircularProgress, Stack, Typography, Snackbar } from "@mui/material"; // Import Snackbar
import MuiAlert from '@mui/material/Alert'; // Import Alert component from MUI
import SearchBar from "../components/SearchBar";
import ReceivedRequest from "../components/ReceivedRequest";
import Navbar from "../components/Navbar";
import User from "../components/User";
import { Box } from "@mui/system";
import { friendlistStyles, generalStyles, sidebarStyles } from "../styles/styles";
import FriendsContainer from "../components/FriendsContainer";
import socket from "../socket";
import { useNavigate } from "react-router-dom";


export default function FriendList({ soundOn, toggleSound }) {
   const nav = useNavigate()
   const loggedUser = JSON.parse(localStorage.getItem('loggedUser')) && JSON.parse(localStorage.getItem('loggedUser')).user;
   const [friendList, setFriendList] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(false);
   const [recRequests, setRecRequests] = useState([]);
   const [sendRequests, setSendRequests] = useState([]);
   const [onlineUsers, setOnlineUsers] = useState([]);

   // Stato snackbar
   const [openSnackbar, setOpenSnackbar] = useState(false);
   const [snackbarMessage, setSnackbarMessage] = useState("");
   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
   // Mostra la snackbar
   const displaySnackbar = (message, severity) => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setOpenSnackbar(true);
   };

   // Chiude la snackbar
   const handleCloseSnackbar = () => {
      setOpenSnackbar(false);
   };


   /** Handler per il logout al click dell'icona posta in Navbar */
   const handleLogout = () => {
      localStorage.removeItem("loggedUser");
      axios
         .get("http://localhost:3000/api/users/logout", { withCredentials: true })
         .then((res) => {
            if (res.data.error) {
               console.log(res.data.error);
            } else {
               console.log("Logut succesfull");
               socket.emit("logout");
            }
         })
         .catch((error) => {
            console.error("Error:", error);
            setError("An error occurred. Please try again later.");
         });
   };


   /** Handler per la rimozione di un amico */
   const handleRemove = (friendUsername) => {
      axios
         .delete(
            `http://localhost:3000/api/friends/removeFriend/${loggedUser.username}/${friendUsername}`
         )
         .then((response) => {
            if (response.statusText === "OK") {
               loadFriendList();
               return response.data;
            } else
               throw new Error(
                  "Si è verificato un errore nella comunicazione con il server"
               );
         });
   };


   // Handler per l'invio di una richiesta di amicizia 
   const handleSearchClick = (friend) => {
      const friendUsername = friend.username;
      const username = loggedUser.username;
      axios
         .post("http://localhost:3000/api/friends/addFriend", {
            username,
            friendUsername,
         })
         .then((response) => {
            if (response.data.success) {
               displaySnackbar("Richiesta inviata correttamente", "success");
               socket.emit('newFriendRequest', { senderId: loggedUser._id, receiverId: friend._id })
               loadFriendList();
            } else if (response.data.error === "Users are already friends") {
               displaySnackbar("Amico già aggiunto", "warning");
            } else {
               displaySnackbar("Richiesta già inviata o ricevuta", "warning");
            }
         })
         .catch((error) => {
            console.error("Errore durante l'invio della richiesta", error);
         });
   };


   /** Handler per la conferma di una richiesta di amicizia */
   const handleAccept = (friend) => {
      const username = friend.username;
      const friendUsername = loggedUser.username;
      axios
         .post("http://localhost:3000/api/friends/accept", {
            username,
            friendUsername,
         })
         .then((response) => {
            if (response.data.success) {
               displaySnackbar("Richiesta accettata correttamente", "success");
               socket.emit('acceptRequest', { sender: loggedUser, receiverId: friend._id })
               loadFriendList(); // Aggiorna la lista degli amici dopo aver accettato la richiesta
            } else displaySnackbar("La richiesta non è andata a buon fine", "warning");
         })
         .catch((error) => {
            console.error("Errore durante l'invio della richiesta", error);
         });
   };

   /** Handler per il rifiuto di una richiesta di amicizia */
   const handleReject = (friend) => {
      const username = friend.username;
      const friendUsername = loggedUser.username;
      axios
         .post("http://localhost:3000/api/friends/reject", {
            username,
            friendUsername,
         })
         .then((response) => {
            if (response.data.success) {
               displaySnackbar("Richiesta rifiutata correttamente", "success");
               socket.emit('rejectRequest', { sender: loggedUser, receiverId: friend._id })
               loadFriendList(); // Aggiorna la lista degli amici dopo aver accettato la richiesta
            } else displaySnackbar("La richiesta non è andata a buon fine", "warning");
         })
         .catch((error) => {
            console.error("Errore durante l'invio della richiesta", error);
         });
   };

   /** Effettua una fetch al DB la lista degli amici relativa all'utente loggato per popolare la sidebar */
   const loadFriendList = () => {
      axios
         .get(`http://localhost:3000/api/friends/list/${loggedUser._id}`)
         .then((response) => {
            if (!response.data.message) {
               setSendRequests(response.data.friendList.sentRequests);
               setRecRequests(response.data.friendList.receivedRequests);
               setFriendList(response.data.friendList.friends);
            }
            setLoading(false);
         })
         .catch((error) => {
            setFriendList([]);
            setSendRequests([]);
            setRecRequests([]);
            setLoading(false);
            setError(true);
         });
      socket.on('getUsers', (utenti) => {
         setOnlineUsers(utenti);
      });
   };

   /** Al caricamento della pagina, richiama loadFriendlist per caricare la lista degli amici
    * ed invia l'evento 'userConnected' al socket per comunicare il proprio stato online
    */
   useEffect(() => {
      if (loggedUser) {
         loadFriendList();
         socket.emit('userConnected', loggedUser._id);
      }
      else nav('/')
   }, []);

   // Socket friendlist
   // Riceve nuove richieste di amicizia
   socket.on('requestReceived', () => {
      loadFriendList()
   })
   // Un utente ha accettato la tua richiesta di amicizia
   socket.on('requestAccepted', (sender) => {
      loadFriendList()
      displaySnackbar(`${sender.username} ha accettato la tua richiesta di amicizia`)
   })
   // Un utente ha rifiutato la tua richiesta di amicizia
   socket.on('requestRejected', (sender) => {
      loadFriendList()
      displaySnackbar(`${sender.username} ha rifiutato la tua richiesta di amicizia`, 'info')
   })


   return (
      <Box height="100vh" display='flex' sx={{ flexDirection: { lg: 'row', md: 'row', sm: 'row', xs: 'column' } }}>
         {loading ? (
            <Box {...generalStyles.loadingContainer}>
               <CircularProgress />
               <Typography variant="h5" mt={2}>
                  Caricamento in corso...
               </Typography>
            </Box>
         ) : error ? (
            <Box height="100vh" flex={1} display="flex" justifyContent="center" alignItems="center">
               <Typography variant="h5">
                  C'è stato un errore durante il caricamento della pagina
               </Typography>
            </Box>
         ) : (
            <>
               <Box {...sidebarStyles.sidebarContainer}>
                  <Navbar
                     loggedUser={{
                        username: loggedUser.username,
                        _id: loggedUser._id,
                     }}
                     handleLogout={handleLogout}
                     toggleSound={toggleSound}
                     soundOn={soundOn}
                  />
                  <SearchBar
                     label="Cerca un utente..."
                     loggedUser={loggedUser}
                     handleClick={handleSearchClick}
                  />

                  <FriendsContainer
                     friendList={friendList}
                     handleRemove={handleRemove}
                     onlineUsers={onlineUsers}
                  />
               </Box>
               <Box {...friendlistStyles.mainContainer}>
                  <Box {...friendlistStyles.requestsContainer}>
                     <Box {...friendlistStyles.topBar}>
                        <Typography {...friendlistStyles.subtitle} variant="h6" gutterBottom>
                           Richieste di amicizia ricevute
                        </Typography>
                     </Box>
                     <Box {...friendlistStyles.entriesContainer}>
                        {recRequests.length !== 0 && (
                           <>
                              {recRequests.map((friend, index) => (
                                 <ReceivedRequest
                                    key={index}
                                    handleAccept={handleAccept}
                                    handleReject={handleReject}
                                    user={friend}
                                 />
                              ))}
                           </>
                        )}
                     </Box>
                  </Box>
                  <Box {...friendlistStyles.requestsContainer}>
                     <Box {...friendlistStyles.topBar}>
                        <Typography {...friendlistStyles.subtitle} variant="h6" gutterBottom >
                           Richieste di amicizia inviate
                        </Typography>
                     </Box>
                     <Box {...friendlistStyles.entriesContainer}>
                        {sendRequests.length !== 0 && (
                           <>
                              {sendRequests.map((friend, index) => (
                                 <Box {...friendlistStyles.entryContainer} key={index}>
                                    <User username={friend.username} />
                                 </Box>
                              ))}
                           </>
                        )}
                     </Box>
                  </Box>
               </Box>
               <Snackbar
                  open={openSnackbar}
                  autoHideDuration={5000}
                  onClose={handleCloseSnackbar}
               >
                  <MuiAlert
                     elevation={6}
                     variant="filled"
                     onClose={handleCloseSnackbar}
                     severity={snackbarSeverity}
                  >
                     {snackbarMessage}
                  </MuiAlert>
               </Snackbar>
            </>
         )}
      </Box>
   );
}
