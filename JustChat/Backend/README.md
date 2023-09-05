## Backend

Questa repository contiene il codice del backend del progetto, implementato seguendo il pattern MVC (Model-View-Controller). La struttura organizzativa della repository è stata progettata per garantire una chiara separazione delle responsabilità e una gestione efficiente delle diverse componenti del sistema.

### Controllers (directory)

La directory "Controllers" ospita i file dei controller, che rappresentano il componente "Controller" del pattern MVC. Ogni file corrisponde a un modello specifico presente nel database e implementa le funzionalità associate a quel modello. I controller consentono di manipolare i dati e gestire le richieste provenienti dal frontend.

### Models (directory)

La directory "Models" contiene i file che definiscono gli schemi dei dati utilizzati dal sistema. Ogni file rappresenta un modello del database e descrive la struttura, le relazioni e i vincoli dei dati associati a quel modello. Gli schemi dei modelli consentono di definire il modo in cui i dati vengono salvati, letti e manipolati nel database.

### Routes (directory)

La directory "Routes" contiene i file che definiscono le routes delle REST API utilizzate per l'interazione con il backend. I file delle routes consentono di mappare le richieste HTTP provenienti dal frontend ai rispettivi metodi dei controller. Ogni modello ha un file separato per definire le routes specifiche associate a quel modello, garantendo una gestione modulare ed espandibile delle API.

### index.js

Il file "index.js" è il punto di ingresso principale del backend. Le sue funzioni fondamentali sono le seguenti:
 - Stabilisce una connessione con il database MongoDB, consentendo al backend di interagire in modo efficiente con i dati memorizzati.
 - Configura il sistema per supportare le richieste CORS (Cross-Origin Resource Sharing), permettendo al backend di gestire le richieste    provenienti da origini diverse e garantendo una comunicazione sicura e controllata tra il frontend e il backend.
 - Implementa la gestione dei cookie di sessione mediante l'utilizzo della libreria express-session. Ciò consente di gestire le sessioni    degli utenti in modo sicuro, fornendo accesso autorizzato alle risorse del sistema.
 - Inizializza il server Socket.io, aprendo una connessione full-duplex tra il client e il server. Questo meccanismo abilita una       comunicazione in tempo reale e basata sugli eventi tra il frontend e il backend, aprendo la strada all'implementazione di funzionalità   interattive e dinamiche nell'applicazione.
 - Avvia il server backend sulla porta 3000, consentendo al sistema di ascoltare le richieste in arrivo e fornire le risposte corrispondenti.

Questo file svolge un ruolo cruciale nel garantire l'avvio e il corretto funzionamento del backend.

### socket.js

Il file "Socket.js" contiene le funzioni necessarie per abilitare una connessione full-duplex tra il client e il server utilizzando Socket.io. Questo meccanismo consente una comunicazione in tempo reale e basata sugli eventi tra il frontend e il backend. La presenza di questa funzionalità consente di implementare caratteristiche interattive e dinamiche nell'applicazione.


Un aspetto da sottolineare è l'utilizzo della libreria bcryptjs nel controller degli utenti per l'hashing delle password. Questa libreria fornisce una crittografia sicura e robusta delle password, garantendo la protezione dei dati sensibili degli utenti.

Complessivamente, la repository del backend rappresenta un componente fondamentale del sistema, fornendo le funzionalità per la gestione dei dati e l'interazione con il frontend.

