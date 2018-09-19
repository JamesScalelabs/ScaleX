/*jslint node: true */
'use strict';
var config = require('../config/config');
 var mysqldb = require('mysql'); // orawrap for oracle
var logger = config.logger;
var mysql_db = {};
var pool;
var poolUser;
var poolDashboard;
var async = require('async');
//var snmp = require('../lib/snmp');
//var snmpConfig = require('../config/snmpConfig');
// return all CLOBs as Strings
mysqldb.fetchAsString = [ mysqldb.CLOB ];
///////////////////////////
// CREATE CONNECTION POOL FOR USER DB//
///////////////////////////
mysql_db.initUserDB = function(callback) {
    logger.info("initializing oracle db pool for UserManagement...");
    var con = mysqldb.createConnection({
  	host: "scalelabsdevdb.cababjt98r5d.us-east-1.rds.amazonaws.com",
  	user: "scaleLabsDevDB",
  	password: "scaleLabsDevDB",
	database : 'my_db'
    });
 con.connect(function(err) {
  if (err) 
  {
	logger.info("err is "+err);
	throw err;
  }
  logger.info("No Err");
  var sql = "select 'tesst' from dual";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted, ID: " );
  });
});
callback();
};
   /* mysqldb.createPool(config.USER_ORACLE, function(err, pool) {
        if (err) {
            //logger.error("Failed to create oracle db pool..." + pool.poolAlias);
            logger.error("Failed to create oracle db pool for User Management...");           
		logger.info("initializing oracle db pool for UserManagement failed...",err);
            
        } else {
            logger.info("initializing oracle db pool for UserManagement Completed...");
            callback();
        }
    });*/
//////////////////////////
// TERMINATING POOL     //
//////////////////////////
/*mysql_db.terminateConnectionUser = function(callback) {
    logger.info("Terminating oracle db pool for User Mangement...");
    poolUser = mysqldb.getPool(config.USER_ORACLE.poolAlias);
    poolUser.terminate(function(err) {
        if (err) {
            logger.error("Failed to Terminating oracle db pool User Mangement......" + poolUser.poolAlias);
            callback(err);
        } else {
            callback();
        }
    });
};*/

//////////////////////////////////////////
// GET A CONNECTION FOR USER MANAGEMENT //
/////////////////////////////////////////
/*mysql_db.doConnectUser = function(getConnectionCb) {
    var maxRetries = 3;
    pool = mysqldb.getPool(config.USER_ORACLE.poolAlias);
    try {
        console.log(pool._logStats());
    } catch (err) {}
    async.retry(maxRetries, function(cb) {
        pool.getConnection(function(err, conn) {
            if (err) {
                logger.error("Failed to create connection...");
                return;
            }
            conn.execute('select 1 from dual', function(err, result) {
                if (err) {
                    logger.error("Invalid Connection...");
                    conn.release(function() {
                        cb(err);
                    });
                } else {
                    cb(null, conn);
                }
            });
        });
    }, function(err, conn) {
        if (err) {
            getConnectionCb(err);
        } else {
            getConnectionCb(null, conn);
        }
    });
};*/
/////////////
// EXECUTE //
/////////////
/*mysql_db.executeSql = function(connection, options, callback) {
    if (!options.bindParams) {
        options.bindParams = {};
    }
    if (!options.opts) {
        options.opts = {};
    }
    connection.execute(options.sql, options.bindParams, options.opts, function(err, result) {
        logger.info("Executing sql: " + options.sql + " , bind params: " + JSON.stringify(options.bindParams) + " , options: " + JSON.stringify(options.opts));
        // Something went wrong - handle the data and release the connection
        if (err) {
            logger.info("ERROR: Unable to execute the SQL: ", err);
            return callback(err);
        }
        // Return the result to the request initiator
        // logger.info("INFO: Result from Database: ", result)
        return callback(err, result);
    });
};
////////////
// COMMIT //
////////////
mysql_db.doCommit = function(connection, callback) {
    connection.commit(function(err) {
        if (err) {
            logger.info("ERROR: Unable to COMMIT transaction: ", err);
        }
        return callback(err, connection);
    });
};
//////////////
// ROLLBACK //
//////////////
mysql_db.doRollback = function(connection, callback) {
    connection.rollback(function(err) {
        if (err) {
            logger.info("ERROR: Unable to ROLLBACK transaction: ", err);
        }
        return callback(err, connection);
    });
};
//////////////////////////
// RELEASE A CONNECTION //
//////////////////////////
mysql_db.doRelease = function(connection, callback) {
    if (connection) {
        connection.release(function(err) {
            if (err) {
                logger.info("ERROR: Unable to RELEASE the connection: ", err);
            }
            return callback(err);
        });
 } else {
    return callback();
 }
};*/
module.exports = mysql_db;
