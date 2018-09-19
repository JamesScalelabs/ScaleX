/*jslint node: true */
'use strict';
// set up ======================================================================
var express = require('express');
var app = express(); // create our app w/ express
//var database = require('./db/oracle_db'); // orawrap for oracle
var database = require('./db/mysql_db');
var config = require('./config/config'); // load the  config
var bodyParser = require('body-parser');
//var fileUpload=require('express-fileupload');
//var port = process.env.PORT || config.SERVER.PORT; // set the port
var port = 3000;
var environment = process.env.NODE_ENV || config.SERVER.ENVIRONMENT;
var server;
var logger = config.logger;
var admin_route = require('./routes/admin/admin_route');
var user_route= require('./routes/user/user_route');
var common_route = require('./routes/common/common_route');
var seller_route = require('./routes/seller/seller_route');
var manager_route = require('./routes/manager/manager_route');
var path = require('path');
var requestIp = require('request-ip');

process.env.UV_THREADPOOL_SIZE = config.ORACLE_ENV.UV_THREADPOOL_SIZE;
// configuration ===============================================================
// Remove winston's console logger in production mode.
/* istanbul ignore next */
if (logger.loggers.default.transports.length > 0) {
    if (logger.loggers.default.transports[0].name === 'console' && environment === 'production' && !config.LOG.CONSOLE_PRINT) {
        try {
            logger.remove(logger.transports.Console);
        } catch (err) {}
    }
}


global.appRoot = path.resolve(__dirname);
// Common middleware.
//app.use(require('./middleware/common_middleware'));
//app.use(express.static(path.join(__dirname, 'public'))); // set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
// app.use(bodyParser.json()); // parse application/json
 //app.use(fileUpload());
app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({limit:"50mb",extended:true,parameterLimit:50000}));
 

/**
 * Security Settings.
 */

app.disable('x-powered-by');
app.enable('trust proxy'); //Enable only when behind nginx.

app.set('title', config.APP_TITLE);
app.set('version', config.APP_VERSION);
app.set('port', port);
app.set('env', environment);

// you can override which attirbute the ip will be set on by
// passing in an options object with an attributeName
app.use(requestIp.mw({
    attributeName: 'sellerip'
}));

/* * Bug - Added For Testing Please remove Below Interceptor ***/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods","GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,username,apiname,Authorization");
  res.header("Access-Control-Expose-Headers", "Content-Disposition");
  next();
});

// routes for User Case Rest Api ======================================================================
app.use('/', admin_route);
app.use('/', user_route);
app.use('/',common_route);
app.use('/',seller_route);
app.use('/',manager_route);
//app.use('/',common_route);

// Initialize DB 
// Start the web server after successfull initialization of DB
try {
    database.initUserDB(function(e) {
        if (e) {
            throw e;
        } else {
                   startServer(); 
		
            }
    });
} catch (err) {
    logger.error("Error occured: " + err.stack);
    //Shutdown now
    //shutdown();
}
function startServer() {
    // listen (start app with node server.js) ======================================
    logger.info('SERVER - Starting process...', {
        title: app.get('title'),
        version: app.get('version'),
        port: app.get('port'),
        NODE_ENV: app.get('env'),
        pid: process.pid
    });
    server = app.listen(app.get('port'));
    server.timeout = config.SERVER.TIMEOUT; 
    logger.info("App listening on port " + port);
    
}
// If the Node process ends, close the orawrap connection & the Express server.
process.on('SIGINT', function() {
     logger.error("SIGINT Recived");
    //shutdown();
    process.exit(0);
});

/* istanbul ignore next */
process.on('SIGTERM', function() {
    logger.error("SIGTERM Recived");
    //shutdown();
});


process.on('uncaughtException', function(err) {
     logger.error("Error occured: " + err.stack);
   //shutdown();
});


/*function shutdown() {
    logger.info("Shutting down ");
    logger.info("Closing database pool ");
    database.terminateConnectionUser(function(err) {
         if (err) {
             logger.error('Error occurred while terminating node-oracledb connection pool: ' + err.stack);
             logger.info('Exiting process after error');
             database.terminateConnectionDashboard(function(err) {
                if (err) {
                 logger.error('Error occurred while terminating node-oracledb dashboard connection pool: ' + err.stack);
                 logger.info('Exiting process after error');
                 process.exit(0);
                } else {
                logger.info('node-oracledb connection pool terminated');
                logger.info('Exiting process');
                process.exit(0);
         }
     });
             //process.exit(0);
         } else {
            
            database.terminateConnectionDashboard(function(err) {
                if (err) {
                 logger.error('Error occurred while terminating node-oracledb dashboard connection pool: ' + err.stack);
                 logger.info('Exiting process after error');
                 process.exit(0);
                } else {
               
                logger.info('node-oracledb connection pool terminated');
                logger.info('Exiting process');
                process.exit(0);
         }
     });
        }
    });

}*/

