/*!
 * verifySignature.js
 *
 * Express handlers for verifying JWT Signature
 *
 */
function getSignatureVerifyingHandler( jose ) {
    return function( req, res ) {
        if ( !req.body.publicKey ) {
            res.send( { message: "The signer's public key is missing." } );
        } else if ( !req.body.message ) {
            res.send( { message: "The Signed Message is missing"} );
        } else {
            try {
                jose.JWK.asKey( req.body.publicKey )
                    .then( function( publicKey ) {
                        jose.JWS.createVerify( publicKey )
                            .verify( req.body.message )
                            .then( function( result ) {
                                r = result;
                                r.payload = result.payload.toString( 'ascii' );
                                r.signature = result.signature.toString( 'hex' );
                                res.send( r );
                            } 
                        );
                    } 
                );
            } catch ( err ) {
                res.send( { message: "Message Signature Verification Failed" } );
            }    
        }
    };
}

module.exports = {
    getSignatureVerifyingHandler: getSignatureVerifyingHandler
};