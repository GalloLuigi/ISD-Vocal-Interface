//Definizione strutturura dati - I componenti della struttura dati hanno nomi in italiano
// Define the 'word' structure
class Word {
  constructor(integer, string) {
    this.integer = integer;
    this.string = string;
  }
}

// Create a list of words (sentence)
const frase = [];

// Create a list of sentences (text)
const testo = [];

var word_count=0;

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

//fine strutture dati


//Iniziallizzo campo che conterra' il comando in output
const output=document.getElementById('outputElement');
document.getElementById('outputElement').style.display = "none";
var output_content; 

old_command=''; //ultimo comando lanciato

//PER FUNZIONE "Rx"
/*********************************************************************************************/
function checkString(str) {
  const regex = /R[0-9]/; // Regular expression pattern
  const regex_1 =  /r[0-9]/;

  const result = regex.test(str); // Apply the regular expression to the string
  if (result) {
    console.log(`${str} matches the pattern`);
    return true
  } else {
     const result_1 = regex_1.test(str);

      if (result_1) {
        console.log(`${str} matches the pattern`);
        return true
      } else {
        console.log(`${str} does not match the pattern`);

    return false
  }
}}

function extract_numer_from_String(str) {
const regex = /[-+]?\d+/; // Regular expression pattern for numbers

const matches = str.match(regex); // Extract matches using regex.match()
if (matches) {
  console.log("Extracted numbers:", matches);
  return matches
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

  // Check if the input string matches the regex
  return regex.test(inputString);
}

function extract_numer_from_StringRR(inputString) {
  // Regular expression pattern to match the format "R1 R2"
  const regex = /R(\d+) R(\d+)/;

  // Match the input string against the regex
  const match = regex.exec(inputString);

  // If there's a match, extract the integers
  if (match) {
    const integer1 = parseInt(match[1]);
    const integer2 = parseInt(match[2]);
    return [integer1, integer2];
  } else {
    // If there's no match, return an empty array indicating invalid input
    return [];
  }
}
/*********************************************************************************************/


    //funzione per aggiungere numeri interi alla fine delle righe
    //DA FARE: Dovra aggiornare la struttura dati     
    function addNumberToEndOfWords(str) {
        const words = str.split(' ');
        let new_string="";
      words.forEach(word=>{
        new_string=new_string+" "+word_count+word;
        word_count++;
      });
        return new_string+" ";
      }
    

      function modifyDivText(divId, newText) {
        // Get the target <div> element using document.getElementById()
        const targetDiv = document.getElementById(divId);
        console.log("targetDiv is "+ targetDiv.textContent);
        // Check if the element exists
        if (!targetDiv) {
          console.error(`Error: Element with ID "${divId}" not found`);
          return; // Or handle the error as needed
        }
      
        // Modify the text content using targetDiv.textContent
        targetDiv.textContent = newText;
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
        output_content=output.textContent;        // output_content e' una stringa contente l'ultimo comando lanciato
    console.log(transcript);
});

if (speech == true) {
    recognition.start();
}
}
listen();
setInterval(listen, 7000); // 5000 milliseconds = 5 seconds



function check_command(){

//controlla se è stato lanciato un comando
    if(output_content=='' || output_content==old_command){

    return
}


//lancia comando add
    if(output_content=='add'||output_content=='Add'||output_content=='ad'){
        add_flag=true;
        const targetElement = document.getElementById('target-div'); //prendo in input il div
        const textContent = targetElement.textContent; //estrapolo il testo
        //const sentences = textContent.split('. '); // divido il testo in una lista di frasi

        //Divido il testo ogni 50 caratteri
        
        const sentences = []; // Initialize an empty array to store sentences
        let currentSentence = ''; // Variable to hold the current sentence being constructed

        // Iterate over the text content character by character
      for (let i = 0; i < textContent.length; i++) {
        const currentChar = textContent[i];

        // Append current character to the current sentence
        currentSentence += currentChar;

        // Check if we've reached the 50-character limit
        if (currentSentence.length === 100) {
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

        targetElement.textContent = ''; // Elimino il vecchio testo
    
        var index =0;
    
        //creo i nuovi div
        sentences.forEach(sentence => {
        const paragraph = document.createElement('div');
        paragraph.id=index+""; //imposto l'id del div pari quello del indice
        paragraph.textContent = index+" "+sentence;
        targetElement.appendChild(paragraph);

        //Aggiornamento strutura dati: per ogni parola nella frase 
        split_sentence_Into_Words(sentence).forEach(parola =>{
          frase.push(new Word(-1, parola));
        });
        testo.push(frase);
        
        //fine aggiornamento struttura dati

        index++
    });

    //console.log(testo);
    old_command=output_content; //aggiorno old command
    }


    //Comando "Rx"
    //controlla se è un comando "Riga" con una regex
    if(checkString(output_content)==true){
        
        row_number = extract_numer_from_String(output_content); //prendo il numero dalla stringa

        console.log("mark a line:"+row_number)
        modifyDivText(row_number,row_number+" "+addNumberToEndOfWords(document.getElementById(row_number).textContent.slice(1)))
        old_command=output_content; //aggiorno old command

    }


    //comando "Rx Ry"
    /*
    if(checkStringRR(output_content)==true){

      list_of_number = extract_numer_from_StringRR(output_content);

    }
    */
   
    //Command: <lines <x> <y>> 
    //il nostro sara' Rx Ry es: "R1 R3"


    // command <add note <u> <v>>

    // command <complete note>

    //<delete note <id>>

    //<correct <u> <v>>

    //<approve correction <id>>




    //"Pulisco" il campo contente il comando
output_content='';
return;

}

setInterval(check_command,2000);
