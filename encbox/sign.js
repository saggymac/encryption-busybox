/*!
 * sign.js
 *
 * Express handlers for signing a JSON Web Token
 *
 */
function getSigningHandler( jose ) {
    return function( req, res ) {
        if ( !req.body.signingKey ) {
            res.send( { message: "The Signing Key is missing" } );
        } else if ( !req.body.message ) {
            res.send( { message: "The Message to sign is missing" });
        } else {
            jose.JWK.asKey( req.body.signingKey )
            .then( function( signingKey ) {
                // {result} is a jose.JWK.Key
                let message = Buffer.from( req.body.message );

                jose.JWS
                    .createSign( { format: 'compact', alg: 'RS256' }, signingKey )
                    .update( message )
                    .final()
                    .then( function( jwsResponse ) {
                        // {result} is a JSON object -- JWS using the JSON General Serialization
                        res.send( jwsResponse );
                    }
                );
            });
        }
    };
}

module.exports = getSigningHandler;