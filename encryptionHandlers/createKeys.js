/*!
 * createKeys.js
 *
 * Express handlers for creating key pairs or symetric encryption keys
 *
 */

function getKeyCreationHandler( keystore ) {
    return function( req, res ) {
        let size = req.body.size || 2048;
        let type = req.body.kty || "RSA";
        let props = {};
        if ( req.body.use ) props.use = req.body.use;
        keystore.generate( type, size, props, sendResponse );

        //Directly sending res.send causes scoping issues
        //having the keystore know to call the send method is tight coupling
        function sendResponse( keys ){
            res.send( keys);
        }

    };
}

module.exports = getKeyCreationHandler;