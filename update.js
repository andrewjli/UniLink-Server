/**
 * This module checks for mentions (registrations)
 * on the Twitter account and then stores them in
 * the MySQL database
 * 
 * @author  Andrew Li
 * @version 1.0
 */

/* Required modules */
var twitter = require('mtwitter');
//var db = require('./db');
var mysql = require('mysql');

/* Twitter authentication tokens */
var twit = new twitter({
  consumer_key: 'CEkvckby49gOKfi1hM8Xhw',
  consumer_secret: '4azgyyYHwTxyMYg6PsBUni7LgBa09ymGoo2F3EoZWqU',
  access_token_key: '2157036348-VgUx0FKeLLYM9PPgkmJ8Aw8UmJqvCVzHRmgg2La',
  access_token_secret: '3fDraQhhpDURs95axnmphip3nE2VrHuaM5AV2KWIFSWjs'
});

/**
 * Requests mentions data from Twitter
 * 
 * @param response  the HTTP response object provided by the HTTP server
 */
function start(response) {
    console.log('dealing with request for /update');
    
    twit.get(
        '/statuses/mentions_timeline',
        {count: 1},
        
        function logResponse(error, data, respo) {
            console.log('Error? ', error);
            
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify(data));
            response.write(JSON.stringify(respo));
            response.end('');
        }
    );
        
    /*var connection = mysql.createConnection({
        host     : 'platinumdis.co',
        port     : '3306',
        user     : 'unilink-user',
        password : 'Password2',
    });
    
    connection.connect(function(err) {
        if(err) {
            console.log('ERROR: ' + err.code); // 'ECONNREFUSED'
            console.log('Fatal error: ' + err.fatal); // true
        }
    });
    //console.log('connection successful');
    connection.query('USE unilink', function(err, results) {
        if(err) {
            console.log('ERROR: ' + err.code); // 'ER_BAD_DB_ERROR'
        }
    });
    //console.log('database switched');
    connection.query('INSERT INTO users VALUES (?, ?, ?, ?)', [id, institute, course, expiry], function(err, results) {
        if(err) {
            console.log('ERROR: ' + err);
        }
    });
    //console.log('entry added');
    connection.end();
    //console.log('connection closed');
    
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write('Ohai');
    response.end();*/
}

/* Make method available to other modules */
exports.start = start;