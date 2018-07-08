/*!
 * getKeys.js
 *
 * Express handlers for getting public keys and both key pairs
 *
 */
function getKeyPairHandler( keystore, includePrivateKeys ) {
    return function( req, res ) {
        keystore.toJSON( includePrivateKeys, res );
    };
}


module.exports = getKeyPairHandler;