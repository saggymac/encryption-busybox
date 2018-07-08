/*!
 * decrypt.js
 *
 * Express handlers for decrypting jwe cypher text and returning plain text
 *
 */
function getDecryptionHandler( jose ) {
    return function( req, res ) {
        if ( !req.body.key ) {
            res.send( { "message": "No Decryption Key Supplied" } );
        } else if ( !req.body.jwe ) {
            res.send( { "message": "No JWE to decrypt" } );
        } else {
            jose.JWK.asKey( req.body.key )
            .then( function( key ) {
                jose.JWE.createDecrypt( key )
                    .decrypt( req.body.jwe )
                    .then( function( result ) {
                        let results = {
                            plaintext: result.plaintext.toString( 'utf8' )
                        };
                        res.send( results );
                    });
                } 
            );
        }
    };
}

module.exports = getDecryptionHandler;