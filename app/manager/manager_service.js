/r*jslint node: true */
'use strict';
var managerService = {};
var manager_model = require('./manager_model');
var config = require('../../config/config');
var logger = config.logger;

managerService.getAmazonCategory = function(apiname, username, productId,modelCallback) {
        logger.info(username + ":manager_service:getAmazonCategory:" + apiname + ":Enter");
        manager_model.getAmazonCategory(apiname, username, productId,function(response) {
	    logger.info(username + ":manager_service:getAmazonCategory:response:",response);
            logger.info(username + ":manager_service:getAmazonCategory:" + apiname + ":Exit");
            modelCallback(response);
        });
};

managerService.uploadProductMarket = function(apiname, username, productDetails, modelCallback) {
	logger.info(username + ":manager_service:uploadProductMarket:" + apiname + ":Enter");
    	manager_model.uploadProductMarket(apiname, username, productDetails, function(response) {
            logger.info(username + ":manager_service:uploadProductMarket:" + apiname + ":Exit");
            modelCallback(response);
    	});
};

managerService.updateProductStatus = function(apiname, username, updateStmt,modelCallback) {
        logger.info(username + ":manager_service:updateProductStatus:" + apiname + ":Enter");
        manager_model.updateProductStatus(apiname, username, updateStmt,function(response) {
            logger.info(username + ":manager_service:updateProductStatus:" + apiname + ":Exit");
            modelCallback(response);
        });
};

managerService.insertMarketplaceUploadStatus = function(apiname, username, id, feedSubmissionId,modelCallback) {
        logger.info(username + ":manager_service:insertMarketplaceUploadStatus:" + apiname + ":Enter");
        manager_model.insertMarketplaceUploadStatus(apiname, username, id, feedSubmissionId,function(response) {
            logger.info(username + ":manager_service:insertMarketplaceUploadStatus:" + apiname + ":Exit");
            modelCallback(response);
        });
};

managerService.updateUploadFile = function(apiname, username, uploadFileName, selectStmt, modelCallback) {
	logger.info(username + ":manager_service:updateUploadFile:" + apiname + ":Enter");
        manager_model.updateUploadFile(apiname, username, uploadFileName, selectStmt, function(response) {
            logger.info(username + ":manager_service:updateUploadFile:" + apiname + ":Exit");
            modelCallback(response);
        });
};

managerService.getProductDetail = function(apiname, username, selectStmt, modelCallback) {
	logger.info(username + ":manager_service:getProductDetail:" + apiname + ":Enter");
        manager_model.getProductDetail(apiname, username, selectStmt, function(response) {
            logger.info(username + ":manager_service:getProductDetail:" + apiname + ":Exit");
            modelCallback(response);
        });
};

module.exports = managerService;
