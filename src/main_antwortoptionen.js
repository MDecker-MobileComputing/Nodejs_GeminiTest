import readlineSync  from "readline-sync";
import {GoogleGenAI} from "@google/genai";


// Alle verfügbaren abfragen: https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY
//const GEMINI_MODELL = "gemini-2.5-flash";
const GEMINI_MODELL = "gemini-flash-lite-latest";

const API_KEY = process.env.GEMINI_API_KEY;
if ( !API_KEY ) {

  console.error( "Fehler: Der API-Schlüssel ist nicht gesetzt. Bitte setzen Sie die Umgebungsvariable GEMINI_API_KEY." );
  process.exit( 1 );
}


const eingabeStr =
  readlineSync.question( "\nBitte Multi-Choice-Frage eingeben:\n> " );

const prompt =
  `Erzeuge 4 Antwortoptionen für folgende Frage. \
   Die Antwortoptionen sollen kurz und stichpunktartig sein, \
   ohne Einleitungstexte oder Erklärungen; \
   die richtige Antwort soll mit einem nachgestellten (richtig) markiert werden \
   und zuerst genannt werden: \
   ${eingabeStr}`;

const ai = new GoogleGenAI({apiKey: API_KEY});

console.log( "\nGeneriere Antwortoptionen...\n" );

async function main() {
const antwort = await ai.models.generateContent({
    model   : GEMINI_MODELL,
    contents: prompt,
  });

  console.log( antwort.text );
}

main();
