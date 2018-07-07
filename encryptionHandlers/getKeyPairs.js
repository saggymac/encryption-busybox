/*!
 * getKeys.js
 *
 * Express handlers for getting public keys and both key pairs
 *
 */
function getKeyPairHandler( logger, keystore, includePrivateKeys ) {
    return function( req, res ) {
        if (keystore.shared.connected && keystore.shared.ready ) {
            let localStorage = keystore.local.toJSON(true);
            keystore.shared.HLEN('encryptionBusyBox::keystore', function processHlenResponse(err, redisKeyCount){
                logger.info( {
                    message: {
                        operation: "GET REDIS Key Count",
                        error: err,
                        keyCount: redisKeyCount
                    }
                });
                if ( localStorage.keys.length != redisKeyCount){
                    getAllKeysInSharedStorage( logger, keystore, includePrivateKeys, res );
                } else {
                    sendResponse( res, keystore, includePrivateKeys );
                }
            });
        } else {
            sendResponse( res, keystore, includePrivateKeys );
        }
    };
}


function getAllKeysInSharedStorage( logger, keystore, includePrivateKeys, res ){
    //Parameters are in the order of how optional they are
    keystore.shared.hgetall( "encryptionBusyBox::keystore", function (err, keys) {
        let allKeys = [];

        for( let index in keys) {
            let key = JSON.parse( keys[index] );
            keystore.local.add( key );
            allKeys.push( key );
        }

        logger.info( {
            message: {
                operation: "GET ALL keys from REDIS",
                error: err,
                keys: allKeys
            }
        });

        sendResponse(  res, keystore, includePrivateKeys );
    });    
}

function sendResponse( res, keystore, includePrivateKeys ){
    if ( res ) res.send( keystore.local.toJSON( includePrivateKeys ) );    
}

module.exports = {
    getKeyPairHandler: getKeyPairHandler,
    getAllKeysInSharedStorage: getAllKeysInSharedStorage
};