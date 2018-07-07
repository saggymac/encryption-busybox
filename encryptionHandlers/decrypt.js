/*!
 * decrypt.js
 *
 * Express handlers for decrypting jwe cypher text and returning plain text
 *
 */
function getDecryptionHandler( jose ) {
    return function( req, res ) {
        //logRequest( req );
        if ( !req.body.key ) {
            let results = {
                "message": "No Decryption Key Supplied"
            };
            res.send( results );
            return;
        }

        if ( !req.body.jwe ) {
            let results = {
                "message": "No JWE to decrypt"
            };
            res.send( results );
            return;
        }

        jose.JWK.asKey( req.body.key )
            .then( function( key ) {
                jose.JWE.createDecrypt( key )
                    .decrypt( req.body.jwe )
                    .then( function( result ) {
                        let results = {
                            plaintext: result.plaintext.toString( 'utf8' )
                        };
                        res.send( results );
                    } );
            } );
    };
}

module.exports = {
    getDecryptionHandler: getDecryptionHandler
};