/*jslint node: true */
'use strict';
var express = require('express');
var seller_route = express.Router();
var config = require('../../config/config');
var api = require('../../lib/api');
var seller_workflow = require('../../app/seller/seller_workflow');
var logger = config.logger;
var mailer = require('../../lib/mailer');
var logout ={};
var fs = require('fs');


seller_route.get('/downloadGenericTemplate', function(req,res) {
	logger.info(req.body.userName + ":seller_route:downloadGenericTemplate:" + req.headers.apiname + ":Request Received:",req.body);
	var filePath="/home/ubuntu/scaleLabs/properties/Catalog_Template.xlsx";
	res.writeHead(200, {
		"Content-Type": "application/octet-stream",
		"Content-Disposition": "attachment; filename=Generic_Upload_Product.xlsx"
	});
	fs.createReadStream(filePath).pipe(res);
});

seller_route.post('/uploadSellerProduct', function(req,res) {
	try {
		logger.info(req.body.userName + ":seller_route:uploadSellerProduct:" + req.headers.apiname + ":Request Received:",req.body);
                seller_workflow.uploadSellerProduct(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(uploadSellerProductResponse){
			logger.info(req.body.userName + ":seller_route:uploadSellerProduct:" + req.headers.apiname + ":Exit");
                        return api.ok(req, res,uploadSellerProductResponse);
                });
        } catch (err) {
                logger.error(req.body.userName + "Error occured: " + req.headers.apiname + ":"+err.stack);
                var failureResponse = {
                        "responseCode": -1,
                        "response": {},
                        "errorMsg": "SEVERE_ERROR"
                };
                return api.ok(req, res, failureResponse);
        }
});

seller_route.post('/uploadProduct', function(req, res) {
	try {
		logger.info(req.body.userName + ":seller_route:uploadProduct:" + req.headers.apiname + ":Request Received:",req.body);
		seller_workflow.uploadProduct(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(uploadProductResponse){
			return api.ok(req, res,uploadProductResponse);
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

seller_route.post('/updateProduct', function(req, res) {
    try {
        logger.info(req.body.userName + ":seller_route:updateProduct:" + req.headers.apiname + ":Request Received:",req.body);
        seller_workflow.updateProduct(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(updateProductResponse){
            return api.ok(req, res,updateProductResponse);
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

seller_route.post('/getAllProducts', function(req, res) {
        try {
                logger.info(req.body.userName + ":seller_route:getAllProducts:" + req.headers.apiname + ":Request Received:",req.body);
                seller_workflow.getAllProducts(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(getAllProductsResponse){
                        return api.ok(req, res,getAllProductsResponse);
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

seller_route.post('/getProductLevelInventoryReport', function(req, res) {
        try {
                logger.info(req.body.userName + ":seller_route:getProductLevelInventoryReport:" + req.headers.apiname + ":Request Received:",req.body);
                seller_workflow.getProductLevelInventoryReport(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(getProductLevelInventoryReportResponse){
                        return api.ok(req, res,getProductLevelInventoryReportResponse);
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

seller_route.post('/getTopProductsSold', function(req, res) {
        try {
                logger.info(req.body.userName + ":seller_route:getTopProductsSold:" + req.headers.apiname + ":Request Received:",req.body);
                seller_workflow.getTopProductsSold(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(getTopProductsSoldResponse){
                        return api.ok(req, res,getTopProductsSoldResponse);
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

module.exports = seller_route;
