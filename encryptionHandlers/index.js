/*!
 * index.js - encryptionHandlers library Entry Point
 *
 * This library wraps node-jose with handlers for use in ExpressJs APIs
 *
 */
const jose = require( 'node-jose' );
const redisDriver = require('redis');

//Storage Provider
const keystore = {
    local: jose.JWK.createKeyStore(),
    driver: redisDriver,
    shared: redisDriver.createClient()
};

//import the functions that create Express handlers
const { getKeyPairHandler, getAllKeysInSharedStorage } = require( './getKeyPairs' );
const { getKeyCreationHandler } = require( './createKeys' );
const { getDecryptionHandler } = require( './decrypt' );
const { getEncryptionHandler } = require( './encrypt' );
const { getSigningHandler } = require( './sign' );
const { getSignatureVerifyingHandler } = require( './verifySignature' );
const { getKeyDerivationHandler } = require( './deriveKey' );

const ONLY_PUBLIC_KEYS = false;
const BOTH_KEY_PAIRS = true;

function getExpressRouteHandlers( logger ){
    //If there is a REDIS or YEDIS instance available then load all of the keys
    keystore.shared.on('ready', function(){
        getAllKeysInSharedStorage( logger, keystore );
    });
    
    keystore.shared.on('error', function (err) {
        logger.info( {
            message: {
                operation: "General REDIS / YEDIS Error",
                host: keystore.shared.host,
                port: keystore.shared.port,
                error: err
            }
        });
    });

return {
        getPublicKeys: getKeyPairHandler( logger, keystore, ONLY_PUBLIC_KEYS ),
        getKeyPairs:   getKeyPairHandler( logger, keystore, BOTH_KEY_PAIRS ),
        createKeys: getKeyCreationHandler( logger, keystore ),
        decryptJWE: getDecryptionHandler( jose ),
        encryptJWE: getEncryptionHandler( jose ),
        signJWT: getSigningHandler( jose ),
        verifySignature: getSignatureVerifyingHandler( jose ),
        deriveKey: getKeyDerivationHandler( jose ),
    };
}

//Create the handlers and export them
module.exports.getExpressRouteHandlers = getExpressRouteHandlers;
