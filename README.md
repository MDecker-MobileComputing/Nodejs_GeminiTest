# Demo-Projekt für Gemini-Anfrage mit Nodejs über REST-API #

<br>

**Referenzen:**

* https://aistudio.google.com/
* https://aistudio.google.com/usage?timeRange=last-28-days
* https://ai.google.dev/gemini-api/docs/pricing?hl=de

<br>

Es gibt auch eine eigene Nodejs-Library für Gemini: https://www.npmjs.com/package/@google/genai

<br>

----

## API-Key ##

<br>

In *AI Studio* kann über den Eintrag "Get API Key" in der Leiste links ein API-Key erzeugt werden.

<br>

Muss gesetzt sein in Umgebungsvariable `GEMINI_API_KEY`.

Beispiel:
```
set GEMINI_API_KEY=....
```

Idee: Diesen `set`-Befehl in Batch-Datei `setApiKeyEnv.bat` schreiben, Dateiname ist in `.gitignore` eingetragen.

<br>

Das Repo enthält auch ein Programm [proxy.js](src/proxy.js), das einen Request um den API-Key
anreichert, damit dieser nicht im Frontend-Code (z.B. Ionic/Angular-App) enthalten sein muss.

<br>

----

## Screenshots ##

<br>

![Screenshot: Usage Stats in AI Studio](screenshot_1_UsageStats.png)

<br>