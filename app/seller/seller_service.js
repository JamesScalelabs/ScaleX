/*jslint node: true */
'use strict';
var sellerService = {};
var seller_model = require('./seller_model');
var config = require('../../config/config');
var logger = config.logger;

sellerService.insertProduct = function(apiname, username, productDetails,modelCallback) {
        logger.info(username + ":seller_service:insertProduct:" + apiname + ":Enter");
        seller_model.insertProduct(apiname, username,productDetails,function(response) {
            logger.info(username + ":seller_service:insertProduct:"  + apiname + ":Exit");
            modelCallback(response);
        });
};
/*
sellerService.insertProduct_old = function(apiname, username,request,i,fileName,tableName,column_name,modelCallback) {
        logger.info(username + ":seller_service:insertProduct:" + apiname + ":Enter");
        seller_model.insertProduct(apiname, username,request,i,fileName,tableName,column_name, function(response) {
            logger.info(username + ":seller_service:insertProduct:"  + apiname + ":Exit");
            modelCallback(response);
        });
};*/

sellerService.uploadProduct = function(apiname, username, productDetails, modelCallback) {
	logger.info(username + ":seller_service:uploadProduct:" + apiname + ":Enter");
    	seller_model.uploadProduct(apiname, username, productDetails, function(response) {
            logger.info(username + ":seller_service:uploadProduct:" + apiname + ":Exit");
            modelCallback(response);
    	});
};

sellerService.updateProduct = function(apiname, username, productDetails, modelCallback) {
    logger.info(username + ":seller_service:updateProduct:" + apiname + ":Enter");
        seller_model.updateProduct(apiname, username, productDetails, function(response) {
            logger.info(username + ":seller_service:updateProduct:" + apiname + ":Exit");
            modelCallback(response);
        });
};

sellerService.getAllProducts = function(apiname, username, modelCallback) {
        logger.info(username + ":seller_service:getAllProducts:" + apiname + ":Enter");
        seller_model.getAllProducts(apiname, username, function(response) {
            logger.info(username + ":seller_service:getAllProducts:" + apiname + ":Exit");
            modelCallback(response);
        });
};

sellerService.getProductLevelInventoryReport = function(apiname, username, modelCallback) {
        logger.info(username + ":seller_service:getProductLevelInventoryReport:" + apiname + ":Enter");
        seller_model.getProductLevelInventoryReport(apiname, username, function(response) {
            logger.info(username + ":seller_service:getProductLevelInventoryReport:" + apiname + ":Exit");
            modelCallback(response);
        });
};

sellerService.getTopProductsSold = function(apiname, username, modelCallback) {
        logger.info(username + ":seller_service:getTopProductsSold:" + apiname + ":Enter");
        seller_model.getTopProductsSold(apiname, username, function(response) {
            logger.info(username + ":seller_service:getTopProductsSold:" + apiname + ":Exit");
            modelCallback(response);
        });
};

/*sellerService.getAllProducts = function(apiname,username,jsonKeyList,columnNameList,tableName,marketPlace,productCategory,productDetail,selectColumn,modelCallback) {
	logger.info(username + ":seller_service:getAllProducts:" + apiname + ":Enter");
        seller_model.getAllProducts(apiname,username,jsonKeyList,columnNameList,tableName,marketPlace,productCategory,productDetail,selectColumn,function(response) {
		logger.info(username + ":seller_service:getAllProducts:" + apiname + ":Exit");
            	modelCallback(response);
	});
};*/

module.exports = sellerService;
