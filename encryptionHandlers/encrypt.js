/*!
 * encrypt.js
 *
 * Express handlers for creating JWE from plaintext
 *
 */

const { logRequest } = require( '../utilities/logRequest' );

function getEncryptionHandler( jose ) {
    return function( req, res ) {
        logRequest( req );
        let options = {
            contentAlg: req.body.contentAlg,
            format: req.body.format,
            alg: req.body.alg
        };

        jose.JWE.createEncrypt( options, req.body.key )
            .update( req.body.plaintext )
            .final()
            .then( function( jweResult ) {
                console.log( "\nResponse  : ", JSON.stringify( jweResult, undefined, 4 ) );
                res.send( jweResult );
            } );
    };
}

module.exports = {
    getEncryptionHandler: getEncryptionHandler
};