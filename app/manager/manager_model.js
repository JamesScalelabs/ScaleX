/*jslint node: true */
'use strict';
var managerDB = {};
var config = require('../../config/config');
var mysql_db = require('../../db/mysql_db');
var query_config = require('../../config/query_config');
var logger = config.logger;
var async = require('async');
var _ = require('lodash');
var mysqldb = require('mysql');

var con = mysqldb.createConnection({
        host: "scalelabsdevdb.cababjt98r5d.us-east-1.rds.amazonaws.com",
        user: "scaleLabsDevDB",
        password: "scaleLabsDevDB",
	database : 'my_db'
});

managerDB.getAmazonCategory = function(apiname, userName, productId, modelCallback) {
	logger.info(userName+ ":manager_model:getAmazonCategory:" + apiname + ":Enter:"+userName+":");
        var failureResponse = {
                "responseCode": -1,
                "response": "",
                "errorMsg": "DB_ERROR"
        };

        var sucessResponse = {
                "responseCode": 0,
		"productCategory":"",
		"errorMsg": ""
        };
        con.query(query_config.MANAGER.GET_AMAZON_PROD_CATEGORY,[productId],function (err, result) {
                if (err){
                        logger.error(userName + ':manager_model:getAmazonCategory:' + apiname + ':Error:' + err);
                        modelCallback(failureResponse);
                } else {
			if (result && result.length > 0) {
				sucessResponse.response=result[0].category;
				sucessResponse.productCategory=result[0].category;
				modelCallback(sucessResponse);
			} else {
				logger.error(userName + ':manager_model:getAmazonCategory:' + apiname + ':Error:NO Rows Available' + err);
				modelCallback(failureResponse);
			}
		}
        });
};

managerDB.insertMarketplaceUploadStatus = function(apiname, userName, id, feedSubmissionId, modelCallback) {
	logger.info(userName+ ":manager_model:insertMarketplaceUploadStatus:" + apiname + ":Enter:"+userName+":");
        var failureResponse = {
                "responseCode": -1,
                "response": "",
                "errorMsg": "DB_ERROR"
        };

        var sucessResponse = {
                "responseCode": 0,
                "response": {},
                "errorMsg": ""
        };
        con.query(query_config.MANAGER.INSERT_MP_UPLOAD_STATUS,[id,feedSubmissionId],function (err, result) {
		if (err){
                        logger.error(userName + ':manager_model:insertMarketplaceUploadStatus:' + apiname + ':Error:' + err);
                        modelCallback(failureResponse);
                }
	});
	modelCallback(sucessResponse);
};

managerDB.updateProductStatus = function(apiname, userName, updateStmt, modelCallback) {
	logger.info(userName+ ":manager_model:updateProductStatus:" + apiname + ":Enter:"+userName+":");
        var failureResponse = {
                "responseCode": -1,
                "response": "",
                "errorMsg": "DB_ERROR"
        };

        var sucessResponse = {
                "responseCode": 0,
                "response": {},
                "errorMsg": ""
        };
	con.query(updateStmt,[],function (err, result) {
		if (err){
			logger.error(userName + ':manager_model:updateProductStatus:' + apiname + ':Error:' + err);
			modelCallback(failureResponse);
		}
	});
	modelCallback(sucessResponse);
};

managerDB.uploadProductMarket = function(apiname, userName, productDetails, modelCallback) {
	logger.info(userName+ ":manager_model:uploadProductMarket:" + apiname + ":Enter:"+userName+":");
	var failureResponse = {
                "responseCode": -1,
                "response": "",
                "errorMsg": "DB_ERROR"
        };

        var sucessResponse = {
                "responseCode": 0,
                "response": {},
                "errorMsg": ""
        };
	for(var i = 0; i < productDetails.length; i++) {
		con.query(query_config.SELLER.INSERT_NEW_PRODUCT,[productDetails[i].sku,productDetails[i].price,productDetails[i].quantity,productDetails[i].productId,productDetails[i].amazonProductIdType,productDetails[i].amazonConditionType,productDetails[i].amazonConditionNote,productDetails[i].asinHint,productDetails[i].title,productDetails[i].productTaxCode,productDetails[i].amazonOperationType,productDetails[i].salePrice,productDetails[i].saleStartDate,productDetails[i].saleEndDate,productDetails[i].leadtimeToShip,productDetails[i].launchDate,productDetails[i].isGiftwrapAvailable,productDetails[i].isGiftMessageAvailable,productDetails[i].amazoneFulfillmentCenterId,productDetails[i].mainOfferImage,productDetails[i].offerImage1,productDetails[i].offerImage2,productDetails[i].offerImage3,productDetails[i].offerImage4,productDetails[i].offerImage5,productDetails[i].offerImage6,productDetails[i].offerImage7,productDetails[i].offerImage8,productDetails[i].offerImage9,productDetails[i].offerImage10,userName],function (err, result) {
			if (err){
                                logger.error(userName + ':manager_model:uploadProductMarket:' + apiname + ':Error:' + err);
                                failureResponse.errorMsg = "Failure in uploading product, Please try again or contact support team!!";
				modelCallback(failureResponse);
			}
		});
	}	
	modelCallback(sucessResponse);
};

managerDB.updateUploadFile = function(apiname, userName, uploadFileName, selectStmt, modelCallback) {
	logger.info(userName+ ":manager_model:updateUploadFile:" + apiname + ":Enter:"+userName+":");
	var failureResponse = {
                "responseCode": -1,
                "response": "",
                "errorMsg": "DB_ERROR"
        };

        var sucessResponse = {
                "responseCode": 0,
                "response": {},
                "errorMsg": ""
        };
	var fs = require('fs');
	con.query(selectStmt,[],function (err, result) {
		if (err){
                        logger.error(userName + ':manager_model:updateUploadFile:' + apiname + ':Error:' + err);
                        modelCallback(failureResponse);
                } else {
			if (result && result.length > 0) {
				for (var i = 0;i < result.length; i++) {
					Object.keys(result[i]).forEach(function(key) {
						fs.appendFileSync(uploadFileName,result[i][key]+"\t");
					});
				}
				fs.appendFileSync(uploadFileName,"\n");
				logger.info(userName+ ":manager_model:getAllProducts:" + apiname + ":Exit:");
				modelCallback(sucessResponse);
			} else {
				logger.error(userName + ':manager_model:updateUploadFile:' + apiname + ':No Product available:');
				modelCallback(failureResponse);
			}
		}
	});
};

managerDB.getProductDetail = function(apiname, userName, selectStmt, modelCallback) {
	logger.info(userName+ ":manager_model:getProductDetail:" + apiname + ":Enter:"+userName+":");
        var failureResponse = {
                "responseCode": -1,
                "response": "",
                "errorMsg": "DB_ERROR"
        };
	var sucessResponse = {
                "responseCode": 0,
                "response": {},
                "errorMsg": ""
        };
	con.query(selectStmt,[],function (err, result) {
		if (err){
                        logger.error(userName + ':manager_model:getProductDetail:' + apiname + ':Error:' + err);
                        modelCallback(failureResponse);
                } else {
			if (result && result.length > 0) {
				sucessResponse.response=result;
				modelCallback(sucessResponse);
			} else {
				logger.error(userName + ':manager_model:getProductDetail:' + apiname + ':Error:NO Rows Available' + err);
				modelCallback(failureResponse);
			}
		}
	});
};

module.exports = managerDB;
