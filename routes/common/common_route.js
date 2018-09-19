/*jslint node: true */
'use strict';
var express = require('express');
var common_route = express.Router();
var config = require('../../config/config');
var api = require('../../lib/api');
var common_workflow = require('../../app/common/common_workflow');
var lazada_getInvoice = require('../../app/common/lazada_getInvoice');
var generic_invoice = require('../../app/common/generic_invoice');
var logger = config.logger;
var mailer = require('../../lib/mailer');
var logout ={};
var fs = require('fs');

/*common_route.post('/getOrderInvoice', function(req, res) {
        try {
                logger.info(req.body.userName + ":common_route:getOrderInvoice:" + req.headers.apiname + ":Request Received:",req.body);
		var filePath="/home/ubuntu/scaleLabs/invoice/sample*/
common_route.get('/getProductFile/:fileName',function(req,res) {
	logger.info("Inside get method of getProductFile, filename : ",req.params.fileName);
	var filePath="./editFiles/"+req.params.fileName;
	res.writeHead(200, {
		"Content-Type": "application/octet-stream",
		"Content-Disposition": "attachment; filename=Edit_Product_List.xlsx"
	});
	fs.createReadStream(filePath).pipe(res);
});

common_route.post('/getProductExcel', function(req, res) {
	try {
		logger.info(req.body.userName + ":common_route:getProductExcel:" + req.headers.apiname + ":Request Received:",req.body);
		common_workflow.getProductExcel(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(getProductExcelResponse){
			logger.info(req.body.userName+":common_route:getProductExcel:"+req.headers.apiname+":Response Sent:",JSON.stringify(getProductExcelResponse));
			//return api.ok(req, res,getProductExcelResponse);
			/*res.writeHead(200, {
                		"Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                		"Content-Disposition": "attachment; filename=Edit_Product_List.xlsx"
			});
			//var filePath="/home/ubuntu/scaleLabs/properties/Catalog_Template.xlsx";
			var filePath="/projects/rakesh/scaleslabs/editFiles/"+getProductExcelResponse;
			//var filePath="/projects/rakesh/scaleslabs/editFiles/rakeshPostman_22072018201249.xlsx";
			logger.info("filePath :",filePath);
			fs.createReadStream(filePath).pipe(res);*/
			//fs.createReadStream('/projects/rakesh/scaleslabs/editFiles/'+getProductExcelResponse).pipe(res);
			return api.ok(req, res,getProductExcelResponse);
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

common_route.get('/getLazadaInvoice', function(req, res) {
        try {
                logger.info("under getLazadaInvoice Routes:");
                lazada_getInvoice.getInvoice(req.headers.apiname, 'Veer', 'trendzstyle2017.sl@gmail.com', '111265824', function(getLazadaInvoiceResponse){
                        return api.ok(req, res, getLazadaInvoiceResponse);
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

common_route.post('/getInvoiceTemplet', function(req, res) {
        try {
                logger.info("under getInvoiceTemplet Routes:");
                generic_invoice.getInvoice(req.headers.apiname,req.headers.lang, req.headers.locale, req.body, function(getLazadaInvoiceResponse){
			var id=req.body.id;
			var filePath="/projects/rakesh/scaleslabs/invoice/"+id+".pdf";
			res.writeHead(200, {
                		"Content-Type": "application/pdf;charset=utf-8",
		                "Content-Disposition": "attachment; filename=invoice.pdf"
			});
			fs.createReadStream(filePath).pipe(res);
                        //return api.ok(req, res, getLazadaInvoiceResponse);
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

common_route.post('/getMarketPlaceOrders', function(req, res) {
        try {
                logger.info(req.body.userName + ":admin_route:getMarketPlaceOrders:" + req.headers.apiname + ":Request Received:",req.body);
                common_workflow.getMarketPlaceOrders(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(getMarketPlaceOrdersResponse){
                        return api.ok(req, res,getMarketPlaceOrdersResponse);
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

common_route.post('/syncSellerOrders', function(req, res) {
	try {
		logger.info(req.body.userName + ":admin_route:syncSellerOrders:" + req.headers.apiname + ":Request Received:",req.body);
		common_workflow.syncSellerOrders(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(syncSellerOrdersResponse){
			return api.ok(req, res,syncSellerOrdersResponse);
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

common_route.post('/getSellerOrders', function(req, res) {
        try {
                logger.info(req.body.userName + ":admin_route:getSellerOrders:" + req.headers.apiname + ":Request Received:",req.body);
                common_workflow.getSellerOrders(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(getSellerOrdersResponse){
                        return api.ok(req, res,getSellerOrdersResponse);
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

common_route.post('/syncElevenStreetShippingOrders', function(req, res) {
        try {
                logger.info(req.body.userName + ":admin_route:syncElevenStreetShippingOrders:" + req.headers.apiname + ":Request Received:",req.body);
                common_workflow.syncElevenStreetShippingOrders(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(syncSellerOrdersResponse){
                        return api.ok(req, res,syncSellerOrdersResponse);
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

common_route.post('/trackOrder', function(req, res) {
        try {
                logger.info(req.body.userName + ":admin_route:trackOrder:" + req.headers.apiname + ":Request Received:",req.body);
                common_workflow.trackOrder(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(trackOrderResponse){
                        return api.ok(req, res,trackOrderResponse);
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


//Added for Orders/Sales Report
common_route.post('/getSalesOrOrdersReport', function(req, res) {
        try {
                logger.info(req.body.userName + ":admin_route:getSalesOrOrdersReport:" + req.headers.apiname + ":Request Received:",req.body);
                common_workflow.getSalesOrOrdersReport(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(getMarketPlaceOrdersResponse){
                        return api.ok(req, res,getMarketPlaceOrdersResponse);
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

//Added for Slaes/Orders Graph 
common_route.post('/getSalesOrOrdersGraph', function(req, res) {
        try {
                logger.info(req.body.userName + ":admin_route:getSalesOrOrdersGraph:" + req.headers.apiname + ":Request Received:",req.body);
                common_workflow.getSalesOrOrdersGraph(req.headers.apiname, req.headers.lang, req.headers.locale, req.body, function(getMarketPlaceOrdersResponse){
                        return api.ok(req, res,getMarketPlaceOrdersResponse);
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

module.exports = common_route;
