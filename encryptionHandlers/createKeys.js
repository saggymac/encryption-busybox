/*!
 * createKeys.js
 *
 * Express handlers for creating key pairs or symetric encryption keys
 *
 */

function getKeyCreationHandler( logger, keystore ) {
    return function( req, res ) {

        let size = req.body.size || 2048;
        let type = req.body.kty || "RSA";
        let props = {};
        if ( req.body.use ) props.use = req.body.use;

        keystore.local.generate( type, size, props ).then( function( keyPair ) {
            let results = {
                key: keyPair.toJSON( true ),
                algorithms: keyPair.algorithms()
            };
            //console.log( "\nResponse  : ", JSON.stringify( results, undefined, 4 ) );

            if (keystore.shared.connected) {
                keystore.shared.hset( "encryptionBusyBox::keystore", results.key.kid, JSON.stringify( results.key ), function (err, reply){
                    logger.info( {
                        message: {
                            operation: "SAVE key to REDIS",
                            keyID: results.key.kid,
                            error: err,
                            reply: reply
                        }
                    });
                });
            }
            res.send( results );
        } );
    };
}

module.exports = {
    getKeyCreationHandler: getKeyCreationHandler
};
