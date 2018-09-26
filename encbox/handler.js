"use strict"


// This is a rewite of app.js to work with an OpenFAAS watchdog.
//
// The way watchdog works is that is passes the body of a function invocation through
// STDIN. (https://github.com/openfaas/faas/tree/master/watchdog)
// And HTTP headers are passed through the environment.
// So we have to rewrap everything differently than we did with node/express.
//

const getStdin = require( 'get-stdin');
const qs = require('qs');

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

var logger = {};

logger.info = function( msg ) {
    console.log( msg.message);
}

logger.error = function( msg ) {
    console.log( msg.message);
}


keystore.initialize( logger);

const ONLY_PUBLIC_KEYS = false;
const BOTH_KEY_PAIRS = true;






var handlers = {};
handlers['/encryption/public-keys.get'] = getKeyPairHandler( keystore, ONLY_PUBLIC_KEYS);
handlers['/encryption/key-pairs.get'] = getKeyPairHandler( keystore, BOTH_KEY_PAIRS);
handlers['/encryption/key-pairs.post'] = getKeyCreationHandler( keystore);
handlers['/algorithms/hkdf.post'] = getKeyDerivationHandler( jose);
handlers['/plaintext.post'] = getDecryptionHandler( jose);
handlers['/ciphertext.post'] = getEncryptionHandler( jose);
handlers['/signature.post'] = getSigningHandler( jose);
handlers['/verification.post'] = getSignatureVerifyingHandler( jose);






module.exports = (event, context) => {


    let key = (event.path + "." + event.method).toLowerCase();
    let handler = handlers[key];

    
    
    // Trying to matchup key methods from express.js/response
    // https://expressjs.com/en/4x/api.html#res
    //
    var res = {
        
        contentType: 'application/json',
        type : function( t ) {
            this.contentType = t;
            return this;
        },
    
        httpStatus: 200,
        status : function( code ) {
            this.httpStatus = code;
            return this;
        },
    
        // supposed to be either a Buffer, a String, or an Array
        response: "",
        send : function( body ) {
            this.response = body;
            return this;
        }
    
    }; 
    
    let result = handler( event, res);


    context
        .status( res.httpStatus)
        .succeed( res.response);


}
