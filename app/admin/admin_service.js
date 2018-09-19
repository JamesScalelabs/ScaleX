/*jslint node: true */
'use strict';
var adminService = {};
var admin_model = require('./admin_model');
var config = require('../../config/config');
var logger = config.logger;

adminService.checkUserExist = function(apiname,username,createUserName,modelCallback) {
	logger.info(username + ":admin_service:checkUserExist:" + apiname + ":Enter");
        admin_model.checkUserExist(apiname,username,createUserName,function(response) {
                logger.info(username + ":admin_service:checkUserExist:" + apiname + ":Exit");
                modelCallback(response);
        });
};

adminService.createUser = function(apiname,username,createUserName,password,groupName,modelCallback) {
	logger.info(username + ":admin_service:createUser:" + apiname + ":Enter");
	admin_model.createUser(apiname,username,createUserName,password,groupName,function(response) {
		logger.info(username + ":admin_service:createUser:" + apiname + ":Exit");
		modelCallback(response);
	});
};

adminService.createUserInfo = function(apiname,username,createUserName,address,description,firstName,lastName,contactNumber,modelCallback) {
	logger.info(username + ":admin_service:createUserInfo:" + apiname + ":Enter");
        admin_model.createUserInfo(apiname,username,createUserName,address,description,firstName,lastName,contactNumber,function(response) {
                logger.info(username + ":admin_service:createUserInfo:" + apiname + ":Exit");
                modelCallback(response);
        });
};

adminService.enableUser = function(apiname,username,enableUserName,modelCallback) {
        logger.info(username + ":admin_service:enableUser:" + apiname + ":Enter");
        admin_model.enableUser(apiname,username,enableUserName,function(response) {
                logger.info(username + ":admin_service:enableUser:" + apiname + ":Exit");
                modelCallback(response);
        });
};

adminService.disableUser = function(apiname,username,disableUserName,modelCallback) {
        logger.info(username + ":admin_service:disableUser:" + apiname + ":Enter");
        admin_model.disableUser(apiname,username,disableUserName,function(response) {
                logger.info(username + ":admin_service:disableUser:" + apiname + ":Exit");
                modelCallback(response);
        });
};

adminService.getUnAllocatedSeller = function(apiname,username,modelCallback) {
        logger.info(username + ":admin_service:getUnAllocatedSeller:" + apiname + ":Enter");
        admin_model.getUnAllocatedSeller(apiname,username,function(response) {
                logger.info(username + ":admin_service:getUnAllocatedSeller:" + apiname + ":Exit");
                modelCallback(response);
        });
};

adminService.getAllocatedSeller = function(apiname,username,managerUserName,getUnAllocatedSellerResponse,modelCallback) {
        logger.info(username + ":admin_service:getAllocatedSeller:" + apiname + ":Enter");
        admin_model.getAllocatedSeller(apiname,username,managerUserName,getUnAllocatedSellerResponse,function(response) {
                logger.info(username + ":admin_service:getAllocatedSeller:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.deleteAllocatedSeller = function(apiname,username,managerUserName,modelCallback) {
        logger.info(username + ":admin_service:deleteAllocatedSeller:" + apiname + ":Enter");
        admin_model.deleteAllocatedSeller(apiname,username,managerUserName,function(response) {
                logger.info(username + ":admin_service:deleteAllocatedSeller:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.allocateSeller = function(apiname,username,managerUserName,allocatedSeller,modelCallback) {
        logger.info(username + ":admin_service:allocateSeller:" + apiname + ":Enter");
        admin_model.allocateSeller(apiname,username,managerUserName,allocatedSeller,function(response) {
                logger.info(username + ":admin_service:allocateSeller:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.getAllUsers = function(apiname,userName,modelCallback) {
        logger.info(userName + ":admin_service:getAllUsers:" + apiname + ":Enter");
        admin_model.getAllUsers(apiname,userName,function(response) {
                logger.info(userName + ":admin_service:getAllUsers:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.deleteUser = function(apiname,userName,deleteUserName,modelCallback) {
        logger.info(userName + ":admin_service:deleteUser:" + apiname + ":Enter");
        admin_model.deleteUser(apiname,userName,deleteUserName,function(response) {
                logger.info(userName + ":admin_service:deleteUser:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.updateUserDetails = function(apiname,userName,updateUserName,address,description,firstName,lastName,contactNumber,status,modelCallback) {
        logger.info(userName + ":admin_service:updateUserDetails:" + apiname + ":Enter");
        admin_model.updateUserDetails(apiname,userName,updateUserName,address,description,firstName,lastName,contactNumber,status,function(response) {
                logger.info(userName + ":admin_service:updateUserDetails:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.getManagerRole = function(apiname,userName,modelCallback) {
        logger.info(userName + ":admin_service:getManagerRole:" + apiname + ":Enter");
        admin_model.getManagerRole(apiname,userName,function(response) {
                logger.info(userName + ":admin_service:getManagerRole:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.createMPRequest = function(apiname,userName,marketPlace,newCatEPR,updateCatEPR,updatePriceEPR,newCatLoc,updateCatLoc,updatePriceLoc,getOrderEPR,modelCallback) {
	logger.info(userName + ":admin_service:createMPRequest:" + apiname + ":Enter");
        admin_model.createMPRequest(apiname,userName,marketPlace,newCatEPR,updateCatEPR,updatePriceEPR,newCatLoc,updateCatLoc,updatePriceLoc,getOrderEPR,function(response) {
		logger.info(userName + ":admin_service:createMPRequest:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.updateMPRequest = function(apiname,userName,marketPlace,newCatEPR,updateCatEPR,updatePriceEPR,newCatLoc,updateCatLoc,updatePriceLoc,getOrderEPR,status,modelCallback) {
	logger.info(userName + ":admin_service:updateMPRequest:" + apiname + ":Enter");
        admin_model.updateMPRequest(apiname,userName,marketPlace,newCatEPR,updateCatEPR,updatePriceEPR,newCatLoc,updateCatLoc,updatePriceLoc,getOrderEPR,status,function(response) {
                logger.info(userName + ":admin_service:updateMPRequest:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.delMPRequest = function(apiname,userName,marketPlace,modelCallback) {
	logger.info(userName + ":admin_service:delMPRequest:" + apiname + ":Enter");
        admin_model.delMPRequest(apiname,userName,marketPlace,function(response) {
		logger.info(userName + ":admin_service:delMPRequest:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.getMarketPlaces = function(apiname,userName,modelCallback) {
        logger.info(userName + ":admin_service:getMarketPlaces:" + apiname + ":Enter");
        admin_model.getMarketPlaces(apiname,userName,function(response) {
                logger.info(userName + ":admin_service:getMarketPlaces:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.getSellerUniqueProduct = function(apiname,userName,sellerName,modelCallback) {
        logger.info(userName + ":admin_service:getSellerUniqueProduct:" + apiname + ":Enter");
        admin_model.getSellerUniqueProduct(apiname,userName,sellerName,function(response) {
                logger.info(userName + ":admin_service:getSellerUniqueProduct:" + apiname + ":Exit",response);
		modelCallback(response);
        });
};

adminService.getSellerLazadaProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
	logger.info(userName + ":admin_service:getSellerLazadaProdCount:" + apiname + ":Enter");
        admin_model.getSellerLazadaProdCount(apiname,userName,sellerName,getSellerOrdersCountResponse,function(response) {
                logger.info(userName + ":admin_service:getSellerLazadaProdCount:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.getSellerAmazonProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
        logger.info(userName + ":admin_service:getSellerAmazonProdCount:" + apiname + ":Enter");
        admin_model.getSellerAmazonProdCount(apiname,userName,sellerName,getSellerOrdersCountResponse,function(response) {
                logger.info(userName + ":admin_service:getSellerAmazonProdCount:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.getSellerAmazonCaProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
	logger.info(userName + ":admin_service:getSellerAmazonCaProdCount:" + apiname + ":Enter");
        admin_model.getSellerAmazonCaProdCount(apiname,userName,sellerName,getSellerOrdersCountResponse,function(response) {
                logger.info(userName + ":admin_service:getSellerAmazonCaProdCount:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.getSellerAmazonMxProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
	logger.info(userName + ":admin_service:getSellerAmazonMxProdCount:" + apiname + ":Enter");
        admin_model.getSellerAmazonMxProdCount(apiname,userName,sellerName,getSellerOrdersCountResponse,function(response) {
                logger.info(userName + ":admin_service:getSellerAmazonMxProdCount:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.getSellerAmazonUkProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
	logger.info(userName + ":admin_service:getSellerAmazonUkProdCount:" + apiname + ":Enter");
        admin_model.getSellerAmazonUkProdCount(apiname,userName,sellerName,getSellerOrdersCountResponse,function(response) {
                logger.info(userName + ":admin_service:getSellerAmazonUkProdCount:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.getSellerElevenStreetProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
        logger.info(userName + ":admin_service:getSellerElevenStreetProdCount:" + apiname + ":Enter");
        admin_model.getSellerElevenStreetProdCount(apiname,userName,sellerName,getSellerOrdersCountResponse,function(response) {
                logger.info(userName + ":admin_service:getSellerElevenStreetProdCount:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.getTotalProdCount = function(apiname,userName,sellerName,getSellerAmazonProdCountResponse,modelCallback) {
        logger.info(userName + ":admin_service:getTotalProdCount:" + apiname + ":Enter");
        admin_model.getTotalProdCount(apiname,userName,sellerName,getSellerAmazonProdCountResponse,function(response) {
                logger.info(userName + ":admin_service:getTotalProdCount:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.getSellerOrdersCount = function(apiname,userName,sellerName,modelCallback) {
	logger.info(userName + ":admin_service:getSellerOrdersCount:" + apiname + ":Enter");
        admin_model.getSellerOrdersCount(apiname,userName,sellerName,function(response) {
                logger.info(userName + ":admin_service:getSellerOrdersCount:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.getSellerAmazonFrProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
        logger.info(userName + ":admin_service:getSellerAmazonFrProdCount:" + apiname + ":Enter");
        admin_model.getSellerAmazonFrProdCount(apiname,userName,sellerName,getSellerOrdersCountResponse,function(response) {
                logger.info(userName + ":admin_service:getSellerAmazonFrProdCount:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.getSellerAmazonDeProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
        logger.info(userName + ":admin_service:getSellerAmazonDeProdCount:" + apiname + ":Enter");
        admin_model.getSellerAmazonDeProdCount(apiname,userName,sellerName,getSellerOrdersCountResponse,function(response) {
                logger.info(userName + ":admin_service:getSellerAmazonDeProdCount:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.getSellerAmazonItProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
        logger.info(userName + ":admin_service:getSellerAmazonItProdCount:" + apiname + ":Enter");
        admin_model.getSellerAmazonItProdCount(apiname,userName,sellerName,getSellerOrdersCountResponse,function(response) {
                logger.info(userName + ":admin_service:getSellerAmazonItProdCount:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.getSellerAmazonEsProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
        logger.info(userName + ":admin_service:getSellerAmazonEsProdCount:" + apiname + ":Enter");
        admin_model.getSellerAmazonEsProdCount(apiname,userName,sellerName,getSellerOrdersCountResponse,function(response) {
                logger.info(userName + ":admin_service:getSellerAmazonEsProdCount:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};

adminService.getSellerSearsProdCount = function(apiname,userName,sellerName,getSellerOrdersCountResponse,modelCallback) {
        logger.info(userName + ":admin_service:getSellerSearsProdCount:" + apiname + ":Enter");
        admin_model.getSellerSearsProdCount(apiname,userName,sellerName,getSellerOrdersCountResponse,function(response) {
                logger.info(userName + ":admin_service:getSellerSearsProdCount:" + apiname + ":Exit",response);
                modelCallback(response);
        });
};



module.exports = adminService;
