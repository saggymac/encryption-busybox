/*!
 * createKeys.js
 *
 * Express handlers for creating key pairs or symetric encryption keys
 *
 */

const { logRequest } = require( '../utilities/logRequest' );

function getKeyCreationHandler( client, keystore ) {
    return function( req, res ) {
        logRequest( req );

        let size = req.body.size || 2048;
        let type = req.body.kty || "RSA";
        let props = {};
        if ( req.body.kid ) props.kid = req.body.kid;
        if ( req.body.use ) props.use = req.body.use;

        keystore.generate( type, size, props ).then( function( keyPair ) {
            let results = {
                key: keyPair.toJSON( true ),
                algorithms: keyPair.algorithms()
            };
            console.log( "\nResponse  : ", JSON.stringify( results, undefined, 4 ) );

            if (client.connected) {
                client.hset( "encryptionBusyBox::keystore", results.key.kid, JSON.stringify( results.key ), function (err, reply){
                    console.log( "Create Key:: REDIS/YEDIS storage Error:: ", err);
                    console.log( "Create Key:: REDIS/YEDIS storage Reply::", reply);
                });
            }

            res.send( results );
        } );
    };
}

module.exports = {
    getKeyCreationHandler: getKeyCreationHandler
};
