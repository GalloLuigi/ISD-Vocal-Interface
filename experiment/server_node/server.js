const express = require('express');
const moment = require('moment'); 
const fs = require('fs');
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

const app = express();

const cors = require('cors');

app.use(cors());
app.use(express.json());
  
/*
app.post('/creaJson', (req, res) => {
    console.log("Enter in creaJson");
    const { stringhe, timestampInizio, timestampFine, completato } = req.body;

    // Qui puoi salvare i dati in un database, in un file, o semplicemente loggarli
    console.log('Dati ricevuti:', req.body);

    res.json({ message: 'Dati ricevuti correttamente' });
});
*/


// app.post('/creaJson', (req, res) => {
//     console.log("Enter in creaJson");
//     const { stringhe, timestampInizio, timestampFine, completato, username, task } = req.body;
//     // Dati da salvare nel file
//     const newData = {
//         stringhe,
//         timestampInizio,
//         timestampFine,
//         completato
//     };

//     newData.stringhe.forEach(element => {
//         element.timestamp= moment(element.timestamp).format('YYYY-MM-DD HH:mm:ss');
//     });

//     newData.timestampInizio=moment(timestampInizio).format('YYYY-MM-DD HH:mm:ss');
//     newData.timestampFine=moment(timestampFine).format('YYYY-MM-DD HH:mm:ss');

//     // Percorso del file JSON in cui memorizzare i dati
//     const filePath = path.join(__dirname, 'dati.json');

//     // Leggi il file esistente e aggiungi i nuovi dati
//     fs.readFile(filePath, 'utf8', (err, data) => {
//         let jsonArray = {};

//         if (!err && data) {
//             try {
//                 jsonArray = JSON.parse(data);  // Converte il contenuto in un array
//             } catch (e) {
//                 console.error("Errore durante il parsing del file JSON:", e);
//             }
//         }

//         // Aggiungi i nuovi dati
//         // jsonArray.push(newData);
//         console.log(username, task)
//         if(!jsonArray[username]){
//             jsonArray[username] = {}
//         }

//         if(!jsonArray[username][task]){
//             jsonArray[username][task] = []
//         }

//         jsonArray[username][task].push(newData)
//         // Scrivi di nuovo il file con i nuovi dati
//         fs.writeFile(filePath, JSON.stringify(jsonArray, null, 2), 'utf8', (err) => {
//             if (err) {
//                 console.error("Errore durante la scrittura del file JSON:", err);
//                 return res.status(500).json({ message: 'Errore durante la memorizzazione dei dati' });
//             }
//             console.log('Dati salvati correttamente:', newData);
//             res.json({ message: 'Dati ricevuti correttamente e salvati' });
//         });
//     });
// });

// Funzione principale
async function handleCSV(inputData, username) {
    const filePath = `./datalog/data_${username}.csv`;
    
    // Verifica se il file esiste
    if (!fs.existsSync(filePath)) {
      console.log('Il file non esiste, lo creo...');
      await createCSV(filePath, inputData);
    } else {
      console.log('Il file esiste, aggiungo i nuovi dati...');
      await appendToCSV(filePath, inputData);
    }
  }

// Funzione per creare il CSV con intestazione e dati
async function createCSV(filePath, inputData) {
    const csvWriter = createCsvWriter({
      path: filePath,
      header: Object.keys(inputData).map(key => ({ id: key, title: key })) // Creazione delle colonne
    });
  
    await csvWriter.writeRecords([inputData]); // Scrive i dati iniziali
    console.log('File CSV creato con successo.');
  }

// Funzione per fare l'append di dati in un CSV esistente
async function appendToCSV(filePath, inputData) {
    let existingData = [];
    
    // Leggi il contenuto attuale del CSV
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        existingData.push(row);
      })
      .on('end', async () => {
        console.log('Dati esistenti letti, ora aggiungo i nuovi dati...');
        
        const csvWriter = createCsvWriter({
          path: filePath,
          header: Object.keys(inputData).map(key => ({ id: key, title: key })),
          append: true // Fa l'append invece di sovrascrivere
        });
  
        await csvWriter.writeRecords([inputData]); // Aggiunge il nuovo record
        console.log('Nuovi dati aggiunti al file CSV.');
      });
  }

app.post('/creaJson', (req, res) => {
    console.log("Enter in creaJson");
    const { stringhe, timestampInizio, timestampFine, completato, username, task } = req.body;
    // Dati da salvare nel file
    const newData = {
        username: username,
        stringhe: stringhe,
        task:task,
        done: completato
    };

    newData.stringhe.forEach(element => {
        element.timestamp= moment(element.timestamp).format('YYYY-MM-DD HH:mm:ss');
    });

    newData.startTS=moment(timestampInizio).format('YYYY-MM-DD HH:mm:ss');
    newData.endTS=moment(timestampFine).format('YYYY-MM-DD HH:mm:ss');

    handleCSV(newData, username);
    
});

app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log("Hello World!")
})

app.listen(3000, () => {
    console.log('Server in ascolto sulla porta 3000');
});