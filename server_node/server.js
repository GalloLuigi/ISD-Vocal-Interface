const express = require("express");
const moment = require("moment");
const fs = require("fs");
const csvParser = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const path = require("path");

const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());

// Funzione principale
async function handleCSV(inputData, username) {
  const filePath = `./datalog/data_${username}.csv`;

  // Verifica se il file esiste
  if (!fs.existsSync(filePath)) {
    console.log("Il file non esiste, lo creo...");
    await createCSV(filePath, inputData);
  } else {
    console.log("Il file esiste, aggiungo i nuovi dati...");
    await appendToCSV(filePath, inputData);
  }
}

// Funzione per creare il CSV con intestazione e dati
async function createCSV(filePath, inputData) {
  const csvWriter = createCsvWriter({
    path: filePath,
    header: Object.keys(inputData).map((key) => ({ id: key, title: key })), // Creazione delle colonne
  });
  await csvWriter.writeRecords([inputData]); // Scrive i dati iniziali
}

// Funzione per fare l'append di dati in un CSV esistente
async function appendToCSV(filePath, inputData) {
  let existingData = [];

  // Leggi il contenuto attuale del CSV
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (row) => {
      existingData.push(row);
    })
    .on("end", async () => {
      console.log("Dati esistenti letti, ora aggiungo i nuovi dati...");

      const csvWriter = createCsvWriter({
        path: filePath,
        header: Object.keys(inputData).map((key) => ({ id: key, title: key })),
        append: true, // Fa l'append invece di sovrascrivere
      });

      await csvWriter.writeRecords([inputData]); // Aggiunge il nuovo record
      console.log("Nuovi dati aggiunti al file CSV.");
    });
}

app.post("/", (req, res) => {
  if (req && req.body) {
    const {
      stringhe,
      timestampInizio,
      timestampFine,
      completato,
      username,
      task,
      finalText,
      finalNotes,
    } = req.body;

    console.log(username);

    if (parseInt(task) <= 1) {
      return;
    }
    // Dati da salvare nel file
    const newData = {
      username: username,
      stringhe: stringhe,
      task: task,
      done: completato,
      final_notes: finalNotes,
    };

    newData.stringhe.forEach((element) => {
      element.timestamp = moment(element.timestamp).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    });

    newData.stringhe = JSON.stringify(newData.stringhe);

    newData.startTS = moment(timestampInizio).format("YYYY-MM-DD HH:mm:ss");
    newData.endTS = moment(timestampFine).format("YYYY-MM-DD HH:mm:ss");
    newData.final_text = finalText;

    handleCSV(newData, username);
  } else {
    console.log("no input");
  }
  res.send(JSON.stringify("Hello World!"));
});

app.listen(3000, () => {
  console.log("Server in ascolto sulla porta 3000");
});
