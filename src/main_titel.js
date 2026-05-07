import readlineSync from "readline-sync";


// Alle verfügbaren abfragen: https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY
//const GEMINI_MODELL = "gemini-2.5-flash";
const GEMINI_MODELL = "gemini-flash-lite-latest";

const API_KEY = process.env.GEMINI_API_KEY;
if ( !API_KEY ) {

  console.error( "Fehler: Der API-Schlüssel ist nicht gesetzt. Bitte setzen Sie die Umgebungsvariable GEMINI_API_KEY." );
  process.exit( 1 );
}


const eingabeStr = readlineSync.question(
  "\nBitte Text eingeben (z.B. Notiz oder Tagebucheintrag), für den ein Titel zu erzeugen ist!\n> " );

const prompt =
  `Erzeuge 5 Titelvorschläge für folgenden Text. \
   Die Titel sollen sachlich und nüchtern formuliert sein, \
   ohne reißerische oder werbende Sprache: ${eingabeStr}`;

async function main() {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODELL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type"  : "application/json",
        "x-goog-api-key": API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              titles: {
                type : "array",
                items: { type: "string" }
              }
            }
          }
        }
      })
    }
  );

  if ( !res.ok ) {

    const errText = await res.text();
    throw new Error( `${res.status} ${res.statusText}: ${errText}` );
  }

  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join( "" );

  if ( !raw ) {

    console.log( "Keine Antwort erhalten." );
    return;
  }

  const { titles } = JSON.parse( raw );
  titles.forEach( (titel, i) => console.log(`${i + 1}. ${titel}`) );
}

main().catch(err => {
  console.error( "Fehler:", err.message );
  process.exit( 1 );
});