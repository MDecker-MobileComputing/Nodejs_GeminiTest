const apiKey = process.env.GEMINI_API_KEY;
if ( !apiKey ) {

  console.error( "Fehler: Die Umgebungsvariable GEMINI_API_KEY ist nicht gesetzt." );
  process.exit( 1 );
}

async function listModels() {

  const modelsArray = [];
  let pageToken = null;

  do {

    const url = new URL("https://generativelanguage.googleapis.com/v1beta/models");
    url.searchParams.set( "key", apiKey );
    if ( pageToken ) {

      url.searchParams.set( "pageToken", pageToken );
    }

    const res = await fetch( url.toString() );

    if (!res.ok) {

      const errText = await res.text();
      throw new Error( `${res.status} ${res.statusText}: ${errText}` );
    }

    const data = await res.json();

    for ( const model of data.models ?? [] ) {

      modelsArray.push( model.name /* + " - " + model.description */ );
    }

    pageToken = data.nextPageToken ?? null;
  } while ( pageToken );

  modelsArray.sort();

  for ( const name of modelsArray ) {

    console.log( name );
  }

  console.log( `\n${modelsArray.length} Modelle gefunden` );
}

listModels().catch( err => {

  console.error( "Fehler:", err.message );
  process.exit( 1 );
});
