/*!
 * index.js - encryptionHandlers library Entry Point
 *
 * This library wraps node-jose with handlers for use in ExpressJs APIs
 *
 */
const jose = require( 'node-jose' );
const keystore = jose.JWK.createKeyStore();

//Shared Storage Provider
const redis = require('redis');
const client = redis.createClient();

//import the functions that create Express handlers
const { getKeyPairHandler, getAllKeysInSharedStorage } = require( './getKeyPairs' );
const { getKeyCreationHandler } = require( './createKeys' );
const { getDecryptionHandler } = require( './decrypt' );
const { getEncryptionHandler } = require( './encrypt' );
const { getSigningHandler } = require( './sign' );
const { getSignatureVerifyingHandler } = require( './verifySignature' );
const { getKeyDerivationHandler } = require( './deriveKey' );

const publicKeys = false;
const keyPairs = true;


//If there is a REDIS or YEDIS instance available then load all of the keys
client.on('ready', function(){
    getAllKeysInSharedStorage( client, keystore );
});

client.on('error', function (err) {
    console.log('REDIS/YEDIS:: error event - ' + client.host + ':' + client.port + ' - ' + err);
});


//Create the handlers and export them
module.exports = {
    getPublicKeys: getKeyPairHandler( client, keystore, publicKeys ),
    getKeyPairs: getKeyPairHandler( client, keystore, keyPairs ),
    createKeys: getKeyCreationHandler( client, keystore ),
    decryptJWE: getDecryptionHandler( jose ),
    encryptJWE: getEncryptionHandler( jose ),
    signJWT: getSigningHandler( jose ),
    verifySignature: getSignatureVerifyingHandler( jose ),
    deriveKey: getKeyDerivationHandler( jose )
};
