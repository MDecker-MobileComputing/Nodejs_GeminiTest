import readlineSync  from "readline-sync";
import {GoogleGenAI} from "@google/genai";


const API_KEY = process.env.GEMINI_API_KEY;
if ( !API_KEY ) {

  console.error( "Fehler: Der API-Schlüssel ist nicht gesetzt. Bitte setzen Sie die Umgebungsvariable GEMINI_API_KEY." );
  process.exit( 1 );
}


const GEMINI_MODELL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
//console.log( `Verwende Modell: ${GEMINI_MODELL}` );


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
