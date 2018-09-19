/*jslint node: true */
'use strict';
var express = require('express');
var manager_route = express.Router();
var config = require('../../config/config');
var api = require('../../lib/api');
var manager_workflow = require('../../app/manager/manager_workflow');
var logger = config.logger;
var mailer = require('../../lib/mailer');
var logout ={};

manager_route.post('/uploadProductMarket', function(req, res) {
	try {
		logger.info(req.body.userName + ":manager_route:uploadProductMarket:" + req.headers.apiname + ":Request Received:",req.body);
		manager_workflow.uploadProductMarket(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(uploadProductMarketResponse){
			return api.ok(req, res,uploadProductMarketResponse);
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

manager_route.post('/uploadProductLazada', function(req, res) {
        try {
                logger.info(req.body.userName + ":manager_route:uploadProductLazada:" + req.headers.apiname + ":Request Received:",req.body);
                manager_workflow.uploadProductLazada(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(uploadProductLazadaResponse){
                        return api.ok(req, res,uploadProductLazadaResponse);
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

module.exports = manager_route;
