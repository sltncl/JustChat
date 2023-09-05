import { io } from 'socket.io-client';

const URL = 'http://localhost:3000'; // L'URL server Socket.io

const socket = io(URL, {
   autoConnect: false,
   cors: {
      origin: true,
      credentials: true
   }
});

// Esempio di gestione degli eventi del socket
socket.on('connect', () => {
   console.log('Connesso al server Socket.io');
});

// socket.on('messageReceived', (message) => {
//     console.log('Messaggio ricevuto:', message);
// });


export default socket;
