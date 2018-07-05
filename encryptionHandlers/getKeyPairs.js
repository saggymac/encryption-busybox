/*!
 * getKeys.js
 *
 * Express handlers for getting public keys and both key pairs
 *
 */

const { logRequest } = require( '../utilities/logRequest' );

function getKeyPairHandler( client, keystore, includePublicKeys ) {
    return function( req, res ) {
        logRequest( req );

        if (client.connected && client.ready ) {
            let localStorage = keystore.toJSON(true);
            client.HLEN('encryptionBusyBox::keystore', function processHlenResponse(err, redisKeyCount){
                console.log( "Get Keystore count:: REDIS/YEDIS storage Error:: ", err);
                console.log( "Get Keystore count:: REDIS/YEDIS storage Reply::", redisKeyCount);
                if ( localStorage.keys.length != redisKeyCount){
                    getAllKeysInSharedStorage( client, keystore, res, includePublicKeys);
                } else {
                    sendResponse( res, keystore, includePublicKeys );
                }
            });
        } else {
            sendResponse( res, keystore, includePublicKeys );
        }
    };
}


function getAllKeysInSharedStorage( client, keystore, res, includePublicKeys ){
    client.hgetall( "encryptionBusyBox::keystore", function (err, keys) {
        console.log( "Getting all Keys from REDIS ... ");
        if (err) console.log('REDIS/YEDIS: Error Getting All Keys : ', err);
        for( let index in keys) {
          console.log( "Key ID: ", index);
          keystore.add( keys[ index ] );
        }
        sendResponse( res, keystore, includePublicKeys );
    });    
}


function sendResponse( res, keystore, includePublicKeys ){
    if ( res ){
        console.log( "\nSending Response  : ", JSON.stringify( keystore.toJSON(), undefined, 4 ) );
        res.send( keystore.toJSON( includePublicKeys ) );    
    }
}

module.exports = {
    getKeyPairHandler: getKeyPairHandler,
    getAllKeysInSharedStorage: getAllKeysInSharedStorage
};