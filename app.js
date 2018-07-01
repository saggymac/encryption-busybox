/*!
 * app.js - encryptionBusybox
 *
 * This app starts an Express API server to expose the node-jose library methods as APIs
 *
 */

const express = require( 'express' );
const os = require( 'os' );
//const opn = require('opn');
const bodyParser = require( 'body-parser' );
const app = express();

const { whereAmI } = require( './utilities/whereAmI' );
const { getPublicKeys, getKeyPairs, createKeys, decryptJWE, encryptJWE, signJWT, verifySignature, deriveKey } = require( './encryptionHandlers' );

// Setup Express Middleware handlers
app.use( bodyParser.json() );
app.use( express.static( 'static' ) );

// Setup API paths
app.get( '/whereAmI', whereAmI );
app.get( '/encryption/public-keys', getPublicKeys );
app.get( '/encryption/key-pairs', getKeyPairs );
app.post( '/encryption/key-pairs', createKeys );
app.post( '/algorithms/hkdf', deriveKey );
app.post( '/plaintext', decryptJWE );
app.post( '/ciphertext', encryptJWE );
app.post( '/signature', signJWT );
app.post( '/verification', verifySignature );

// Start the server and listen for requests
app.listen( 3000 );

// show where the web interface is located in the default browser
//opn('http://localhost:3000/whereAmI');