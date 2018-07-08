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
        keystore.generate( type, size, props, res );
    };
}

module.exports = getKeyCreationHandler;