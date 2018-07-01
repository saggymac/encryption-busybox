/*!
 * getKeys.js
 *
 * Express handlers for getting public keys and both key pairs
 *
 */

const { logRequest } = require( '../utilities/logRequest' );

function getKeyPairHandler( keystore, includePublicKeys ) {
    return function( req, res ) {
        logRequest( req );
        console.log( "\nResponse  : ", JSON.stringify( keystore.toJSON(), undefined, 4 ) );
        res.send( keystore.toJSON( includePublicKeys ) );
    };
}

module.exports = {
    getKeyPairHandler: getKeyPairHandler
};