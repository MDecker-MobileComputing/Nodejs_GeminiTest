import readlineSync from "readline-sync";


const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODELL = "gemini-2.5-flash";


if (!API_KEY) {

  console.error("Fehler: Der API-Schlüssel ist nicht gesetzt. Bitte setzen Sie die Umgebungsvariable GEMINI_API_KEY.");
  process.exit(1);
}


const eingabeStr = readlineSync.question("\nBitte Text eingeben, für den ein Titel zu erzeugen ist!\n> ");

const prompt = `Erzeuge einen Titel für folgenden Text: ${eingabeStr}`;

async function main() {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODELL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    }
  );

  if (!res.ok) {

    const errText = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${errText}`);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") ??
    "Keine Antwort erhalten.";

  console.log(text);
}

main().catch(err => {
  console.error("Fehler:", err.message);
  process.exit(1);
});