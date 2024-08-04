//COMAND CONFIGURATION
//----------------------------------------------------------------------------------------------//
//Attuale configurazione dei comandi
const config ={
  "Add number to line": "number",
  "Select line": "R",
  "Add a note": "N",
  "Complete Note":"complete",
  "Delete note": "delete",
  "Highlight note": "h",
  "Correct note": "c",
  "Approve correction": "a"
};

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

var regex_add = "number";
var regex_complete= "complete";
var regex_R=/[r][0-9]/;
var regex_RR=/r[0-9]r[0-9]/;
var regex_NN=/n[0-9]n[0-9]/;
var regex_delete=/delete[0-9]/;
var regex_H=/[h][0-9]/;
var regex_CC=/c[0-9]c[0-9]/;
var regex_A=/[a][0-9]/;


//NON FUNZIONANTE AL MOMENTO
function sostituisciRegex(regex, valoreDaSostituire, nuovoValore) {
  regex_string=regex.toString()

  regex_string=regex_string.slice(1);
  regex_string=regex_string.slice(0, -1);

  new_regex=regex_string.replace(valoreDaSostituire,nuovoValore)
  return new RegExp(new_regex);
}

function gen_regex_from_config() {
  regex_add= config["Add number to line"];
  //regex_R=sostituisciRegex(regex_R,"Rr",config["Select line"]);
  
  regex_complete= config["Complete Note"];

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
var last_row_number = 0;
let last_note = 0

function split_sentence_Into_Words(inputString) {
  // Regular expression pattern to match words
  const regex = /\w+/g;

  // Split the input string into an array using the regex
  const words = inputString.match(regex);

  // If there are matches (words found), return the array
  if (words) {
    return words;
  } else {
    // If no matches (no words found), return an empty array
    return [];
  }
}



function compile_testo(){
  console.log(Object.keys(testo).length);
  let sentences = []
  const targetElement = document.getElementById('target-div'); //prendo in input il div
  const textContent = targetElement.textContent; //estrapolo il testo
  let index = 1
  if(Object.keys(testo).length===0){
    console.log("entrato")
    
    let currentSentence = ''; // Variable to hold the current sentence being constructed

    // Iterate over the text content character by character
    for (let i = 0; i < textContent.length; i++) {
      const currentChar = textContent[i];

      // Append current character to the current sentence
      currentSentence += currentChar;

      // Check if we've reached the 50-character limit
      if (currentSentence.length === 89) {
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

  Object.entries(testo).forEach(([key, value]) => {
    const paragraph = document.createElement('div');
    const index = String(key)
    paragraph.id = index + ""; //imposto l'id del div pari quello del indice
    let text = ""
    Object.entries(value).forEach(([k, v]) => {
      text = text + v + " "

    });
    text = index + " " + text
    //aggiungere tag <br>
    paragraph.innerHTML = text+"<br>"
    targetElement.appendChild(paragraph);
  });
  
}

//Iniziallizzo campo che conterra' il comando in output
const output = document.getElementById('outputElement');
document.getElementById('outputElement').style.display = "none";
var output_content;

old_command = ''; //ultimo comando lanciato


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
  var regex_RR = /\b\w+(\d)\w+(\d)\b/g;

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
    console.log(input_map)
    let word_index = start_index
    let new_string = ""
    let row = testo[row_number]
    let temp = ""
    if(row){
      for (const [key, value] of Object.entries(row)) {
        temp = temp + String(word_index) + " " +  String(value) + " "
        map[word_index] = {
          word: String(value),
          row: row_number,
          pos: key  
        }
        word_index++
      }
      new_string = new_string + temp
    } 
    console.log(new_string, map, word_index)
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
    Object.entries(notes).forEach(([key, value]) => {
      let noteText = String(value.note)
      if(value.is_note==true){
        finalText = finalText + String(key) + " " + noteText + "<br>";
      }
      else{
        finalText = finalText + `<span style="color: red;">${key} ${noteText}</span><br>`;  //se è una correzzione la stringa è rossa
      }
      
    });

    wrapper.innerHTML = finalText
  }
}

var note_flag=false
//generic_Extract_Numbers_From_String
function listen() {


  var buffer_note=""
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
    //Aggunto il tolowercase

    output_content = output.textContent;
    
    if(note_flag==true){

      const note_to_write = document.getElementById(last_row_number+"_note");
      buffer_note = output_content

    }
    else{

      output_content = output_content.toLowerCase();;        // output_content e' una stringa contente l'ultimo comando lanciato
      output_content = output_content.split(' ').join('');
      console.log("The command is:"+output_content);

    }

    console.log(transcript);
  });

  recognition.addEventListener("audioend", () => {
    console.log("Audio capturing ended");
    if(note_flag==true && buffer_note!="complete"){
      let txt = notes[last_note].note
      txt = txt + " "+buffer_note+" "
      notes[last_note].note = txt
      recompile_notes()
    }
  });

  if (speech == true) {
    recognition.interimResults = false;
    //recognition.lang = "en-US";
    recognition.start();
  }
}
listen();
setInterval(listen, 7000); // 5000 milliseconds = 5 seconds

function add(){
  add_flag = true;
  compile_testo();
  old_command = output_content; //aggiorno old command
}

function Rx(){
  compile_testo();
  let rows = extract_numer_from_String(output_content); //prendo il numero dalla stringa

  last_row_number = rows[0] //Aggiorno campo contente detta ultima riga

  let start_index = 0
  let start_map = {}
  for(const r of rows){
    let ret = addNumberToEndOfWords(parseInt(r), start_index, start_map)
    let editedString = ret[0]
    let end_map = ret[1]
    let end_index = ret[2] 
    modificaTestoDiv(parseInt(r), r + " " + editedString)
    start_index = end_index
    start_map = end_map
  }
  old_command = output_content; //aggiorno old command
}

function RxRy(){
  compile_testo();
  let rows = extract_numer_from_StringRR(output_content,regex_RR); //prendo i numeri dalla stringa

  rows=getIntegersInRange(rows[0],rows[1]);               // prendo tutti i numeri nel range

  last_row_number = rows[0] //Aggiorno campo contente detta ultima riga

  let start_index = 0
  let start_map = {}
  console.log("The rows:"+rows);
  for(const r of rows){
    let ret = addNumberToEndOfWords(parseInt(r), start_index, start_map)
    let editedString = ret[0]
    let end_map = ret[1]
    let end_index = ret[2] 
    modificaTestoDiv(parseInt(r), r + " " + editedString)
    start_index = end_index
    start_map = end_map
  }
  old_command = output_content; //aggiorno old command
}

function NxNy(){
  let words_number = extract_numer_from_StringRR(output_content);                   //prendo i numeri dalla stringa
  words_number=getIntegersInRange(words_number[0],words_number[1]);               // prendo tutti i numeri nel range

  let backupTesto = JSON.parse(JSON.stringify(testo));

  words_number.forEach(k => {
    let word = map[k];
    backupTesto[word.row][word.pos] = `<u>${k} ${word.word}</u>`;
  });

  addNote(words_number[0], words_number[1])

  Object.entries(backupTesto).forEach(([key, value]) => {
    let finalText = `${key} ${Object.values(value).join(' ')}`;
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

  addCorrection(parseInt(words_number[0]), parseInt(words_number[1]))

  Object.entries(backupTesto).forEach(([key, value]) => {
    let finalText = `${key} ${Object.values(value).join(' ')}`;
    modificaTestoDiv(parseInt(key), finalText);
  });

  note_flag=true

}

// true nota - false correzione
function addNote(stw, enw){
  let index = Object.keys(notes).length + 1
  let textNote = "<span id='asterisco'>*</span> "
  last_note = index
  notes[index] = {
    startWord : stw,
    endWord : enw,
    note: textNote,
    is_note : true,
  }
  recompile_notes()
}

function addCorrection(stw, enw){
  let index = Object.keys(notes).length + 1
  let textNote = "<span id='asterisco'>*</span> "
  last_note = index
  notes[index] = {
    startWord : stw,
    endWord : enw,
    note: textNote,
    is_note : false,
  }
  recompile_notes()
}

//da rifare
function highlightNote(id) {
  if(notes[id]){
    compile_testo();
    const note = notes[id]

    let backupTesto = JSON.parse(JSON.stringify(testo));
    words_number=getIntegersInRange(note.startWord, note.endWord);    

    words_number.forEach(k => {
      let word = map[k];
      backupTesto[word.row][word.pos] = `<u>${k} ${word.word}</u>`;
    });


    Object.entries(backupTesto).forEach(([key, value]) => {
      let finalText = `${key} ${Object.values(value).join(' ')}`;
      modificaTestoDiv(parseInt(key), finalText);
    });

    let finalText = ""

    Object.entries(notes).forEach(([key, value]) => {
      finalText = finalText + `${key} ${value.note}` + " <br>";
    });
  
    document.getElementById("wrapper_notes").innerHTML = finalText
  }
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
  
  recompile_notes()
}

function complete(){
  note_flag=false
  let txt = notes[last_note].note
  console.log(txt)
  txt = txt.replaceAll("<span id='asterisco'>*</span> ", "")
  console.log(txt)
  notes[last_note].note = txt
  recompile_notes()
  last_note = 0
}

function note_delete(){
  let note_to_delete = extract_numer_from_String(output_content);
  console.log("Nota da cancellare:"+note_to_delete[0]);
  deleteNote(note_to_delete[0])
}

function approveCorrection(id){
  console.log(notes[id].note)//tutto il testo della correzione

  //dobbiamo eliminare le parole sottolineate nel testo   //aggiungi parola a testo

  const note = notes[id]

  words_number=getIntegersInRange(note.startWord, note.endWord);    

  words_number.forEach(k => {
    let word = map[k];
    testo[word.row][word.pos] = ``;
    if(k==words_number[note.startWord]){
      testo[word.row][word.pos] = notes[id].note;
    }
  });


  //elimina correzzione

  compile_testo();
  deleteNote(id);

}


function check_command() {

  //Annulla effetto comando vuoto/ vecchio comando che puo' erroneamente essere letto piu' volte
  if (output_content == '' || output_content == old_command) {
    return
  }


  //lancia comando add
  if (output_content== regex_add ) {
    add()
  }

  //Comando "Rx"
  //controlla se è un comando "Riga" con una regex
  if (generic_Check_String(output_content,regex_R) == true) {
      Rx()
  }

  //Comando "RxRy"
  if (generic_Check_String(output_content,regex_RR) == true) {
    RxRy()
  }

  // command Nx Ny {aggiunta nota}
  // Viene eliminata la punteggiatura
  if (generic_Check_String(output_content,regex_NN) == true) {
    NxNy();
  }

  // command <complete note> complete
  if ( output_content == regex_complete) {
    complete();
  }

    //<delete note <id>> Dx
  if (generic_Check_String(output_content,regex_delete) == true) {
    note_delete();
  }

  // highlight note <id>
  if (generic_Check_String(output_content,regex_H) == true) {
    extract_numer_from_String(output_content);
    console.log(extract_numer_from_String(output_content));
    highlightNote(extract_numer_from_String(output_content));
  }

  //<correct <u> <v>> Cx Cy
  if (generic_Check_String(output_content,regex_CC) == true) {
    CxCy();
  }
  //<approve correction <id>>
  if (generic_Check_String(output_content,regex_A) == true) {
    approveCorrection(extract_numer_from_String(output_content));
  }

  //SOLO PER I TEST
  document.addEventListener('keyup', function(event) {
        if (event.code === 'Space') {
      add();
    }

  });
  
  //"Pulisco" il campo contente il comando
  output_content = '';
  return;

}

setInterval(check_command, 2000);
