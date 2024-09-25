//COMAND CONFIGURATION
import {ExtConfig} from "./config.js";

//tutti i comandi detti dall'utente
var all_command=[]

var start_experiment=Date.now();

var is_select_bool=false;

let old_command = ''; //ultimo comando lanciato
let add_flag
let words_number
let words_number_lenght
let nuovo_div_note

let exp_index = 1

var regex_add = "numeri";
var regex_complete= "Chiudi nota";
var regex_R=/seleziona[0-9]+/;
var regex_RR=/seleziona[0-9]+a[0-9]+/;
var regex_NN=/nota[0-9]+nota[0-9]+/;
var regex_delete=/cancellanota[0-9]+/;
var regex_H=/cerca[0-9]+/;
var regex_CC=/correggi[0-9]+correggi[0-9]+/;
var regex_A=/approva[0-9]+/;

var regex_su="paginasu";
var regex_giu="paginagiù";

var write_output_command="";

var exp_command_num=1;
var errors=0;

const Experiments = ExtConfig.Experiments
const Papers = ExtConfig.Papers
const config = ExtConfig.Config

const old_config ={
  "Add numbers to lines": "numeri",
  "Select line": "seleziona",
  "Add a note": "nota",
  "Complete Note":"Chiudi nota",
  "Delete note": "cancella nota",
  "Highlight note": "cerca",
  "Correct note": "correggi",
  "Approve correction": "approva"
};

generate_experiment(Experiments[exp_index]);

function modifyConfig() {
  const selectedKey = document.getElementById('config-keys-dropdown').value;
  const newValue = document.getElementById('new-value').value;

  if (selectedKey && newValue) {
      config[selectedKey] = newValue;
      updateConfigDisplay();
      document.getElementById('modify-form').reset();
  } else {
      alert('Please select a key and enter a new value.');
  }

  gen_regex_from_config()

}


async function inviaDatiAlServer(comand_list,start_experiment,press_next,experiment_complete) {

  console.log("Invio i dati al server...");

  const url = 'http://localhost:3000/creaJson'; // URL del tuo endpoint
  //const url = '  https://node-js-vocal-interface-server.onrender.com/creaJson'; 

  const usern = document.getElementById("nav_username").value
  const data = {
      stringhe: comand_list,       
      timestampInizio: start_experiment,            
      timestampFine: press_next,   
      completato: experiment_complete,     
      username: usern,
      task: exp_index        
  };
  
  fetch(url, {
      method: 'POST',                         // Metodo POST
      headers: {
          'Content-Type': 'application/json', // Indica che i dati sono in formato JSON
      },
      body: JSON.stringify(data)              // Converti l'oggetto data in stringa JSON
  })
  .then(response => response.json())          // Converti la risposta JSON
  .then(data => {
      console.log('Risposta dal server:', data); // Visualizza la risposta
  })
  .catch((error) => {
      console.error('Errore durante la richiesta:', error);
  });
}

function convertNumbersToDigits(str) {
  // Array contenente i numeri da uno a diciannove in italiano
  const units = ['', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci',
    'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove'];   

  // Array contenente le decine (escluse le unità) in italiano
  const tens = ['', '', 'venti', 'trenta', 'quaranta', 'cinquanta', 'sessanta', 'settanta', 'ottanta', 'novanta'];

  // Funzione ausiliaria per convertire un singolo numero in lettere in un numero intero
  function convertNumber(numStr) {
    numStr = numStr.toLowerCase();
    let result = 0;

    // Gestisce numeri da uno a diciannove
    if (units.includes(numStr)) {
      return units.indexOf(numStr);
    }

    // Gestisce decine e unità
    for (let i = tens.length - 1; i >= 0; i--) {
      if (numStr.startsWith(tens[i])) {
        result += i * 10;
        numStr = numStr.slice(tens[i].length);
        break;
      }
    }

    // Aggiunge le unità rimanenti
    result += units.indexOf(numStr);
    return result;
  }

  // Espressione regolare per individuare i numeri scritti in lettere in italiano
  const numberRegex = /\b(uno|due|tre|quattro|cinque|sei|sette|otto|nove|dieci|undici|dodici|tredici|quattordici|quindici|sedici|diciassette|diciotto|diciannove|venti|trenta|quaranta|cinquanta|sessanta|settanta|ottanta|novanta|cento|mille)\b/gi;   
  


  // Sostituisce ogni occorrenza di un numero in lettere con il corrispondente numero intero
  return str.replace(numberRegex, (match) => {
    return convertNumber(match);
  });
}

function updateConfigDisplay() {
  document.getElementById('config-content').textContent = JSON.stringify(config, null, 2);
}

function updateDropdown() {
  const dropdown = document.getElementById('config-keys-dropdown');
  dropdown.innerHTML = '';

  for (const key in config) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key;
      dropdown.appendChild(option);
  }
}

// Initialize display and dropdown
updateConfigDisplay();
updateDropdown();



function sostituisciRegex(regex, valoreDaSostituire, nuovoValore) {
  regex_string=regex.toString()
  regex_string=regex_string.slice(1);
  regex_string=regex_string.slice(0, -1);
  new_regex=regex_string.replaceAll(valoreDaSostituire,nuovoValore)
  return new RegExp(new_regex);
}

function gen_regex_from_config() {
//
  regex_add= config["Add numbers to lines"];
  
  regex_R=sostituisciRegex(regex_R,old_config["Select line"],config["Select line"]);
  regex_RR=sostituisciRegex(regex_RR,old_config["Select line"],config["Select line"]);
  old_config["Select line"]=config["Select line"];

  regex_CC=sostituisciRegex(regex_CC,old_config["Correct note"],config["Correct note"]);
  old_config["Correct note"]=config["Correct note"];

  regex_NN=sostituisciRegex(regex_NN,old_config["Add a note"],config["Add a note"]);
  old_config["Add a note"]=config["Add a note"];

  regex_delete=sostituisciRegex(regex_delete,old_config["Delete note"],config["Delete note"]);
  old_config["Delete note"]=config["Delete note"];

  regex_A=sostituisciRegex(regex_A,old_config["Approve correction"],config["Approve correction"]);
  old_config["Approve correction"]=config["Approve correction"];

  regex_H=sostituisciRegex(regex_H,old_config["Highlight note"],config["Highlight note"]);
  old_config["Highlight note"]=config["Highlight note"];

  regex_complete= config["Complete Note"];
//
}




//  VOCAL INTERFACE
//----------------------------------------------------------------------------------------------//
//Definizione strutturura dati - I componenti della struttura dati hanno nomi in italiano
class Word {
  constructor(integer, string) {
    this.integer = integer;
    this.string = string;
  }
  toString() {
    return 'Word(integer: ${this.integer}, string: "${this.string}")';
  }

}


// Create a list of sentences (text)
const testo = {};
var map = new Map();
var word_count = 0;
let notes = {}
var number_of_rows = 0;
var last_row_number = [];
let last_note = 0

function split_sentence_Into_Words(inputString) {
  // Regular expression pattern to match words
  const regex = /[\w-]+/g;

  // Split the input string into an array using the regex
  const words = inputString.match(regex);
  // const words = inputString.split(" ");
  // If there are matches (words found), return the array
  if (words) {
    return words;
  } else {
    // If no matches (no words found), return an empty array
    return [];
  }
}

function isAlpha (ch){
  return /^[A-Z]$/i.test(ch);
}

function isDigit(str){
  return /^\d+$/.test(str);
}

function compile_testo(){
  let sentences = []
  const targetElement = document.getElementById('target-div'); //prendo in input il div
  const textContent = targetElement.textContent; //estrapolo il testo
  let index = 1
  last_row_number = []
  if(Object.keys(testo).length===0){

    console.log("ripreso testo")
    
    let currentSentence = ''; // Variable to hold the current sentence being constructed

    // Iterate over the text content character by character
    for (let i = 0; i < textContent.length; i++) {
      const currentChar = textContent[i];

      // Append current character to the current sentence
      currentSentence += currentChar;

      // Check if we've reached the 50-character limit

      if (currentSentence.length == 89) {
        // Se l'ultimo carattere è parte di una parola (non uno spazio), aggiungere un trattino
        //

        // console.log("[" + textContent[i] + "]")
        // console.log("[" + textContent[i + 1] + "]")
        if ((isAlpha(currentChar) || isDigit(currentChar)) && textContent[i + 1] && (isAlpha(textContent[i + 1]) || isDigit(textContent[i + 1]))) {
          currentSentence += '-'; // Aggiungi il trattino alla fine
        }
        if(textContent.charCodeAt(i) === textContent.charCodeAt(i+1) && textContent.charCodeAt(i) === 32){
          currentSentence = currentSentence.substring(0, currentSentence.length - 11); 
          currentSentence += '-';
        }
        
        // If so, add the current sentence to the sentences array
        number_of_rows++
        sentences.push(currentSentence);

        // Reset the current sentence variable
        currentSentence = '';
      }

    }

    // Add any remaining characters to the last sentence
    if (currentSentence.length > 0) {
      sentences.push(currentSentence);
    }

    sentences.forEach(sentence => {  
      if(!testo[index]){
        testo[index] = {}
      }
      let wordIndex = 1
      split_sentence_Into_Words(sentence).forEach(parola => {
        testo[index][wordIndex] = parola
        wordIndex++
      });
  
      //fine aggiornamento struttura dati
      index++
    });
  }

  targetElement.textContent = ''; // Elimino il vecchio testo

  document.getElementById('wrapper_notes').innerHTML = ""

  Object.entries(testo).forEach(([key, value]) => {
    const paragraph = document.createElement('div');

    const index = String(key)
    paragraph.id = index + ""; //imposto l'id del div pari quello del indice
    let text = ""

    //note
    //creo per ogni riga un div note con il medesimo id
    const note = document.createElement('div');
    nuovo_div_note = document.getElementById('wrapper_notes').appendChild(note);
    nuovo_div_note.id=index+"note";
    nuovo_div_note.innerHTML = "&nbsp;"
    //mostraDiv(index+"note");//rendo il div "fisico" 

    //

    Object.entries(value).forEach(([k, v]) => {
      text = text + v + " "

    });
    text = "<b>"+index+"</b>" + " " + text
    //aggiungere tag <br>
    paragraph.innerHTML = text+"<br>"
    targetElement.appendChild(paragraph);


  });
  recompile_notes();
}

//Iniziallizzo campo che conterra' il comando in output
const output = document.getElementById('outputElement');
document.getElementById('outputElement').style.display = "none";
var output_content;




function generic_Check_String(str, pattern) {
  const regex = new RegExp(pattern);
  return regex.test(str);
}


//PER FUNZIONE "Rx"
/*********************************************************************************************/
function extract_numer_from_String(str) {
  const regex = /[-+]?\d+/; // Regular expression pattern for numbers
  let test = []

  const matches = str.match(regex); // Extract matches using regex.match()
  if (matches) {
    test.push(matches[0])
    console.log("Extracted numbers:", matches);
    return test
  } else {
    console.log("No numbers found in the string.");
  }
}

//PER FUNZIONE "Rx Ry"
/*********************************************************************************************/
function extract_numer_from_StringRR(inputString) {
  var regex_RR = /\b[a-zA-Z]+(\d+)[a-zA-Z]+(\d+)\b/g;

  let matches;
  let integers = [];

  // Usa la regex per trovare tutte le corrispondenze nel testo
  while ((matches = regex_RR.exec(inputString)) !== null) {
      // Aggiungi i numeri trovati alla lista degli interi
      integers.push(parseInt(matches[1]));
      integers.push(parseInt(matches[2]));
  }

  return integers;
   
}

 

function getIntegersInRange(start, end) {
  if (start > end) {
    return [];
  }

  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}


/*************************************************************************************************/

function nascondiDiv(idDiv) {
  const elemento = document.getElementById(idDiv);
  if (elemento) {
    //elemento.style.display = 'none';
    elemento.style.visibility = 'hidden';
  } else {
    console.error("Elemento con ID '" + idDiv + "' non trovato.");
  }
}

function mostraDiv(idDiv) {
  const div = document.getElementById(idDiv);
  div.style.visibility = 'visible';
}

function rimuoviAsterischi(stringa) {
  return stringa.replace(/\*/g, '');
}

/*********************************************************************************************/

//funzione per aggiungere numeri interi alla fine delle righe
function addNumberToEndOfWords(row_number, start_index, input_map) {
  if(row_number){
    map = input_map
    let word_index = start_index
    let new_string = ""
    let row = testo[row_number]
    let temp = ""
    if(row){
      for (const [key, value] of Object.entries(row)) {
        temp = temp +"<span style='color: blue;'>"+String(word_index)+"</span>" + " " +  String(value) + " "
        map[word_index] = {
          word: String(value),
          row: row_number,
          pos: key  
        }
        word_index++
      }
      new_string = new_string + temp
    } 
    return [new_string, map, word_index]
  }
}


function modificaTestoDiv(idDiv, nuovoTesto) {
  const div = document.getElementById(idDiv);
  if (div) {
    div.innerHTML = nuovoTesto; // Usa innerHTML invece di textContent
  } else {
    console.error(`Elemento con ID "${idDiv}" non trovato.`);
  }
}

function recompile_notes(){
  if(notes){
    let wrapper = document.getElementById("wrapper_notes")
    let finalText = ""
    let notes_dict = {}
    Object.entries(notes).forEach(([key, value]) => {
      let noteText = String(value.note)
      if(value.is_note==true){
        finalText = String(key) + " " + noteText + "<br>";
      } else {
        finalText = String(key) + `<span style="color: red;">` + noteText + "</span><br>";
      }
      const note_index = parseInt(value.startWord_number[0])
      let num_divs = document.getElementById("wrapper_notes").children.length;
      for (let i = note_index; i<num_divs;i++){
          const note_id = i+"note"
          if(!notes_dict[note_id]){
            document.getElementById(note_id).innerHTML = finalText 
            notes_dict[note_id] = true
            break
        }
      }
    });
    //note
    //wrapper.innerHTML = finalText
  }
}

function coloraTestoInRosso() {
  // Seleziona l'elemento con l'ID "copy_of_command"
  const elemento = document.getElementById("copy_of_command");

  // Se l'elemento è stato trovato, cambia il colore del testo
  if (elemento) {
    elemento.style.backgroundColor  = "red";
  } else {
    console.error("Elemento con ID 'copy_of_command' non trovato.");
  }
}

function coloraTestoInVerde() {
  // Seleziona l'elemento con l'ID "copy_of_command"
  const elemento = document.getElementById("copy_of_command");

  // Se l'elemento è stato trovato, cambia il colore del testo
  if (elemento) {
    elemento.style.backgroundColor  = "green";
  } else {
    console.error("Elemento con ID 'copy_of_command' non trovato.");
  }
}

var note_flag=false
let buffer_note=""

var experiment_complete=false;

function listen() {
  console.log("Listen...")
  var speech = true;
  window.SpeechRecognition = window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.interimResults = true;

  recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('')

    output.innerHTML = transcript;

    output_content = output.textContent;

    let experimentContent = ExtConfig.Experiments[exp_index];
    let is_correct;

// Funzione per verificare se una stringa è contenuta nei valori dell'oggetto
function containsStringInObject(obj, str) {
  return Object.values(obj).some(value => 
      typeof value === 'string' && value.toLocaleLowerCase().includes(convertNumbersToDigits(str.toLocaleLowerCase()))
  );
}

if (containsStringInObject(experimentContent, output_content)) {
  is_correct=true;
} else {
is_correct=false;
}

    //aggiunta a all_command
    let comando = {
      timestamp: Date.now(),
      stringa: output_content,
      is_correct: is_correct
      };


    all_command.push(comando);

    output_content =convertNumbersToDigits(output_content);
    console.log("NUMERO COMANDO: " + exp_command_num)
    if(output_content.toLowerCase()===Experiments[exp_index]["Command "+exp_command_num].toLowerCase()){
      document.getElementById("Command "+exp_command_num).classList.add("completed")
      // Logger(exp_command_num, true)
      exp_command_num++


      if(exp_command_num== Object.keys(Experiments[exp_index]).length){
        experiment_complete=true;
      }

      console.log("exp_command_num:"+exp_command_num);
    }else {
      errors++;
      //Logger(exp_command_num, false)
      console.log("Error in command:"+errors);
      console.log("Error: The command is:"+output_content);
      write_output_command = output_content
      coloraTestoInRosso();
      writeInDiv("Current comand: "+output_content);
    }
    console.log("The command is:"+output_content);
    
    if(note_flag==true){
      coloraTestoInVerde();
      buffer_note = output_content
    }
    else{

      output_content = output_content.toLowerCase();;        // output_content e' una stringa contente l'ultimo comando lanciato
      output_content = output_content.split(' ').join('');
      console.log("The command is:"+output_content);

    }

    console.log(transcript);
  });

   //recognition.addEventListener("audioend", () => {
    recognition.addEventListener("soundend", () => {
     console.log("Audio capturing ended");
     if(note_flag==true && buffer_note!=config["Complete Note"]){
      recompile_notes()
      console.log("buffer note finale: " + buffer_note)
       let txt = notes[last_note].note
       txt = txt + " "+buffer_note+" "
       notes[last_note].note = txt
       buffer_note = ""
       recompile_notes()
       listen();

     }
     else {
      check_command();
      listen();
     }

  });



  if (speech == true) {
    recognition.interimResults = false;
    //recognition.lang = "en-US";
    recognition.lang = "it-IT";

    recognition.start();
  }
  check_command()
}
listen();
//setInterval(listen, 5000); // 5000 milliseconds = 5 seconds

function add(){
  add_flag = true;
  compile_testo();
  old_command = output_content; //aggiorno old command
}

function Rx(){
  compile_testo();
  let rows = extract_numer_from_String(output_content); //prendo il numero dalla stringa

  last_row_number = rows //Aggiorno campo contente detta ultima riga

  let start_index = 0
  let start_map = {}
  for(const r of rows){
    let ret = addNumberToEndOfWords(parseInt(r), start_index, start_map)
    let editedString = ret[0]
    let end_map = ret[1]
    let end_index = ret[2] 
    modificaTestoDiv(parseInt(r), "<b>"+r + "</b>" + editedString)
    start_index = end_index
    start_map = end_map
  }
  old_command = output_content; //aggiorno old command
}

function RxRy(){
  compile_testo();
  let rows = extract_numer_from_StringRR(output_content,regex_RR); //prendo i numeri dalla stringa

  rows=getIntegersInRange(rows[0],rows[1]);               // prendo tutti i numeri nel range

  last_row_number = rows //Aggiorno campo contente detta ultima riga

  let start_index = 0
  let start_map = {}
  for(const r of rows){
    let ret = addNumberToEndOfWords(parseInt(r), start_index, start_map)
    let editedString = ret[0]
    let end_map = ret[1]
    let end_index = ret[2] 
    modificaTestoDiv(parseInt(r), "<b>"+r + "</b>"+ editedString)
    start_index = end_index
    start_map = end_map
  }
  old_command = output_content; //aggiorno old command
}

function NxNy(){
  let wrds = extract_numer_from_StringRR(output_content);                   //prendo i numeri dalla stringa
  words_number=getIntegersInRange(wrds[0],wrds[1]);               // prendo tutti i numeri nel range
  let backupTesto = JSON.parse(JSON.stringify(testo));
  words_number.forEach(k => {
    let word = map[k];
    backupTesto[word.row][word.pos] = `<u>${"<span style='color: blue;'>"+k+"</span>"} ${word.word}</u>`;
  });

  words_number_lenght=words_number.length;

  addNote(words_number[0], words_number[words_number_lenght-1],last_row_number)
  Object.entries(backupTesto).forEach(([key, value]) => {
    let finalText = `${"<b>"+key+"</b>"} ${Object.values(value).join(' ')}`;
    modificaTestoDiv(parseInt(key), finalText);
  });

  note_flag=true

}

function CxCy(){
  let words_number = extract_numer_from_StringRR(output_content);                   //prendo i numeri dalla stringa
  words_number=getIntegersInRange(words_number[0],words_number[1]);               // prendo tutti i numeri nel range

  let backupTesto = JSON.parse(JSON.stringify(testo));

  words_number.forEach(k => {
    let word = map[k];
    backupTesto[word.row][word.pos] = `<u>${k} ${word.word}</u>`;
  });

  words_number_lenght=words_number.length;
  addCorrection(parseInt(words_number[0]), parseInt(words_number[words_number_lenght-1]),last_row_number)

  Object.entries(backupTesto).forEach(([key, value]) => {
    let finalText = `${"<b>"+key+"</b>"} ${Object.values(value).join(' ')}`;
    modificaTestoDiv(parseInt(key), finalText);
  });

  note_flag=true

}

// true nota - false correzione
function addNote(stw, enw, last_rowNumber){
  let index = Object.keys(notes).length + 1
  let textNote = "<span id='asterisco'>*</span> "
  last_note = index
  notes[index] = {
    startWord : stw,
    endWord : enw,
    note: textNote,
    startWord_number:last_rowNumber,
    is_note : true,
  }
  recompile_notes()
}

function addCorrection(stw, enw, last_rowNumber){
  let index = Object.keys(notes).length + 1
  let textNote = "<span id='asterisco'>*</span> "
  last_note = index
  notes[index] = {
    startWord : stw,
    endWord : enw,
    note: textNote,
    startWord_number:last_rowNumber,
    is_note : false,
  }
  recompile_notes()
}

function highlightNote(id) {
      // Verifica se la nota esiste
      if (!notes[id]) {
        console.error(`Nota con ID ${id} non trovata.`);
        return;
    }

    if(notes[id].startWord_number.length>1){
      let lunghezzaArray = notes[id].startWord_number.length
      output_content = config["Select line"]+notes[id].startWord_number[0]+config["Select line"]+notes[id].startWord_number[lunghezzaArray-1];
      console.log("New Output content:"+output_content)
      RxRy()
    }
    else{
      output_content = config["Select line"]+notes[id].startWord_number[0];
      console.log("New Output content:"+output_content)
      Rx()
    }

    // Ottieni i numeri delle parole da evidenziare
    const note = notes[id];
    const wordsToHighlight = getIntegersInRange(note.startWord, note.endWord);

    // Crea una copia del testo per evitare modifiche indesiderate
    const backupTesto = JSON.parse(JSON.stringify(testo));

    // Evidenzia le parole nel backup
    wordsToHighlight.forEach(k => {
        const word = map[k];
        backupTesto[word.row][word.pos] = `<u>${k} ${word.word}</u>`;
    });

    // Aggiorna l'interfaccia grafica con il testo evidenziato
    Object.entries(backupTesto).forEach(([key, value]) => {
        const finalText = `${key} ${Object.values(value).join(' ')}`;
        modificaTestoDiv(parseInt(key), finalText);
    });
}

function deleteNote(id){
  let index = 1
  let maxKeys = Object.keys(notes).length

  let tempObj = {}

  for (const [key, value] of Object.entries(notes)) {
    if(parseInt(id) == parseInt(key)){
      
    } else {
      tempObj[index] = value
      index++
    }
  }

  notes = JSON.parse(JSON.stringify(tempObj));
  compile_testo()
  recompile_notes()
}

function complete(){
  note_flag=false
  let txt = notes[last_note].note
  txt = txt.replaceAll("<span id='asterisco'>*</span> ", "")
  notes[last_note].note = txt
  recompile_notes()
  last_note = 0
}

function note_delete(){
  let note_to_delete = extract_numer_from_String(output_content);
  console.log("Nota da cancellare:"+note_to_delete[0]);
  deleteNote(note_to_delete[0])
}

function estraiChiaviDaIndice(oggetto, indiceInizio) {
  // Controlliamo se l'oggetto è valido e se l'indice è valido
  if (typeof oggetto !== 'object' || oggetto === null) {
    throw new Error('Il primo argomento deve essere un oggetto');
  }
  if (indiceInizio < 0 || indiceInizio >= Object.keys(oggetto).length) {
    throw new Error('L\'indice iniziale è fuori dai limiti');
  }

  // Otteniamo un array di chiavi
  const chiavi = Object.keys(oggetto);

  // Estraiamo le chiavi a partire dall'indice specificato
  return chiavi.slice(indiceInizio);
}


function approveCorrection(id){

  //elimino parole da x a y dalla mappa
  //aggiungo le mie
  //faccio lo shift di quelle a y+1
  
  const note = notes[id]
  const note_text=(notes[id].note).trim()
  const splitted_note_text = note_text.split(" ")
  words_number=getIntegersInRange(note.startWord, note.endWord);

  let splitted_length = splitted_note_text.length
  let splitted_index = 0

  let foreachindex = 0

  words_number.forEach(k => {
    let word = map[k];
    let rowIndex = word.row
    let posIndex = word.pos - 1

    let textArrayElement = []
    
    for (const [key, value] of Object.entries(testo[rowIndex])) {
      textArrayElement.push(value)
    }
    
    textArrayElement.splice(posIndex, 1)
    if (splitted_note_text[splitted_index]) {
      let word_to_change = splitted_note_text[splitted_index]
      textArrayElement.splice(posIndex, 0, word_to_change)
      splitted_index ++
    }   

    let objCopy = {}

    if (foreachindex === words_number.length - 1){ 
      if (splitted_note_text[splitted_index]) {
        for (let i = splitted_length; i >= splitted_index; i--) {
          const word_to_change = splitted_note_text[i]
          textArrayElement.splice(posIndex, 0, word_to_change)
        }
      }   
    }

    for(let i = 0; i < textArrayElement.length; i++){
      objCopy[i] = textArrayElement[i]
    }

    testo[rowIndex] = objCopy

    foreachindex ++
  });  

  //elimina correzione
  deleteNote(id);
  compile_testo();

  //
}

//var write_output_command="";
const windowHeight = window.innerHeight;

function scrollUp() {
  // Ottiene l'elemento che rappresenta la finestra del browser
  //const windowHeight = window.innerHeight;

  // Scorri la pagina verso l'alto di una quantità pari all'altezza della finestra
  window.scrollTo({
    top: window.scrollY - windowHeight,
    behavior: 'smooth'
  });
}

function scrollDown() {
  // Ottiene l'altezza totale della pagina
  //const windowHeight = document.documentElement.scrollHeight;

  // Scorri la pagina verso il basso di una quantità pari all'altezza della finestra
  window.scrollTo({
    top: window.scrollY + windowHeight,
    behavior: 'smooth'
  });
}

function check_command() {

  if(exp_index!=1){
    nascondiDiv("username_form")
    }
  else{
    mostraDiv("username_form");
  }

  if(exp_index!=5){
    document.getElementById("next").textContent="Next"
  }

  console.log("Check command...")

  writeInDiv("Current comand:"+write_output_command);

  //Annulla effetto comando vuoto/ vecchio comando che puo' erroneamente essere letto piu' volte
  if (output_content == ''){
    // || output_content == old_command) {
    return
  }


  //lancia comando add
  if (output_content== regex_add ) {
    coloraTestoInVerde()
    write_output_command = output_content
    add()
  }

  //Comando "Rx"
  //controlla se è un comando "Riga" con una regex
  if (generic_Check_String(output_content,regex_R) == true) {
    is_select_bool=true;
    write_output_command = output_content
    coloraTestoInVerde()
      Rx()
  }

  //Comando "RxRy"
  if (generic_Check_String(output_content,regex_RR) == true) {
    is_select_bool=true;
    write_output_command = output_content
    coloraTestoInVerde()
    RxRy()
  }

  // command Nx Ny {aggiunta nota}
  // Viene eliminata la punteggiatura
  if (generic_Check_String(output_content,regex_NN) == true) {
    if(is_select_bool==true){
      write_output_command = output_content
      coloraTestoInVerde()
      NxNy();
      is_select_bool=false;
    }
    else{
      
    }
  }

  // command <complete note> complete
  if ( output_content == regex_complete) {
    write_output_command = output_content
    coloraTestoInVerde()
    complete();
  }

    //<delete note <id>> Dx
  if (generic_Check_String(output_content,regex_delete) == true) {
    write_output_command = output_content
    coloraTestoInVerde()
    note_delete();
  }

  // highlight note <id>
  if (generic_Check_String(output_content,regex_H) == true) {
    write_output_command = output_content
    coloraTestoInVerde()
    extract_numer_from_String(output_content);
    highlightNote(extract_numer_from_String(output_content));
  }

  //<correct <u> <v>> Cx Cy
  if (generic_Check_String(output_content,regex_CC) == true) {
    if(is_select_bool==true){
      write_output_command = output_content
      coloraTestoInVerde()
      CxCy();
      is_select_bool=false;
    }
    else{

    }

  }
  //<approve correction <id>>
  if (generic_Check_String(output_content,regex_A) == true) {
    if(is_note==true){
      return
    }
    write_output_command = output_content
    coloraTestoInVerde()
    approveCorrection(extract_numer_from_String(output_content));
  }

  
  if(generic_Check_String(output_content,regex_su)==true){
    write_output_command = output_content
    coloraTestoInVerde()
    scrollUp();

  }

  if(generic_Check_String(output_content,regex_giu)==true){
    write_output_command = output_content
    coloraTestoInVerde()
    scrollDown();
  }

  //"Pulisco" il campo contente il comando
  output_content = '';
  return;

}

setInterval(check_command, 2000);

function writeInDiv(text) {
  const div = document.getElementById("copy_of_command");
  // Espressione regolare per trovare i numeri nella stringa
  const modifiedText = text.replace(/(\d+)/g, ' $1 ');

  // Rimuovere eventuali doppi spazi creati dalla sostituzione
  const finalText = modifiedText.replace(/\s+/g, ' ');

  div.textContent = finalText.trim(); // Rimuove eventuali spazi all'inizio e alla fine
}

function generate_experiment(commands){
  let instructions_div=document.getElementById("instructions")
  instructions_div.innerHTML = ""
  for(let command in commands){
    let p = document.createElement("p");
    p.id=command;
    p.innerHTML = commands[command];
    instructions_div.appendChild(p);
  }
}

//Button Next

let paperIndexes = 1

const targetElement = document.getElementById('target-div'); //prendo in input il div
targetElement.innerHTML= Papers[paperIndexes];
const button_next = document.getElementById('next');
button_next.addEventListener('click', async function(butpres) {
  
  let press_next=Date.now();
  
  inviaDatiAlServer(all_command,start_experiment,press_next,experiment_complete)
  
  //svuoto buffer comandi pronunciati
  all_command=[]
  
  paperIndexes++
  exp_index++
  exp_command_num = 1

  if (!Papers[paperIndexes]) {
    paperIndexes = 1
  }
  targetElement.innerHTML= Papers[paperIndexes];

  if(!Experiments[exp_index]){
    exp_index = 1
  }
  generate_experiment(Experiments[exp_index]);

  if(document.getElementById("next").textContent=="Fine"){
    document.getElementById('nav_username').value="Inserisci nuovo nome utente"
  }

  if(exp_index==5){
    document.getElementById("next").textContent="Fine"
  }


});
