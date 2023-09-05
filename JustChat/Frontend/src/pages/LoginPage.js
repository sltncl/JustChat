import React, { useState, useEffect } from "react";
import axios from "axios";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/system";
import { Typography } from "@mui/material";

const LoginPage = () => {
   const nav = useNavigate();
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
   const [isAlreadyLogged, setIsAlreadyLogged] = useState(false);

   /**useEffect viene invocato soltato la prima volta.
    * Nel caso l'user ha fatto già precedentemente l'accesso viene direttamente
    * reinderizzato alla pagina home.
    */
   useEffect(() => {
      axios
         .get("http://localhost:3000/api/users/profile", { withCredentials: true })
         .then((res) => {
            if (res.data.error) {
               setIsAlreadyLogged(false);
               console.log(res.data.error);
            } else {
               setIsAlreadyLogged(true);
               nav("/home");
               console.log("cookies work");
            }
         })
         .catch((error) => {
            console.error("Error:", error);
            setError("Errore durante la connessione al server.");
         });
   }, []);

   const handleUsernameChange = (e) => {
      setUsername(e.target.value);
   };

   const handlePasswordChange = (e) => {
      setPassword(e.target.value);
   };
   /**handler per la gestione del submit del form, viene passato
    * successivamente a LoginForm come una props
    */
   const handleSubmit = (e) => {
      e.preventDefault();
      axios
         .post(
            "http://localhost:3000/api/users/login",
            { username, password },
            { withCredentials: true }
         )
         .then((response) => {
            /*if utile a gestire la risposta del back-end in caso 
                di successo(array di oggetti) o di errore(solo oggetto)*/
            if (response.data.length == 2) {
               const [messageResponse, userResponse] = response.data;
               localStorage.setItem("loggedUser", JSON.stringify(userResponse));
               nav("/home");
            } else if (response.data.error) {
               setError(response.data.error);
            }
         })
         .catch((error) => {
            console.error("Error:", error);
            setError("Errore");
         });
   };

   return (
      <Stack
         height="100vh"
         width="100vw"
         justifyContent="center"
         alignItems="center"
         spacing={3}
      >
         <Typography variant='h3' fontWeight={800}>JustChat</Typography>
         <LoginForm
            username={username}
            password={password}
            handleUsernameChange={handleUsernameChange}
            handlePasswordChange={handlePasswordChange}
            handleSubmit={handleSubmit}
            error={error}
         />
      </Stack>
   );
};

export default LoginPage;
