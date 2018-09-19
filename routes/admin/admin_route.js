/*jslint node: true */
'use strict';
var express = require('express');
var admin_route = express.Router();
var config = require('../../config/config');
var api = require('../../lib/api');
var admin_workflow = require('../../app/admin/admin_workflow');
var logger = config.logger;
var mailer = require('../../lib/mailer');
var logout ={};

//Summary API's 
/*admin_route.post('/', function(req, res) {
    try {
		var success = {"response":"success"};
		return api.ok(req,res,success);
    } catch (err) {
        logger.error("Error occured: " + err.stack);
        var failureResponse = {
            "responseCode": -1,
            "response": {},
            "errorMsg": "SEVERE_ERROR"
        };
        return api.ok(req, res, failureResponse);

    }
});*/

admin_route.post('/enableUser', function(req, res) {
    try {
        logger.info(req.body.userName + ":admin_route:enableUser:" + req.headers.apiname + ":Request Received:",req.body);
        admin_workflow.enableUser(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(enableUserResponse) {
                 logger.info(req.body.userName + ":admin_route:enableUser:" + req.headers.apiname + ":Response Received:",enableUserResponse);
                return api.ok(req, res, enableUserResponse);
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

admin_route.post('/disableUser', function(req, res) {
    try {
        logger.info(req.body.userName + ":admin_route:disableUser:" + req.headers.apiname + ":Request Received:",req.body);
        admin_workflow.disableUser(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(disableUserResponse) {
		 logger.info(req.body.userName + ":admin_route:disableUser:" + req.headers.apiname + ":Response Received:",disableUserResponse);
                return api.ok(req, res, disableUserResponse);
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

admin_route.post('/createUser', function(req, res) {
    try {
        logger.info(req.body.userName + ":admin_route:createUser:" + req.headers.apiname + ":Request Received:",req.body);
        admin_workflow.createUser(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(createUserResponse) {
                logger.info(req.body.userName + ":admin_route:createUser:" + req.headers.apiname + ":Response Received:",createUserResponse);
                return api.ok(req, res, createUserResponse);
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

admin_route.post('/getAllocateSeller', function(req, res) {
    try {
        logger.info(req.body.userName + ":admin_route:getAllocateSeller:" + req.headers.apiname + ":Request Received:",req.body);
        admin_workflow.getAllocateSeller(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(getAllocateSellerResponse){
                return api.ok(req, res, getAllocateSellerResponse);
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

admin_route.post('/allocateSeller', function(req, res) {
    try {
        logger.info(req.body.userName + ":admin_route:allocateSeller:" + req.headers.apiname + ":Request Received:",req.body);
        admin_workflow.allocateSeller(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(allocateSellerResponse){
                return api.ok(req, res, allocateSellerResponse);
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

admin_route.post('/getAllUsers', function(req, res) {
    try {
        logger.info(req.body.userName + ":admin_route:getAllUsers:" + req.headers.apiname + ":Request Received:",req.body);
        admin_workflow.getAllUsers(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(getAllUsersResponse){
                return api.ok(req, res, getAllUsersResponse);
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

admin_route.post('/deleteUser', function(req, res) {
    try {
        logger.info(req.body.userName + ":admin_route:deleteUser:" + req.headers.apiname + ":Request Received:",req.body);
        admin_workflow.deleteUser(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(deleteUserResponse){
                return api.ok(req, res,deleteUserResponse);
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

admin_route.post('/updateUserDetails', function(req, res) {
    try {
        logger.info(req.body.userName + ":admin_route:updateUserDetails:" + req.headers.apiname + ":Request Received:",req.body);
        admin_workflow.updateUserDetails(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(updateUserDetailsResponse){
                return api.ok(req, res,updateUserDetailsResponse);
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

admin_route.post('/getManagerRole', function(req, res) {
    try {
        logger.info(req.body.userName + ":admin_route:getManagerRole:" + req.headers.apiname + ":Request Received:",req.body);
        admin_workflow.getManagerRole(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(getManagerRoleesponse){
                return api.ok(req, res,getManagerRoleesponse);
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

admin_route.post('/createMarketPlace', function(req, res) {
        try {
        logger.info(req.body.userName + ":admin_route:createMPRequest:" + req.headers.apiname + ":Request Received:",req.body);
        admin_workflow.createMPRequest(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(createMPRequestResponse){
                return api.ok(req, res,createMPRequestResponse);
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

admin_route.post('/updateMarketPlace', function(req, res) {
        try {
        logger.info(req.body.userName + ":admin_route:updateMPRequest:" + req.headers.apiname + ":Request Received:",req.body);
        admin_workflow.updateMPRequest(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(updateMPRequestResponse){
                return api.ok(req, res,updateMPRequestResponse);
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


admin_route.post('/deleteMarketPlace', function(req, res) {
	try {
        logger.info(req.body.userName + ":admin_route:delMPRequest:" + req.headers.apiname + ":Request Received:",req.body);
        admin_workflow.delMPRequest(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(delMPRequestResponse){
                return api.ok(req, res,delMPRequestResponse);
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

admin_route.post('/getMarketPlaces', function(req, res) {
        try {
        logger.info(req.body.userName + ":admin_route:getMarketPlaces:" + req.headers.apiname + ":Request Received:",req.body);
        admin_workflow.getMarketPlaces(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(getMarketPlacesResponse){
                return api.ok(req, res,getMarketPlacesResponse);
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

admin_route.post('/getSellerOrdersCount', function(req, res) {
	try {
		logger.info(req.body.userName + ":admin_route:getSellerOrdersCount:" + req.headers.apiname + ":Request Received:",req.body);
        	admin_workflow.getSellerOrdersCount(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(getSellerOrdersCountResponse){
			return api.ok(req, res,getSellerOrdersCountResponse);
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

module.exports = admin_route;
