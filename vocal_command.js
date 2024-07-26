//Definizione strutturura dati - I componenti della struttura dati hanno nomi in italiano
// Define the 'word' structure
class Word {
  constructor(integer, string) {
    this.integer = integer;
    this.string = string;
  }
  toString() {
    return 'Word(integer: ${this.integer}, string: "${this.string}")';
  }

}

// Create a list of words (sentence)
const frase = [];

// Create a list of sentences (text)
const testo = {};
var map = new Map();
var word_count = 0;

function modifyWordCount(delta) {
  // Update the global variable using the delta value
  word_count = delta;
}


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
      }0
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

//fine strutture dati


//Iniziallizzo campo che conterra' il comando in output
const output = document.getElementById('outputElement');
document.getElementById('outputElement').style.display = "none";
var output_content;

old_command = ''; //ultimo comando lanciato

//PER FUNZIONE "Rx"
/*********************************************************************************************/
function checkString(str) {
  const regex = /R[0-9]/; // Regular expression pattern
  const regex_1 = /r[0-9]/;

  const result = regex.test(str); // Apply the regular expression to the string
  if (result) {
    console.log(`${str} matches the pattern Rx`);
    return true
  } else {
    const result_1 = regex_1.test(str);

    if (result_1) {
      console.log(`${str} matches the pattern Rx`);
      return true
    } else {
      console.log(`${str} does not match the pattern Rx`);

      return false
    }
  }
}

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
/*********************************************************************************************/

//PER FUNZIONE "Rx Ry"
/*********************************************************************************************/
function checkStringRR(inputString) {
  // Regular expression pattern for the specified format
  const regex = /^[rR]\d+ [rR]\d+$/;
  console.log(`${inputString} match the pattern Rx Ry`);
  // Check if the input string matches the regex
  return regex.test(inputString);
}

function extract_numer_from_StringRR(inputString) {
 // Regex per estrarre i due interi
 const regex = /^([rR])(\d+)\s+([rR])(\d+)$/;
 const match = inputString.match(regex);

 // Se la stringa corrisponde al pattern, estraiamo i numeri
 if (match) {
   const intero1 = parseInt(match[2]);
   const intero2 = parseInt(match[4]);
   console.log(intero1,intero2);
   return [intero1, intero2];
 } else {
   return null; // La stringa non corrisponde al formato richiesto
 }
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
/*********************************************************************************************/


//PER FUNZIONE "Nx Ny"
/*********************************************************************************************/
function checkStringNN(inputString) {
  // Regular expression pattern for the specified format
  const regex = /^[nN]\d+ [nN]\d+$/;
  console.log(`${inputString} match the pattern Nx Ny`);
  // Check if the input string matches the regex
  return regex.test(inputString);
}

function extract_numer_from_StringNN(inputString) {
 // Regex per estrarre i due interi
 const regex = /^([nN])(\d+)\s+([nN])(\d+)$/;
 const match = inputString.match(regex);

 // Se la stringa corrisponde al pattern, estraiamo i numeri
 if (match) {
   const intero1 = parseInt(match[2]);
   const intero2 = parseInt(match[4]);
   console.log(intero1,intero2);
   return [intero1, intero2];
 } else {
   return null; // La stringa non corrisponde al formato richiesto
 }
}
/*********************************************************************************************/


//funzione per aggiungere numeri interi alla fine delle righe
function addNumberToEndOfWords(row_number, start_index, input_map) {
  if(row_number){
     map = input_map
    console.log(input_map)
    let word_index = start_index + 1
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

//   const words = str.split(' ');
//   let new_string = "";
//   /*
// words.forEach(word=>{
//   new_string=new_string+" "+word_count+word;
//   word_count++;
// });
// */
//   testo[row_number].forEach(word => {
    
//     // new_string = new_string + " " + word_count + word;
//     // console.log(word);
//     // word.integer = word_count;
//     // word_count++;
//   });
//   //console.log(testo[row_number]);
//   return new_string + " ";




function modificaTestoDiv(idDiv, nuovoTesto) {
  const div = document.getElementById(idDiv);
  if (div) {
    div.innerHTML = nuovoTesto; // Usa innerHTML invece di textContent
  } else {
    console.error(`Elemento con ID "${idDiv}" non trovato.`);
  }
}

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
    output_content = output.textContent;        // output_content e' una stringa contente l'ultimo comando lanciato
    console.log(transcript);
  });

  if (speech == true) {
    recognition.start();
  }
}
listen();
setInterval(listen, 7000); // 5000 milliseconds = 5 seconds

function check_command() {

  //controlla se è stato lanciato un comando
  if (output_content == '' || output_content == old_command) {

    return
  }


  //lancia comando add
  if (output_content == 'add' || output_content == 'Add' || output_content == 'ad') {
    add_flag = true;
    compile_testo();
    old_command = output_content; //aggiorno old command
  }


  //Comando "Rx"
  //controlla se è un comando "Riga" con una regex
  //IL COMANDO R0 è buggato
  if (checkString(output_content) == true) {
    compile_testo();
    let rows = extract_numer_from_String(output_content); //prendo il numero dalla stringa
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


  //Comando "RxRy"
  if (checkStringRR(output_content) == true) {
    compile_testo();
    let rows = extract_numer_from_StringRR(output_content); //prendo i numeri dalla stringa
    rows=getIntegersInRange(rows[0],rows[1]);               // prendo tutti i numeri nel range

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

  // command Nx Ny {aggiunta nota}
  // Viene eliminata la punteggiatura
  if (checkStringNN(output_content) == true) {
    let words_number = extract_numer_from_StringNN(output_content);                   //prendo i numeri dalla stringa
    words_number=getIntegersInRange(words_number[0],words_number[1]);               // prendo tutti i numeri nel range

    //let backupTesto = { ...testo };
    let backupTesto = JSON.parse(JSON.stringify(testo));

    words_number.forEach(k => {
      let word = map[k];
      backupTesto[word.row][word.pos] = `<u>${k} ${word.word}</u>`;
    });

    Object.entries(backupTesto).forEach(([key, value]) => {
      let finalText = `${key} ${Object.values(value).join(' ')}`;
      modificaTestoDiv(parseInt(key), finalText);
    });
  }

  



/*
  //Test underline
  function test() {
    let parole = [3, 4, 5];
    let backupTesto = { ...testo };

    parole.forEach(k => {
      let word = map[k];
      backupTesto[word.row][word.pos] = `<u>${word.word}</u>`;
    });

    Object.entries(backupTesto).forEach(([key, value]) => {
      let finalText = `${key} ${Object.values(value).join(' ')}`;
      modificaTestoDiv(parseInt(key), finalText);
    });
  }

// Function to be called when spacebar is pressed
  function onSpacebarPress() {
    test()    // Add your function logic here
  }

// Add event listener for keydown event
  document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
      onSpacebarPress();
    }
  });
  if (output_content == 'a') {
    test();
  }
*/

  // command <complete note>

  //<delete note <id>>

  //<correct <u> <v>>

  //<approve correction <id>>




  //"Pulisco" il campo contente il comando
  output_content = '';
  return;

}

setInterval(check_command, 2000);
