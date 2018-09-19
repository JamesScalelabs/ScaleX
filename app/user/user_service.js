/*jslint node: true */
'use strict';
var userService = {};
var user_model = require('./user_model');
//var user_request = require('./user_request');
var config = require('../../config/config');
var logger = config.logger;

userService.authenticateUser = function(apiname, username, password, modelCallback) {
    logger.info(username + ":user_service:authenticateUser:" + apiname + ":Enter");
    user_model.authenticateUser(apiname, username, password, function(response) {
            logger.info(username + ":user_service:authenticateUser:" + apiname + ":Exit");
            modelCallback(response);
    });
};

userService.createUser = function(apiname, username,newPassword,groupName,modelCallback) {
    logger.info(username + ":user_service:createUser:" + apiname + ":Enter");
    user_model.createUser(apiname, username,newPassword,groupName,function(response) {
            logger.info(username + ":user_service:createUser:" + apiname + ":Exit");
            modelCallback(response);
    });
};

userService.deleteUser = function(apiname, username,modelCallback) {
    logger.info(username + ":user_service:deleteUser:" + apiname + ":Enter");
    user_model.deleteUser(apiname, username,function(response) {
            logger.info(username + ":user_service:deleteUser:" + apiname + ":Exit");
            modelCallback(response);
    });
};

module.exports = userService;
