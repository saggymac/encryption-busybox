/*!
 * getKeys.js
 *
 * Express handlers for getting public keys and both key pairs
 *
 */
function getKeyPairHandler( keystore, includePrivateKeys ) {
    return function( req, res ) {
        keystore.toJSON( includePrivateKeys, sendResponse );

        function sendResponse( err, keys ){
            if ( err ){
                res.status(424).send( { keys:[], error: err.message });
            } else {
                res.send(  keys  );
            }
        }
    };
}

module.exports = getKeyPairHandler;