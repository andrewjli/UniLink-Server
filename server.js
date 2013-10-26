var http = require('http');
var url = require('url');
var api = require('./api');


// request format: url.com/get?inst=xxxx&course=yyyy&year=0000&start=0&sort=n

function start() {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        var param = url.parse(request.url).search;
        console.log('request received for ' + pathname);

        if(pathname == '/api') {
            api.start(response, param);
        } else {
            // 404
        }
    }
    
    http.createServer(onRequest).listen(process.env.PORT, process.env.IP);
    console.log('server started');
}

exports.start = start;