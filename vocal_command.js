// Delay utile a dare tempo allo script take_text
function delayTwoSeconds() {
  setTimeout(() => {
    console.log('Two seconds have passed!');
  }, 2000);
}
delayTwoSeconds();


//Iniziallizzo campo che conterra' il comando in output
const output=document.getElementById('outputElement');
document.getElementById('outputElement').style.display = "none";
var output_content; 


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


    //funzione per aggiungere numeri interi alla fine delle righe
    
    function addNumberToEndOfWords(str) {
        // Split the string into words
        const words = str.split(' ');
      
        // Modify each word and append the number
        const modifiedWords = words.map((word, index) => {
          return word + (index + 1);
        });
      
        // Join the modified words back into a string
        const modifiedString = modifiedWords.join(' ');
      
        // Return the modified string
        return modifiedString;
      }
    

      function modifyDivText(divId, newText) {
        // Get the target <div> element using document.getElementById()
        const targetDiv = document.getElementById(divId);
      
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
        output_content=output.textContent;
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
    if(output_content==''){

    return
}

//lancia comando add
    if(output_content=='add'||output_content=='Add'||output_content=='ad'){
        add_flag=true;
        const targetElement = document.getElementById('target-div'); //prendo in input il div
        const textContent = targetElement.textContent; //estrapolo il testo
        const sentences = textContent.split('. '); // divido il testo in una lista di frasi
        targetElement.textContent = ''; // Elimino il vecchio testo
    
        var index =0;
    
        //creo i nuovi paragrafi
        sentences.forEach(sentence => {
        const paragraph = document.createElement('div');
        paragraph.id=index+""; //imposto l'id del div pari quello del indice
        paragraph.textContent = index+" "+sentence;
        targetElement.appendChild(paragraph);
        index++
    });
    }
    //controlla se è un comando "Riga" con una regex
    if(checkString(output_content)==true){
        
        row_number = extract_numer_from_String(output_content); //prendo il numero dalla stringa
        console.log("mark a line:"+row_number)
        modifyDivText(row_number,addNumberToEndOfWords(document.getElementById(row_number).textContent))

    }

output_content='';
return;

}

setInterval(check_command,2000);
