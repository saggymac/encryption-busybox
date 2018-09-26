/*!
 * deriveKey.js
 *
 * Express handlers for deriving an encryption key
 *
 */
function getKeyDerivationHandler( jose ) {
    return function( req, res ) {
        //Guard Conditions
        if ( !req.body.algorithm ) {
            res.send( { "message": "No algorithm specified" } );
        } else if ( !req.body.inputKeyMaterial ) {
            res.send( { "message": "No Input Key material specified" } );
        } else if ( !req.body.length ) {
            res.send( { "message": "No Key material length specified" } );
        } else {
            let options = { length: req.body.length };
            let ikm = new Buffer( req.body.inputKeyMaterial, "hex" );
            if ( req.body.salt ) { options.salt = new Buffer( req.body.salt, "hex" ); }
            if ( req.body.info ) { options.info = new Buffer( req.body.info, "hex" ); }
    
            jose.JWA.derive( req.body.algorithm, ikm, options )
                .then( function( outputKeyMaterial ) {
                    let results = { outputKeyMaterial: outputKeyMaterial.toString( "hex" ) };
                    res.send( results );
                }
            );
        }
    };
}

module.exports = getKeyDerivationHandler;