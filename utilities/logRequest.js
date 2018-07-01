exports.logRequest = function( req ) {
    let requestDetails = {
        protocol: req.protocol,
        host: req.hostname,
        method: req.method,
        path: req.path,
        paramaters: req.params,
        headers: req.headers,
        query: req.query,
        body: req.body,
        cookies: req.cookies,
        ip: req.ip
    };

    console.log( "Request Received : ", JSON.stringify( requestDetails, undefined, 4 ) );
};