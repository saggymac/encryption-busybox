/*!
 * encrypt.js
 *
 * Express handlers for creating JWE from plaintext
 *
 */
function getEncryptionHandler( jose ) {
    return function( req, res ) {
        let options = {
            contentAlg: req.body.contentAlg,
            format: req.body.format,
            alg: req.body.alg
        };

        jose.JWE.createEncrypt( options, req.body.key )
            .update( req.body.plaintext )
            .final()
            .then( function( jweResult ) {
                res.send( jweResult );
            }
        );
    };
}

module.exports = getEncryptionHandler;