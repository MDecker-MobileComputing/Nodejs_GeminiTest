# Demo-Projekt für Gemini-Anfrage mit Nodejs über REST-API #

<br>

Programm [main_titel.js](src/main_titel.js) erzeugt mehrere Titelvorschläge für den eingegebenen Text.

<br>

Mit `npm run liste` werden die Namen aller zur Verfügung stehenden Modelle auf ausgegeben.

<br>

**Referenzen:**

* https://aistudio.google.com/
* https://aistudio.google.com/usage?timeRange=last-28-days
* https://ai.google.dev/gemini-api/docs/pricing?hl=de

<br>

----

## Gemini-Library von Google ##

<br>

Es gibt auch eine offizielle Nodejs-Library für Gemini: https://www.npmjs.com/package/@google/genai

siehe Beispielprogramm [main_antwortoptionen.js](src/main_antwortoptionen.js) in diesem Repo
(Ausführen mit: `npm run mc`)

<br>

----

## API-Key ##

<br>

In *AI Studio* kann über den Eintrag "Get API Key" in der Leiste links ein API-Key erzeugt werden.
Es muss dann eine Umgebungsvariable `GEMINI_API_KEY` mit diesem API-Key gesetzt werden.

Beispiel für Windows:
```
@set GEMINI_API_KEY=....
```

Diesen `set`-Befehl kann man in eine Batch-Datei `setApiKeyEnv.bat` schreiben, da der Name dieser Batch-Datei in
[.gitignore](.gitignore) eingetragen ist.

<br>

Das Repo enthält auch ein Programm [proxy.js](src/proxy.js), das einen Request um den API-Key
anreichert, damit dieser nicht im Frontend-Code (z.B. Ionic/Angular-App) enthalten sein muss.

<br>

----

## Screenshots ##

<br>

![Screenshot: Usage Stats in AI Studio](screenshot_1_UsageStats.png)

<br>