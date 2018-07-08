/*!
 * index.js - encryptionHandlers library Entry Point
 *
 * This library wraps node-jose with handlers for use in ExpressJs APIs
 *
 */
const jose = require( 'node-jose' );

//import the functions that create Express handlers
const getKeyPairHandler  = require( './getKeyPairs' );
const getKeyCreationHandler = require( './createKeys' );
const getDecryptionHandler = require( './decrypt' );
const getEncryptionHandler = require( './encrypt' );
const getSigningHandler = require( './sign' );
const getSignatureVerifyingHandler = require( './verifySignature' );
const getKeyDerivationHandler = require( './deriveKey' );
const keystore = require( './keystore');

const ONLY_PUBLIC_KEYS = false;
const BOTH_KEY_PAIRS = true;

function getExpressRouteHandlers( logger ){
    
    keystore.initialize( logger );
    
    return {
        getPublicKeys: getKeyPairHandler( keystore, ONLY_PUBLIC_KEYS ),
        getKeyPairs:   getKeyPairHandler( keystore, BOTH_KEY_PAIRS ),
        createKeys: getKeyCreationHandler( keystore ),
        decryptJWE: getDecryptionHandler( jose ),
        encryptJWE: getEncryptionHandler( jose ),
        signJWT: getSigningHandler( jose ),
        verifySignature: getSignatureVerifyingHandler( jose ),
        deriveKey: getKeyDerivationHandler( jose ),
    };
}

//Create the handlers and export them
module.exports = getExpressRouteHandlers;