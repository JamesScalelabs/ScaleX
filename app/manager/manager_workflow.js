/*jslint node: true */
'use strict';
var date = require('date-and-time');
var managerWorkflow={};
var managerService=require('./manager_service');
var config = require('../../config/config');
var logger = config.logger;
var async = require('async');
var jwt = require('jsonwebtoken');
var fs = require("fs");
var contents = fs.readFileSync('./config/appkey_config.js','utf8');
var crypto    = require('crypto');
var algorithm = 'sha256';
var date = require('date-and-time');
var rl = require('readline-specific')
var requestApi = require('request');
//var amazonMws = require('amazon-mws');
var ebay = require('./../../node_modules/ebay-api/index.js');
var xmlBuilder = require('xml');

var failureResponse = {
	"responseCode": -1,
        "response": "",
        "errorMsg": ""
};

managerWorkflow.uploadProductLazada = function(apiname, lang, locale,request, responseCallback) {
	logger.info(request.userName + ":manager_workflow:uploadProductLazada:" + apiname + ":Enter");
        var sucessResponse = {
                "responseCode": 0,
                "response": {},
                "errorMsg": "Product Uploaded successfully to lazada marketplace",
                "sucessMsg":"Product Uploaded successfully to lazada marketplace"
        };

	async.waterfall(
        [
		function(callback) {
			var jsonContent = JSON.parse(contents);
                        const sellerAppKey = request.user.sellerName.concat('_password');
                        const sellerUser = request.user.sellerName.concat('_uname');
                        var appKey = jsonContent[sellerAppKey];
                        var user = jsonContent[sellerUser];
                        if(appKey == null || user == null) {
                                callback(failureResponse,null);
			} else {
				user = user.replace('@','%40');
                                var timestamp = new Date().toISOString();
                                timestamp = timestamp.replace(/:/g,"%3A");
                                timestamp = timestamp.replace(/\..+/, '');
                                timestamp = timestamp+'%2B00%3A00';
				var hmac;
				var text= 'Action=CreateProduct&Format=json&Timestamp='+timestamp+'&UserID='+user+'&Version=1.0';
				var hash;
                                hmac = crypto.createHmac(algorithm, appKey);
				hmac.setEncoding('hex');
                                hmac.end(text, function () {
                                        hash = hmac.read();
				});
				hash=hmac.read();
				var url='https://api.sellercenter.lazada.com.my/?';
				/*commonService.getSellerOrders(apiname, request.userName,request.user.sellerName,hash,text,url,function(getSellerOrdersResponse) {
                                        if(getSellerOrdersResponse.responseCode === 0) {
                                                callback(null,getSellerOrdersResponse);
                                        } else {
                                                failureResponse.errorMsg = "Error in getting orders";
                                                callback(failureResponse,null);
                                        }
                                });*/
				callback(null,sucessResponse);
			}
		},
	],
        function(err, results) {
                if (err) {
                        logger.error(request.userName + ":manager_workflow:uploadProductMarket:" + apiname + ":Exit",err);
                        responseCallback(err);
                } else {
                        logger.info(request.userName + ":manager_workflow:uploadProductMarket:" + apiname + ":Exit",results);
                        responseCallback(results);
                }
        });
};

managerWorkflow.uploadProductMarket = function(apiname, lang, locale,request, responseCallback) {
	logger.info(request.userName + ":manager_workflow:uploadProductMarket:" + apiname + ":Enter");
        var sucessResponse = {
                "responseCode": 0,
                "response": {},
                "errorMsg": "Product Uploaded successfully to marketplace",
                "sucessMsg":"Product Uploaded successfully to marketplace"
        };
	async.waterfall(
        [
		function(callback) {
			logger.info("Start of amazon Product Upload");
			logger.info("------------------------------");
			var amazonRequestProduct = {
				"productDetails": []
			};
			async.eachSeries(request.productDetails,function(amazonProduct,amazonCallback) {
				var productDetail = {
					"marketPlace": "amazon",
					"id" : "",
					"productCategory": ""
				};
				productDetail.id=amazonProduct.id;
				managerService.getAmazonCategory(apiname,request.userName,productDetail.id,function(response) {
					if(response.responseCode === 0 ) {
						productDetail.productCategory=response.productCategory;
						amazonRequestProduct.productDetails.push(productDetail);
					}
					amazonCallback();
				});
			},function(err, result) {
				callback(null,amazonRequestProduct);
			});
		},
		function(amazonRequestProduct,callback) {
			logger.info("amazonRequestProduct : ",JSON.stringify(amazonRequestProduct));
			var amazonproductDetails = {"amazonproductDetails":[]};
			var amazonTemplates = {"amazonTemplates":[]};
			for (var i=0 ; i < amazonRequestProduct.productDetails.length; i++) {
				var templateFile = "";
				if(amazonRequestProduct.productDetails[i].marketPlace === "amazon") {
					amazonproductDetails.amazonproductDetails.push(amazonRequestProduct.productDetails[i]);
					templateFile = amazonRequestProduct.productDetails[i].marketPlace;
					if (amazonRequestProduct.productDetails[i].productCategory != null && amazonRequestProduct.productDetails[i].productCategory.length > 0) {
						templateFile = templateFile+"_"+amazonRequestProduct.productDetails[i].productCategory;
					}
					//templateFile = templateFile+".txt";
					if(! amazonTemplates.amazonTemplates.includes(templateFile)) {
						amazonTemplates.amazonTemplates.push(templateFile);
					}
				}
			}
			callback(null,amazonproductDetails,amazonTemplates);
		},
		//update the status of the product to uploaded for amazon product category table
		function(apd,amazonTemplates,callback) {
			for (var i=0 ; i < apd.amazonproductDetails.length; i++ ) {
				var tableName = "SELLER_PRODUCT_UPLOAD";
				var updateStmt = "update "+tableName+" set amazonUS_upload_status = 'uploaded' where ID = '"+apd.amazonproductDetails[i].id+"'";
				managerService.updateProductStatus(apiname,request.userName,updateStmt,function(response) {
					logger.info("manager_workflow:updateProductStatus: "+apd.amazonproductDetails[i].id);
				});
			}
			callback(null,apd,amazonTemplates);
		},
		//create upload files
		function(apd,amazonTemplates,callback) {
			if (amazonTemplates.amazonTemplates.length > 0 )
			{
				var timestamp = new Date();
				var timestamp = date.format(timestamp,'YYYY:MM:DD:HH:MM:SS');
				timestamp = timestamp.replace(/:/g,"");
				for (var i=0 ; i < amazonTemplates.amazonTemplates.length;i++ ) {
					var fs = require('fs');
					fs.createReadStream("./templates/"+amazonTemplates.amazonTemplates[i]+".txt").pipe(fs.createWriteStream("./catalogue/amazon/"+amazonTemplates.amazonTemplates[i]+"_"+timestamp+".txt"));
				}
			}
			callback(null,apd,amazonTemplates,timestamp);
		},
		//update the data to upload files
		function(apd,amazonTemplates,timestamp,callback) {
			var i=0;
			var uploadFileNameList = {"uploadFileNameList":[]};
			if (amazonTemplates.amazonTemplates.length === 0 ) {
				callback(null,uploadFileNameList);
			}
			async.eachSeries(apd.amazonproductDetails,function(amazonproductDetails,callback1){
				i++;
				var uploadFileName = amazonproductDetails.marketPlace;
				//var tableName = amazonproductDetails.marketPlace;
				var tableName = "SELLER_PRODUCT_UPLOAD";
				if(amazonproductDetails.productCategory != null && amazonproductDetails.productCategory.length > 0) {
					uploadFileName = uploadFileName+"_"+amazonproductDetails.productCategory;
				//	tableName = tableName+"_"+amazonproductDetails.productCategory;
				}
				//tableName = tableName+"_catalogue";
				uploadFileName = uploadFileName+"_"+timestamp+".txt";
				uploadFileName = "./catalogue/amazon/"+uploadFileName;
				if(! uploadFileNameList.uploadFileNameList.includes(uploadFileName)) {
					uploadFileNameList.uploadFileNameList.push(uploadFileName);
				}
				logger.info("uploadFileName -> ",uploadFileName);
				rl.oneline(uploadFileName,3,function(err, res) {
					var selectStmt = "select ";
					res = res.replace(/\t/g,",");
					selectStmt = selectStmt + res +" from "+tableName+" where ID = '"+amazonproductDetails.id+"'";
					logger.info("selectStmt : ",selectStmt);
					if (i == apd.amazonproductDetails.length ) {
						managerService.updateUploadFile(apiname,request.userName,uploadFileName,selectStmt,function(response) {
							callback(null,uploadFileNameList);
						});
					} else {
						managerService.updateUploadFile(apiname,request.userName,uploadFileName,selectStmt,function(response) {
							callback1();
						});
					}
				});
			});
		},
		//function to read all the amazon market place parameters
		function(uploadFileNameList,callback) {
			var amazonConfig = {
                                "responseCode": -1,
                                "sellerId":"",
                                "accountNo":"",
                                "accessKeyId":"",
                                "secretKey":"",
                                "sellerIdEu":"",
                                "accountNoEu":"",
                                "accessKeyIdEu":"",
                                "secretKeyEu":"",
                                "fileName":"",
                                "feedSubmissionId":"",
                                "feedSubmissionIdEu":"",
                                "productIdList":[]
                        }
			var jsonContent = JSON.parse(contents);
			const amazonSellerId = request.user.sellerName.concat('_amazon_us_seller_id');
                        const amazonAccountNo = request.user.sellerName.concat('_amazon_us_account_no');
                        const amazonAccessKeyId = request.user.sellerName.concat('_amazon_us_access_key_id');
                        const amazonSecretKey = request.user.sellerName.concat('_amazon_us_secret_key');
                        const amazonSellerIdEu = request.user.sellerName.concat('_amazon_eu_seller_id');
                        const amazonAccountNoEu = request.user.sellerName.concat('_amazon_eu_account_no');
                        const amazonAccessKeyIdEu = request.user.sellerName.concat('_amazon_eu_access_key_id');
                        const amazonSecretKeyEu = request.user.sellerName.concat('_amazon_eu_secret_key');
			var sellerId = jsonContent[amazonSellerId];
                        var accountNo = jsonContent[amazonAccountNo];
                        var accessKeyId = jsonContent[amazonAccessKeyId];
                        var secretKey = jsonContent[amazonSecretKey];
                        var sellerIdEu = jsonContent[amazonSellerIdEu];
                        var accountNoEu = jsonContent[amazonAccountNoEu];
                        var accessKeyIdEu = jsonContent[amazonAccessKeyIdEu];
                        var secretKeyEu = jsonContent[amazonSecretKeyEu];
			//if (sellerId == null && accountNo == null && accessKeyId == null && secretKey == null) {
				logger.info("amazon us acount exist<--------------------------------");
				amazonConfig.responseCode=0;
				amazonConfig.sellerId=sellerId;
                                amazonConfig.accountNo=accountNo;
                                amazonConfig.accessKeyId=accessKeyId;
                                amazonConfig.secretKey=secretKey;
		//	}
		//	if (sellerIdEu != null && accountNoEu != null && accessKeyIdEu != null && secretKeyEu != null) {
				amazonConfig.responseCode=0;
                                amazonConfig.sellerIdEu=sellerIdEu;
                                amazonConfig.accountNoEu=accountNoEu;
                                amazonConfig.accessKeyIdEu=accessKeyIdEu;
                                amazonConfig.secretKeyEu=secretKeyEu;
		//	}
			callback(null,uploadFileNameList,amazonConfig);
		},
		function(uploadFileNameList,amazonConfig,callback) {
			logger.info("uploadFileNameList : ",uploadFileNameList);
			logger.info("amazonConfig : ",amazonConfig);
			if (uploadFileNameList.uploadFileNameList.length > 0 ) {
				if (amazonConfig.responseCode === 0 && amazonConfig.sellerId.length > 0) {
					var accessKey = amazonConfig.accessKeyId;
					var accessSecret = amazonConfig.secretKey;
					var i = 0;
					async.eachSeries(uploadFileNameList.uploadFileNameList,function(fileName,callback1){
						i++;
						var FeedContent = fs.readFileSync(fileName, 'UTF-8');
						var amazonMws = require('amazon-mws')(accessKey, accessSecret);
						amazonMws.feeds.submit({
							'Version': '2009-01-01',
                                		        'Action': 'SubmitFeed',
                        	        	        'FeedType': '_POST_PRODUCT_DATA_',
                	                	        'FeedContent': FeedContent,
        	                                	'SellerId': amazonConfig.sellerId,
	                                        	'MWSAuthToken': amazonConfig.accountNo
						}, function (error, response) {
							if (error) {
								logger.info("amazon feed submit error ",error);
								console.log('error ', error);
                                                                callback1();
							}
							logger.info("amazon response on SubmitFeed : ",response);
							console.log('amazon response on SubmitFeed : ', response);
							var FeedSubmissionId = response.FeedSubmissionInfo.FeedSubmissionId;
							if(amazonConfig.feedSubmissionId.length === 0 ) {
								amazonConfig.feedSubmissionId = response.FeedSubmissionInfo.FeedSubmissionId;
							} else {
								amazonConfig.feedSubmissionId = amazonConfig.feedSubmissionId+","+response.FeedSubmissionInfo.FeedSubmissionId;
							}
							amazonMws.feeds.search({
								'Version': '2009-01-01',
                                                		'Action': 'GetFeedSubmissionResult',
                                                		'SellerId': amazonConfig.sellerId,
                                                		'MWSAuthToken': amazonConfig.accountNo,
                                                		'FeedSubmissionId': FeedSubmissionId
							}, function (error, response) {
								if (error) {
									logger.info("error : ",error);
									callback1();
								}
								logger.info("response on GetFeedSubmissionList : ", response);
								if (i === uploadFileNameList.uploadFileNameList.length) { callback(null,uploadFileNameList,amazonConfig); }
								callback1();
							});
						});
					});
				} else {
					callback(null,uploadFileNameList,amazonConfig);
				}
			} else {
				callback(null,uploadFileNameList,amazonConfig);
			}
		},
		function(uploadFileNameList,amazonConfig,callback) {
			if (uploadFileNameList.uploadFileNameList.length > 0 ) {
				if (amazonConfig.responseCode === 0 && amazonConfig.sellerIdEu.length > 0) {
					var accessKeyEu = amazonConfig.accessKeyIdEu;
					var accessSecretEu = amazonConfig.secretKeyEu;
					var i = 0;
					async.eachSeries(uploadFileNameList.uploadFileNameList,function(fileName,callback1){
						i++;
						var FeedContent = fs.readFileSync(fileName, 'UTF-8');
						var amazonMws = require('amazon-mws')(accessKeyEu, accessSecretEu);
						amazonMws.feeds.submit({
                                                        'Version': '2009-01-01',
                                                        'Action': 'SubmitFeed',
                                                        'FeedType': '_POST_PRODUCT_DATA_',
                                                        'FeedContent': FeedContent,
                                                        'SellerId': amazonConfig.sellerIdEu,
                                                        'MWSAuthToken': amazonConfig.accountNoEu
						}, function(error, response) {
							if (error) {
                                                                console.log('error ', error);
                                                                return;
                                                        }
							logger.info("response on SubmitFeed : ", response);
							var FeedSubmissionId = response.FeedSubmissionInfo.FeedSubmissionId;
							if(amazonConfig.feedSubmissionIdEu.length === 0 ) {
                                                                amazonConfig.feedSubmissionIdEu = response.FeedSubmissionInfo.FeedSubmissionId;
							} else {
								amazonConfig.feedSubmissionIdEu = amazonConfig.feedSubmissionIdEu+","+response.FeedSubmissionInfo.FeedSubmissionId;
							}
							amazonMws.feeds.search({
                                                                'Version': '2009-01-01',
                                                                'Action': 'GetFeedSubmissionResult',
                                                                'SellerId': amazonConfig.sellerIdEu,
                                                                'MWSAuthToken': amazonConfig.accountNoEu,
								'FeedSubmissionId': FeedSubmissionId
                                                        }, function (error, response) {
                                                                if (error) {
                                                                        logger.info("error : ",error);
                                                                        return;
                                                                }
                                                                logger.info("response on GetFeedSubmissionList : ", response);
                                                                if (i === uploadFileNameList.uploadFileNameList.length) { callback(null,uploadFileNameList,amazonConfig); }
                                                                callback1();
							});
						});
					});
				} else {
					callback(null,uploadFileNameList,amazonConfig);
				}
			} else {
				callback(null,uploadFileNameList,amazonConfig);
			}
		},
		//End of upload to amazon Market Place

		//Start of upload to Lazada Market Place
		function(uploadFileNameList,amazonConfig,callback) {
			logger.info("start uploading product to lazada marketplace");
			logger.info("---------------------------------------------");
			var lazadaproductDetails = {"lazadaproductDetails":[]};
			var lazadaTemplates = {"lazadaTemplates":[]};
			for (var i=0 ; i < request.productDetails.length; i++) {
				var templateFile = "";
				//if(request.productDetails[i].marketPlace === "lazada") {
					lazadaproductDetails.lazadaproductDetails.push(request.productDetails[i]);
					templateFile = request.productDetails[i].marketPlace;
					if (request.productDetails[i].productCategory != null && request.productDetails[i].productCategory.length > 0) {
                                                templateFile = templateFile+"_"+request.productDetails[i].productCategory;
                                        }
					//templateFile = templateFile+".txt";
					templateFile ="lazada_template.txt";
					if(! lazadaTemplates.lazadaTemplates.includes(templateFile)) {
						lazadaTemplates.lazadaTemplates.push(templateFile);
					}
				//}
			}
			callback(null,lazadaproductDetails,lazadaTemplates);
		},
		//update the status of the product to uploaded for lazada product category table
		function(lpd,lazadaTemplates,callback) {
			for (var i=0 ; i < lpd.lazadaproductDetails.length; i++ ) {
				var tableName = "SELLER_PRODUCT_UPLOAD";
				var updateStmt = "update "+tableName+" set lazada_upload_status = 'uploaded' where ID = '"+lpd.lazadaproductDetails[i].id+"'";
				managerService.updateProductStatus(apiname,request.userName,updateStmt,function(response) {
                                        logger.info("manager_workflow:updateProductStatus:lazada "+lpd.lazadaproductDetails[i].id);
				});
			}
			callback(null,lpd,lazadaTemplates);
		},
		function(lpd,lazadaTemplates,callback) {
			var jsonContent = JSON.parse(contents);
                        const sellerAppKey = request.user.sellerName.concat('_password');
                        const sellerUser = request.user.sellerName.concat('_uname');
                        var appKey = jsonContent[sellerAppKey];
                        var user = jsonContent[sellerUser];
                        if(appKey == null || user == null) {
                                callback(null,lpd,lazadaTemplates,"false","false","false");
			} else {
				user = user.replace('@','%40');
                                var timestamp = new Date().toISOString();
                                timestamp = timestamp.replace(/:/g,"%3A");
                                timestamp = timestamp.replace(/\..+/, '');
                                timestamp = timestamp+'%2B00%3A00';
                                var hmac;
                                var text= 'Action=CreateProduct&Format=json&Timestamp='+timestamp+'&UserID='+user+'&Version=1.0';
                                var hash;
                                hmac = crypto.createHmac(algorithm, appKey);
                                hmac.setEncoding('hex');
                                hmac.end(text, function () {
                                        hash = hmac.read();
                                });
                                hash=hmac.read();
                                var url='https://api.sellercenter.lazada.com.my/?';
				callback(null,lpd,lazadaTemplates,hash,url,text);
			}
		},
		function(lpd,lazadaTemplates,hash,url,text,callback) {
			async.eachSeries(lpd.lazadaproductDetails,function(prod,callback1){
				var tableName = "SELLER_PRODUCT_UPLOAD";
				var templateFile ="lazada_template.txt";
				var fs = require('fs'), readline = require('readline');
				var rd = readline.createInterface({
					input: fs.createReadStream("./templates/"+templateFile),
					console: false
				});
				var column = "";
				var xml = "";
				rd.on('line', function(line) {
					xml = xml + line+"\n";
					if(line.includes("$")) {
						var tmp = line.split(">")[1];
						tmp = tmp.split("<")[0];
						tmp = tmp.replace('$','');
						column = column+tmp+",";
					}
				}).on('close', function() {
					var x = column.length-1;
					column=column.substring(0,x);
					var selectStmt = "select "+column+" from "+tableName+" where ID = '"+prod.id+"'";
					logger.info("Getting Lazada ProductDetails select Stmt : "+selectStmt+"\n");
					managerService.getProductDetail(apiname,request.userName,selectStmt,function(response) {
						if(response.responseCode === 0 ) {
							var tmp1 = column.split(",");
							for (var j = 0; j < tmp1.length ; j++) {
								var tmp3 = tmp1[j];
								var tmp2 = tmp1[j];
								tmp2 = "$"+tmp2;
								if (response.response[0][tmp3] !== null) {
									xml = xml.replace(tmp2,response.response[0][tmp3]);
								} else {
									xml = xml.replace(tmp2,'');
								}
							}
							logger.info("Lazada xml input request is \n"+xml);
							var sellerName = request.user.sellerName;
							var finalUrl = url+text+'&Signature='+hash;
							logger.info("finalUrl : "+finalUrl);
							var options = {
								uri : finalUrl,
								method : 'POST',
								body : xml
							}
							requestApi(options, function (error, response, body) {
								logger.info("lazada response body : ",body);
								callback1();
							});
						} else {
							callback1();
						}
					});
				});
			});
			callback(null,lpd);
		},

		//Start of upload to ElevenStreet Market Place
		function(lpd,callback) {
			logger.info("Starting to insert products for 11Street\n");
			var elevenProductDetails = {"elevenProductDetails":[]};
			for (var i=0 ; i < request.productDetails.length; i++) {
					elevenProductDetails.elevenProductDetails.push(request.productDetails[i]);
			}
			callback(null,elevenProductDetails);
		},
		//update the status of the product to uploaded for ElevenStreet product category table
		function(epd,callback) {
			for (var i=0 ; i < epd.elevenProductDetails.length; i++ ) {
				var tableName = "SELLER_PRODUCT_UPLOAD";
				var updateStmt = "update "+tableName+" set elevenStreet_upload_status = 'uploaded' where ID = '"+epd.elevenProductDetails[i].id+"'";
				managerService.updateProductStatus(apiname,request.userName,updateStmt,function(response) {
					logger.info("manager_workflow:updateProductStatus:elevenStreet: "+epd.elevenProductDetails[i].id);
				});
			}
			callback(null,epd);
		},
		function(epd,callback) {
			var jsonContent = JSON.parse(contents);
			const elevenStreetSite = "elevenStreet_site";
			const elevenStreetKey = request.user.sellerName.concat('_elevenStateKey');
			var site = jsonContent[elevenStreetSite];
                        var sellerKey = jsonContent[elevenStreetKey];
			if(site == null || sellerKey == null) {
				logger.info("Eleven Street Upload cancelled as site or API key missing");
				callback(null,epd,"false","false");
			} else {
				callback(null,epd,site,sellerKey);
			}
		},
		function(epd,site,sellerKey,callback) {
			if(sellerKey === "false" ) {
				callback(null,epd);
			} else {
				async.eachSeries(epd.elevenProductDetails,function(prod,callback1){
					var tableName = "SELLER_PRODUCT_UPLOAD";
					var templateFile = "elevenStreet.txt";
					var fs = require('fs'), readline = require('readline');
                                	var rd = readline.createInterface({
                                        	input: fs.createReadStream("./templates/"+templateFile),
                                        	console: false
                                	});
                                	var column = "";
                                	var xml = "";
					rd.on('line', function(line) {
	                                        xml = xml + line+"\n";
	                                        if(line.includes("$")) {
	                                                var tmp = line.split(">")[1];
	                                                tmp = tmp.split("<")[0];
	                                                tmp = tmp.replace('$','');
	                                                column = column+tmp+",";
	                                        }
	                                }).on('close', function() {
						var x = column.length-1;
						column=column.substring(0,x);
						var selectStmt = "select "+column+" from "+tableName+" where ID = '"+prod.id+"'";
						logger.info("Getting elevenStreets ProductDetails select Stmt : "+selectStmt+" ");
						managerService.getProductDetail(apiname,request.userName,selectStmt,function(response) {
							if(response.responseCode === 0 ) {
								var tmp1 = column.split(",");
								for (var j = 0; j < tmp1.length ; j++) {
									var tmp3 = tmp1[j];
									var tmp2 = tmp1[j];
									tmp2 = "$"+tmp2;
									if (response.response[0][tmp3] !== null) {
                                                                	        xml = xml.replace(tmp2,response.response[0][tmp3]);
                                                                	} else {
                                                                        	xml = xml.replace(tmp2,'');
                                                                	}
								}
								logger.info("11 street xml is \n"+xml);
								var headers = {
                							'Content-Type': 'application/xml',
                							'Accept-Charset': 'utf8',
                							'openapikey': sellerKey
        							};
								var options = {
									url: "http://api.11street.my/rest/prodservices/product",
									method: 'POST',
									body : xml,
									headers: headers
								};
								requestApi(options, function (error, response, body) {
                                                                        logger.info("11 Streen insert product response for error : ",error);
                                                                        //logger.info("11 Streen insert product response for response : ",response);
                                                                	logger.info("11 Streen insert product response for body : ",body);
                                                        	});
								callback1();
							} else {
								callback1();
							}
						});
					});
				});
				callback(null,epd);
			}
		},
		//Start of upload to ebay market place
		function(epd,callback) {
			var ebayProductDetails = {"ebayProductDetails":[]};
                        for (var i=0 ; i < request.productDetails.length; i++) {
					ebayProductDetails.ebayProductDetails.push(request.productDetails[i]);
			}
			callback(null,ebayProductDetails);
		},
		//update the status of the product to uploaded for ebay product category table
		function(epd,callback) {
			for (var i=0 ; i < epd.ebayProductDetails.length; i++ ) {
				var tableName = "SELLER_PRODUCT_UPLOAD";
				var updateStmt = "update "+tableName+" set ebay_upload_status = 'uploaded' where ID = '"+epd.ebayProductDetails[i].id+"'";
				managerService.updateProductStatus(apiname,request.userName,updateStmt,function(response) {
                                        logger.info("manager_workflow:updateProductStatus:ebay: "+epd.ebayProductDetails[i].id);
				});
			}
			callback(null,epd);
		},
		function(epd,callback) {
                        var jsonContent = JSON.parse(contents);
			const ebaySellerDevId = request.user.sellerName.concat('_ebaySellerDevId');
                        const ebaySellerCertId = request.user.sellerName.concat('_ebaySellerCertId');
                        const ebaySellerAppId = request.user.sellerName.concat('_ebaySellerAppIdKey');
                        const ebaySellerAuthToken = request.user.sellerName.concat('_ebaySellerAuthToken');
			var sellerDevId = jsonContent[ebaySellerDevId];
                        var sellerCertId = jsonContent[ebaySellerCertId];
                        var sellerAppId = jsonContent[ebaySellerAppId];
                        var sellerAuthToken = jsonContent[ebaySellerAuthToken];
			if(sellerDevId === null || sellerCertId === null || sellerAppId === null || sellerAuthToken === null) {
				callback(null,epd,"false","false","false","false");
			} else {
				callback(null,epd,sellerDevId,sellerCertId,sellerAppId,sellerAuthToken);
			}
		},
		function(epd,sellerDevId,sellerCertId,sellerAppId,sellerAuthToken,callback) {
			if (sellerDevId === "false" ) {
                                callback(null,epd);
                        } else {
				async.eachSeries(epd.ebayProductDetails,function(prod,callback1){
					var tableName = "SELLER_PRODUCT_UPLOAD";
					var templateFile = "ebay.txt";
                                        var fs = require('fs'), readline = require('readline');
                                        var rd = readline.createInterface({
                                                input: fs.createReadStream("./templates/"+templateFile),
                                                console: false
                                        });
                                        var column = "";
                                        var xml = "";
					rd.on('line', function(line) {
                                                xml = xml + line+"\n";
                                                if(line.includes("$")) {
							var tmp = line.split(":")[1];
							tmp=tmp.replace("\"","");
							tmp=tmp.replace("\"","");
							tmp=tmp.replace("$","");
							tmp=tmp.replace(",","");
							column = column+tmp+",";
						}
					}).on('close', function() {
						var x = column.length-1;
                                                column=column.substring(0,x);
						column=column.replace(/ /g,"");
                                                var selectStmt = "select "+column+" from "+tableName+" where ID = '"+prod.id+"'";
						logger.info("Getting ebay ProductDetails select Stmt : "+selectStmt+"\n");
						managerService.getProductDetail(apiname,request.userName,selectStmt,function(response) {
							if(response.responseCode === 0 ) {
								var tmp1 = column.split(",");
								for (var j = 0; j < tmp1.length ; j++) {
                                                                        var tmp3 = tmp1[j];
                                                                        var tmp2 = tmp1[j];
                                                                        tmp2 = "$"+tmp2;
                                                                        if (response.response[0][tmp3] !== null) {
                                                                                xml = xml.replace(tmp2,response.response[0][tmp3]);
                                                                        } else {
                                                                                xml = xml.replace(tmp2,'');
                                                                        }
                                                                }
								var uploadJson = JSON.parse(xml);
								logger.info("uploadJson for ebay is \n",uploadJson);
								ebay.xmlRequest({
									serviceName: 'Trading',
									opType: 'AddItems',
									devId: sellerDevId,
                                                                        certId: sellerCertId,
                                                                        appId: sellerAppId,
									sandbox: false,
									authToken: sellerAuthToken,
									params: uploadJson,
								}, function(error, results) {
									logger.info("ebay upload error : ",error);
									logger.info("ebay upload results : ",results);
									callback1();
								});
							} else {
								callback1();
							}
						});
					});
				});
                                callback(null,epd);
			}
		},
		//start of sears market place upload
		function(epd,callback) {
			logger.info("Starting to sears product to marketplace");
			logger.info("----------------------------------------");
                        var searsProductDetails = {"searsProductDetails":[]};
			for (var i=0 ; i < request.productDetails.length; i++) {
                        	searsProductDetails.searsProductDetails.push(request.productDetails[i]);
                        }
                        callback(null,searsProductDetails);
		},
		//update the status of the product to uploaded for  sears product category table
		function(epd,callback) {
			for (var i=0 ; i < epd.searsProductDetails.length; i++ ) {
                                var tableName = "SELLER_PRODUCT_UPLOAD"
                                var updateStmt = "update "+tableName+" set sears_upload_status = 'uploaded' where ID = '"+epd.searsProductDetails[i].id+"'";
                                managerService.updateProductStatus(apiname,request.userName,updateStmt,function(response) {
                                        logger.info("manager_workflow:updateProductStatus:sears: "+epd.searsProductDetails[i].id);
                                });
                        }
                        callback(null,epd);
                },
                function(epd,callback) {
			var jsonContent = JSON.parse(contents);
                        const searsSite = "sears_site";
                        const searsSellerId = request.user.sellerName.concat('_sears_seller_id');
                        const searsSellerSecretKey = request.user.sellerName.concat('_sears_secret_key');
                        const searsSellerEmail = request.user.sellerName.concat('_sears_seller_email');
                        var site = jsonContent[searsSite];
                        var sellerId = jsonContent[searsSellerId];
                        var sellerSecretKey = jsonContent[searsSellerSecretKey];
                        var sellerEmail = jsonContent[searsSellerEmail];
			if(site === null || sellerId === null || sellerSecretKey === null || sellerEmail=== null ) {
				callback(null,epd,"false","false","false","false");
			} else {
				callback(null,epd,site,sellerId,sellerSecretKey,sellerEmail);
			}
		},
		function(epd,site,sellerId,sellerSecretKey,sellerEmail,callback) {
			if (sellerId === "false" ) {
                                callback(null,epd);
                        } else {
				async.eachSeries(epd.searsProductDetails,function(prod,callback1){
                                        var tableName = "SELLER_PRODUCT_UPLOAD";
					var templateFile = "sears.txt";
                                        var fs = require('fs'), readline = require('readline');
                                        var rd = readline.createInterface({
                                                input: fs.createReadStream("./templates/"+templateFile),
                                                console: false
                                        });
                                        var column = "";
                                        var xml = "";
                                        rd.on('line', function(line) {
                                                xml = xml + line+"\n";
                                                if(line.includes("$")) {
							var tmp = line.split("$")[1];
							tmp=tmp.split("\"")[0];
							tmp=tmp.split("<")[0];
							column = column+tmp+",";
						}
                                        }).on('close', function() {
                                                var x = column.length-1;
                                                column=column.substring(0,x);
                                                column=column.replace(/ /g,"");
						var selectStmt = "select "+column+" from "+tableName+" where ID = '"+prod.id+"'";
                                                logger.info("Getting sears ProductDetails select Stmt : "+selectStmt+"\n");
                                                managerService.getProductDetail(apiname,request.userName,selectStmt,function(response) {
							if(response.responseCode === 0 ) {
								var tmp1 = column.split(",");
                                                                for (var j = 0; j < tmp1.length ; j++) {
                                                                        var tmp3 = tmp1[j];
                                                                        var tmp2 = tmp1[j];
                                                                        tmp2 = "$"+tmp2;
                                                                        if (response.response[0][tmp3] !== null) {
                                                                                xml = xml.replace(tmp2,response.response[0][tmp3]);
                                                                        } else {
                                                                                xml = xml.replace(tmp2,'');
                                                                        }
                                                                }
								var dt = new Date();
								var requestTs="";
                                                                requestTs = dt.getFullYear()+"-"+("0"+(dt.getMonth()+1)).slice(-2)+"-"+("0"+dt.getDate()).slice(-2)+"T"+dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds()+"Z";
                                                                var text = sellerId+":"+sellerEmail+":"+requestTs;
                                                                var hash;
                                                                var hmac;
                                                                hmac = crypto.createHmac(algorithm,sellerSecretKey);
                                                                hmac.setEncoding('hex');
                                                                hmac.end(text, function () {
									hash = hmac.read();
                                				});
                                                                hash=hmac.read();
								var header = "HMAC-SHA256 emailaddress="+sellerEmail+",timestamp="+requestTs+",signature="+hash;
								var headers = {
                							'Authorization':header
								};
								var siteUrl="https://seller.marketplace.sears.com/SellerPortal/api/catalog/fbm/v24?sellerId="+sellerId+"";
								var options = {
									url: siteUrl,
									method: 'PUT',
                                                                        body : xml,
                                                                        headers: headers
                                                                };
								logger.info("Sears Request : ",JSON.stringify(options));
								requestApi(options, function (error, response, body) {
                                                                        logger.info("Sears Response body : ",body);
									callback1();
                                                                });
							} else {
								callback1();
							}
						});
					});
				});
				callback(null,sucessResponse);
			}
		},
	],
        function(err, results) {
                if (err) {
                        logger.error(request.userName + ":manager_workflow:uploadProductMarket:" + apiname + ":Exit",err);
                        responseCallback(err);
                } else {
                        logger.info(request.userName + ":manager_workflow:uploadProductMarket:" + apiname + ":Exit",results);
                        responseCallback(results);
                }
        });
};
/*
managerWorkflow.uploadProductMarket = function(apiname, lang, locale,request, responseCallback) {
	logger.info(request.userName + ":manager_workflow:uploadProductMarket:" + apiname + ":Enter");
	var sucessResponse = {
                "responseCode": 0,
                "response": {},
		"errorMsg": "Product Uploaded successfully to marketplace",
		"sucessMsg":"Product Uploaded successfully to marketplace"
        };
	async.waterfall(
	[
		function(callback) {
			var productDetails=request.productDetails;
			for(var i = 0; i < productDetails.length; i++) {
				managerService.updateProductStatus(apiname,request.userName,productDetails[i].id,'uploaded',function(updateProductStatusResponse) {
					logger.info("manager_workflow:updateProductStatus: "+productDetails[i].id);
				});
			}
			callback(null,sucessResponse);
                },
		//Upload to amazon US market place
		function(sucessResponse,callback) {
			var amazonConfig = {
				"responseCode": -1,
				"site":"",
				"marketPlaceId":"",
                                "sellerId":"",
                                "accountNo":"",
                                "accessKeyId":"",
                                "secretKey":"",
				"sellerIdEu":"",
                                "accountNoEu":"",
                                "accessKeyIdEu":"",
                                "secretKeyEu":"",
				"fileName":"",
				"feedSubmissionId":"",
				"feedSubmissionIdEu":"",
				"productIdList":[]
			}
			var jsonContent = JSON.parse(contents);
			const amazonUsSite = "amazon_us_site";
                        const amazonUsMarketPlaceId = "amazon_us_marketplace_id";
                        const amazonSellerId = request.user.sellerName.concat('_amazon_us_seller_id');
                        const amazonAccountNo = request.user.sellerName.concat('_amazon_us_account_no');
                        const amazonAccessKeyId = request.user.sellerName.concat('_amazon_us_access_key_id');
                        const amazonSecretKey = request.user.sellerName.concat('_amazon_us_secret_key');
			const amazonSellerIdEu = request.user.sellerName.concat('_amazon_eu_seller_id');
			const amazonAccountNoEu = request.user.sellerName.concat('_amazon_eu_account_no');
			const amazonAccessKeyIdEu = request.user.sellerName.concat('_amazon_eu_access_key_id');
			const amazonSecretKeyEu = request.user.sellerName.concat('_amazon_eu_secret_key');
                        var site = jsonContent[amazonUsSite];
                        var marketPlaceId = jsonContent[amazonUsMarketPlaceId];
                        var sellerId = jsonContent[amazonSellerId];
                        var accountNo = jsonContent[amazonAccountNo];
                        var accessKeyId = jsonContent[amazonAccessKeyId];
                        var secretKey = jsonContent[amazonSecretKey];
			var sellerIdEu = jsonContent[amazonSellerIdEu]
			var accountNoEu = jsonContent[amazonAccountNoEu]
			var accessKeyIdEu = jsonContent[amazonAccessKeyIdEu]
			var secretKeyEu = jsonContent[amazonSecretKeyEu]
			logger.info("site : "+site+" marketPlaceId: "+marketPlaceId+" sellerId: "+sellerId+" accountNo: "+accountNo+" accessKeyId: "+accessKeyId+" secretKey: "+secretKey);
			if (site == null || marketPlaceId == null || sellerId == null || accountNo == null || accessKeyId == null || secretKey == null) {
				logger.info("manager_workflow:uploadProductMarket:required parameter missing for upload product to amazon US marketplace");
				callback(null,amazonConfig);
			} else {
				amazonConfig.responseCode=0;
				amazonConfig.site=site;
				amazonConfig.marketPlaceId=marketPlaceId;
				amazonConfig.sellerId=sellerId;
                                amazonConfig.accountNo=accountNo;
                       	        amazonConfig.accessKeyId=accessKeyId;
                                amazonConfig.secretKey=secretKey;
				callback(null,amazonConfig);
			}
			if (sellerIdEu != null && accountNoEu != null && accessKeyIdEu != null && secretKeyEu != null) {
				amazonConfig.responseCode=0;
				amazonConfig.sellerIdEu=sellerIdEu;
				amazonConfig.accountNoEu=accountNoEu;
				amazonConfig.accessKeyIdEu=accessKeyIdEu;
				amazonConfig.secretKeyEu=secretKeyEu;
			}
		},
		//below functione is to create a flat file for amazon
		function(amazonConfig,callback) {
			if (amazonConfig.responseCode === 0 ) {
				var timestamp = new Date();
				var timestamp = date.format(timestamp,'YYYY:MM:DD:HH:MM:SS');
				timestamp = timestamp.replace(/:/g,"");
				var fileName = "./catalogue/amazon/amazon_"+request.user.sellerName+"_"+timestamp;
				amazonConfig.fileName=fileName;
				var stream = fs.createWriteStream(fileName);
				var productDetails=request.productDetails;
				if (productDetails.length > 0) {
					stream.once('open', function(fd) {
						var templateType="TemplateType=Custom";
						var version="Version=2017.1230";
						var templateSignature="TemplateSignature=RkFTSElPTk9USEVS";
                                                var message="The top 3 rows are for Amazon.com use only. Do not modify or delete the top 3 rows.\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t";
						var message1="Images\t\t\t\t\t\t\t\t\t\tVariation\t\t\tBasic\t\t\t\tDiscovery\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tUngrouped\t\t\t\t\t\t\t\t\t\t\t\t\t\tDimensions\t\t\t\t\t\t\t\t\t\t\t\tFulfillment\t\t\t\t\t\tCompliance\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tOffer\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t";
						stream.write(templateType+"\t"+version+"\t"+templateSignature+"\t"+message+"\t"+message1+"\n");
						stream.write("Item Type Keyword"+"\t"+"Seller SKU"+"\t"+"Product ID"+"\t"+"Product ID Type"+"\t"+"Brand Name"+"\t"+"Title"+"\t"+"Manufacturer"+"\t"+"Gender (Department Name)"+"\t"+"Gender (Department Name)"+"\t"+"Gender (Department Name)"+"\t"+"Gender (Department Name)"+"\t"+"Gender (Department Name)"+"\t"+"Material Type"+"\t"+"Material Type"+"\t"+"Material Type"+"\t"+"Material Type"+"\t"+"Material Type"+"\t"+"Metal Type"+"\t"+"Setting Type"+"\t"+"Gem Type"+"\t"+"Standard Price"+"\t"+"Quantity"+"\t"+"Shipping-Template"+"\t"+"Main Image URL"+"\t"+"Swatch Image URL"+"\t"+"Other Image URL"+"\t"+"Other Image URL"+"\t"+"Other Image URL"+"\t"+"Other Image URL"+"\t"+"Other Image URL"+"\t"+"Other Image URL"+"\t"+"Other Image URL"+"\t"+"Other Image URL"+"\t"+"Main Offer Image"+"\t"+"Offer Image"+"\t"+"Parentage"+"\t"+"Parent SKU"+"\t"+"Relationship Type"+"\t"+"Variation Theme"+"\t"+"Model Number"+"\t"+"Product Type (PTD)"+"\t"+"Update Delete"+"\t"+"Product Description"+"\t"+"Part Number (Model Number)"+"\t"+"Key Product Features"+"\t"+"Key Product Features"+"\t"+"Key Product Features"+"\t"+"Key Product Features"+"\t"+"Key Product Features"+"\t"+"Target Audience"+"\t"+"Target Audience"+"\t"+"Target Audience"+"\t"+"Target Audience"+"\t"+"Target Audience"+"\t"+"Intended Use"+"\t"+"Intended Use"+"\t"+"Intended Use"+"\t"+"Intended Use"+"\t"+"Intended Use"+"\t"+"Subject Matter"+"\t"+"Subject Matter"+"\t"+"Subject Matter"+"\t"+"Subject Matter"+"\t"+"Subject Matter"+"\t"+"Search Keywords"+"\t"+"Search Keywords"+"\t"+"Search Keywords"+"\t"+"Search Keywords"+"\t"+"Search Keywords"+"\t"+"Total Diamond Weight"+"\t"+"Total Diamond Weight Unit Of Measure"+"\t"+"Total Gem Weight"+"\t"+"Total Gem Weight Unit Of Measure"+"\t"+"Metal Stamp"+"\t"+"Chain Type"+"\t"+"Ring Size"+"\t"+"Stone Shape"+"\t"+"Stone Shape"+"\t"+"Stone Shape"+"\t"+"Pearl Type"+"\t"+"Size Per Pearl"+"\t"+"Style"+"\t"+"Color"+"\t"+"Color Map"+"\t"+"Shipping Weight"+"\t"+"Website Shipping Weight Unit Of Measure"+"\t"+"Display Dimensions Unit Of Measure"+"\t"+"Item Display Diameter"+"\t"+"Display Height"+"\t"+"Item Display Width"+"\t"+"Item Display Length"+"\t"+"Length"+"\t"+"Width"+"\t"+"Height"+"\t"+"Item Dimensions Unit Of Measure"+"\t"+"Item Display Weight"+"\t"+"Display Weight Unit of Measure"+"\t"+"Fulfillment Center ID"+"\t"+"Package Length"+"\t"+"Package Height"+"\t"+"Package Width"+"\t"+"Package Dimensions Unit Of Measure"+"\t"+"Package Weight"+"\t"+"Package Weight Unit Of Measure"+"\t"+"Country of Origin"+"\t"+"Consumer Notice"+"\t"+"Cpsia Warning"+"\t"+"Cpsia Warning"+"\t"+"Cpsia Warning"+"\t"+"Cpsia Warning"+"\t"+"CPSIA Warning Description"+"\t"+"fabric_type"+"\t"+"fabric_type"+"\t"+"fabric_type"+"\t"+"fabric_type"+"\t"+"fabric_type"+"\t"+"fabric_type"+"\t"+"fabric_type"+"\t"+"fabric_type"+"\t"+"fabric_type"+"\t"+"fabric_type"+"\t"+"import_designation"+"\t"+"Item Condition"+"\t"+"Condition Note"+"\t"+"Currency"+"\t"+"Launch Date"+"\t"+"Product Tax Code"+"\t"+"Manufacturer's Suggested Retail Price"+"\t"+"Sale Price"+"\t"+"Sale Start Date"+"\t"+"Sale End Date"+"\t"+"Release Date"+"\t"+"Package Quantity"+"\t"+"Production Time"+"\t"+"Restock Date"+"\t"+"Maximum Aggregate Ship Quantity"+"\t"+"Offering Can Be Gift Messaged"+"\t"+"Is Gift Wrap Available"+"\t"+"Is Discontinued by Manufacturer"+"\t"+"Max Order Quantity"+"\t"+"Offering Release Date"+"\n");
						stream.write("item_type"+"\t"+"item_sku"+"\t"+"external_product_id"+"\t"+"external_product_id_type"+"\t"+"brand_name"+"\t"+"item_name"+"\t"+"manufacturer"+"\t"+"department_name1"+"\t"+"department_name2"+"\t"+"department_name3"+"\t"+"department_name4"+"\t"+"department_name5"+"\t"+"material_type1"+"\t"+"material_type2"+"\t"+"material_type3"+"\t"+"material_type4"+"\t"+"material_type5"+"\t"+"metal_type"+"\t"+"setting_type"+"\t"+"gem_type"+"\t"+"standard_price"+"\t"+"quantity"+"\t"+"merchant_shipping_group_name"+"\t"+"main_image_url"+"\t"+"swatch_image_url"+"\t"+"other_image_url1"+"\t"+"other_image_url2"+"\t"+"other_image_url3"+"\t"+"other_image_url4"+"\t"+"other_image_url5"+"\t"+"other_image_url6"+"\t"+"other_image_url7"+"\t"+"other_image_url8"+"\t"+"main_offer_image"+"\t"+"offer_image"+"\t"+"parent_child"+"\t"+"parent_sku"+"\t"+"relationship_type"+"\t"+"variation_theme"+"\t"+"model"+"\t"+"feed_product_type"+"\t"+"update_delete"+"\t"+"product_description"+"\t"+"part_number"+"\t"+"bullet_point1"+"\t"+"bullet_point2"+"\t"+"bullet_point3"+"\t"+"bullet_point4"+"\t"+"bullet_point5"+"\t"+"target_audience_keywords1"+"\t"+"target_audience_keywords2"+"\t"+"target_audience_keywords3"+"\t"+"target_audience_keywords4"+"\t"+"target_audience_keywords5"+"\t"+"specific_uses_keywords1"+"\t"+"specific_uses_keywords2"+"\t"+"specific_uses_keywords3"+"\t"+"specific_uses_keywords4"+"\t"+"specific_uses_keywords5"+"\t"+"thesaurus_subject_keywords1"+"\t"+"thesaurus_subject_keywords2"+"\t"+"thesaurus_subject_keywords3"+"\t"+"thesaurus_subject_keywords4"+"\t"+"thesaurus_subject_keywords5"+"\t"+"generic_keywords1"+"\t"+"generic_keywords2"+"\t"+"generic_keywords3"+"\t"+"generic_keywords4"+"\t"+"generic_keywords5"+"\t"+"total_diamond_weight"+"\t"+"total_diamond_weight_unit_of_measure"+"\t"+"total_gem_weight"+"\t"+"total_gem_weight_unit_of_measure"+"\t"+"metal_stamp"+"\t"+"chain_type"+"\t"+"ring_size"+"\t"+"stone_shape1"+"\t"+"stone_shape2"+"\t"+"stone_shape3"+"\t"+"pearl_type"+"\t"+"size_per_pearl"+"\t"+"style_name"+"\t"+"color_name"+"\t"+"color_map"+"\t"+"website_shipping_weight"+"\t"+"website_shipping_weight_unit_of_measure"+"\t"+"display_dimensions_unit_of_measure"+"\t"+"item_display_diameter"+"\t"+"item_display_height"+"\t"+"item_display_width"+"\t"+"item_display_length"+"\t"+"item_length"+"\t"+"item_width"+"\t"+"item_height"+"\t"+"item_dimensions_unit_of_measure"+"\t"+"item_display_weight"+"\t"+"item_display_weight_unit_of_measure"+"\t"+"fulfillment_center_id"+"\t"+"package_length"+"\t"+"package_height"+"\t"+"package_width"+"\t"+"package_dimensions_unit_of_measure"+"\t"+"package_weight"+"\t"+"package_weight_unit_of_measure"+"\t"+"country_of_origin"+"\t"+"prop_65"+"\t"+"cpsia_cautionary_statement1"+"\t"+"cpsia_cautionary_statement2"+"\t"+"cpsia_cautionary_statement3"+"\t"+"cpsia_cautionary_statement4"+"\t"+"cpsia_cautionary_description"+"\t"+"fabric_type1"+"\t"+"fabric_type2"+"\t"+"fabric_type3"+"\t"+"fabric_type4"+"\t"+"fabric_type5"+"\t"+"fabric_type6"+"\t"+"fabric_type7"+"\t"+"fabric_type8"+"\t"+"fabric_type9"+"\t"+"fabric_type10"+"\t"+"import_designation"+"\t"+"condition_type"+"\t"+"condition_note"+"\t"+"currency"+"\t"+"product_site_launch_date"+"\t"+"product_tax_code"+"\t"+"list_price"+"\t"+"sale_price"+"\t"+"sale_from_date"+"\t"+"sale_end_date"+"\t"+"merchant_release_date"+"\t"+"item_package_quantity"+"\t"+"fulfillment_latency"+"\t"+"restock_date"+"\t"+"max_aggregate_ship_quantity"+"\t"+"offering_can_be_gift_messaged"+"\t"+"offering_can_be_giftwrapped"+"\t"+"is_discontinued_by_manufacturer"+"\t"+"max_order_quantity"+"\t"+"offering_start_date"+"\n");
						for(var i = 0; i < productDetails.length; i++) {
							amazonConfig.productIdList.push(productDetails[i].id);
							if(productDetails[i].itemType === "jewelry-sets" ) {
								stream.write(productDetails[i].itemType+"\t");
								stream.write(productDetails[i].itemSku+"\t");
								stream.write(productDetails[i].externalProductId+"\t");
                                                                stream.write(productDetails[i].externalProductIdType+"\t");
                                                                stream.write(productDetails[i].brandName+"\t");
                                                                stream.write(productDetails[i].itemName+"\t");
                                                                stream.write(productDetails[i].manufacturer+"\t");
                                                                stream.write(productDetails[i].departmentName1+"\t");
                                                                stream.write(productDetails[i].departmentName2+"\t");
                                                                stream.write(productDetails[i].departmentName3+"\t");
                                                                stream.write(productDetails[i].departmentName4+"\t");
                                                                stream.write(productDetails[i].departmentName5+"\t");
                                                                stream.write(productDetails[i].materialType1+"\t");
                                                                stream.write(productDetails[i].materialType2+"\t");
                                                                stream.write(productDetails[i].materialType3+"\t");
                                                                stream.write(productDetails[i].materialType4+"\t");
                                                                stream.write(productDetails[i].materialType5+"\t");
                                                                stream.write(productDetails[i].metalType+"\t");
                                                                stream.write(productDetails[i].settingType+"\t");
                                                                stream.write(productDetails[i].gemType+"\t");
                                                                stream.write(productDetails[i].standardPrice+"\t");
                                                                stream.write(productDetails[i].quantity+"\t");
                                                                stream.write(productDetails[i].merchantShippingGroupName+"\t");
                                                                stream.write(productDetails[i].mainOfferImage+"\t");
                                                                stream.write(productDetails[i].swatchImageUrl+"\t");
                                                                stream.write(productDetails[i].offerImage1+"\t");
                                                                stream.write(productDetails[i].offerImage2+"\t");
                                                                stream.write(productDetails[i].offerImage3+"\t");
                                                                stream.write(productDetails[i].offerImage4+"\t");
                                                                stream.write(productDetails[i].offerImage5+"\t");
                                                                stream.write(productDetails[i].offerImage6+"\t");
                                                                stream.write(productDetails[i].offerImage7+"\t");
                                                                stream.write(productDetails[i].offerImage8+"\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write(productDetails[i].feedProductType+"\t");
                                                                stream.write(productDetails[i].updateDelete+"\t");
                                                                stream.write(productDetails[i].productDescription+"\t");
                                                                stream.write("\t");
                                                                stream.write(productDetails[i].bulletPoint1+"\t");
                                                                stream.write(productDetails[i].bulletPoint2+"\t");
                                                                stream.write(productDetails[i].bulletPoint3+"\t");
                                                                stream.write(productDetails[i].bulletPoint4+"\t");
                                                                stream.write(productDetails[i].bulletPoint5+"\t");
                                                                stream.write(productDetails[i].targetAudienceKeywords1+"\t");
                                                                stream.write(productDetails[i].targetAudienceKeywords2+"\t");
                                                                stream.write(productDetails[i].targetAudienceKeywords3+"\t");
                                                                stream.write(productDetails[i].targetAudienceKeywords4+"\t");
                                                                stream.write(productDetails[i].targetAudienceKeywords5+"\t");
                                                                stream.write(productDetails[i].specificUsesKeywords1+"\t");
                                                                stream.write(productDetails[i].specificUsesKeywords2+"\t");
                                                                stream.write(productDetails[i].specificUsesKeywords3+"\t");
                                                                stream.write(productDetails[i].specificUsesKeywords4+"\t");
                                                                stream.write(productDetails[i].specificUsesKeywords5+"\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write(productDetails[i].genericKeywords1+"\t");
                                                                stream.write(productDetails[i].genericKeywords2+"\t");
                                                                stream.write(productDetails[i].genericKeywords3+"\t");
                                                                stream.write(productDetails[i].genericKeywords4+"\t");
                                                                stream.write(productDetails[i].genericKeywords5+"\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write("\t");
                                                                stream.write(productDetails[i].websiteShippingWeight+"\t");
                                                                stream.write(productDetails[i].websiteShippingWeightUnitOfMeasure+"\t");
                                                                stream.write(productDetails[i].displayDimensionsUnitOfMeasure+"\t");
                                                                stream.write(productDetails[i].itemDisplayDiameter+"\t");
                                                                stream.write(productDetails[i].itemDisplayHeight+"\t");
                                                                stream.write(productDetails[i].itemDisplayWidth+"\t");
                                                                stream.write(productDetails[i].itemDisplayLength+"\t");
                                                                stream.write(productDetails[i].itemLength+"\t");
                                                                stream.write(productDetails[i].itemWidth+"\t");
                                                                stream.write(productDetails[i].itemHeight+"\t");
                                                                stream.write(productDetails[i].itemDimensionsUnitOfMeasure+"\t");
                                                                stream.write(productDetails[i].itemDisplayWeight+"\t");
                                                                stream.write(productDetails[i].itemDisplayWeightUnitOfMeasure+"\t");
                                                                stream.write(productDetails[i].fulfillmentCenterId+"\t");
                                                                stream.write(productDetails[i].packageLength+"\t");
                                                                stream.write(productDetails[i].packageHeight+"\t");
                                                                stream.write(productDetails[i].packageWidth+"\t");
                                                                stream.write(productDetails[i].packageDimensionsUnitOfMeasure+"\t");
                                                                stream.write(productDetails[i].packageWeight+"\t");
                                                                stream.write(productDetails[i].packageWeightUnitOfMeasure+"\t");
                                                                stream.write(productDetails[i].countryOfOrigin+"\t");
                                                                stream.write(productDetails[i].prop65+"\t");
                                                                stream.write(productDetails[i].cpsiaCautionaryStatement1+"\t");
                                                                stream.write(productDetails[i].cpsiaCautionaryStatement2+"\t");
                                                                stream.write(productDetails[i].cpsiaCautionaryStatement3+"\t");
                                                                stream.write(productDetails[i].cpsiaCautionaryStatement4+"\t");
                                                                stream.write(productDetails[i].cpsiaCautionaryDescription+"\t");
                                                                stream.write(productDetails[i].fabricType1+"\t");
                                                                stream.write(productDetails[i].fabricType2+"\t");
                                                                stream.write(productDetails[i].fabricType3+"\t");
                                                                stream.write(productDetails[i].fabricType4+"\t");
                                                                stream.write(productDetails[i].fabricType5+"\t");
                                                                stream.write(productDetails[i].fabricType6+"\t");
                                                                stream.write(productDetails[i].fabricType7+"\t");
                                                                stream.write(productDetails[i].fabricType8+"\t");
                                                                stream.write(productDetails[i].fabricType9+"\t");
                                                                stream.write(productDetails[i].fabricType10+"\t");
                                                                stream.write(productDetails[i].importDesignation+"\t");
                                                                stream.write(productDetails[i].conditionType+"\t");
                                                                stream.write(productDetails[i].conditionNote+"\t");
                                                                stream.write(productDetails[i].currency+"\t");
                                                                stream.write(productDetails[i].productSiteLaunchDate+"\t");
                                                                stream.write(productDetails[i].productTaxCode+"\t");
                                                                stream.write(productDetails[i].listPrice+"\t");
                                                                stream.write(productDetails[i].salePrice+"\t");
                                                                stream.write(productDetails[i].saleFromDate+"\t");
                                                                stream.write(productDetails[i].saleEndDate+"\t");
                                                                stream.write(productDetails[i].merchantReleaseDate+"\t");
                                                                stream.write(productDetails[i].itemPackageQuantity+"\t");
                                                                stream.write(productDetails[i].fulfillmentLatency+"\t");
                                                                stream.write(productDetails[i].restockDate+"\t");
                                                                stream.write(productDetails[i].maxAggregateShipQuantity+"\t");
                                                                stream.write(productDetails[i].offeringCanBeGiftMessaged+"\t");
                                                                stream.write(productDetails[i].offeringCanBeGiftwrapped+"\t");
                                                                stream.write(productDetails[i].isDiscontinuedByManufacturer+"\t");
                                                                stream.write(productDetails[i].maxOrderQuantity+"\t");
                                                                stream.write(productDetails[i].offeringStartDate+"\n");
							}
						}
					});
				}
				callback(null,amazonConfig);
			} else {
				callback(null,amazonConfig);
			}
		},
		function(amazonConfig,callback) {
			if (amazonConfig.responseCode === 0 ) {
				var accessKey = amazonConfig.accessKeyId;
				var accessSecret = amazonConfig.secretKey;
				var accessKeyEu = amazonConfig.accessKeyIdEu;
				var accessSecretEu = amazonConfig.secretKeyEu;
                                //var amazonMws = require('amazon-mws')(accessKey, accessSecret);
				//var amazonMwsEu = require('amazon-mws')(accessKeyEu, accessSecretEu);
				var FeedContent = fs.readFileSync(amazonConfig.fileName, 'UTF-8');
				if ( amazonConfig.sellerId != null && amazonConfig.accountNo != null && accessKey != null && accessSecret != null && accessKey.length > 0 && accessSecret.length > 0) {
				var amazonMws = require('amazon-mws')(accessKey, accessSecret);
				amazonMws.feeds.submit({
					'Version': '2009-01-01',
					'Action': 'SubmitFeed',
					'FeedType': '_POST_PRODUCT_DATA_',
					'FeedContent': FeedContent,
					'SellerId': amazonConfig.sellerId,
					'MWSAuthToken': amazonConfig.accountNo
				}, function (error, response) {
		        		if (error) {
            					console.log('error ', error);
            					return;
        				}
        				console.log('response on SubmitFeed : ', response);
					var FeedSubmissionId = response.FeedSubmissionInfo.FeedSubmissionId;
					amazonConfig.feedSubmissionId = response.FeedSubmissionInfo.FeedSubmissionId;
					//var FeedSubmissionId = '54249017540';
					amazonMws.feeds.search({
						'Version': '2009-01-01',
						'Action': 'GetFeedSubmissionResult',
						'SellerId': amazonConfig.sellerId,
						'MWSAuthToken': amazonConfig.accountNo,
						'FeedSubmissionId': FeedSubmissionId
					}, function (error, response) {
						if (error) {
                                                	console.log('error ', error);
                                                	return;
                                        	}
						console.log('response on GetFeedSubmissionResult : ', response);
					});

					amazonMws.feeds.search({
						'Version': '2009-01-01',
                                                'Action': 'GetFeedSubmissionList',
						'SellerId': amazonConfig.sellerId,
                                                'MWSAuthToken': amazonConfig.accountNo
                                        }, function (error, response) {
                                                if (error) {
                                                        console.log('error ', error);
                                                        return;
                                                }
                                                console.log('response on GetFeedSubmissionList : ', response);
                                        });
					callback(null,amazonConfig);
    				});
				} else {
					callback(null,amazonConfig);
				}
			} else {
				callback(null,amazonConfig);
			}
		},
		function(amazonConfig,callback) {
                        if (amazonConfig.responseCode === 0 ) {
                                var accessKeyEu = amazonConfig.accessKeyIdEu;
                                var accessSecretEu = amazonConfig.secretKeyEu;
                                var FeedContent = fs.readFileSync(amazonConfig.fileName, 'UTF-8');
				if ( amazonConfig.sellerIdEu != null && amazonConfig.accountNoEu != null && accessKeyEu != null && accessSecretEu != null && accessKeyEu.length > 0 && accessSecretEu.length > 0 ) {
				 var amazonMwsEu = require('amazon-mws')(accessKeyEu, accessSecretEu);
                                 amazonMwsEu.feeds.submit({
                                        'Version': '2009-01-01',
                                        'Action': 'SubmitFeed',
                                        'FeedType': '_POST_PRODUCT_DATA_',
                                        'FeedContent': FeedContent,
                                        'SellerId': amazonConfig.sellerIdEu,
                                        'MWSAuthToken': amazonConfig.accountNoEu
                                }, function (error, response) {
                                        if (error) {
                                                console.log('error ', error);
                                                return;
                                        }
                                        console.log('response on SubmitFeedEu : ', response);
                                        var FeedSubmissionId = response.FeedSubmissionInfo.FeedSubmissionId;
                                        amazonConfig.feedSubmissionIdEu = response.FeedSubmissionInfo.FeedSubmissionId;
                                        amazonMwsEu.feeds.search({
                                                'Version': '2009-01-01',
                                                'Action': 'GetFeedSubmissionResult',
                                                'SellerId': amazonConfig.sellerIdEu,
                                                'MWSAuthToken': amazonConfig.accountNoEu,
                                                'FeedSubmissionId': FeedSubmissionId
                                        }, function (error, response) {
                                                if (error) {
                                                        console.log('error ', error);
                                                        return;
                                                }
                                                console.log('response on GetFeedSubmissionResultEu : ', response);
                                        });

                                        amazonMwsEu.feeds.search({
                                                'Version': '2009-01-01',
                                                'Action': 'GetFeedSubmissionList',
                                                'SellerId': amazonConfig.sellerIdEu,
                                                'MWSAuthToken': amazonConfig.accountNoEu
                                        }, function (error, response) {
                                                if (error) {
                                                        console.log('error ', error);
                                                        return;
                                                }
                                                console.log('response on GetFeedSubmissionListEu : ', response);
                                        });
                                        callback(null,amazonConfig);
                                });
				} else {
                        	        callback(null,amazonConfig);
				}
                        } else {
				callback(null,amazonConfig);
			}
		},
		function(amazonConfig,callback) {
			for(var i = 0; i < amazonConfig.productIdList.length; i++) {
				managerService.insertMarketplaceUploadStatus(apiname,request.userName,amazonConfig.productIdList[i],amazonConfig.feedSubmissionId,function(resp) {
					logger.info("manager_workflow:insertMarketplaceUploadStatus: "+amazonConfig.productIdList[i]);
				});
			}
			callback(null,sucessResponse);
		}
		//upload to amazon US market place end
	],
	function(err, results) {
                if (err) {
                        logger.error(request.userName + ":manager_workflow:uploadProductMarket:" + apiname + ":Exit",err);
                        responseCallback(err);
                } else {
                        logger.info(request.userName + ":manager_workflow:uploadProductMarket:" + apiname + ":Exit",results);
                        responseCallback(results);
                }
        });
};*/

module.exports = managerWorkflow;
