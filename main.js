



    const jose = require( 'node-jose' );

    //import the functions that create Express handlers
    const getKeyPairHandler  = require( './encryptionHandlers/getKeyPairs' );
    const getKeyCreationHandler = require( './encryptionHandlers/createKeys' );
    const getDecryptionHandler = require( './encryptionHandlers/decrypt' );
    const getEncryptionHandler = require( './encryptionHandlers/encrypt' );
    const getSigningHandler = require( './encryptionHandlers/sign' );
    const getSignatureVerifyingHandler = require( './encryptionHandlers/verifySignature' );
    const getKeyDerivationHandler = require( './encryptionHandlers/deriveKey' );
    const keystore = require( './encryptionHandlers/keystore');

    var logger = {};
    logFunc = function( msg ) {
        console.log( msg.message);
    }
    logger['error'] = logFunc;
    logger['info'] = logFunc;
    
    
    keystore.initialize( logger);
    
    const ONLY_PUBLIC_KEYS = false;
    const BOTH_KEY_PAIRS = true;

    var handlers = {};
    handlers['public-keys.get'] = getKeyPairHandler( keystore, ONLY_PUBLIC_KEYS);
    handlers['key-pairs.get'] = getKeyPairHandler( keystore, BOTH_KEY_PAIRS);
    handlers['key-pairs.post'] = getKeyCreationHandler( keystore);
    handlers['algorithms/hkdf.post'] = getKeyDerivationHandler( jose);
    handlers['plaintext.post'] = getDecryptionHandler( jose);
    handlers['ciphertext.post'] = getEncryptionHandler( jose);
    handlers['signature.post'] = getSigningHandler( jose);
    handlers['verification.post'] = getSignatureVerifyingHandler( jose);



// documentation on how HTTP invokes pass params to the function ...
// https://console.bluemix.net/docs/openwhisk/openwhisk_webactions.html#openwhisk_webactions
// 

function actionMain(params) {

    // This is annoying ... the way params are passed in is different depending on how the action
    // is invoked.  HTTP params/properties are passed in properties named like '__ow_*'.  But if
    // the action invocation is otherwise, they are just named params.

    var key;
    var req = {};

    if (typeof params.__ow_method != 'undefined') {
        key = (params.__ow_path + "." + params.__ow_method).toLowerCase();
        req.rawBody = params.__ow_body;  
    }
    else {
        key = (params.name + "." + params.method).toLowerCase();
        req.rawBody = params.body;
    }

    if (typeof req.rawBody != 'undefined') {
        req.body = JSON.parse( req.rawBody);
    }
    


    // Building up an express resposne object because our handlers were
    // originially written for that.
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
  
    console.log( "getting handler: " + key);
    let handler = handlers[key];
    if ( typeof handler != 'undefined' ) {
        let result = handler( req, res);
        return { statusCode: res.httpStatus, 
            headers: { 'Content-Type': res.contentType },
            body: res.response
        };
    }
    else {
        return { statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: {'error': "no handler for " + key}
        };
    }

}

exports.main = actionMain;