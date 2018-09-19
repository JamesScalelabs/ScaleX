/*jslint node: true */
"use strict";
var winston = require('winston');
var moment = require('moment');
var path = require('path');
var config = {};
config.USER_ORACLE = {
    poolAlias: "scaleLabsPool1", //Name Of The Oracle Pool
    user: "scaleLabsDevDB",  //Oracle user name
    password: "scaleLabsDevDB", // Oracle user password
    connectString: "scalelabsdevdb", // Oralce connection string (SID)
    poolMax: 10,
    poolMin: 1,
    poolIncrement: 1,
    poolTimeout: 1,
    _enableStats: false
};

/**
 * Basic App Configuration.
 */
config.APP_STARTUP_FILE = 'server.js'; // start-up file, Don't change this configuration
config.SERVER = {
    PORT:3001, // Port that application server will run on. If this is changed, the Passenger command's --port parameter has to match this.
    MIN_INSTANCES: 3, // Number of clusters the app will have. This should be (no. of CPU cores - 1), and the Passenger command's --min-instances parameter has to match this.
    MAX_POOL_SIZE: 3, // Maximum number of instances that will be maintained in a static pool, and the Passenger command's --max-pool-size parameter has to match this.
    FRIENDLY_ERROR_PAGES: false, // Set to `true` to show Passenger's friendly error page, which contains a lot of information that can help in debugging.
    ENVIRONMENT: 'production',
    TIMEOUT: 0
};

config.RESTAPIS = {
    MAIL_REPORT: "/v1/api/mailReport"
};

config.MAIL = {
    SERVER_AUTH: false, // SMTP authentication required? Set to `false` if you're using plain localhost mail.
    DEBUG: true, // Set to `true` to view more debugging information.
    HOST: 'mail.evolving.com', // SMTP mail server hostname.
    PORT: 25, // SMTP mail server port.
    SECURE: false, // Use SSL?
    USE_TLS: false, // Use TLS?
    USERNAME: '', // SMTP mail server authentication username.
    PASSWORD: '', // SMTP mail server authentication password.
    DEFAULT_SENDER: 'kiran.byahatti@evolving.com', // Default 'From:' address used for all outgoing emails.
    CONNECTION_TIMEOUT: 7 * 1000 // x * 1000, where `x` is the number of seconds after which the SMTP server connection will timeout if the server doesn't respond within `x` seconds; default 7 seconds.
};


config.ADMIN_PORTAL = {
    REST_API_ADMIN_PORTAL_AUTHENTICATE: "/v1/api/adminPortal/authenticate"
};

var here = path.resolve(__dirname);
config.WEBAPP = {
    PUBLIC_DIRECTORY: path.join(here, '../public')// Internal - !!!DO NOT TOUCH!!!
    
};

config.ORACLE_ENV = {
    UV_THREADPOOL_SIZE: 100
};

/**
 * Internationalization Configuration.
 */
config.i18n = {
    DEFAULT_LOCALE: 'en-us' // Default locale. Note that this has to be of the format 'xx-xx', where x is always lowercase. Will be overridden `PREFERRED_LANGUAGE` in product_config.js.
};
config.LOG = {
    FILENAME: "./logs/scaleLabs", // Main log file's path and name. `FORMAT` is appended to `FILENAME`.
    FORMAT: "MMddHH.log", // Date pattern in filename. Allowed tokens are yy, yyyy, M, MM, d, dd, H, HH, m, mm.
    PRETTY_PRINT: false, // Set to `true` if util.inspect should be used on metadata. Helps in debugging.
    CONSOLE_PRINT: false, // Set to `true` if output should also additionally be printed on console.
    JSON: false, // Set to `true` if log file should be in JSON format. Helps when log data needs to be consumed by external service like Loggly.
    COLORIZE: false, // Set to `true` if output should be colorized. Use only when `CONSOLE_PRINT` is also set to `true`.
    TIMESTAMP: function(args) {
        return moment().format('DD-MM-YYYY HH:mm:ss.SSS');
    }, // Set to `true` to include timestamp in log.
    LEVEL: 'debug', // Logging level; allowed values are 'silly' (lowest), 'verbose', 'debug', 'info', 'warn', 'error' (highest).
    MAXSIZE: 500000000 // 500MB  maxsize option which will rotate the logfile when it exceeds a certain size in bytes.
};
//winston.add(winston.transports.DailyRotateFile, {
winston.add(require('winston-daily-rotate-file'), {
    filename: config.LOG.FILENAME,
    name: 'mainLog', // Internal name for logging instance.
    datePattern: config.LOG.FORMAT,
    handleExceptions: true, // Automatically log all unhandled exceptions.
    exitOnError: false, // Set to `true` to exit the application on any unhandled exception. Not recommended.
    prettyPrint: config.LOG.PRETTY_PRINT,
    silent: config.LOG.CONSOLE_PRINT,
    humanReadableUnhandledException: true, // Set to `true` to print clean stacktrace.
    json: config.LOG.JSON,
    colorize: config.LOG.COLORIZE,
    timestamp: config.LOG.TIMESTAMP,
    level: config.LOG.LEVEL,
    maxsize: config.LOG.MAXSIZE,
    localTime: true
});

config.auth ={
	SECRET: "ThisIsSecret!"
};
config.logger = winston;
module.exports = config;

