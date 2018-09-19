'use strict';
var express = require('express');
var user_route = express.Router();
var _ = require('lodash');
var config = require('../../config/config');
var api = require('../../lib/api');
var user_workflow = require('../../app/user/user_workflow');
var logger = config.logger;
var logout ={};
user_route.post('/login', function(req, res) {
    try {
        user_workflow.authenticateUser(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(loginResponse) {
	    logger.info(req.body.userName + ":user_route:post:login:" + req.headers.apiname + ":Request Received:",req.body);
            if(loginResponse.responseCode === 0){
                    return api.ok(req, res, loginResponse);
            }
            else
            {   
                return api.ok(req, res, loginResponse);
            }  
        });
    } catch (err) {
        logger.error("Error occured: " + err.stack);
        var failureResponse = {
            "responseCode": -1,
            "response": {},
            "errorMsg": "SEVERE_ERROR"
        };
        return api.ok(req, res, failureResponse);
    }
});

user_route.post('/resetPassword', function(req, res) {
    try {
        logger.info(req.body.userName + ":user_route:post:resetPassword:" + req.headers.apiname + ":Request Received:",req.body);
        user_workflow.resetPassword(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(resetPasswordResponse) {
		logger.info(req.body.userName + ":user_route:post:resetPassword:" + req.headers.apiname + ":Response Received:",resetPasswordResponse);
                return api.ok(req, res, resetPasswordResponse);
	});
    } catch (err) {
        logger.error("Error occured: " + err.stack);
        var failureResponse = {
            "responseCode": -1,
            "response": {},
            "errorMsg": "SEVERE_ERROR"
        };
        return api.ok(req, res, failureResponse);
    }
});

user_route.get('/', function(req, res) {
        logger.info(req.body.userName + ":user_route:post:index:"+ req.headers.apiname + ":Request Received:",req.body);
	res.sendFile('/home/ubuntu/scaleLabs/public/index.html',{root: __dirname });
});
	
	

module.exports = user_route;
