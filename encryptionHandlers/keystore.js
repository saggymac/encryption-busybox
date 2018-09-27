/*!
 * index.js - encryptionHandlers library Entry Point
 *
 * This library wraps node-jose with handlers for use in ExpressJs APIs
 *
 */
const jose = require( 'node-jose' );
const redisDriver = require('redis');

const keystore = {
    generate: generate,
    toJSON: toJSON,
    initialize: initialize
};

const standaloneKeystore = jose.JWK.createKeyStore();
let connectionAttempts = 0;
let hasLocalhostRedisFailed = false;
let hasExternalRedisFailed = false;
let shouldOperateStandalone = false;
let logger = {};
let client = {};


function initialize( appLogger ){
    logger = appLogger;

    //If there is a REDIS or YEDIS instance available then use that as our keystore otherwise operate locally
    client = redisDriver.createClient( {host:'172.17.0.2'});
    client.on('ready', resetConnectionAttempts );
    client.on('error', handleUnCaughtConnectionError );
    return keystore;
}

function getAllKeysInSharedStorage( includePrivateKeys, callback ){
    if ( !client.ready || !client.connected ) callback( new Error('Shared Keystore unavailable'), null );
    else {
        client.hgetall( "encryptionBusyBox::keystore", processRedisKeys );    
    }
    function processRedisKeys(err, keys) {
        if ( err ) {
            callback( err, null );
        } else {
            let jwkKeySet = [];
            for( let index in keys) {
                let key = JSON.parse( keys[index] );
                jwkKeySet.push( key );
            }
            jose.JWK.asKeyStore(jwkKeySet).then( sendKeys );
        }

        function sendKeys( ks ){
            let allKeys = ks.toJSON( includePrivateKeys );
            logger.info( {
                message: {
                    operation: "GET ALL keys from REDIS",
                    error: err,
                    keyCount: allKeys.length
                }
            });
            callback( null, allKeys );    
        }
    }
}


function toJSON( includePrivateKeys, callback ) {
    if (shouldOperateStandalone) {
        callback( null, standaloneKeystore.toJSON( includePrivateKeys) );
    } else {
        getAllKeysInSharedStorage( includePrivateKeys, callback);
    }
}

function generate( type, size, props, callback ){
    if (shouldOperateStandalone ) ks = standaloneKeystore;
    else {
        if ( !client.ready || !client.connected ) {
            callback( new Error('Shared Keystore unavailable'), null );
            return;
        }
        ks = jose.JWK.createKeyStore();
    }
    ks.generate( type, size, props ).then( marshalKeys);

    function marshalKeys( keyPair ) {
        let results = {
            key: keyPair.toJSON( true ),
            algorithms: keyPair.algorithms()
        };
        if (shouldOperateStandalone) {
            callback( null, results );
        } else {
            client.hset( "encryptionBusyBox::keystore", results.key.kid, JSON.stringify( results.key ), returnKeyIfSuccessfullySaved);
        }

        function returnKeyIfSuccessfullySaved(err, reply){
            logger.info( {
                message: {
                    operation: "SAVE key to REDIS",
                    keyID: results.key.kid,
                    error: err,
                    reply: reply
                }
            });
            if ( err ) {
                callback( err, null );
            } else {
                callback( null, results );
            }
        }    
    }
}

function logConnectionStatus( level, msg, err ){
    logger[level]( {
        message: {
            operation: msg,
            connectionAttempts: connectionAttempts,
            hasLocalhostRedisFailed: hasLocalhostRedisFailed,
            hasExternalRedisFailed: hasExternalRedisFailed,
            shouldOperateStandalone: shouldOperateStandalone,
            clientDetails: {
                address: client.address,
                connected: client.connected,
                ready: client.ready,
                retry_totaltime: client.retry_totaltime,
                retry_delay: client.retry_delay,
                eventCount: client._eventsCount,
                server_info: client.server_info
            },
            err
        }
    });
}

function resetConnectionAttempts(){
    connectionAttempts = 0;
    logConnectionStatus( "info", "Successfully Connected to REDIS", null);
}

function handleUnCaughtConnectionError(err) {
    if ( ( err.code === "ECONNREFUSED" && err.syscall === "connect") || (err.code === "ENOTFOUND")  ){
        connectionAttempts++;
        if ( connectionAttempts >= 5 ){
            if ( !hasLocalhostRedisFailed ){
                hasLocalhostRedisFailed = true;
                connectionAttempts = 0;
                client.quit();
                client = redisDriver.createClient({ host: "redis"});
                client.on('ready', resetConnectionAttempts.bind(this));
                client.on('error', handleUnCaughtConnectionError );
                logConnectionStatus( "info", "Retrying with External REDIS Server", err);
            } else {
                hasExternalRedisFailed = true;
                shouldOperateStandalone = true;
                client.quit();
                client = { connected: false, ready: false };
                logConnectionStatus( "error", "Failed to Connect to External REDIS Server", err );
            }
        } else {
            logConnectionStatus( "info", "Retrying REDIS / YEDIS Connection", err );
        }
    } else {
        logConnectionStatus( "error", "General REDIS / YEDIS Error", err );
    }
}

module.exports = keystore;