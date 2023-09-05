import './App.css';
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import FriendList from "./pages/FriendList";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useEffect, useState } from "react";
import socket from "./socket";
import { ThemeProvider } from '@emotion/react';
import { theme } from './theme'

function App() {
   const [soundOn, setSoundOn] = useState(true)

   // Sound on/off
   const toggleSound = () => {
      setSoundOn(prev => !prev)
   }

   useEffect(() => {
      socket.connect();
      // Cleanup della connessione al momento dello smontaggio del componente
      return () => {
         socket.disconnect();
      };
   }, []);

   return (
      <ThemeProvider theme={theme}>
         <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/home" element={<Home soundOn={soundOn} toggleSound={toggleSound} />}></Route>
            <Route path="/friends" element={<FriendList soundOn={soundOn} toggleSound={toggleSound} />}></Route>
         </Routes>
      </ThemeProvider>
   );
}

export default App;
