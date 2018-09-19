/*jslint node: true */
'use strict';
var userWorkflow={};
var userService=require('./user_service');
var config = require('../../config/config');
var logger = config.logger;
var async = require('async');
var jwt = require('jsonwebtoken');
var failureResponse = {
	"responseCode": -1,
        "response": "",
        "errorMsg": ""
};

userWorkflow.authenticateUser = function(apiname, lang, locale,request, responseCallback) {
	var sucessResponse = {
		"responseCode": 0,
        	"response": {
			"userName": "",
			"token": "",
			"groupName": ""
		},
		"errorMsg": ""
	};
	
	logger.info(request.userName + ":user_workflow:authenticateAdmin:" + apiname + ":Enter");
	var req = {
        	username: request.userName
    	};
	var token = jwt.sign(req, config.auth.SECRET, {algorithm : 'HS256'});
	async.waterfall(
		[
			function(callback) {
            			callback(null,sucessResponse);
        		},

			function(getActiveSessionsResponse, callback) {
				userService.authenticateUser(apiname, request.userName, request.password, function(authResponse) {
              				if (authResponse.responseCode === 0) {
						authResponse.response.userName=request.userName;
                    				authResponse.response.token=token;
               					callback(null,authResponse);
              				} else {
						//authResponse.errorMsg = i18n.getString(locale, authResponse.errorMsg);
						authResponse.errorMsg = authResponse.errorMsg;
						authResponse.responseCode = -1;
						logger.info(request.userName + ":user_workflow:authenticateUser:" + apiname + ":Exit");
						callback(authResponse, null);
					}
				});
			},
		],
		function(err, results) {
            if (err) {
                logger.error(request.userName + ":user_workflow:authenticateAdmin:" + apiname + ":Exit");
                responseCallback(err);
            } else {
                logger.info(request.userName + ":user_workflow:authenticateAdmin:" + apiname + ":Exit:", results);
		responseCallback(results);
            }
	});
};

userWorkflow.resetPassword = function(apiname, lang, locale,request, responseCallback) {
	var sucessResponse = {
		"responseCode": 0,
		"response": {
			"userName": request.userName
		},
		"errorMsg": ""
	};
	
	logger.info(request.userName + ":user_workflow:resetPassword:" + apiname + ":Enter");
	async.waterfall(
	[
		function(callback) {
			userService.authenticateUser(apiname, request.userName, request.oldPassword, function(authResponse) {
				if (authResponse.responseCode === 0) {
					callback(null,sucessResponse);
				} else {
					authResponse.responseCode = -1;
					authResponse.errorMsg = "Old user Password Validation Failed";
					logger.info(request.userName + ":user_workflow:authenticateUser:" + apiname + ":Exit");
					callback(authResponse, null);
				}
			});
		},
                function(authResponse,callback) {
			userService.deleteUser(apiname, request.userName, function(disableUserResponse) {
                                if (disableUserResponse.responseCode === 0) {
                                        callback(null,sucessResponse);
                                } else {
					failureResponse.errorMsg = "Reset Password Failer";
					logger.info(request.userName + ":user_workflow:disableUser:" + apiname + ":Exit");
					callback(failureResponse,null);
                                }
                        });
                },
		function(sucessResponse,callback) {
			userService.createUser(apiname, request.userName,request.newPassword,request.groupName, function(createUserResponse) {
				if (createUserResponse.responseCode === 0) {
                                        callback(null,sucessResponse);
                                } else {
                                        failureResponse.errorMsg = "Reset Password Failer";
                                        logger.info(request.userName + ":user_workflow:createUser:" + apiname + ":Exit");
                                        callback(failureResponse,null);
                                }
                        });
		},
	],
	function(err, results) {
		if (err) {
			logger.error(request.userName + ":user_workflow:resetPassword:" + apiname + ":Exit");
			responseCallback(err);
		} else {
			logger.info(request.userName + ":user_workflow:resetPassword:" + apiname + ":Exit:", results);
			responseCallback(results);
		}
	});
};


module.exports = userWorkflow;
