import express      from "express";
import createLogger from "logging";

const GEMINI_MODELL = process.env.GEMINI_MODELL ?? "gemini-flash-lite-latest";
const API_KEY       = process.env.GEMINI_API_KEY;

if ( !API_KEY ) {

  console.error( "Fehler: Umgebungsvariable GEMINI_API_KEY ist nicht gesetzt." );
  process.exit( 1 );
}


const logger = createLogger( "gemini-proxy" );
logger.info( "Gewähltes Modell:", GEMINI_MODELL );

const expressObjekt = express();
expressObjekt.use( express.json() );

// POST /generate  →  leitet an Gemini API weiter
expressObjekt.post( "/generate", async ( req, res ) => {

  const model  = req.query.model ?? GEMINI_MODELL;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

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

  } catch ( fehler ) {

    logger.error( "Proxy-Fehler:", fehler.message );
    res.status( 502 )
       .json( { error: "Upstream nicht erreichbar", detail: fehler.message } );
  }
} );


const PORT = 8080;
expressObjekt.listen( PORT, () => {
  logger.info( `Gemini-Proxy läuft auf http://localhost:${PORT}` );
} );
