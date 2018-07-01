const os = require( 'os' );
let interfaces = os.networkInterfaces();
let ip4Interfaces = [];

var exports = module.exports = {};

exports.getIp4Interfaces = function() {
    for ( let interfaceName in interfaces ) {
        let alias = 0;

        for ( let subInterface of interfaces[ interfaceName ] ) {
            if ( 'IPv4' !== subInterface.family || subInterface.internal !== false ) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                continue;
            }
            let webInterface = '';
            if ( alias >= 1 ) {
                // this single interface has multiple ipv4 addresses
                webInterface = interfaceName + ':' + alias + ' ' + subInterface.address;
                console.log( webInterface );
            } else {
                // this interface has only one ipv4 adress
                webInterface = interfaceName + ' ' + subInterface.address;
                console.log( webInterface );
            }
            ip4Interfaces.push( subInterface.address );
            ++alias;
        }
    }

    return ip4Interfaces;
};