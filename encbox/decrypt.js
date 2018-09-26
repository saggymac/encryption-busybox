/*!
 * decrypt.js
 *
 * Express handlers for decrypting jwe cypher text and returning plain text
 *
 */
function getDecryptionHandler( jose ) {
    return async function( req, res ) {
        console.log("Type of req.body: ", typeof req.body);
        console.log("Type of req.body.key: ", typeof req.body.key);
        console.log("Type of req.body.jwe: ", typeof req.body.jwe);
        if ( !req.body.key ) {
            console.log("Type of req.body.key: ", typeof req.body.key);
            res.status(400).send( { "message": "No Decryption Key Supplied" } );
        } else if ( !req.body.jwe ) {
            console.log("Type of req.body.jwe: ", typeof req.body.jwe);
            res.status(400).send( { "message": "No JWE to decrypt" } );
        } else {
            console.log("Importing Key : ", JSON.stringify( req.body.key));
            let key = await jose.JWK.asKey( req.body.key );
            console.log("Import Key returned key: ", typeof key);
            let decryptor = await jose.JWE.createDecrypt( key );
            let result = await decryptor.decrypt( req.body.jwe );
            let results = {
                plaintext: result.plaintext.toString( 'utf8' )
            };
            res.send( results );


            /*jose.JWK.asKey( req.body.key )
            .then( function( key ) {
                console.log("Import Key returned key: ", typeof key);
                if (key ){
                  jose.JWE.createDecrypt( key )
                      .decrypt( req.body.jwe )
                      .then( function( result ) {
                          let results = {
                              plaintext: result.plaintext.toString( 'utf8' )
                          };
                          res.send( results );
                      });
                  }
                else {
                  res.status(400).send( { "message": "key import failed" } );
                }
            });*/
        }
    };
}

module.exports = getDecryptionHandler;
