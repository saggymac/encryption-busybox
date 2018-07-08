/*!
 * app.js - encryptionBusybox
 *
 * This app starts an Express API server to expose the node-jose library methods as APIs
 *
 */

const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const app = express();

const winston = require('winston');
const expressWinston = require('express-winston');
expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('_headers');
expressWinston.responseWhitelist.push('body');

const winstonTransport = new winston.transports.Console({
    json: true,
    stringify: (obj) => {
        let timestamp = new Date();
        logLine = obj;
        logLine.localeTime = timestamp.toLocaleString();
        logLine.ISOTime = timestamp.toISOString();
        return JSON.stringify( logLine );
    },
    level: 'debug',
    colorize: true
  });
const logger = new winston.Logger ({ transports: [ winstonTransport ] });


const { whereAmI } = require( './utilities/whereAmI' );
let routeHandlers = require( './encryptionHandlers' );
routeHandlers = routeHandlers(logger);

// Setup Express Middleware handlers
app.use( bodyParser.json() );
app.use( express.static( 'static' ) );

app.use(expressWinston.logger({
    transports: [
      winstonTransport
    ],
    meta: true
}));

// Setup API paths
app.get( '/whereAmI', whereAmI );
app.get( '/encryption/public-keys', routeHandlers.getPublicKeys );
app.get( '/encryption/key-pairs', routeHandlers.getKeyPairs );
app.post( '/encryption/key-pairs', routeHandlers.createKeys );
app.post( '/algorithms/hkdf', routeHandlers.deriveKey );
app.post( '/plaintext', routeHandlers.decryptJWE );
app.post( '/ciphertext', routeHandlers.encryptJWE );
app.post( '/signature', routeHandlers.signJWT );
app.post( '/verification', routeHandlers.verifySignature );


app.use(expressWinston.errorLogger({
    transports: [
        winstonTransport
    ],
    meta: true
}));

// Start the server and listen for requests
app.listen( 3000 );