/*!
 * getKeys.js
 *
 * Express handlers for getting public keys and both key pairs
 *
 */
function getKeyPairHandler( keystore, includePrivateKeys ) {
    return function( req, res ) {
        keystore.toJSON( includePrivateKeys, sendResponse );

        //Directly sending res.send causes scoping issues
        //having the keystore know to call the send method is tight coupling
        function sendResponse( keys ){
            res.send( keys);
        }
    };
}


module.exports = getKeyPairHandler;