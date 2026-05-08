import readlineSync from "readline-sync";


const GEMINI_MODELL = "gemini-2.5-flash";
//const GEMINI_MODELL = "gemini-flash-lite-latest";

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

console.log( "\nGeneriere Titelvorschläge..." );

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
  const raw  = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join( "" );

  if ( !raw ) {

    console.log( "Keine Antwort erhalten." );
    return;
  }

  // eigentliche Antwort ausgeben
  const { titles } = JSON.parse( raw );
  titles.forEach( (titel, i) => console.log(`${i + 1}. ${titel}`) );


  // Token-Verbrauch ausgeben
  const usage = data?.usageMetadata;
  if ( usage ) {

    const tokensPrompt   = usage.promptTokenCount      ?? 0;
    const tokensAntwort  = usage.candidatesTokenCount  ?? 0;
    const tokensApiTotal = usage.totalTokenCount       ?? 0;
    const tokensAddiert  = tokensPrompt + tokensAntwort ;
    const tokensDiff     = tokensApiTotal - tokensAddiert;

    console.log( "\nToken-Verbrauch:" );
    console.log( "  Prompt      : ", tokensPrompt   );
    console.log( "  Antwort     : ", tokensAntwort  );
    console.log( "  Gesamt (P+A): ", tokensAddiert  );
    console.log( "  Gesamt (API): ", tokensApiTotal );
    console.log( "  Unterschied : ", tokensDiff     );
    if ( tokensDiff != 0 ) {

      console.log( "  Hinweis: Gesamt (API) kann weitere Token enthalten (z.B. interne/systemseitige Token)." );
    }
  }
}

main().catch(err => {

  console.error( "Fehler:", err.message );
  process.exit( 1 );
});