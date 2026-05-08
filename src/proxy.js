import express      from "express";
import createLogger from "logging";

/**
 * Ein einfacher Proxy-Server, der Anfragen an die Gemini API weiterleitet.
 * Er ermöglicht es, die API über einen lokalen Endpunkt zu nutzen, ohne den API-Schlüssel
 * direkt im Frontend zu verwenden. Außerdem kann damit das verwendete Modell zentral gesteuert werden.
 */


const logger = createLogger( "gemini-proxy" );

const API_KEY = process.env.GEMINI_API_KEY;
if ( !API_KEY ) {

  console.error( "Fehler: Umgebungsvariable GEMINI_API_KEY ist nicht gesetzt." );
  process.exit( 1 );
}

const GEMINI_MODELL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
logger.info( "Gewähltes Modell:", GEMINI_MODELL );


const expressObjekt = express();
expressObjekt.use( express.json() );

let zaehlerRequest = 0;

expressObjekt.post( "/generate", async ( req, res ) => {

  zaehlerRequest++;
  logger.info( `Anfrage Nr ${zaehlerRequest} erhalten.` );

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODELL}:generateContent`;

  try {

    const upstream = await fetch( apiUrl, {
      method : "POST",
      headers: {
        "Content-Type"  : "application/json",
        "x-goog-api-key": API_KEY
      },
      body: JSON.stringify( req.body )
    } );

    const data = await upstream.json();
    res.status( upstream.status ).json( data );

  logger.info( `Anfrage Nr ${zaehlerRequest} erfolgreich verarbeitet.` );

  } catch ( fehler ) {

    logger.error( `Proxy-Fehler bei Anfrage Nr ${zaehlerRequest}:`, fehler.message );
    res.status( 502 )
       .json( { error: "Upstream nicht erreichbar", detail: fehler.message } );
  }
} );


const PORT = 8080;
expressObjekt.listen( PORT, () => {

  logger.info( `Gemini-Proxy läuft auf http://localhost:${PORT}` );
} );
