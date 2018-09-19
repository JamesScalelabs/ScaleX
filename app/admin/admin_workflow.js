/*jslint node: true */
'use strict';
var adminWorkflow={};
var adminService=require('./admin_service');
var userService=require('./../user/user_service');
var config = require('../../config/config');
var logger = config.logger;
var async = require('async');
var jwt = require('jsonwebtoken');
var failureResponse = {
        "responseCode": -1,
        "response": "",
        "errorMsg": ""
};
var sucessResponse = {
                "responseCode": 0,
                "response": {},
                "msg": ""
};

adminWorkflow.enableUser = function(apiname, lang, locale,request, responseCallback) {
        logger.info(request.userName + ":admin_workflow:enableUser:" + apiname + ":Enter");
        async.waterfall(
        [
                function(callback) {
                        adminService.enableUser(apiname, request.userName, request.user.userName, function(enableUserResponse) {
                                if (enableUserResponse.responseCode === 0) {
                                        callback(null,sucessResponse);
                                } else {
                                        failureResponse.errorMsg = "Disabling User Failed";
                                        callback(failureResponse,null);
                                }
                        });
                },
        ],
        function(err, results) {
                if (err) {
                        logger.error(request.userName + ":admin_workflow:enableUser:" + apiname + ":Exit");
                        responseCallback(err);
                } else {
                        logger.info(request.userName + ":admin_workflow:enableUser:" + apiname + ":Exit:", results);
                        responseCallback(results);
                }
        });
};

adminWorkflow.disableUser = function(apiname, lang, locale,request, responseCallback) {
        logger.info(request.userName + ":admin_workflow:disableUser:" + apiname + ":Enter");
	async.waterfall(
        [
                function(callback) {
			adminService.disableUser(apiname, request.userName, request.user.userName, function(disableUserResponse) {
				if (disableUserResponse.responseCode === 0) {
                                        callback(null,sucessResponse);
                                } else {
                                        failureResponse.errorMsg = "Disabling User Failed";
					callback(failureResponse,null);
				}
			});
                },
	],
	function(err, results) {
                if (err) {
                        logger.error(request.userName + ":admin_workflow:disableUser:" + apiname + ":Exit");
                        responseCallback(err);
                } else {
                        logger.info(request.userName + ":admin_workflow:disableUser:" + apiname + ":Exit:", results);
			responseCallback(results);
                }
	});
};

adminWorkflow.createUser = function(apiname, lang, locale,request, responseCallback) {
        logger.info(request.userName + ":admin_workflow:createUser:" + apiname + ":Enter");
        async.waterfall(
        [
		function(callback) {
			adminService.checkUserExist(apiname, request.userName,request.user.userName,function(checkUserExistResponse) {
				if(checkUserExistResponse.responseCode === 0) {
                                        callback(null,sucessResponse);
                                } else {
                                        failureResponse.errorMsg = "User Already Exist";
                                        callback(failureResponse,null);
                                }
                        });
                },
		function(sucessResponse,callback) {
			adminService.createUser(apiname, request.userName,request.user.userName,request.user.password,request.user.groupName, function(createUserResponse) {
                                if (createUserResponse.responseCode === 0) {
                                        callback(null,sucessResponse);
                                } else {
                                        failureResponse.errorMsg = "Failed to Create User";
					callback(failureResponse,null);
                                }
                        });
                },
		function(sucessResponse,callback) {
			adminService.createUserInfo(apiname, request.userName,request.user.userName,request.user.address,request.user.description,request.user.firstName,request.user.lastName, request.user.contactNumber, function(createUserInfoResponse) {
                                if (createUserInfoResponse.responseCode === 0) {
                                        callback(null,sucessResponse);
                                } else {
                                        failureResponse.errorMsg = "Failed to Create User";
                                        callback(failureResponse,null);
                                }
                        });
                },
	],
        function(err, results) {
                if (err) {
                        logger.error(request.userName + ":admin_workflow:createUser:" + apiname + ":Exit");
                        responseCallback(err);
                } else {
                        logger.info(request.userName + ":admin_workflow:createUser:" + apiname + ":Exit:", results);
                        responseCallback(results);
                }
        });
};

adminWorkflow.getAllocateSeller = function(apiname, lang, locale,request, responseCallback) {
	logger.info(request.userName + ":admin_workflow:getAllocateSeller:" + apiname + ":Enter");
	async.waterfall(
	[
		function(callback) {
			adminService.getUnAllocatedSeller(apiname, request.userName, function(getUnAllocatedSellerResponse) {
				if(getUnAllocatedSellerResponse.responseCode === 0) {
					callback(null,getUnAllocatedSellerResponse);
				} else {
					failureResponse.errorMsg = "Error Fetching users";
					callback(failureResponse,null);
				}
			});
		},
		function(getUnAllocatedSellerResponse,callback)
		{
			adminService.getAllocatedSeller(apiname, request.userName, request.user.managerUserName, getUnAllocatedSellerResponse, function(getAllocatedSellerResponse) {
				if(getAllocatedSellerResponse.responseCode === 0) {
					callback(null,getAllocatedSellerResponse);
				} else {
					failureResponse.errorMsg = "Error Fetching users";
					callback(failureResponse,null);
				}
			});
		},
	],
	function(err, results) {
		if (err) {
			logger.error(request.userName + ":admin_workflow:getAllocateSeller:" + apiname + ":Exit",err);
			responseCallback(err);
		} else {
			logger.info(request.userName + ":admin_workflow:getAllocateSeller:" + apiname + ":Exit:", results);
			responseCallback(results);
		}
	});
};

adminWorkflow.allocateSeller = function(apiname, lang, locale,request, responseCallback) {
        logger.info(request.userName + ":admin_workflow:allocateSeller:" + apiname + ":Enter");
        async.waterfall(
        [
                function(callback) {
                        adminService.deleteAllocatedSeller(apiname, request.userName,request.user.managerUserName, function(deleteAllocatedSellerResponse) {
                                if(deleteAllocatedSellerResponse.responseCode === 0) {
                                        callback(null,deleteAllocatedSellerResponse);
                                } else {
                                        failureResponse.errorMsg = "Error Allocating seller"
					callback(failureResponse,null);
                                }
                        });
                },
		function(deleteAllocatedSellerResponse,callback)
		{
                	adminService.allocateSeller(apiname,request.userName,request.user.managerUserName,request.user.allocatedSeller,function(allocateSellerResponse) {
				if(allocateSellerResponse.responseCode === 0) {
                                        callback(null,allocateSellerResponse);
                                } else {
                                        failureResponse.errorMsg = "Error Allocating seller"
					callback(failureResponse,null);
                                }
                        });
                },
        ],
        function(err, results) {
                if (err) {
                        logger.error(request.userName + ":admin_workflow:allocateSeller:" + apiname + ":Exit",err);
                        responseCallback(err);
                } else {
                        logger.info(request.userName + ":admin_workflow:allocateSeller:" + apiname + ":Exit:", results);
                        responseCallback(results);
                }
        });
};

adminWorkflow.getAllUsers = function(apiname, lang, locale,request, responseCallback) {
	logger.info(request.userName + ":admin_workflow:getAllUsers:" + apiname + ":Enter");
        async.waterfall(
        [
                function(callback) {
                        adminService.getAllUsers(apiname, request.userName,function(getAllUsersResponse) {
                                if(getAllUsersResponse.responseCode === 0) {
                                        callback(null,getAllUsersResponse);
                                } else {
                                        failureResponse.errorMsg = "Error in getting users";
					callback(failureResponse,null);
				}
			});
                },
	],
	function(err, results) {
                if (err) {
                        logger.error(request.userName + ":admin_workflow:getAllUsers:" + apiname + ":Exit",err);
                        responseCallback(err);
                } else {
                        logger.info(request.userName + ":admin_workflow:getAllUsers:" + apiname + ":Exit:", results);
                        responseCallback(results);
                }
        });
};

adminWorkflow.deleteUser = function(apiname, lang, locale,request, responseCallback) {
        logger.info(request.userName + ":admin_workflow:deleteUser:" + apiname + ":Enter");
        async.waterfall(
        [
                function(callback) {
                        adminService.deleteUser(apiname, request.userName,request.user.userName,function(deleteUserResponse) {
                                if(deleteUserResponse.responseCode === 0) {
                                        callback(null,deleteUserResponse);
                                } else {
                                        failureResponse.errorMsg = "Error in deleting user";
					callback(failureResponse,null);
                                }
                        });
                },
        ],
        function(err, results) {
                if (err) {
                        logger.error(request.userName + ":admin_workflow:deleteUser:" + apiname + ":Exit",err);
                        responseCallback(err);
                } else {
                        logger.info(request.userName + ":admin_workflow:deleteUser:" + apiname + ":Exit:", results);
                        responseCallback(results);
                }
        });
};

adminWorkflow.updateUserDetails = function(apiname, lang, locale,request, responseCallback) {
        logger.info(request.userName + ":admin_workflow:updateUserDetails:" + apiname + ":Enter");
        async.waterfall(
        [
                function(callback) {
                        adminService.updateUserDetails(apiname, request.userName,request.user.userName,request.user.address,request.user.description,request.user.firstName,request.user.lastName,request.user.contactNumber,request.user.status,function(updateUserDetailsResponse) {
                                if(updateUserDetailsResponse.responseCode === 0) {
                                        callback(null,updateUserDetailsResponse);
                                } else {
                                        failureResponse.errorMsg = "Error in updating user";
                                        callback(failureResponse,null);
                                }
                        });
                },
        ],
        function(err, results) {
                if (err) {
                        logger.error(request.userName + ":admin_workflow:updateUserDetails:" + apiname + ":Exit",err);
                        responseCallback(err);
                } else {
                        logger.info(request.userName + ":admin_workflow:updateUserDetails:" + apiname + ":Exit:", results);
                        responseCallback(results);
                }
        });
};

adminWorkflow.getManagerRole = function(apiname, lang, locale,request, responseCallback) {
        logger.info(request.userName + ":admin_workflow:getManagerRole:" + apiname + ":Enter");
        async.waterfall(
        [
                function(callback) {
                        adminService.getManagerRole(apiname,request.userName,function(getManagerRoleResponse) {
                                if(getManagerRoleResponse.responseCode === 0) {
                                        callback(null,getManagerRoleResponse);
                                } else {
                                        failureResponse.errorMsg = "No Manager User Found";
					callback(failureResponse,null);
                                }
                        });
                },
        ],
        function(err, results) {
                if (err) {
                        logger.error(request.userName + ":admin_workflow:getManagerRole:" + apiname + ":Exit",err);
                        responseCallback(err);
                } else {
                        logger.info(request.userName + ":admin_workflow:getManagerRole:" + apiname + ":Exit:", results);
                        responseCallback(results);
                }
        });
};

adminWorkflow.createMPRequest = function(apiname, lang, locale,request, responseCallback) {
	logger.info(request.userName + ":admin_workflow:createMPRequest:" + apiname + ":Enter");
	async.waterfall(
        [
			function(callback) {
				adminService.createMPRequest(apiname,request.userName,request.marketPlace.marketPlace,request.marketPlace.newCatEPR,request.marketPlace.updateCatEPR,request.marketPlace.updatePriceEPR,request.marketPlace.newCatLoc,request.marketPlace.updateCatLoc,request.marketPlace.updatePriceLoc,request.marketPlace.getOrderEPR, function(createMPRequestResponse) {
					if(createMPRequestResponse.responseCode === 0) {
						callback(null,sucessResponse);
					} else {
						failureResponse.errorMsg = "Failed to Create  Market Place";
						callback(failureResponse,null);
					}
				});
			},
		],
		function(err, results) {
			if (err) {
				logger.error(request.userName + ":admin_workflow:createMPRequest:" + apiname + ":Exit");
					responseCallback(err);
			} else {
				logger.info(request.userName + ":admin_workflow:createMPRequest:" + apiname + ":Exit:", results);
				responseCallback(results);
            }
		}
	);
};
	
				
							
					
adminWorkflow.updateMPRequest = function(apiname, lang, locale,request, responseCallback) {
	logger.info(request.userName + ":admin_workflow:updateMPRequest:" + apiname + ":Enter");
	async.waterfall(
        [
			function(callback) {
				adminService.updateMPRequest(apiname,request.userName,request.marketPlace.marketPlace,request.marketPlace.newCatEPR,request.marketPlace.updateCatEPR,request.marketPlace.updatePriceEPR,request.marketPlace.newCatLoc,request.marketPlace.updateCatLoc,request.marketPlace.updatePriceLoc,request.marketPlace.getOrderEPR,request.marketPlace.status, function(updateMPRequestResponse) {
					if(updateMPRequestResponse.responseCode === 0) {
						callback(null,sucessResponse);
					} else {
						failureResponse.errorMsg = "Failed to Update Market Place";
						callback(failureResponse,null);
					}
				});
			},
		],
		function(err, results) {
			if (err) {
				logger.error(request.userName + ":admin_workflow:updateMPRequest:" + apiname + ":Exit");
					responseCallback(err);
			} else {
				logger.info(request.userName + ":admin_workflow:updateMPRequest:" + apiname + ":Exit:", results);
				responseCallback(results);
            }
		}
	);
};						
				
				
adminWorkflow.delMPRequest = function(apiname, lang, locale,request, responseCallback) {
	logger.info(request.userName + ":admin_workflow:delMPRequest:" + apiname + ":Enter");
	async.waterfall(
        [
			function(callback) {
				adminService.delMPRequest(apiname,request.userName,request.marketPlace.marketPlace, function(delMPRequestResponse) {
					if(delMPRequestResponse.responseCode === 0) {
						callback(null,sucessResponse);
					} else {
						failureResponse.errorMsg = "Failed to Delete Market Place";
						callback(failureResponse,null);
					}
				});
			},
		],
		function(err, results) {
			if (err) {
				logger.error(request.userName + ":admin_workflow:delMPRequest:" + apiname + ":Exit");
					responseCallback(err);
			} else {
				logger.info(request.userName + ":admin_workflow:delMPRequest:" + apiname + ":Exit:", results);
				responseCallback(results);
            }
		}
	);
};							

adminWorkflow.getMarketPlaces = function(apiname, lang, locale,request, responseCallback) {
        logger.info(request.userName + ":admin_workflow:getMarketPlaces:" + apiname + ":Enter");
        async.waterfall(
        [
                function(callback) {
                        adminService.getMarketPlaces(apiname, request.userName,function(getMarketPlacesResponse) {
                                if(getMarketPlacesResponse.responseCode === 0) {
                                        callback(null,getMarketPlacesResponse);
                                } else {
                                        failureResponse.errorMsg = "Error in getting users";
                                        callback(failureResponse,null);
                                }
                        });
                },
        ],
        function(err, results) {
                if (err) {
                        logger.error(request.userName + ":admin_workflow:getMarketPlaces:" + apiname + ":Exit",err);
                        responseCallback(err);
                } else {
                        logger.info(request.userName + ":admin_workflow:getMarketPlaces:" + apiname + ":Exit:", results);
                        responseCallback(results);
                }
        });
};

adminWorkflow.getSellerOrdersCount = function(apiname, lang, locale,request, responseCallback) {
	logger.info(request.userName + ":admin_workflow:getSellerOrdersCount:" + apiname + ":Enter");
        async.waterfall(
        [
                function(callback) {
                        adminService.getSellerUniqueProduct(apiname,request.userName,request.user.sellerName,function(getSellerOrdersCountResponse) {
				if(getSellerOrdersCountResponse.responseCode === 0) {
                        		callback(null,getSellerOrdersCountResponse);
                                } else {
                                        failureResponse.errorMsg = "Error in getting orders";
                                        callback(failureResponse,null);
                                }
			});
		},
		function(getSellerOrdersCountResponse,callback)
		{
			adminService.getSellerLazadaProdCount(apiname,request.userName,request.user.sellerName,getSellerOrdersCountResponse,function(getSellerLazadaProdCountResponse) {
				callback(null,getSellerLazadaProdCountResponse);
			});
		},
		function(getSellerLazadaProdCountResponse,callback)
                {
                        adminService.getSellerAmazonProdCount(apiname,request.userName,request.user.sellerName,getSellerLazadaProdCountResponse,function(getSellerAmazonProdCountResponse) {
                                callback(null,getSellerAmazonProdCountResponse);
                        });
                },
		function(getSellerAmazonProdCountResponse,callback)
                {
			adminService.getSellerAmazonCaProdCount(apiname,request.userName,request.user.sellerName,getSellerAmazonProdCountResponse,function(getSellerAmazonCaProdCountResponse) {
                                callback(null,getSellerAmazonCaProdCountResponse);
                        });
                },
		function(getSellerAmazonCaProdCountResponse,callback)
                {
                        adminService.getSellerAmazonMxProdCount(apiname,request.userName,request.user.sellerName,getSellerAmazonCaProdCountResponse,function(getSellerAmazonMxProdCountResponse) {
                                callback(null,getSellerAmazonMxProdCountResponse);
                        });
                },
                function(getSellerAmazonMxProdCountResponse,callback)
                {
                        adminService.getSellerAmazonUkProdCount(apiname,request.userName,request.user.sellerName,getSellerAmazonMxProdCountResponse,function(getSellerAmazonUkProdCountResponse) {
                                callback(null,getSellerAmazonUkProdCountResponse);
                        });
                },
		function(getSellerAmazonUkProdCountResponse,callback)
                {
                        adminService.getSellerElevenStreetProdCount(apiname,request.userName,request.user.sellerName,getSellerAmazonUkProdCountResponse,function(getSellerElevenStreetProdCountResponse) {
                                callback(null,getSellerElevenStreetProdCountResponse);
                        });
                },
		function(getSellerElevenStreetProdCountResponse,callback)
                {
                        adminService.getSellerAmazonFrProdCount(apiname,request.userName,request.user.sellerName,getSellerElevenStreetProdCountResponse,function(getSellerAmazonFrProdCountResponse) {
                                callback(null,getSellerAmazonFrProdCountResponse);
                        });
                },
				function(getSellerAmazonFrProdCountResponse,callback)
                {
                        adminService.getSellerAmazonDeProdCount(apiname,request.userName,request.user.sellerName,getSellerAmazonFrProdCountResponse,function(getSellerAmazonDeProdCountResponse) {
                                callback(null,getSellerAmazonDeProdCountResponse);
                        });
                },
				function(getSellerAmazonDeProdCountResponse,callback)
                {
                        adminService.getSellerAmazonItProdCount(apiname,request.userName,request.user.sellerName,getSellerAmazonDeProdCountResponse,function(getSellerAmazonItProdCountResponse) {
                                callback(null,getSellerAmazonItProdCountResponse);
                        });
                },
				function(getSellerAmazonItProdCountResponse,callback)
                {
                        adminService.getSellerAmazonEsProdCount(apiname,request.userName,request.user.sellerName,getSellerAmazonItProdCountResponse,function(getSellerAmazonEsProdCountResponse) {
                                callback(null,getSellerAmazonEsProdCountResponse);
                        });
                },
				function(getSellerAmazonEsProdCountResponse,callback)
                {
                        adminService.getSellerSearsProdCount(apiname,request.userName,request.user.sellerName,getSellerAmazonEsProdCountResponse,function(getSellerSearsProdCountResponse) {
                                callback(null,getSellerSearsProdCountResponse);
                        });
                },
		function(getSellerAmazonProdCountResponse,callback)
		{
			adminService.getTotalProdCount(apiname,request.userName,request.user.sellerName,getSellerAmazonProdCountResponse,function(getTotalProdCountResponse) {
				callback(null,getTotalProdCountResponse);
                        });
                },
	],
	function(err, results) {
                if (err) {
                        logger.error(request.userName + ":admin_workflow:getSellerOrdersCount:" + apiname + ":Exit",err);
                        responseCallback(err);
                } else {
                        logger.info(request.userName + ":admin_workflow:getSellerOrdersCount:" + apiname + ":Exit",results);
                        responseCallback(results);
                }
        });
};

module.exports = adminWorkflow;
