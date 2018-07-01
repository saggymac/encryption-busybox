/*!
 * index.js - encryptionHandlers library Entry Point
 *
 * This library wraps node-jose with handlers for use in ExpressJs APIs
 *
 */
const jose = require( 'node-jose' );
const keystore = jose.JWK.createKeyStore();

//import the functions that create Express handlers
const { getKeyPairHandler } = require( './getKeyPairs' );
const { getKeyCreationHandler } = require( './createKeys' );
const { getDecryptionHandler } = require( './decrypt' );
const { getEncryptionHandler } = require( './encrypt' );
const { getSigningHandler } = require( './sign' );
const { getSignatureVerifyingHandler } = require( './verifySignature' );
const { getKeyDerivationHandler } = require( './deriveKey' );

const publicKeys = false;
const keyPairs = true;

//Create the handlers and export them
module.exports = {
    getPublicKeys: getKeyPairHandler( keystore, publicKeys ),
    getKeyPairs: getKeyPairHandler( keystore, keyPairs ),
    createKeys: getKeyCreationHandler( keystore ),
    decryptJWE: getDecryptionHandler( jose ),
    encryptJWE: getEncryptionHandler( jose ),
    signJWT: getSigningHandler( jose ),
    verifySignature: getSignatureVerifyingHandler( jose ),
    deriveKey: getKeyDerivationHandler( jose )
};