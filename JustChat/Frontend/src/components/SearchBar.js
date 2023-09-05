import React, { useState, useEffect } from 'react';
import axios from 'axios';
import User from "./User";
import "../App.css"
import { Box, Stack } from '@mui/system';
import { sidebarStyles } from '../styles/styles';

const SearchBar = (props) => {
   const [searchText, setSearchText] = useState('');
   const [searchResults, setSearchResults] = useState([]);

   /** Handler per l'evento onChange dell'input, setta il contenuto di searchText ad ogni
    * variazione del valore dell'input
    */
   const handleSearchChange = (event) => {
      setSearchText(event.target.value);
   };

   /** Effettua una fetch al DB per ottenere gli utenti che matchano la stringa di ricerca
    * ovvero searchText
   */
   const handleSearch = () => {
      if (searchText !== '') {
         axios.get(`http://localhost:3000/api/users/${props.loggedUser._id}/search?searchText=${searchText}`)
            .then((response) => {
               setSearchResults(response.data);
            })
            .catch((error) => {
               console.error('Errore durante la ricerca degli utenti', error);
            });
      }
   };

   /** Richiama l'handler per la ricerca degli utenti ad ogni variazione di searchText */
   useEffect(() => {
      handleSearch()
   }, [searchText]);

   return (
      <>
         <Box {...sidebarStyles.searchbar} className="searchbar">
            <input value={searchText} onChange={handleSearchChange} label={props.label}
               placeholder={props.label} />
         </Box>
         {
            searchText &&
            <Stack {...sidebarStyles.resultsContainer}>
               {searchResults.map((user, index) => (
                  <Box {...sidebarStyles.resultWrapper}
                     key={index}
                     onClick={() => {
                        setSearchText('');
                        setSearchResults([]);
                        props.handleClick(user);
                     }}>
                     <Box {...sidebarStyles.chatWrapper}>
                        <User
                           key={user._id}
                           id={user._id}
                           username={user.username}
                           firstName={user.firstName}
                           lastName={user.lastName} />
                     </Box>
                  </Box>
               ))}
            </Stack>
         }
      </>

   )
};

export default SearchBar;
