/*jslint node: true */
'use strict';
var adminModel = {};
var config = require('../../config/config');
var mysql_db = require('../../db/mysql_db');
var query_config = require('../../config/query_config');
var logger = config.logger;
var async = require('async');
var _ = require('lodash');
var mysqldb = require('mysql');
var forEach = require('async-foreach').forEach;


var con = mysqldb.createConnection({
        host: "scalelabsdevdb.cababjt98r5d.us-east-1.rds.amazonaws.com",
        user: "scaleLabsDevDB",
        password: "scaleLabsDevDB",
        database : 'my_db'
});

adminModel.checkUserExist = function(apiname, userName,createUserName,modelCallback) {
	logger.info(userName+ ":admin_model:checkUserExist:" + apiname + ":Enter:");
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
        con.query(query_config.ADMIN.USER_EXIST,[createUserName],function (err, result) {
		if (err){
                	logger.error(userName + ':checkUserExist:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "DB_ERROR_TO_FETCH_USERDETAILS";
                        modelCallback(failureResponse);
                }
                else
                {
			if (result && result.length > 0) {
				failureResponse.errorMsg = "user with username already exisit"
				modelCallback(failureResponse);
                        }
                        else
                        {
				modelCallback(sucessResponse);
			}
		}
	});
};
		

adminModel.createUser = function(apiname, userName,createUserName,password,groupName,modelCallback) {
	logger.info(userName+ ":admin_model:createUser:" + apiname + ":Enter:"+userName+":");
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
        con.query(query_config.COMMON.CREATE_USER,[createUserName,password,groupName],function (err, result) {
                if (err){
                        logger.error(userName + ':admin_model:createUser:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "DB_ERROR_TO_INSERT";
                        modelCallback(failureResponse);
                }
                else
                {
                        logger.info(userName + ':admin_model:createUser:' + apiname + ':result:',result);
                        modelCallback(sucessResponse);
                }
        });
};

adminModel.createUserInfo = function(apiname, userName,createUserName,address,description,firstName,lastName,contactNumber,modelCallback) {
        logger.info(userName+ ":admin_model:createUserInfo:" + apiname + ":Enter:"+userName+":");
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
	con.query(query_config.ADMIN.CREATEUSERINFO,[createUserName,address,description,firstName,lastName,contactNumber],function (err, result) {
                if (err){
                        logger.error(userName + ':admin_model:createUserInfo:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "DB_ERROR_TO_INSERT";
                        modelCallback(failureResponse);
                }
                else
                {
                        logger.info(userName + ':admin_model:createUserInfo:' + apiname + ':result:',result);
                        modelCallback(sucessResponse);
                }
        });
};

adminModel.enableUser = function(apiname, userName,enableUserName,modelCallback) {
        logger.info(userName+ ":admin_model:enableUser:" + apiname + ":Enter:"+userName+":");
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
        con.query(query_config.ADMIN.ENABLE_USER,[enableUserName],function (err, result) {
                if (err){
                        logger.error(userName + ':admin_model:enableUser:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "DB_ERROR_TO_INSERT";
                        modelCallback(failureResponse);
                }
                else
                {
                        logger.info(userName + ':admin_model:enableUser:' + apiname + ':result:',result);
                        modelCallback(sucessResponse);
                }
        });
};

adminModel.disableUser = function(apiname, userName,createUserName,modelCallback) {
        logger.info(userName+ ":admin_model:disableUser:" + apiname + ":Enter:"+userName+":");
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
        con.query(query_config.ADMIN.DISABLE_USER,[createUserName],function (err, result) {
                if (err){
                        logger.error(userName + ':admin_model:disableUser:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "DB_ERROR_TO_INSERT";
                        modelCallback(failureResponse);
                }
                else
                {
                        logger.info(userName + ':admin_model:disableUser:' + apiname + ':result:',result);
                        modelCallback(sucessResponse);
                }
        });
};

adminModel.getUnAllocatedSeller = function(apiname, userName,modelCallback) {
        logger.info(userName+ ":admin_model:getUnAllocatedSeller:" + apiname + ":Enter:"+userName+":");
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
        var unAllocatedUser = { "unAllocatedUser" : [] };
        con.query(query_config.ADMIN.UNALLOCATED_USER,function (err, result) {
                if (err){
                        logger.error(userName + ':admin_model:getUnAllocatedSeller:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "Error Fetching users";
                        modelCallback(failureResponse);
                }
		else
		{
			if (result && result.length > 0) {
				for (var i = 0;i < result.length; i++) {
					unAllocatedUser.unAllocatedUser.push({"id" : result[i].USERNAME,"value" : result[i].USERNAME});
				}
			}
			sucessResponse.response = unAllocatedUser;
			modelCallback(sucessResponse);
		}
	});
};

adminModel.getAllocatedSeller = function(apiname, userName,managerUserName,getUnAllocatedSellerResponse,modelCallback) {
        logger.info(userName+ ":admin_model:getAllocatedSeller:" + apiname + ":Enter:");
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
	var allocatedUser = { "allocatedUser" : [] };
        con.query(query_config.ADMIN.ALLOCATED_USER,[managerUserName],function (err, result) {
                if (err){
                        logger.error(userName + ':admin_model:getAllocatedSeller:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "Error Fetching users";
                        modelCallback(failureResponse);
                }
                else
                {
                        if (result && result.length > 0) {
                                for (var i = 0;i < result.length; i++) {
                                        allocatedUser.allocatedUser.push({"id" : result[i].SELLER_USER_ID,"value" : result[i].SELLER_USER_ID});
                                }
                        }
			getUnAllocatedSellerResponse.response= JSON.parse((JSON.stringify(allocatedUser) + JSON.stringify(getUnAllocatedSellerResponse.response)).replace(/}{/g,","))
			logger.info(userName+ ":admin_model:getAllocatedSeller:" + apiname + ":Exit:");
                        modelCallback(getUnAllocatedSellerResponse);
                }
        });
};

adminModel.deleteAllocatedSeller = function(apiname,userName,managerUserName, modelCallback) {
	logger.info(userName+ ":admin_model:deleteAllocatedSeller:" + apiname + ":Enter:");
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
	con.query(query_config.ADMIN.DELETE_ASSOCIATED_SELLER,[managerUserName],function (err, result) {
                if (err){
                        logger.error(userName + ':admin_model:deleteAllocatedSeller:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "Error Allocating Seller";
			modelCallback(failureResponse);
                }
                else
                {
			modelCallback(sucessResponse);
                }
        });
};

adminModel.allocateSeller = function(apiname,userName,managerUserName,allocatedSeller,modelCallback) {
	logger.info(userName+ ":admin_model:allocateSeller:" + apiname + ":Enter:");
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
	for(var i = 0; i < allocatedSeller.length; i++) {
		con.query(query_config.ADMIN.INSERT_ASSOCAITED_SELLER,[managerUserName,allocatedSeller[i].seller],function (err, result) {
			if (err){
				logger.error(userName + ':admin_model:allocateSeller:' + apiname + ':Error:' + err);
                 	       	failureResponse.errorMsg = "Error Allocating Seller";
                        	modelCallback(failureResponse);
               	 	}
		});
	}
	modelCallback(sucessResponse);
};

adminModel.getAllUsers = function(apiname,userName,modelCallback) {
        logger.info(userName+ ":admin_model:getAllUsers:" + apiname + ":Enter:");
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
	var availableUsers = { "availableUsers" : [] };
	con.query(query_config.ADMIN.GET_ALL_USER,function (err, result) {
		if (err){
                        logger.error(userName + ':admin_model:getAllUsers:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "Error Fetching users";
                        modelCallback(failureResponse);
                }
                else
                {
			if (result && result.length > 0) {
				for (var i = 0;i < result.length; i++) {
					var userDetails = { "userName" : "",
                            				"groupName" : "",
                            				"status" : "",
                            				"address" : "",
                            				"description" :"",
                            				"firstName" : "",
                            				"lastName" : "",
                            				"contactNumber" : ""
                        		};
					userDetails.address="";
					userDetails.description="";
					userDetails.contactNumber="";
					userDetails.userName=result[i].USERNAME;
					userDetails.groupName=result[i].GROUP_NAME;
					//userDetails.status=result[i].STATUS;
					if(result[i].STATUS === 1)
						userDetails.status=true;
					else if (result[i].STATUS === 0)
						userDetails.status=false;
					userDetails.address=result[i].ADDRESS;
					userDetails.description=result[i].DESCRIPTION;
                                        userDetails.firstName=result[i].FIRST_NAME;
                                        userDetails.lastName=result[i].LAST_NAME;
                                        userDetails.contactNumber=result[i].CONTACT_NUMBER;
					availableUsers.availableUsers.push(userDetails);
				}
				sucessResponse.response=availableUsers;
			}
			logger.info(userName+ ":admin_model:getAllUsers:" + apiname + ":Exit:");
                        modelCallback(sucessResponse);
                }
        });
};

adminModel.deleteUser = function(apiname, userName,deleteUserName,modelCallback) {
        logger.info(userName+ ":admin_model:deleteUser:" + apiname + ":Enter:");
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
	con.query(query_config.ADMIN.DELETE_USER,[deleteUserName],function (err, result) {
                if (err){
                        logger.error(userName + ':admin_model:deleteUser:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "ERROR deleting the user";
			modelCallback(failureResponse);
                }
                else
                {
			logger.info(userName+ ":admin_model:deleteUser:" + apiname + ":Exit:");
			modelCallback(sucessResponse);
		}
        });
};

adminModel.updateUserDetails = function(apiname,userName,updateUserName,address,description,firstName,lastName,contactNumber,status,modelCallback) {
        logger.info(userName+ ":admin_model:updateUserDetails:" + apiname + ":Enter:");
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
        con.query(query_config.ADMIN.UPDATE_USER_INFO,[address,description,firstName,lastName,contactNumber,status,updateUserName,updateUserName],function (err, result) {
                if (err){
                        logger.error(userName + ':admin_model:updateUserDetails:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "ERROR updating the user";
                        modelCallback(failureResponse);
                }
                else
                {
                        logger.info(userName+ ":admin_model:updateUserDetails:" + apiname + ":Exit:");
                        modelCallback(sucessResponse);
                }
        });
};

adminModel.getManagerRole = function(apiname,userName,modelCallback) {
        logger.info(userName+ ":admin_model:getManagerRole:" + apiname + ":Enter:");
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
	var managerUsers = {"managerUsers":[] };
        con.query(query_config.ADMIN.GET_ALL_MANAGER,[],function (err, result) {
                if (err){
                        logger.error(userName + ':admin_model:getManagerRole:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "Error getting manager user";
                        modelCallback(failureResponse);
                }
                else
                {
			if (result && result.length > 0) {
				for (var i = 0;i < result.length; i++) {
					managerUsers.managerUsers.push({"userName" : result[i].USERNAME});
                                }
			}
			sucessResponse.response = managerUsers;
			logger.info(userName+ ":admin_model:getManagerRole:" + apiname + ":Exit:");
			modelCallback(sucessResponse);
		}
	});
};

adminModel.createMPRequest = function(apiname,userName,marketPlace,newCatEPR,updateCatEPR,updatePriceEPR,newCatLoc,updateCatLoc,updatePriceLoc,getOrderEPR,modelCallback) {
	logger.info(userName+ ":admin_model:createMPRequest:" + apiname + ":Enter:");
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
	con.query(query_config.ADMIN.CREATE_MARKET_PLACE,[marketPlace,newCatEPR,updateCatEPR,updatePriceEPR,getOrderEPR,newCatLoc,updateCatLoc,updatePriceLoc],function (err, result) {
                if (err){
                        logger.error(userName + ':admin_model:createMPRequest:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "DB_ERROR_TO_INSERT";
                        modelCallback(failureResponse);
                }
                else
                {
                        logger.info(userName + ':admin_model:createMPRequest:' + apiname + ':result:',result);
                        modelCallback(sucessResponse);
                }
        });
};

adminModel.updateMPRequest = function(apiname,userName,marketPlace,newCatEPR,updateCatEPR,updatePriceEPR,newCatLoc,updateCatLoc,updatePriceLoc,getOrderEPR,status,modelCallback) {
        logger.info(userName+ ":admin_model:updateMPRequest:" + apiname + ":Enter:");
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
        con.query(query_config.ADMIN.UPDATE_MARKET_PLACE,[newCatEPR,updateCatEPR,updatePriceEPR,getOrderEPR,newCatLoc,updateCatLoc,updatePriceLoc,status,marketPlace],function (err, result) {
                if (err){
                        logger.error(userName + ':admin_model:updateMPRequest:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "DB_ERROR_TO_INSERT";
                        modelCallback(failureResponse);
                }
                else
                {
                        logger.info(userName + ':admin_model:updateMPRequest:' + apiname + ':result:',result);
                        modelCallback(sucessResponse);
                }
        });
};

adminModel.delMPRequest = function(apiname,userName,marketPlace,modelCallback) {
	logger.info(userName+ ":admin_model:delMPRequest:" + apiname + ":Enter:");
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
        con.query(query_config.ADMIN.DELETE_MARKET_PLACE,[marketPlace],function (err, result) {
                if (err){
                        logger.error(userName + ':admin_model:delMPRequest:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "DB_ERROR_TO_INSERT";
                        modelCallback(failureResponse);
                }
                else
                {
                        logger.info(userName + ':admin_model:delMPRequest:' + apiname + ':result:',result);
                        modelCallback(sucessResponse);
                }
        });
};

adminModel.getMarketPlaces  = function(apiname,userName,modelCallback) {
        logger.info(userName+ ":admin_model:getMarketPlaces:" + apiname + ":Enter:");
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
        var marketPlaces = { "marketPlaces" : [] };
	con.query(query_config.ADMIN.GET_ALL_MARKET_PLACE,function (err, result) {
                if (err){
                        logger.error(userName + ':admin_model:getMarketPlaces:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "Error Fetching Market Place";
                        modelCallback(failureResponse);
                }
                else
                {
                        if (result && result.length > 0) {
				for (var i = 0;i < result.length; i++) {
					var marketPlace= { "marketPlace" : "",
							"newCatEPR" :"",
                    					"updateCatEPR":"",
                    					"updatePriceEPR" : "",
							"getOrderEPR":"",
							"newCatLoc":"",
                    					"updateCatLoc":"",
                    					"updatePriceLoc":"",
							"status":""
					};
					marketPlace.marketPlace=result[i].MARKET_PLACE_NAME;
					marketPlace.newCatEPR=result[i].EPR_UPLOAD_NEW_CATALOGUE;
                                        marketPlace.updateCatEPR=result[i].EPR_UPLOAD_UPDATE_CATALOGUE;
                                        marketPlace.updatePriceEPR=result[i].EPR_UPLOAD_UPDATE_PRICE;
                                        marketPlace.getOrderEPR=result[i].EPR_GET_ORDER;
                                        marketPlace.newCatLoc=result[i].UPLOAD_NEW_CATALOGUE_TEMPLATE;
                                        marketPlace.updateCatLoc=result[i].UPLOAD_UPDATE_CATALOGUE_TEMPLATE;
                                        marketPlace.updatePriceLoc=result[i].UPLOAD_UPDATE_PRICE_TEMPLATE;
					if(result[i].STATUS === 1 || result[i].status === 1)
                                        	marketPlace.status=true;
                                        else if (result[i].STATUS === 0 || result[i].STATUS === 0)
						marketPlace.status=false;
					marketPlaces.marketPlaces.push(marketPlace);
				}
			}
			else
			{
				logger.info(userName+ ":admin_model:getMarketPlaces:" + apiname + ":No Market Place Available:");
			}
			sucessResponse.response=marketPlaces;
			logger.info(userName+ ":admin_model:getMarketPlaces:" + apiname + ":Exit:");
                        modelCallback(sucessResponse);
                }
        });
};

adminModel.getSellerUniqueProduct  = function(apiname,userName,sellerName,modelCallback) {
	logger.info(userName+ ":admin_model:getSellerUniqueProduct:" + apiname + ":Enter:");
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
	var productList = { "productList" : [] };
	con.query(query_config.ADMIN.GET_UNIQUE_PRODUCT,[sellerName],function (err, result) {
		if (err){
			logger.error(userName + ':admin_model:getSellerUniqueProduct:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "Error Fetching Product Details";
                        modelCallback(failureResponse);
                } else {
			if (result && result.length > 0) {
				for (var i = 0;i < result.length; i++) {
					var productListTmp = { "lazada" : 0,
							"amazon" : 0,
							"amazonCA" : 0,
							"amazonMX" : 0,
							"amazonUK" : 0,
							"amazonFR" : 0,
							"amazonDE" : 0,
							"amazonIT" : 0,
							"amazonES" : 0,
							"productName" : "",
							"elevenStreet" : 0,
							"sears" : 0,
							"total" : 0
					}
					productListTmp.productName=result[i].PRODUCT_NAME;
					productList.productList.push(productListTmp);
				}
			} else {
				logger.info(userName+ ":admin_model:getSellerUniqueProduct:" + apiname + ":No Product available:");
			}
			sucessResponse.response=productList;
			logger.info(userName+ ":admin_model:getSellerUniqueProduct:" + apiname + ":Exit:");
                        modelCallback(sucessResponse);
		}
	});
};

adminModel.getSellerLazadaProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
	logger.info(userName+ ":admin_model:getSellerLazadaProdCount:" + apiname + ":Enter:");
	var totalRecord=0;
	if(getSellerOrdersCountResponse.response.productList.length === 0 ) {
		modelCallback(getSellerOrdersCountResponse);
	}
	forEach(getSellerOrdersCountResponse.response.productList, function(item, index, arr) {
		var productName = item.productName;
		con.query(query_config.ADMIN.GET_LAZADA_PRODUCT_COUNT,[sellerName,productName],function(err, result) {
			if (err){
                                logger.error(userName + ':admin_model:getSellerLazadaProdCount:' + apiname + ':Error:' + err);
                        } else {
                                if (result && result.length > 0) {
					if (result[0].PROD_COUNT !== null ) {
						getSellerOrdersCountResponse.response.productList[index].lazada=result[0].PROD_COUNT;
					}
				}
			}
			totalRecord++;
			if (totalRecord === getSellerOrdersCountResponse.response.productList.length) {
				modelCallback(getSellerOrdersCountResponse);
			}
                });
	});
	logger.info(userName+ ":admin_model:getSellerLazadaProdCount:" + apiname + ":Exit:");
};

adminModel.getSellerAmazonProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
        logger.info(userName+ ":admin_model:getSellerAmazonProdCount:" + apiname + ":Enter:");
        var totalRecord=0;
        if(getSellerOrdersCountResponse.response.productList.length === 0 ) {
                modelCallback(getSellerOrdersCountResponse);
        }
        forEach(getSellerOrdersCountResponse.response.productList, function(item, index, arr) {
                var productName = item.productName;
                con.query(query_config.ADMIN.GET_AMAZON_PRODUCT_COUNT,[sellerName,productName],function(err, result) {
                        if (err){
                                logger.error(userName + ':admin_model:getSellerAmazonProdCount:' + apiname + ':Error:' + err);
                        } else {
                                if (result && result.length > 0) {
					if (result[0].PROD_COUNT !== null ) {
                                        	getSellerOrdersCountResponse.response.productList[index].amazon=result[0].PROD_COUNT;
					}
                                }
                        }
                        totalRecord++;
                        if (totalRecord === getSellerOrdersCountResponse.response.productList.length) {
                                modelCallback(getSellerOrdersCountResponse);
                        }
                });
        });
	logger.info(userName+ ":admin_model:getSellerAmazonProdCount:" + apiname + ":Exit:");
};

adminModel.getSellerAmazonCaProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
	logger.info(userName+ ":admin_model:getSellerAmazonCaProdCount:" + apiname + ":Enter:");
        var totalRecord=0;
	if(getSellerOrdersCountResponse.response.productList.length === 0 ) {
                modelCallback(getSellerOrdersCountResponse);
        }
        forEach(getSellerOrdersCountResponse.response.productList, function(item, index, arr) {
                var productName = item.productName;
                con.query(query_config.ADMIN.GET_AMAZON_CA_PRODUCT_COUNT,[sellerName,productName],function(err, result) {
                        if (err){
                                logger.error(userName + ':admin_model:getSellerAmazonCaProdCount:' + apiname + ':Error:' + err);
                        } else {
                                if (result && result.length > 0) {
                                        if (result[0].PROD_COUNT !== null ) {
                                                getSellerOrdersCountResponse.response.productList[index].amazonCA=result[0].PROD_COUNT;
                                        }
                                }
                        }
                        totalRecord++;
                        if (totalRecord === getSellerOrdersCountResponse.response.productList.length) {
                                modelCallback(getSellerOrdersCountResponse);
                        }
                });
        });
        logger.info(userName+ ":admin_model:getSellerAmazonCaProdCount:" + apiname + ":Exit:");
};

adminModel.getSellerAmazonMxProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
	logger.info(userName+ ":admin_model:getSellerAmazonMxProdCount:" + apiname + ":Enter:");
        var totalRecord=0;
	if(getSellerOrdersCountResponse.response.productList.length === 0 ) {
                modelCallback(getSellerOrdersCountResponse);
        }
        forEach(getSellerOrdersCountResponse.response.productList, function(item, index, arr) {
                var productName = item.productName;
                con.query(query_config.ADMIN.GET_AMAZON_MX_PRODUCT_COUNT,[sellerName,productName],function(err, result) {
                        if (err){
                                logger.error(userName + ':admin_model:getSellerAmazonMxProdCount:' + apiname + ':Error:' + err);
                        } else {
                                if (result && result.length > 0) {
                                        if (result[0].PROD_COUNT !== null ) {
                                                getSellerOrdersCountResponse.response.productList[index].amazonMX=result[0].PROD_COUNT;
                                        }
                                }
                        }
                        totalRecord++;
                        if (totalRecord === getSellerOrdersCountResponse.response.productList.length) {
                                modelCallback(getSellerOrdersCountResponse);
                        }
                });
        });
        logger.info(userName+ ":admin_model:getSellerAmazonMxProdCount:" + apiname + ":Exit:");
};

adminModel.getSellerAmazonUkProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
	logger.info(userName+ ":admin_model:getSellerAmazonUkProdCount:" + apiname + ":Enter:");
        var totalRecord=0;
	if(getSellerOrdersCountResponse.response.productList.length === 0 ) {
                modelCallback(getSellerOrdersCountResponse);
        }
        forEach(getSellerOrdersCountResponse.response.productList, function(item, index, arr) {
                var productName = item.productName;
                con.query(query_config.ADMIN.GET_AMAZON_UK_PRODUCT_COUNT,[sellerName,productName],function(err, result) {
                        if (err){
                                logger.error(userName + ':admin_model:getSellerAmazonUkProdCount:' + apiname + ':Error:' + err);
                        } else {
                                if (result && result.length > 0) {
                                        if (result[0].PROD_COUNT !== null ) {
                                                getSellerOrdersCountResponse.response.productList[index].amazonUK=result[0].PROD_COUNT;
                                        }
                                }
                        }
                        totalRecord++;
                        if (totalRecord === getSellerOrdersCountResponse.response.productList.length) {
                                modelCallback(getSellerOrdersCountResponse);
                        }
                });
        });
        logger.info(userName+ ":admin_model:getSellerAmazonUkProdCount:" + apiname + ":Exit:");
};

adminModel.getSellerElevenStreetProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
        logger.info(userName+ ":admin_model:getSellerElevenStreetProdCountt:" + apiname + ":Enter:");
        var totalRecord=0;
	if(getSellerOrdersCountResponse.response.productList.length === 0 ) {
                modelCallback(getSellerOrdersCountResponse);
        }
        forEach(getSellerOrdersCountResponse.response.productList, function(item, index, arr) {
                var productName = item.productName;
                con.query(query_config.ADMIN.GET_ELEVEN_STREET_PRODUCT_COUNT,[sellerName,productName],function(err, result) {
                        if (err){
                                logger.error(userName + ':admin_model:getSellerElevenStreetProdCount:' + apiname + ':Error:' + err);
                        } else {
                                if (result && result.length > 0) {
                                        if (result[0].PROD_COUNT !== null ) {
                                                getSellerOrdersCountResponse.response.productList[index].elevenStreet=result[0].PROD_COUNT;
                                        }
                                }
                        }
                        totalRecord++;
                        if (totalRecord === getSellerOrdersCountResponse.response.productList.length) {
                                modelCallback(getSellerOrdersCountResponse);
                        }
                });
        });
        logger.info(userName+ ":admin_model:getSellerElevenStreetProdCount:" + apiname + ":Exit:");
};

adminModel.getTotalProdCount = function(apiname,userName,sellerName,getSellerAmazonProdCountResponse,modelCallback) {
	logger.info(userName+ ":admin_model:getTotalProdCount:" + apiname + ":Enter:");
	forEach(getSellerAmazonProdCountResponse.response.productList, function(item, index, arr) {
		var total=0;
		total=getSellerAmazonProdCountResponse.response.productList[index].amazon + getSellerAmazonProdCountResponse.response.productList[index].lazada + getSellerAmazonProdCountResponse.response.productList[index].amazonCA + getSellerAmazonProdCountResponse.response.productList[index].amazonMX + getSellerAmazonProdCountResponse.response.productList[index].amazonUK+getSellerAmazonProdCountResponse.response.productList[index].elevenStreet+getSellerAmazonProdCountResponse.response.productList[index].amazonFR+getSellerAmazonProdCountResponse.response.productList[index].amazonDE+getSellerAmazonProdCountResponse.response.productList[index].amazonIT+getSellerAmazonProdCountResponse.response.productList[index].amazonES+getSellerAmazonProdCountResponse.response.productList[index].sears;
		getSellerAmazonProdCountResponse.response.productList[index].total=total;
	});
        logger.info(userName+ ":admin_model:getTotalProdCount:" + apiname + ":Exit:");
	modelCallback(getSellerAmazonProdCountResponse);
};

adminModel.getSellerAmazonFrProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
        logger.info(userName+ ":admin_model:getSellerAmazonFrProdCount:" + apiname + ":Enter:");
        var totalRecord=0;
	if(getSellerOrdersCountResponse.response.productList.length === 0 ) {
                modelCallback(getSellerOrdersCountResponse);
        }
        forEach(getSellerOrdersCountResponse.response.productList, function(item, index, arr) {
                var productName = item.productName;
                con.query(query_config.ADMIN.GET_AMAZON_FR_PRODUCT_COUNT,[sellerName,productName],function(err, result) {
                        if (err){
                                logger.error(userName + ':admin_model:getSellerAmazonFrProdCount:' + apiname + ':Error:' + err);
                        } else {
                                if (result && result.length > 0) {
                                        if (result[0].PROD_COUNT !== null ) {
                                                getSellerOrdersCountResponse.response.productList[index].amazonFR=result[0].PROD_COUNT;
                                        }
                                }
                        }
                        totalRecord++;
                        if (totalRecord === getSellerOrdersCountResponse.response.productList.length) {
                                modelCallback(getSellerOrdersCountResponse);
                        }
                });
        });
        logger.info(userName+ ":admin_model:getSellerAmazonFrProdCount:" + apiname + ":Exit:");
};

adminModel.getSellerAmazonDeProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
        logger.info(userName+ ":admin_model:getSellerAmazonDeProdCount:" + apiname + ":Enter:");
        var totalRecord=0;
	if(getSellerOrdersCountResponse.response.productList.length === 0 ) {
                modelCallback(getSellerOrdersCountResponse);
        }
        forEach(getSellerOrdersCountResponse.response.productList, function(item, index, arr) {
                var productName = item.productName;
                con.query(query_config.ADMIN.GET_AMAZON_DE_PRODUCT_COUNT,[sellerName,productName],function(err, result) {
                        if (err){
                                logger.error(userName + ':admin_model:getSellerAmazonDeProdCount:' + apiname + ':Error:' + err);
                        } else {
                                if (result && result.length > 0) {
                                        if (result[0].PROD_COUNT !== null ) {
                                                getSellerOrdersCountResponse.response.productList[index].amazonDE=result[0].PROD_COUNT;
                                        }
                                }
                        }
                        totalRecord++;
                        if (totalRecord === getSellerOrdersCountResponse.response.productList.length) {
                                modelCallback(getSellerOrdersCountResponse);
                        }
                });
        });
        logger.info(userName+ ":admin_model:getSellerAmazonDeProdCount:" + apiname + ":Exit:");
};

adminModel.getSellerAmazonItProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
        logger.info(userName+ ":admin_model:getSellerAmazonItProdCount:" + apiname + ":Enter:");
        var totalRecord=0;
	if(getSellerOrdersCountResponse.response.productList.length === 0 ) {
                modelCallback(getSellerOrdersCountResponse);
        }
        forEach(getSellerOrdersCountResponse.response.productList, function(item, index, arr) {
                var productName = item.productName;
                con.query(query_config.ADMIN.GET_AMAZON_IT_PRODUCT_COUNT,[sellerName,productName],function(err, result) {
                        if (err){
                                logger.error(userName + ':admin_model:getSellerAmazonItProdCount:' + apiname + ':Error:' + err);
                        } else {
                                if (result && result.length > 0) {
                                        if (result[0].PROD_COUNT !== null ) {
                                                getSellerOrdersCountResponse.response.productList[index].amazonIT=result[0].PROD_COUNT;
                                        }
                                }
                        }
                        totalRecord++;
                        if (totalRecord === getSellerOrdersCountResponse.response.productList.length) {
                                modelCallback(getSellerOrdersCountResponse);
                        }
                });
        });
        logger.info(userName+ ":admin_model:getSellerAmazonItProdCount:" + apiname + ":Exit:");
};

adminModel.getSellerAmazonEsProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
        logger.info(userName+ ":admin_model:getSellerAmazonEsProdCount:" + apiname + ":Enter:");
        var totalRecord=0;
	if(getSellerOrdersCountResponse.response.productList.length === 0 ) {
                modelCallback(getSellerOrdersCountResponse);
        }
        forEach(getSellerOrdersCountResponse.response.productList, function(item, index, arr) {
                var productName = item.productName;
                con.query(query_config.ADMIN.GET_AMAZON_ES_PRODUCT_COUNT,[sellerName,productName],function(err, result) {
                        if (err){
                                logger.error(userName + ':admin_model:getSellerAmazonEsProdCount:' + apiname + ':Error:' + err);
                        } else {
                                if (result && result.length > 0) {
                                        if (result[0].PROD_COUNT !== null ) {
                                                getSellerOrdersCountResponse.response.productList[index].amazonES=result[0].PROD_COUNT;
                                        }
                                }
                        }
                        totalRecord++;
                        if (totalRecord === getSellerOrdersCountResponse.response.productList.length) {
                                modelCallback(getSellerOrdersCountResponse);
                        }
                });
        });
        logger.info(userName+ ":admin_model:getSellerAmazonEsProdCount:" + apiname + ":Exit:");
};

adminModel.getSellerSearsProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
        logger.info(userName+ ":admin_model:getSellerSearsProdCount:" + apiname + ":Enter:");
        var totalRecord=0;
	if(getSellerOrdersCountResponse.response.productList.length === 0 ) {
                modelCallback(getSellerOrdersCountResponse);
        }
        forEach(getSellerOrdersCountResponse.response.productList, function(item, index, arr) {
                var productName = item.productName;
                con.query(query_config.ADMIN.GET_SEARS_PRODUCT_COUNT,[sellerName,productName],function(err, result) {
                        if (err){
                                logger.error(userName + ':admin_model:getSellerSearsProdCount:' + apiname + ':Error:' + err);
                        } else {
                                if (result && result.length > 0) {
                                        if (result[0].PROD_COUNT !== null ) {
                                                getSellerOrdersCountResponse.response.productList[index].sears=result[0].PROD_COUNT;
                                        }
                                }
                        }
                        totalRecord++;
                        if (totalRecord === getSellerOrdersCountResponse.response.productList.length) {
                                modelCallback(getSellerOrdersCountResponse);
                        }
                });
        });
        logger.info(userName+ ":admin_model:getSellerSearsProdCount:" + apiname + ":Exit:");
};

module.exports = adminModel;
