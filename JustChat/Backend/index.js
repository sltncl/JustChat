const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');

const app = express();
const server = http.createServer(app);
const initSocketServer = require('./socket');

// Connessione al database MongoDB
mongoose.connect("");
const db = mongoose.connection;
db.once("open", () => {
    console.log("Connesso al DB");
    server.listen(3000, () => {
        console.log("App in ascolto");
    });
});

// Configurazione CORS
const corsOptions = {
    origin: true,
    credentials: true
};
app.use(cors(corsOptions));

// Middleware per il parsing del body delle richieste
app.use(express.json());

// Configurazione della sessione
app.use(session({
    secret: '__SeCreT-kEy__',
    name: 'sessionId',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 86400000 // un giorno
    }
}));

// Configurazione delle routes API
const router = require('./routes/api');
app.use('/api', router);

// Inizializza il server Socket.io
initSocketServer(server);
