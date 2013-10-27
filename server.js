/**
 * This module creates a server which listens and
 * parses the request URL of any request and routes it
 * 
 * @author  Andrew Li
 * @version 1.0
 */

/* Required modules */
var http = require('http');
var url = require('url');
var api = require('./api');
var update = require('./update');

/**
 * Starts a server that listens on the specified port and IP address
 * It takes any request it receives and passes it on to the router
 */
function start() {
    
    /** 
     * Creates a listener that upon receiving request, parses the
     * URL and saves path and parameters and pass it to the router
     * 
     * @param request   the URL requested by the received request
     * @param response  the response object created by the server
     */
    function onRequest(request, response) {
        /* Parse URL */
        var pathname = url.parse(request.url).pathname;
        var param = url.parse(request.url).search;
        console.log('request received for ' + pathname);

        /* Different handlers for different URLs */
        if(pathname == '/api') {
            api.start(response, param);
        } if(pathname == '/update') {
            update.start(response);
        }
        else {
            // 404
        }
    }
    
    /* If you use this on a regular server, comment out the second line
     * If you use this on Cloud9, comment out the first line
     * Do not leave both lines uncommented.
     */
    //http.createServer(onRequest).listen(4654, "127.0.0.1");
    http.createServer(onRequest).listen(process.env.PORT, process.env.IP);
    console.log('server started');
}

/* Make method available to other modules */
exports.start = start;