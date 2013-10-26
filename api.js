var querystring = require('querystring');

function start(response, param) {
    console.log('dealing with request for ' + param);
    var parameters = querystring.parse(param);
    
    
    
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(parameters));
    response.end();
}

exports.start = start;