# Front-End

Questa repository contiene il front-end del progetto.

## Indice
- [Installazione](#Installazione)
- [components](#components-directory)
- [pages](#Pages-directory)
- [App.js](#App.js)
- [socket.js](#socket.js)
-[Stile](#Stile)

### Installazione

1. Scarica e installa Node: <https://nodejs.org/>
3. Installare le dependencies: `npm install`
2. Avviare il server back-end con `npm start` affinché si metta in ascolto sulla porta 3000
4. Avviare il front-end: `npm start`

### components (directory)

La directory "components" contiene tutti i componenti React utilizzati all'interno delle pagine

## Pages (directory)

La directory "pages" contiene le pagine che verranno mostrate all'utente

### Login Page

Nella login page l'utente inserisce il proprio username e password (criptata lato back-end) per accedere nella home. La pagina mostra in caso di errore il relativo messaggio.
Con l'utilizzo dei cookie di sessione nel caso sia già avvenuto l'accesso precedentemente, si viene direttamente indirizzati alla pagina home.
Per i nuovi utenti c'è un link che indirizza alla pagina di Sign Up.

### Sign Up Page

Nella pagina di Sign Up è possibile creare un nuovo utente inserendo:
1. username
2. nome
3. cognome
4. password

Dopo aver inviato la richiesta di registrazione, il server effettua i controlli opportuni (username già esistente, campi vuoti) e si viene indirizzati alla pagina di home.
Come nel caso del log in, gestisce gli eventuali errori che invia il server mostrandoli nella pagina.

### Home Page

La pagina home vengono gestite le chat con i diversi utenti (anche quelli che non fanno parte dei propri amici).
In alto a sinistra vi sono dei pulsanti per andare alla pagina relativi agli amici, attivare/disattivare gli effetti sonori dell'applicazione e per il log out.
Successivamente c'è la barra di ricerca degli utenti e le diverse chat attive con i nostri amici, con la preview dell'ultimo messaggio e il relativo orario e se nel caso non è stato letto viene mostrato in grassetto.
Cliccando su una chat essa si aprirà sulla destra, con in alto il nome dell'utente, lo stato (online/offline) e un pulsante per eliminare la chat.
Successivamente vi sono i relativi messaggi scambiati con giorno e orario e la textbox per inviare un messaggio real time tramite l'utilizzo di Socket.io.

### FriendList Page

La pagina FriendList è dove l'utente può gestire le proprie amicizie.
Sulla sinistra c'è un barra di ricerca utenti per inviare amicizie, in basso invece ci sono tutte le amicizie con ognuna la possibilità di poterla eliminare.
Al centro della pagina c'è l'elenco delle richieste di amicizia ricevute con la possibilità di accettarle o rifiutare e sulla destra c'è l'elenco delle richieste di amicizia inviate.


### App.js

Nel file "App.js" vengono gestite le routes.

### socket.js

Nel file "socket.js" viene gestito il comportamento dei socket per permettere la gestione degli eventi real-time (scambio di messaggi, creazione ed eliminazione di una chat, richieste di amicizia, stato degli utenti).

### Stile

Tramite l'utilizzo di Material UI e fogli di stile CSS si è voluto dare una grafica minimale ma allo stesso tempo accattivante, scegliendo opportunamente le icone e i colori della pagina. Il nome stesso del progetto "JustChat" rispecchia la nostra decisione, sottolineando la semplicità di utilizzo.


