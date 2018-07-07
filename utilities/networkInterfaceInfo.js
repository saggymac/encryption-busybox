const os = require( 'os' );
let interfaces = os.networkInterfaces();
let ip4Interfaces = [];

var exports = module.exports = {};

exports.getIp4Interfaces = function() {
    for ( let interfaceName in interfaces ) {
        for ( let subInterface of interfaces[ interfaceName ] ) {
            if ( 'IPv4' !== subInterface.family || subInterface.internal !== false ) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                continue;
            }
            ip4Interfaces.push( subInterface.address );
        }
    }
    return ip4Interfaces;
};