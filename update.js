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
var twt = require('./twt');

/* Twitter authentication tokens */
var twit = new twitter(twt.twitter);

/**
 * Requests mentions data from Twitter
 * 
 * @param response  the HTTP response object provided by the HTTP server
 */
function start(response) {
    console.log('dealing with request for /update');

    getLastID(response);
}

function getLastID(response) {
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
    connection.query('SELECT id FROM lastid', function(err, results) {
        if(err) {
            console.log('ERROR: ' + err);
        }
        console.log(results);
        var lastid = results[0].id;
        getTweets(response, lastid);
    });
    //console.log('entry added');
    connection.end();
    //console.log('connection closed');
}

function getTweets(response, lastid) {
    twit.get(
        '/statuses/mentions_timeline',
        {
            count : 20,
            since_id : lastid,
            trim_user : true,
            contributor_details : false,
            include_entities : false
        },
        
        function logResponse(error, data, respo) {
            if(error)
                console.log(error);
            
            if(data !== null) {
                var add = [];
                var remove = [];
                for(var i = 0; i < data.length; i++) {
                    var userid = parseInt(data[i].user.id_str, 10);
                    
                    if(data[i].text.substr(12) == 'remove') {
                        remove.push(userid);
                    } else {
                        var array = data[i].text.substr(12).split(' ');
                        
                        var temp = {
                            id : userid,
                            institute : array[0],
                            course : array[1],
                            expiry : array[2]
                        };
                        add.push(temp);
                    }
                }
                
                var last_id = parseInt(data[0].id_str, 10);
                
                writeToDB(response, add, remove, last_id);
            } else {
                response.writeHead(200, { 'Content-Type': 'text/plain' });
                response.write('Done');
                response.end();
            }
        }
    );
}

function writeToDB(response, add, remove, last_id) {
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
    if(add.length !== 0) {
        for(var i = 0; i < add.length; i++) {
            console.log('Adding ' + add[i].id);
            connection.query('INSERT INTO users VALUES (?, ?, ?, ?)', [add[i].id, add[i].institute, add[i].course, add[i].expiry], function(err, results) {
                if(err) {
                    console.log('ERROR: ' + err);
                }
            });
        }
    }
    console.log(remove);
    if(remove.length !== 0) {
        for(var j = 0; j < remove.length; j++) {
            console.log('Removing j='+j+': ' + remove[j]);
            connection.query('DELETE FROM users WHERE id=?', [remove[j]], function(err, results) {
                if(err) {
                    console.log('ERROR: ' + err);
                }
            });
        }
    }
    connection.query('UPDATE lastid SET id=? WHERE 1=1', [last_id], function(err, results) {
        if(err) {
            console.log('ERROR: ' + err);
        }
    });
    //console.log('entry added');
    connection.end();
    //console.log('connection closed');
    
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write('Done');
    response.end();
}

/* Make method available to other modules */
exports.start = start;