import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css"

const SignUpForm = () => {
   const nav = useNavigate();

   const [username, setUsername] = useState("");
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");

   /**handler per la gestione del submit del form */
   const handleFormSubmit = (e) => {
      e.preventDefault();

      //post al back-end
      axios
         .post("http://localhost:3000/api/users/addUser", {
            username,
            firstName,
            lastName,
            password,
         }, { withCredentials: true })
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
            console.log("Error:", error.message);
            setError("Errore");
         });
   };

   /** Se l'utente è già loggato fa un redirect a '/home' */
   useEffect(() => {
      if (JSON.parse(localStorage.getItem('loggedUser')))
         nav('/home')
   }, [])


   return (
      <div className="container">
         <h2>Registrati</h2>
         {error && <p className="error-message">{error}</p>}

         <form class="signup-form" onSubmit={handleFormSubmit}>
            <label>
               Username:
               <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
               />
            </label>
            <br />
            <label>
               Nome:
               <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
               />
            </label>
            <br />
            <label>
               Cognome:
               <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
               />
            </label>
            <br />
            <label>
               Password:
               <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
               />
            </label>
            <br />
            <button type="submit">Registrati</button>
         </form>
      </div>
   );
};

export default SignUpForm;

