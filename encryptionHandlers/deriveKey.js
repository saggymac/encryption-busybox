/*!
 * deriveKey.js
 *
 * Express handlers for deriving an encryption key
 *
 */

const { logRequest } = require( '../utilities/logRequest' );

function getKeyDerivationHandler( jose ) {
    return function( req, res ) {
        logRequest( req );

        //Guard Conditions
        if ( !req.body.algorithm ) {
            let results = {
                "message": "No algorithm specified"
            };
            console.log( "\nResponse  : ", JSON.stringify( results, undefined, 4 ) );
            res.send( results );
            return;
        }
        if ( !req.body.inputKeyMaterial ) {
            let results = {
                "message": "No Input Key material specified"
            };
            console.log( "\nResponse  : ", JSON.stringify( results, undefined, 4 ) );
            res.send( results );
            return;
        }
        if ( !req.body.length ) {
            let results = {
                "message": "No Key material length specified"
            };
            console.log( "\nResponse  : ", JSON.stringify( results, undefined, 4 ) );
            res.send( results );
            return;
        }

        let options = {
            length: req.body.length
        };
        let ikm = new Buffer( req.body.inputKeyMaterial, "hex" );
        if ( req.body.salt ) {
            options.salt = new Buffer( req.body.salt, "hex" );
        }
        if ( req.body.info ) {
            options.info = new Buffer( req.body.info, "hex" );
        }

        jose.JWA.derive( req.body.algorithm, ikm, options )
            .then( function( outputKeyMaterial ) {
                let results = {
                    outputKeyMaterial: outputKeyMaterial.toString( "hex" )
                };
                console.log( "\nResponse  : ", JSON.stringify( results, undefined, 4 ) );
                res.send( results );
            } );
    };
}

module.exports = {
    getKeyDerivationHandler: getKeyDerivationHandler
};