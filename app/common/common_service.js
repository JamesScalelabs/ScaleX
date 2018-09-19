/*jslint node: true */
'use strict';
var commonService = {};
var common_model = require('./common_model');
var common_request = require('./common_request');
var config = require('../../config/config');
var logger = config.logger;

commonService.getProductDetails = function(apiname,username,productDetails,modelCallback) {
        logger.info(username + ":common_service:getProductDetails:" + apiname + ":Enter");
        common_model.getProductDetails(apiname,username,productDetails,function(response) {
                logger.info(username + ":common_service:getProductDetails:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.getTotalOutOfStockMP = function(apiname,username,sellerName,modelCallback) {
	logger.info(username + ":common_service:getTotalOutOfStockMP:" + apiname + ":Enter");
        common_model.getTotalOutOfStockMP(apiname,username,sellerName,function(response) {
                logger.info(username + ":common_service:getTotalOutOfStockMP:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.getTotalPendingOrders = function(apiname,username,sellerName, startDate, endDate, modelCallback) {
        logger.info(username + ":common_service:getTotalPendingOrders:" + apiname + ":Enter");
        common_model.getTotalPendingOrders(apiname,username,sellerName, startDate, endDate, function(response) {
                logger.info(username + ":common_service:getTotalPendingOrders:" + apiname + ":Exit");
                modelCallback(response);
        });
};
commonService.getMarketPlaceOrders = function(apiname,username,sellerName, startDate, endDate, modelCallback) {
        logger.info(username + ":common_service:getTotalPendingOrders:" + apiname + ":Enter");
        common_model.getMarketPlaceOrders(apiname,username,sellerName, startDate, endDate, function(response) {
                logger.info(username + ":common_service:getTotalPendingOrders:" + apiname + ":Exit");
                modelCallback(response);
        });
};
commonService.getSalesOrOrdersReport = function(apiname,username,sellerName,startDate, endDate, modelCallback) {
        logger.info(username + ":common_service:getSalesOrOrdersReport:" + apiname + ":Enter");
        common_model.getSalesOrOrdersReport(apiname,username,sellerName,startDate, endDate, function(response) {
                logger.info(username + ":common_service:getSalesOrOrdersReport:" + apiname + ":Exit");
                modelCallback(response);
        });
};
commonService.getSalesOrOrdersGraph = function(apiname,username,sellerName,startDate, endDate,marketPlace, modelCallback) {
        logger.info(username + ":common_service:getSalesOrOrdersGraph:" + apiname + ":Enter");
        common_model.getSalesOrOrdersGraph(apiname,username,sellerName,startDate, endDate, marketPlace, function(response) {
                logger.info(username + ":common_service:getSalesOrOrdersGraph:" + apiname + ":Exit");
                modelCallback(response);
        });
};
commonService.insertEbayOrder = function(apiname,username,marketPlace,orders,seller,modelCallback) {
	logger.info(username + ":common_service:insertEbayOrder:" + apiname + ":Enter");
	common_model.insertEbayOrder(apiname,username,marketPlace,orders,seller,function(response) {
                logger.info(username + ":common_service:insertEbayOrder:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.getSellerOrders = function(apiname,username,sellerName,hash,text,url,modelCallback) {
        logger.info(username + ":common_service:getSellerOrders:" + apiname + ":Enter");
        common_request.getSellerOrders(apiname,username,sellerName,hash,text,url,function(response) {
		logger.info(username + ":common_service:getSellerOrders:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.deleteOrder = function(apiname,username,marketPlace,orderList,modelCallback) {
        logger.info(username + ":common_service:deleteOrder:" + apiname + ":Enter");
        common_model.deleteOrder(apiname,username,marketPlace,orderList,function(response) {
                logger.info(username + ":common_service:deleteOrder:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.insertOrder = function(apiname,username,marketPlace,orders,seller,modelCallback) {
	logger.info(username + ":common_service:insertOrder:" + apiname + ":Enter");
        common_model.insertOrder(apiname,username,marketPlace,orders,seller,function(response) {
                logger.info(username + ":common_service:insertOrder:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.getMaxUpdateTs = function(apiname,username,marketPlace,seller,modelCallback) {
        logger.info(username + ":common_service:getMaxUpdateTs:" + apiname + ":Enter");
        common_model.getMaxUpdateTs(apiname,username,marketPlace,seller,function(response) {
                logger.info(username + ":common_service:getMaxUpdateTs:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.getSellerLocalOrder = function(apiname,username,marketPlace,seller,modelCallback) {
	logger.info(username + ":common_service:getSellerLocalOrder:" + apiname + ":Enter");
        common_model.getSellerLocalOrder(apiname,username,marketPlace,seller,function(response) {
                logger.info(username + ":common_service:getSellerLocalOrder:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.getSellerOrderItems = function(apiname,username,sellerName,hash,text,url,modelCallback) {
        logger.info(username + ":common_service:getSellerOrderItems:" + apiname + ":Enter");
	common_request.getSellerOrderItems(apiname,username,sellerName,hash,text,url,function(response) {
                logger.info(username + ":common_service:getSellerOrderItems:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.updateSellerOrderItems = function(apiname,username,sellerName,OrderItems,modelCallback) {
        logger.info(username + ":common_service:updateSellerOrderItems:" + apiname + ":Enter");
        common_model.updateSellerOrderItems(apiname,username,sellerName,OrderItems,function(response) {
                logger.info(username + ":common_service:updateSellerOrderItems:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.getAmazonUsSellerOrders = function(apiname,username,sellerName,updateTs,site,marketPlaceId,sellerId,accountNo,accessKeyId,secretKey,modelCallback) {
	logger.info(username + ":common_service:getAmazonUsSellerOrders:" + apiname + ":Enter");
        common_request.getAmazonUsSellerOrders(apiname,username,sellerName,updateTs,site,marketPlaceId,sellerId,accountNo,accessKeyId,secretKey,function(response) {
                logger.info(username + ":common_service:getAmazonUsSellerOrders:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.insertAmazonOrder = function(apiname,username,marketPlace,getAmazonUsSellerOrdersResponse,sellerName,modelCallback) {
        logger.info(username + ":common_service:insertAmazonOrder:" + apiname + ":Enter");
	common_model.insertAmazonOrder(apiname,username,marketPlace,getAmazonUsSellerOrdersResponse,sellerName,function(response) {
		logger.info(username + ":common_service:insertAmazonOrder:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.getElevenStatesComplete = function(apiname,username,sellerName,updateTs,updateTill,site,sellerKey,modelCallback) {
	logger.info(username + ":common_service:getElevenStatesComplete:" + apiname + ":Enter");
        common_request.getElevenStatesComplete(apiname,username,sellerName,updateTs,updateTill,site,sellerKey,function(response) {
                logger.info(username + ":common_service:getElevenStatesComplete:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.insertElevenStreetOrder = function(apiname,username,marketPlace,responseJson,sellerName,modelCallback) {
	logger.info(username + ":common_service:insertElevenStreetOrder:" + apiname + ":Enter");
        common_model.insertElevenStreetOrder(apiname,username,marketPlace,responseJson,sellerName,function(response) {
		logger.info(username + ":common_service:insertElevenStreetOrder:" + apiname + ":Exit");
                modelCallback(response);
	});
};

commonService.getElevenStatesCompleteShip = function(apiname,username,sellerName,site,sellerKey,modelCallback) {
        logger.info(username + ":common_service:getElevenStatesCompleteShip:" + apiname + ":Enter");
        common_request.getElevenStatesCompleteShip(apiname,username,sellerName,site,sellerKey,function(response) {
                logger.info(username + ":common_service:getElevenStatesCompleteShip:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.insertElevenStreetOrderSeller = function(apiname,username,marketPlace,responseJson,sellerName,modelCallback) {
        logger.info(username + ":common_service:insertElevenStreetOrderSeller:" + apiname + ":Enter");
        common_model.insertElevenStreetOrderSeller(apiname,username,marketPlace,responseJson,sellerName,function(response) {
                logger.info(username + ":common_service:insertElevenStreetOrderSeller:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.getSearsSellerOrders = function(apiname,username,sellerName,hash,site,sellerId,sellerEmail,updateTs,toTs,requestTs,modelCallback) {
        logger.info(username + ":common_service:getSearsSellerOrders:" + apiname + ":Enter");
        common_request.getSearsSellerOrders(apiname,username,sellerName,hash,site,sellerId,sellerEmail,updateTs,toTs,requestTs,function(response) {
                logger.info(username + ":common_service:getSearsSellerOrders:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.insertSearsSellerOrder = function(apiname,username,marketPlace,responseJson,sellerName,modelCallback) {
        logger.info(username + ":common_service:insertSearsSellerOrder:" + apiname + ":Enter");
        common_model.insertSearsSellerOrder(apiname,username,marketPlace,responseJson,sellerName,function(response) {
                logger.info(username + ":common_service:insertSearsSellerOrder:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.checkTableExist = function(apiname,username,tableName,modelCallback) {
        logger.info(username + ":common_service:checkTableExist:" + apiname + ":Enter");
        common_model.checkTableExist(apiname,username,tableName,function(response) {
                logger.info(username + ":common_service:checkTableExist:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.trackFedExOrder = function(apiname,username,request,modelCallback) {
        logger.info(username + ":common_service:trackFedExOrder:" + apiname + ":Enter");
        common_request.trackFedExOrder(apiname,username,request,function(response) {
                logger.info(username + ":common_service:trackFedExOrder:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.trackAramexOrder = function(apiname,username,request,modelCallback) {
        logger.info(username + ":common_service:trackAramexOrder:" + apiname + ":Enter");
        common_request.trackAramexOrder(apiname,username,request,function(response) {
                logger.info(username + ":common_service:trackAramexOrder:" + apiname + ":Exit");
                modelCallback(response);
        });
};

commonService.trackDHLOrder = function(apiname,username,request,modelCallback) {
        logger.info(username + ":common_service:trackDHLOrder:" + apiname + ":Enter");
        common_request.trackDHLOrder(apiname,username,request,function(response) {
                logger.info(username + ":common_service:trackDHLOrder:" + apiname + ":Exit");
                modelCallback(response);
        });
};

module.exports = commonService;
