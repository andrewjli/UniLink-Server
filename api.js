/**
 * This module handles a request for data by
 * checking the MySQL database with the given
 * parameters and returns the data
 * 
 * @author  Andrew Li
 * @version 1.0
 */

/* Required modules */
var querystring = require('querystring');
//var db = require('./db');
var mysql   = require('mysql');

function start(response, param) {
    console.log('dealing with request for ' + param);
    // request format: institute=uni&course=module&year=year&filter=n
    var parameters = querystring.parse(param.substr(1));
    
    if(parameters.filter == 'n')
        parameters.filter = '%';
    if(parameters.year == 'n')
        parameters.year = '%';
    if(parameters.course == 'n')
        parameters.course = '%';
    
    var connection = mysql.createConnection({
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
    console.log(parameters);
    connection.query('SELECT id FROM users WHERE institute LIKE ? AND course LIKE ? AND expiry LIKE ?', [parameters.institute, parameters.course, parameters.year], function(err, results) {
        if(err) {
            console.log('ERROR: ' + err);
        }
        console.log(results);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify(results));
        response.end();
    });
    //console.log('entry added');
    connection.end();
    //console.log('connection closed');
}

/* Make method available to other modules */
exports.start = start;