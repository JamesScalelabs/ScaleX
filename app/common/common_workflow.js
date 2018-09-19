/*jslint node: true */
'use strict';
var commonWorkflow = {};
var commonService = require('./common_service');
var userService = require('./../user/user_service');
var config = require('../../config/config');
//var appkey_config = require('../../config/appkey_config');
var logger = config.logger;
var async = require('async');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var algorithm = 'sha256';
var fs = require("fs");
var contents = fs.readFileSync('./config/appkey_config.js', 'utf8');
var date = require('date-and-time');
var ebay = require('./../../node_modules/ebay-api/index.js');
var xmlBuilder = require('xml');
var moment = require('moment');
var dateFormat = require("dateformat");
var Excel = require('exceljs');

commonWorkflow.getProductExcel = function(apiname, lang, locale, request, responseCallback) {
	logger.info(request.userName + ":common_workflow:getProductExcel:" + apiname + ":Enter");
	var failureResponse = {
	        "responseCode": -1,
	        "response": "",
	        "errorMsg": "Issue in generating Eccel File"
	};

	var sucessResponse = {
        	"responseCode": 0,
	        "response": {
			"fileName" : "",
		},
		"errorMsg": ""
	};

	var workbook = new Excel.Workbook();
	async.waterfall(
	[
		function(callback) {
			var fileName=request.userName;
			fileName=fileName+"_";
			var timeStamp = dateFormat(new Date(), "ddmmyyyyHHMMss")
			fileName=fileName+timeStamp+".xlsx";
			callback(null,fileName);
		},
		function(fileName,callback) {
			commonService.getProductDetails(apiname,request.userName,request.productDetails, function(response) {
				workbook.xlsx.readFile('./templates/Catalog_Template_Edit.xlsx').then(function() {
					var worksheet = workbook.getWorksheet(1);
					var rowNum=3
					var rowHeader3 = worksheet.getRow(rowNum);
                                        rowHeader3.getCell(159).value = "Please Dont Change Value Of This Column";
					rowHeader3.commit();
					rowNum=4;
					var rowHeader = worksheet.getRow(rowNum);
					rowHeader.getCell(159).value = "INTERNAL_ID";
					rowHeader.commit();
					rowNum=5;
					async.eachSeries(response.response.productDetails,function(productDetail,productCallback) {
						logger.info("---->rowNum : ",rowNum);
						var row = worksheet.getRow(rowNum);
						//row.getCell(1).value = 5;
                                                row.getCell(1).value = productDetail.sellerSku;
                                                row.getCell(2).value = productDetail.brand;
                                                row.getCell(3).value = productDetail.name;
                                                row.getCell(4).value = productDetail.color;
                                                row.getCell(5).value = productDetail.category;
                                                row.getCell(6).value = productDetail.materialOrFabric;
                                                row.getCell(7).value = productDetail.productDescription;
                                                row.getCell(8).value = productDetail.model;
                                                row.getCell(9).value = productDetail.gender;
                                                row.getCell(10).value = productDetail.quantity;
                                                row.getCell(11).value = productDetail.price;
                                                row.getCell(12).value = productDetail.image1;
                                                row.getCell(13).value = productDetail.image2;
                                                row.getCell(14).value = productDetail.image3;
                                                row.getCell(15).value = productDetail.image4;
                                                row.getCell(16).value = productDetail.image5;
                                                row.getCell(17).value = productDetail.image6;
                                                row.getCell(18).value = productDetail.image7;
                                                row.getCell(19).value = productDetail.packageLength;
                                                row.getCell(20).value = productDetail.packageWidth;
                                                row.getCell(21).value = productDetail.packageHeight;
                                                row.getCell(22).value = productDetail.packageWeight;
                                                row.getCell(23).value = productDetail.watch_external_product_id;
                                                row.getCell(24).value = productDetail.watch_external_product_id_type;
                                                row.getCell(25).value = productDetail.watch_item_name;
                                                row.getCell(26).value = productDetail.watch_manufacturer;
                                                row.getCell(27).value = productDetail.watch_model;
                                                row.getCell(28).value = productDetail.watch_part_number;
                                                row.getCell(29).value = productDetail.watch_standard_price;
                                                row.getCell(30).value = productDetail.watch_merchant_shipping_group_name;
                                                row.getCell(31).value = productDetail.watch_target_audience_keywords1;
                                                row.getCell(32).value = productDetail.watch_target_audience_keywords2;
                                                row.getCell(33).value = productDetail.watch_target_audience_keywords3;
                                                row.getCell(34).value = productDetail.watch_target_audience_keywords4;
                                                row.getCell(35).value = productDetail.watch_target_audience_keywords5;
                                                row.getCell(36).value = productDetail.watch_main_image_url;
                                                row.getCell(37).value = productDetail.watch_band_material_type;
                                                row.getCell(38).value = productDetail.watch_band_color;
                                                row.getCell(39).value = productDetail.watch_dial_color;
                                                row.getCell(40).value = productDetail.watch_display_type;
                                                row.getCell(41).value = productDetail.watch_movement_type;
                                                row.getCell(42).value = productDetail.shoes_feed_product_type;
                                                row.getCell(43).value = productDetail.shoes_item_sku;
                                                row.getCell(44).value = productDetail.shoes_merchant_shipping_group_name;
                                                row.getCell(45).value = productDetail.shoes_outer_material_type1;
                                                row.getCell(46).value = productDetail.shoes_outer_material_type2;
                                                row.getCell(47).value = productDetail.shoes_material_type1;
                                                row.getCell(48).value = productDetail.shoes_material_type2;
                                                row.getCell(49).value = productDetail.shoes_color_name;
                                                row.getCell(50).value = productDetail.shoes_size_name;
                                                row.getCell(51).value = productDetail.baby_item_sku;
                                                row.getCell(52).value = productDetail.baby_item_name;
                                                row.getCell(53).value = productDetail.baby_quantity;
                                                row.getCell(54).value = productDetail.baby_standard_price;
                                                row.getCell(55).value = productDetail.baby_merchant_shipping_group_name;
                                                row.getCell(56).value = productDetail.baby_color_name;
                                                row.getCell(57).value = productDetail.baby_mfg_minimum;
                                                row.getCell(58).value = productDetail.baby_mfg_minimum_unit_of_measure;
                                                row.getCell(59).value = productDetail.beauty_item_sku;
                                                row.getCell(60).value = productDetail.beauty_item_name;
                                                row.getCell(61).value = productDetail.beauty_part_number;
                                                row.getCell(62).value = productDetail.beauty_merchant_shipping_group_name;
                                                row.getCell(63).value = productDetail.beauty_recommended_browse_nodes;
                                                row.getCell(64).value = productDetail.computers_item_sku;
                                                row.getCell(65).value = productDetail.computers_item_name;
                                                row.getCell(66).value = productDetail.computers_merchant_shipping_group_name;
                                                row.getCell(67).value = productDetail.computers_recommended_browse_nodes;
                                                row.getCell(68).value = productDetail.computers_hard_disk_size1;
                                                row.getCell(69).value = productDetail.computers_hard_disk_size2;
                                                row.getCell(70).value = productDetail.computers_hard_disk_size3;
                                                row.getCell(71).value = productDetail.computers_hard_disk_size4;
                                                row.getCell(72).value = productDetail.computers_hard_disk_size5;
                                                row.getCell(73).value = productDetail.computers_hard_disk_size6;
                                                row.getCell(74).value = productDetail.computers_hard_disk_size7;
                                                row.getCell(75).value = productDetail.computers_hard_disk_size8;
                                                row.getCell(76).value = productDetail.computers_hard_disk_interface1;
                                                row.getCell(77).value = productDetail.computers_hard_disk_interface2;
                                                row.getCell(78).value = productDetail.computers_hard_disk_interface3;
                                                row.getCell(79).value = productDetail.computers_hard_disk_interface4;
                                                row.getCell(80).value = productDetail.computers_system_ram_type1;
                                                row.getCell(81).value = productDetail.computers_system_ram_type2;
                                                row.getCell(82).value = productDetail.computers_system_ram_type3;
                                                row.getCell(83).value = productDetail.computers_system_ram_type4;
                                                row.getCell(84).value = productDetail.computers_system_ram_type5;
                                                row.getCell(85).value = productDetail.computers_system_ram_type6;
                                                row.getCell(86).value = productDetail.computers_system_ram_type7;
                                                row.getCell(87).value = productDetail.computers_operating_system;
                                                row.getCell(88).value = productDetail.food_merchant_shipping_group_name;
                                                row.getCell(89).value = productDetail.food_material_features;
                                                row.getCell(90).value = productDetail.food_fc_shelf_life;
                                                row.getCell(91).value = productDetail.food_fc_shelf_life_pad_time;
                                                row.getCell(92).value = productDetail.food_product_expiration_type;
                                                row.getCell(93).value = productDetail.furniture_item_name;
                                                row.getCell(94).value = productDetail.furniture_merchant_shipping_group_name;
                                                row.getCell(95).value = productDetail.sports_condition_type;
                                                row.getCell(96).value = productDetail.sports_merchant_shipping_group_name;
                                                row.getCell(97).value = productDetail.sports_item_type_name;
                                                row.getCell(98).value = productDetail.toys_item_name;
                                                row.getCell(99).value = productDetail.toys_merchant_shipping_group_name;
                                                row.getCell(100).value = productDetail.toys_color_name;
                                                row.getCell(101).value = productDetail.toys_mfg_minimum;
                                                row.getCell(102).value = productDetail.clothing_merchant_shipping_group_name;
                                                row.getCell(103).value = productDetail.clothing_color_name;
                                                row.getCell(104).value = productDetail.clothing_department_name;
                                                row.getCell(105).value = productDetail.giftcard_product_description;
                                                row.getCell(106).value = productDetail.giftcard_item_type;
                                                row.getCell(107).value = productDetail.giftcard_merchant_shipping_group_name;
                                                row.getCell(108).value = productDetail.giftcard_bullet_point1;
                                                row.getCell(109).value = productDetail.giftcard_bullet_point2;
                                                row.getCell(110).value = productDetail.giftcard_bullet_point3;
                                                row.getCell(111).value = productDetail.giftcard_bullet_point4;
                                                row.getCell(112).value = productDetail.giftcard_bullet_point5;
                                                row.getCell(113).value = productDetail.giftcard_target_audience_keywords1;
                                                row.getCell(114).value = productDetail.giftcard_target_audience_keywords2;
                                                row.getCell(115).value = productDetail.giftcard_target_audience_keywords3;
                                                row.getCell(116).value = productDetail.giftcard_legal_disclaimer_description;
                                                row.getCell(117).value = productDetail.giftcard_state_string;
                                                row.getCell(118).value = productDetail.giftcard_format;
                                                row.getCell(119).value = productDetail.giftcard_genre;
                                                row.getCell(120).value = productDetail.health_item_package_quantity;
                                                row.getCell(121).value = productDetail.health_merchant_shipping_group_name;
                                                row.getCell(122).value = productDetail.health_unit_count;
                                                row.getCell(123).value = productDetail.health_unit_count_type;
                                                row.getCell(124).value = productDetail.home_merchant_shipping_group_name;
                                                row.getCell(125).value = productDetail.home_color_name;
                                                row.getCell(126).value = productDetail.home_material_type1;
                                                row.getCell(127).value = productDetail.home_material_type2;
                                                row.getCell(128).value = productDetail.home_material_type3;
                                                row.getCell(129).value = productDetail.home_material_type4;
                                                row.getCell(130).value = productDetail.home_material_type5;
                                                row.getCell(131).value = productDetail.home_material_type6;
                                                row.getCell(132).value = productDetail.home_material_type7;
                                                row.getCell(133).value = productDetail.home_material_type8;
                                                row.getCell(134).value = productDetail.home_material_type9;
                                                row.getCell(135).value = productDetail.home_material_type10;
                                                row.getCell(136).value = productDetail.home_thread_count;
                                                row.getCell(137).value = productDetail.luggage_part_number;
                                                row.getCell(138).value = productDetail.luggage_merchant_shipping_group_name;
                                                row.getCell(139).value = productDetail.luggage_color_name;
                                                row.getCell(140).value = productDetail.luggage_color_map;
                                                row.getCell(141).value = productDetail.luggage_material_type1;
                                                row.getCell(142).value = productDetail.luggage_material_type2;
                                                row.getCell(143).value = productDetail.luggage_material_type3;
                                                row.getCell(144).value = productDetail.luggage_material_type4;
                                                row.getCell(145).value = productDetail.luggage_material_type5;
                                                row.getCell(146).value = productDetail.musical_model;
                                                row.getCell(147).value = productDetail.musical_merchant_shipping_group_name;
                                                row.getCell(148).value = productDetail.office_model;
                                                row.getCell(149).value = productDetail.office_merchant_shipping_group_name;
                                                row.getCell(150).value = productDetail.office_list_price_with_tax;
                                                row.getCell(151).value = productDetail.pet_merchant_shipping_group_name;
                                                row.getCell(152).value = productDetail.jewellery_condition_type;
                                                row.getCell(153).value = productDetail.jewellery_merchant_shipping_group_name;
                                                row.getCell(154).value = productDetail.jewellery_color_map;
                                                row.getCell(155).value = productDetail.jewellery_department_name;
                                                row.getCell(156).value = productDetail.jewellery_material_type;
                                                row.getCell(157).value = productDetail.jewellery_ring_size;
                                                row.getCell(158).value = productDetail.jewellery_item_shape;
						row.getCell(159).value = productDetail.id;
						row.commit();
						rowNum=rowNum+1;
						productCallback();
					},function(err, result) {
						workbook.xlsx.writeFile('./editFiles/'+fileName).then(function() {
							sucessResponse.response.fileName = fileName;
							callback(null,sucessResponse);
						});
					});
				});
			});

		}
	],
        function(err, results) {
                if (err) {
                        logger.error(request.userName + ":common_workflow:getProductExcel:" + apiname + ":Exit",err);
			responseCallback(err);
		} else {
			logger.info(request.userName + ":common_workflow:getProductExcel:" + apiname + ":Exit",results);
			responseCallback(results);
		}
	});
};

commonWorkflow.getMarketPlaceOrders = function(apiname, lang, locale, request, responseCallback) {
    var failureResponse = {
        "responseCode": -1,
        "response": "",
        "errorMsg": "Issue in sync with market place"
    };

    var sucessResponse = {
        "responseCode": 0,
        "response": {
            "lazada": {
                "outOfStock": 0,
                "pending": 0,
                "thisMonth": 0
            },
            "elevenStreet": {
                "outOfStock": 0,
                "pending": 0,
                "thisMonth": 0
            },
            "sears": {
                "outOfStock": 0,
                "pending": 0,
                "thisMonth": 0
            },
            "ebay": {
                "outOfStock": 0,
                "pending": 0,
                "thisMonth": 0
            },
            "amazonUS": {
                "outOfStock": 0,
                "pending": 0,
                "thisMonth": 0
            },
            "amazonCA": {
                "outOfStock": 0,
                "pending": 0,
                "thisMonth": 0
            },
            "amazonMX": {
                "outOfStock": 0,
                "pending": 0,
                "thisMonth": 0
            },
            "amazonUK": {
                "outOfStock": 0,
                "pending": 0,
                "thisMonth": 0
            },
            "amazonFR": {
                "outOfStock": 0,
                "pending": 0,
                "thisMonth": 0
            },
            "amazonDE": {
                "outOfStock": 0,
                "pending": 0,
                "thisMonth": 0
            },
            "amazonIT": {
                "outOfStock": 0,
                "pending": 0,
                "thisMonth": 0
            },
            "amazonES": {
                "outOfStock": 0,
                "pending": 0,
                "thisMonth": 0
            },
            "cDiscount": {
                "outOfStock": 0,
                "pending": 0,
                "thisMonth": 0
            },
            "etsy": {
                "outOfStock": 0,
                "pending": 0,
                "thisMonth": 0
            }
        },
        "errorMsg": ""
    };

    var startDate = moment(request.thisMonth.startDate).format("YYYY-MM-DD");
    var endDate = moment(request.thisMonth.startDate).format("YYYY-MM-DD");

    logger.info(request.userName + ":common_workflow:getMarketPlaceOrders" + apiname + ":Enter");
    async.waterfall(
        [
            function(callback) {
                commonService.getTotalOutOfStockMP(apiname, request.userName, request.user.sellerName, function(response) {
                    sucessResponse.response.lazada.outOfStock = response.outOfStock;
                    sucessResponse.response.elevenStreet.outOfStock = response.outOfStock;
                    sucessResponse.response.sears.outOfStock = response.outOfStock;
                    sucessResponse.response.ebay.outOfStock = response.outOfStock;
                    sucessResponse.response.amazonUS.outOfStock = response.outOfStock;
                    sucessResponse.response.amazonCA.outOfStock = response.outOfStock;
                    sucessResponse.response.amazonUK.outOfStock = response.outOfStock;
                    sucessResponse.response.amazonFR.outOfStock = response.outOfStock;
                    sucessResponse.response.amazonDE.outOfStock = response.outOfStock;
                    sucessResponse.response.amazonIT.outOfStock = response.outOfStock;
                    sucessResponse.response.amazonES.outOfStock = response.outOfStock;
                    sucessResponse.response.cDiscount.outOfStock = response.outOfStock;
                    sucessResponse.response.etsy.outOfStock = response.outOfStock;

                    callback(null, sucessResponse);
                });
            },
            function(sucessResponse, callback) {

                commonService.getTotalPendingOrders(apiname, request.userName, request.user.sellerName, startDate, endDate, function(response) {

                    console.log(response);
                    console.log(response.amazonUS);
                    sucessResponse.response.lazada.pending = response.lazada;
                    sucessResponse.response.elevenStreet.pending = response.elevenStreet;
                    sucessResponse.response.sears.pending = response.sears;
                    sucessResponse.response.ebay.pending = response.ebay;
                    sucessResponse.response.amazonUS.pending = response.amazonUS;
                    sucessResponse.response.amazonCA.pending = response.amazonCA;
                    sucessResponse.response.amazonUK.pending = response.amazonUK;
                    sucessResponse.response.amazonFR.pending = response.amazonFR;
                    sucessResponse.response.amazonDE.pending = response.amazonDE;
                    sucessResponse.response.amazonIT.pending = response.amazonIT;
                    sucessResponse.response.amazonES.pending = response.amazonES;
                    sucessResponse.response.cDiscount.pending = response.cDiscount;
                    sucessResponse.response.etsy.pending = response.etsy;
                    callback(null, sucessResponse);
                });

            },
            function(sucessResponse, callback) {

                commonService.getTotalPendingOrders(apiname, request.userName, request.user.sellerName, startDate, endDate, function(response) {

                    console.log(response);
                    console.log(response.amazonUS);
                    sucessResponse.response.lazada.thisMonth = response.lazada;
                    sucessResponse.response.elevenStreet.thisMonth = response.elevenStreet;
                    sucessResponse.response.sears.thisMonth = response.sears;
                    sucessResponse.response.ebay.thisMonth = response.ebay;
                    sucessResponse.response.amazonUS.thisMonth = response.amazonUS;
                    sucessResponse.response.amazonCA.thisMonth = response.amazonCA;
                    sucessResponse.response.amazonUK.thisMonth = response.amazonUK;
                    sucessResponse.response.amazonFR.thisMonth = response.amazonFR;
                    sucessResponse.response.amazonDE.thisMonth = response.amazonDE;
                    sucessResponse.response.amazonIT.thisMonth = response.amazonIT;
                    sucessResponse.response.amazonES.thisMonth = response.amazonES;
                    sucessResponse.response.cDiscount.thisMonth = response.cDiscount;
                    sucessResponse.response.etsy.thisMonth = response.etsy;
                    callback(null, sucessResponse);
                });

            },
            function(sucessResponse, callback) {

var finalResponse = {
        "responseCode": 0,
        "response": [],
        "errorMsg": ""
    };
                   for (var name in sucessResponse.response) {
                        console.log(name);
                        console.log(sucessResponse.response[name]);
                        var temp = {
                            "marketPlace":name,
                            "outOfStock": sucessResponse.response[name].outOfStock,
                            "pending": sucessResponse.response[name].pending,
                            "thisMonth": sucessResponse.response[name].thisMonth
                        };
                        finalResponse.response.push(temp);
                   }
                 console.log(finalResponse);

                    callback(null, finalResponse);
                
            }
        ],
        function(err, results) {
            if (err) {
                logger.error(request.userName + ":common_workflow:getMarketPlaceOrders:" + apiname + ":Exit", err);
                responseCallback(err);
            } else {
                logger.info(request.userName + ":common_workflow:getMarketPlaceOrders:" + apiname + ":Exit", results);
                responseCallback(results);
            }
        });
};

commonWorkflow.syncElevenStreetShippingOrders = function(apiname, lang, locale, request, responseCallback) {
    var failureResponse = {
        "responseCode": -1,
        "response": "",
        "errorMsg": "Issue in sync with market place"
    };

    var sucessResponse = {
        "responseCode": 0,
        "response": "Sync with 11Streets market place for orders is sucessfull",
        "errorMsg": ""
    };
    logger.info(request.userName + ":common_workflow:syncElevenStreetShippingOrders" + apiname + ":Enter");
    async.waterfall(
        [
            function(callback) {
                var jsonContent = JSON.parse(contents);
                const elevenStreetSite = "elevenStreet_site";
                const elevenStreetKey = request.user.sellerName.concat('_elevenStateKey');
                var site = jsonContent[elevenStreetSite];
                var sellerKey = jsonContent[elevenStreetKey];
                if (site == null || sellerKey == null) {
                    logger.info("eleven state sync cancelled because required param missing");
                    callback(null, failureResponse);
                } else {
                    for (var i in request.user.orders) {
                        logger.info("request.user.orders -> " + request.user.orders[i]);
                        site = site + "rest/ordservices/complete/" + request.user.orders[i];
                        logger.info("site -> " + site);
                        commonService.getElevenStatesCompleteShip(apiname, request.userName, request.user.sellerName, site, sellerKey, function(response) {
                            logger.info("response -> ", response);
                            if (response.responseCode === 0) {
                                var responseJsonString = JSON.stringify(response.response.result);
                                responseJsonString = responseJsonString.replace('ns2:orders', 'orders');
                                responseJsonString = responseJsonString.replace('ns2:order', 'order');
                                var responseJson = JSON.parse(responseJsonString);
                                responseJson = JSON.parse(responseJson);
                                logger.info("responseJson -> ", JSON.stringify(responseJson));
                                if (responseJson.orders.result_code != null && responseJson.orders.result_code[0] === '0') {
                                    logger.info("not valid order");
                                } else {
                                    commonService.deleteOrder(apiname, request.userName, 'elevenStreet', responseJson.orders.order[0].ordNo[0], function(response) {
                                        commonService.insertElevenStreetOrderSeller(apiname, request.userName, 'elevenStreet', responseJson, request.user.sellerName, function(res) {
                                            logger.info("order added -> ", responseJson.orders.order[0].ordNo[0]);
                                        });
                                    });
                                }
                            }
                        });
                    }
                    callback(null, sucessResponse);
                }
            },
        ],
        function(err, results) {
            if (err) {
                logger.error(request.userName + ":common_workflow:syncElevenStreetShippingOrders:" + apiname + ":Exit", err);
                responseCallback(err);
            } else {
                logger.info(request.userName + ":common_workflow:syncElevenStreetShippingOrders:" + apiname + ":Exit", results);
                responseCallback(results);
            }
        });
};

commonWorkflow.syncSellerOrders = function(apiname, lang, locale, request, responseCallback) {
    var failureResponse = {
        "responseCode": -1,
        "response": "",
        "errorMsg": "Issue in sync with market place"
    };

    var sucessResponse = {
        "responseCode": 0,
        "response": "Sync with market place is sucessfull",
        "errorMsg": ""
    };
    logger.info(request.userName + ":common_workflow:syncSellerOrders" + apiname + ":Enter");
    async.waterfall(
        [
            function(callback) {
		logger.info(request.userName + ":common_workflow:syncSellerOrders:starting sync of LAZADA market place" + apiname + ":Enter");
                commonService.getMaxUpdateTs(apiname, request.userName, 'lazada', request.user.sellerName, function(getMaxUpdateTsResponse) {
                    var updateTs = '';
                    if (getMaxUpdateTsResponse.responseCode === 0) {
                        updateTs = JSON.stringify(getMaxUpdateTsResponse.response.updateTs);
                        updateTs = updateTs.replace(/.000Z/, '');
                        updateTs = updateTs.replace(/"/g, '');
                        updateTs = updateTs.replace(/ /, 'T23%3A4');
                        updateTs = updateTs.replace(/:/g, "%3A");
                        updateTs = updateTs + '%2B00%3A00';
                    } else {
                        updateTs = '2010-02-25T23%3A46%3A11%2B00%3A00';
                    }
                    callback(null, updateTs);
                });
            },
            function(updateTs, callback) {
                logger.info(request.userName + ":common_workflow:updateTs " + updateTs);
                var jsonContent = JSON.parse(contents);
                const sellerAppKey = request.user.sellerName.concat('_password');
                const sellerUser = request.user.sellerName.concat('_uname');
                var appKey = jsonContent[sellerAppKey];
                var user = jsonContent[sellerUser];
                if (appKey == null || user == null) {
                    //callback(failureResponse, null);
                    callback(null,sucessResponse);
                } else {
                    user = user.replace('@', '%40');
                    var timestamp = new Date().toISOString();
                    timestamp = timestamp.replace(/:/g, "%3A");
                    timestamp = timestamp.replace(/\..+/, '');
                    timestamp = timestamp + '%2B00%3A00';
                    logger.info(request.userName + ":common_workflow:Timestamp " + timestamp);
                    logger.info(request.userName + ":common_workflow:sellerUser " + user);
                    logger.info(request.userName + ":common_workflow:appKey " + appKey);
                    var hmac;
                    var text = 'Action=GetOrders&Format=json&Timestamp=' + timestamp + '&UpdatedAfter=' + updateTs + '&UserID=' + user + '&Version=1.0';
                    var hash;
                    hmac = crypto.createHmac(algorithm, appKey);
                    hmac.setEncoding('hex');
                    hmac.end(text, function() {
                        hash = hmac.read();
                        //callback(null,hash,text);
                    });
                    hash = hmac.read();
                    logger.info(request.userName + ":common_workflow:hash " + hash);
                    var url = 'https://api.sellercenter.lazada.com.my/?';
                    commonService.getSellerOrders(apiname, request.userName, request.user.sellerName, hash, text, url, function(getSellerOrdersResponse) {
                        if (getSellerOrdersResponse.responseCode === 0) {
                            callback(null, getSellerOrdersResponse);
                        } else {
                            failureResponse.errorMsg = "Error in getting orders";
                            callback(failureResponse, null);
                        }
                    });
                }
            },
            function(getSellerOrdersResponse, callback) {
                var orderList;
                for (var i in getSellerOrdersResponse.response.orders) {
                    if (orderList == null) {
                        orderList = '';
                    }
                    var order = getSellerOrdersResponse.response.orders[i];
                    orderList = '\'' + order.OrderId + '\',' + orderList;
                }
                if (orderList != null) {
                    orderList = orderList.substring(0, orderList.length - 1);
                    commonService.deleteOrder(apiname, request.userName, 'lazada', orderList, function(deleteOrderResponse) {
                        callback(null, getSellerOrdersResponse);
                    });
                } else {
                    callback(null, getSellerOrdersResponse);
                }
            },
            function(getSellerOrdersResponse, callback) {
                if (getSellerOrdersResponse.response.orders != null) {
                    commonService.insertOrder(apiname, request.userName, 'lazada', getSellerOrdersResponse.response.orders, request.user.sellerName, function(insertOrderResponse) {
                        callback(null, getSellerOrdersResponse);
                    });
                } else {
                    callback(null, getSellerOrdersResponse);
                }
            },
            function(getSellerOrdersResponse, callback) {
                var jsonContent = JSON.parse(contents);
                const sellerAppKey = request.user.sellerName.concat('_password');
                const sellerUser = request.user.sellerName.concat('_uname');
                var appKey = jsonContent[sellerAppKey];
                var user = jsonContent[sellerUser];
                var timestamp = new Date().toISOString();
                timestamp = timestamp.replace(/:/g, "%3A");
                timestamp = timestamp.replace(/\..+/, '');
                timestamp = timestamp + '%2B00%3A00';
                if (appKey == null || user == null) {
                    callback(null,sucessResponse);
                    //callback(failureResponse, null);
                } else {
                    user = user.replace('@', '%40');
                    if (getSellerOrdersResponse.response.orders != null) {
                        for (var i in getSellerOrdersResponse.response.orders) {
                            var hmac;
                            var text = 'Action=GetOrderItems&Format=json&OrderId=' + getSellerOrdersResponse.response.orders[i].OrderId + '&Timestamp=' + timestamp + '&UserID=' + user + '&Version=1.0';
                            var hash;
                            hmac = crypto.createHmac(algorithm, appKey);
                            hmac.setEncoding('hex');
                            hmac.end(text, function() {
                                hash = hmac.read();
                            });
                            hash = hmac.read();
                            var url = 'https://api.sellercenter.lazada.com.my/?';
                            commonService.getSellerOrderItems(apiname, request.userName, request.user.sellerName, hash, text, url, function(getSellerOrderItemsResponse) {
                                if (getSellerOrderItemsResponse.responseCode === 0) {
                                    for (var j in getSellerOrderItemsResponse.response.orderItems) {
                                        commonService.updateSellerOrderItems(apiname, request.userName, request.user.sellerName, getSellerOrderItemsResponse.response.orderItems[j], function(updateSellerOrderItemsResponse) {
                                            logger.info(request.userName + ":common_workflow:syncSellerOrders:updatedInfo: " + getSellerOrderItemsResponse.response.orderItems[j].OrderId);
                                        });
                                    }
                                    //update the ORDER_INFO_TABLE
                                }
                            });
                        }
                        callback(null, getSellerOrdersResponse);
                    } else {
                        callback(null, getSellerOrdersResponse);
                    }
                }
            },
            function(getSellerOrdersResponse, callback) {
		logger.info(request.userName + ":common_workflow:syncSellerOrders:end sync of LAZADA market place" + apiname + ":Enter");
                callback(null, sucessResponse);
            },
            //Sync of amazon US seller orders
            function(sucessResponse, callback) {
		logger.info(request.userName + ":common_workflow:syncSellerOrders:starting sync of AMAZON US market place " + apiname + ":Enter");
                commonService.getMaxUpdateTs(apiname, request.userName, 'amazon', request.user.sellerName, function(getMaxUpdateTsResponse) {
                    var updateTs = '';
                    if (getMaxUpdateTsResponse.responseCode === 0) {
                        updateTs = JSON.stringify(getMaxUpdateTsResponse.response.updateTs);
                        updateTs = updateTs.substring(1, 11);
                    } else {
                        updateTs = '2014-01-01';
                    }
                    callback(null, updateTs);
                });
            },
            function(updateTs, callback) {
                //var updateTs="2014-11-30";

                var jsonContent = JSON.parse(contents);
                const amazonUsSite = "amazon_us_site";
                const amazonUsMarketPlaceId = "amazon_us_marketplace_id";
                const amazonSellerId = request.user.sellerName.concat('_amazon_us_seller_id');
                const amazonAccountNo = request.user.sellerName.concat('_amazon_us_account_no');
                const amazonAccessKeyId = request.user.sellerName.concat('_amazon_us_access_key_id');
                const amazonSecretKey = request.user.sellerName.concat('_amazon_us_secret_key');
                var site = jsonContent[amazonUsSite];
                var marketPlaceId = jsonContent[amazonUsMarketPlaceId];
                var sellerId = jsonContent[amazonSellerId];
                var accountNo = jsonContent[amazonAccountNo];
                var accessKeyId = jsonContent[amazonAccessKeyId];
                var secretKey = jsonContent[amazonSecretKey];
                logger.info("site : " + site + " marketPlaceId: " + marketPlaceId + " sellerId: " + sellerId + " accountNo: " + accountNo + " accessKeyId: " + accessKeyId + " secretKey: " + secretKey + " updateTs: " + updateTs);
                if (site == null || marketPlaceId == null || sellerId == null || accountNo == null || accessKeyId == null || secretKey == null) {
                    callback(null, sucessResponse);
                } else {
                    commonService.getAmazonUsSellerOrders(apiname, request.userName, request.user.sellerName, updateTs, site, marketPlaceId, sellerId, accountNo, accessKeyId, secretKey, function(getAmazonUsSellerOrdersResponse) {
                        callback(null, getAmazonUsSellerOrdersResponse);
                    });
                }
            },
            function(getAmazonUsSellerOrdersResponse, callback) {
                var orderList;
		if(getAmazonUsSellerOrdersResponse.listOrdersResult && getAmazonUsSellerOrdersResponse.listOrdersResult.orders ) {
                for (var i in getAmazonUsSellerOrdersResponse.listOrdersResult.orders) {
                    //logger.info("------>"+getAmazonUsSellerOrdersResponse.listOrdersResult.orders[i].amazonOrderId);
                    if (orderList == null) {
                        orderList = '';
                    }
                    var order = getAmazonUsSellerOrdersResponse.listOrdersResult.orders[i];
                    orderList = '\'' + order.amazonOrderId + '\',' + orderList;
                }
		}
                if (orderList != null) {
                    orderList = orderList.substring(0, orderList.length - 1);
                    logger.info("deleting the order if exist : ", orderList);
                    commonService.deleteOrder(apiname, request.userName, 'amazon', orderList, function(deleteOrderResponse) {
                        callback(null, getAmazonUsSellerOrdersResponse);
                    });
                } else {
                    callback(null, getAmazonUsSellerOrdersResponse);
                }
            },
            function(getAmazonUsSellerOrdersResponse, callback) {
                if (getAmazonUsSellerOrdersResponse.listOrdersResult && getAmazonUsSellerOrdersResponse.listOrdersResult.orders && getAmazonUsSellerOrdersResponse.listOrdersResult.orders != null) {
                    commonService.insertAmazonOrder(apiname, request.userName, 'amazon', getAmazonUsSellerOrdersResponse, request.user.sellerName, function(insertAmazonOrderResponse) {
                        callback(null, sucessResponse);
                    });
                } else {
                    callback(null, sucessResponse);
                }
            },
            //Sync of amazon CA seller orders
            function(sucessResponse, callback) {
                commonService.getMaxUpdateTs(apiname, request.userName, 'amazonCA', request.user.sellerName, function(getMaxUpdateTsResponse) {
                    var updateTs = '';
                    if (getMaxUpdateTsResponse.responseCode === 0) {
                        updateTs = JSON.stringify(getMaxUpdateTsResponse.response.updateTs);
                        updateTs = updateTs.substring(1, 11);
                    } else {
                        updateTs = '2014-11-30';
                    }
                    callback(null, updateTs);
                });
            },
            function(updateTs, callback) {
                var jsonContent = JSON.parse(contents);
                const amazonUsSite = "amazon_us_site";
                const amazonUsMarketPlaceId = "amazon_ca_marketplace_id";
                const amazonSellerId = request.user.sellerName.concat('_amazon_us_seller_id');
                const amazonAccountNo = request.user.sellerName.concat('_amazon_us_account_no');
                const amazonAccessKeyId = request.user.sellerName.concat('_amazon_us_access_key_id');
                const amazonSecretKey = request.user.sellerName.concat('_amazon_us_secret_key');
                var site = jsonContent[amazonUsSite];
                var marketPlaceId = jsonContent[amazonUsMarketPlaceId];
                var sellerId = jsonContent[amazonSellerId];
                var accountNo = jsonContent[amazonAccountNo];
                var accessKeyId = jsonContent[amazonAccessKeyId];
                var secretKey = jsonContent[amazonSecretKey];
                logger.info("site : " + site + " marketPlaceId: " + marketPlaceId + " sellerId: " + sellerId + " accountNo: " + accountNo + " accessKeyId: " + accessKeyId + " secretKey: " + secretKey + " updateTs: " + updateTs);
                if (site == null || marketPlaceId == null || sellerId == null || accountNo == null || accessKeyId == null || secretKey == null) {
                    callback(null, sucessResponse);
                } else {
                    commonService.getAmazonUsSellerOrders(apiname, request.userName, request.user.sellerName, updateTs, site, marketPlaceId, sellerId, accountNo, accessKeyId, secretKey, function(getAmazonUsSellerOrdersResponse) {
                        callback(null, getAmazonUsSellerOrdersResponse);
                    });
                }
            },
            function(getAmazonUsSellerOrdersResponse, callback) {
                var orderList;
                if (getAmazonUsSellerOrdersResponse.listOrdersResult != null) {
                    for (var i in getAmazonUsSellerOrdersResponse.listOrdersResult.orders) {
                        //logger.info("------>"+getAmazonUsSellerOrdersResponse.listOrdersResult.orders[i].amazonOrderId);
                        if (orderList == null) {
                            orderList = '';
                        }
                        var order = getAmazonUsSellerOrdersResponse.listOrdersResult.orders[i];
                        orderList = '\'' + order.amazonOrderId + '\',' + orderList;
                    }
                    if (orderList != null) {
                        orderList = orderList.substring(0, orderList.length - 1);
                        logger.info("deleting the order if exist : ", orderList);
                        commonService.deleteOrder(apiname, request.userName, 'amazon', orderList, function(deleteOrderResponse) {
                            callback(null, getAmazonUsSellerOrdersResponse);
                        });
                    } else {
                        callback(null, getAmazonUsSellerOrdersResponse);
                    }
                } else {
                    callback(null, getAmazonUsSellerOrdersResponse);
                }
            },
            function(getAmazonUsSellerOrdersResponse, callback) {
                if (getAmazonUsSellerOrdersResponse.listOrdersResult != null && getAmazonUsSellerOrdersResponse.listOrdersResult.orders != null) {
                    commonService.insertAmazonOrder(apiname, request.userName, 'amazonCA', getAmazonUsSellerOrdersResponse, request.user.sellerName, function(insertAmazonOrderResponse) {
                        callback(null, sucessResponse);
                    });
                } else {
                    callback(null, sucessResponse);
                }
            },
            //Sync of amazon MX seller orders
            function(sucessResponse, callback) {
                commonService.getMaxUpdateTs(apiname, request.userName, 'amazonMX', request.user.sellerName, function(getMaxUpdateTsResponse) {
                    var updateTs = '';
                    if (getMaxUpdateTsResponse.responseCode === 0) {
                        updateTs = JSON.stringify(getMaxUpdateTsResponse.response.updateTs);
                        updateTs = updateTs.substring(1, 11);
                    } else {
                        updateTs = '2014-11-30';
                    }
                    callback(null, updateTs);
                });
            },
            function(updateTs, callback) {
                var jsonContent = JSON.parse(contents);
                const amazonUsSite = "amazon_us_site";
                const amazonUsMarketPlaceId = "amazon_mx_marketplace_id";
                const amazonSellerId = request.user.sellerName.concat('_amazon_us_seller_id');
                const amazonAccountNo = request.user.sellerName.concat('_amazon_us_account_no');
                const amazonAccessKeyId = request.user.sellerName.concat('_amazon_us_access_key_id');
                const amazonSecretKey = request.user.sellerName.concat('_amazon_us_secret_key');
                var site = jsonContent[amazonUsSite];
                var marketPlaceId = jsonContent[amazonUsMarketPlaceId];
                var sellerId = jsonContent[amazonSellerId];
                var accountNo = jsonContent[amazonAccountNo];
                var accessKeyId = jsonContent[amazonAccessKeyId];
                var secretKey = jsonContent[amazonSecretKey];
                logger.info("site : " + site + " marketPlaceId: " + marketPlaceId + " sellerId: " + sellerId + " accountNo: " + accountNo + " accessKeyId: " + accessKeyId + " secretKey: " + secretKey + " updateTs: " + updateTs);
                if (site == null || marketPlaceId == null || sellerId == null || accountNo == null || accessKeyId == null || secretKey == null) {
                    callback(null, sucessResponse);
                } else {
                    commonService.getAmazonUsSellerOrders(apiname, request.userName, request.user.sellerName, updateTs, site, marketPlaceId, sellerId, accountNo, accessKeyId, secretKey, function(getAmazonUsSellerOrdersResponse) {
                        callback(null, getAmazonUsSellerOrdersResponse);
                    });
                }
            },
            function(getAmazonUsSellerOrdersResponse, callback) {
                var orderList;
                if (getAmazonUsSellerOrdersResponse.listOrdersResult != null && getAmazonUsSellerOrdersResponse.listOrdersResult.orders != null) {
                    for (var i in getAmazonUsSellerOrdersResponse.listOrdersResult.orders) {
                        //logger.info("------>"+getAmazonUsSellerOrdersResponse.listOrdersResult.orders[i].amazonOrderId);
                        if (orderList == null) {
                            orderList = '';
                        }
                        var order = getAmazonUsSellerOrdersResponse.listOrdersResult.orders[i];
                        orderList = '\'' + order.amazonOrderId + '\',' + orderList;
                    }
                    if (orderList != null) {
                        orderList = orderList.substring(0, orderList.length - 1);
                        logger.info("deleting the order if exist : ", orderList);
                        commonService.deleteOrder(apiname, request.userName, 'amazon', orderList, function(deleteOrderResponse) {
                            callback(null, getAmazonUsSellerOrdersResponse);
                        });
                    } else {
                        callback(null, getAmazonUsSellerOrdersResponse);
                    }
                } else {
                    callback(null, getAmazonUsSellerOrdersResponse);
                }
            },
            function(getAmazonUsSellerOrdersResponse, callback) {
                if (getAmazonUsSellerOrdersResponse.listOrdersResult != null && getAmazonUsSellerOrdersResponse.listOrdersResult.orders != null) {
                    commonService.insertAmazonOrder(apiname, request.userName, 'amazonMX', getAmazonUsSellerOrdersResponse, request.user.sellerName, function(insertAmazonOrderResponse) {
                        callback(null, sucessResponse);
                    });
                } else {
                    callback(null, sucessResponse);
                }
            },
            //Sync of Amazon UK
            function(sucessResponse, callback) {
                commonService.getMaxUpdateTs(apiname, request.userName, 'amazonUK', request.user.sellerName, function(getMaxUpdateTsResponse) {
                    var updateTs = '';
                    if (getMaxUpdateTsResponse.responseCode === 0) {
                        updateTs = JSON.stringify(getMaxUpdateTsResponse.response.updateTs);
                        updateTs = updateTs.substring(1, 11);
                    } else {
                        updateTs = '2014-11-30';
                    }
                    callback(null, updateTs);
                });
            },
            function(updateTs, callback) {
                var jsonContent = JSON.parse(contents);
                const amazonUsSite = "amazon_eu_site";
                const amazonUsMarketPlaceId = "amazon_uk_marketplace_id";
                const amazonSellerId = request.user.sellerName.concat('_amazon_eu_seller_id');
                const amazonAccountNo = request.user.sellerName.concat('_amazon_eu_account_no');
                const amazonAccessKeyId = request.user.sellerName.concat('_amazon_eu_access_key_id');
                const amazonSecretKey = request.user.sellerName.concat('_amazon_eu_secret_key');
                var site = jsonContent[amazonUsSite];
                var marketPlaceId = jsonContent[amazonUsMarketPlaceId];
                var sellerId = jsonContent[amazonSellerId];
                var accountNo = jsonContent[amazonAccountNo];
                var accessKeyId = jsonContent[amazonAccessKeyId];
                var secretKey = jsonContent[amazonSecretKey];
                logger.info("site : " + site + " marketPlaceId: " + marketPlaceId + " sellerId: " + sellerId + " accountNo: " + accountNo + " accessKeyId: " + accessKeyId + " secretKey: " + secretKey + " updateTs: " + updateTs);
                if (site == null || marketPlaceId == null || sellerId == null || accountNo == null || accessKeyId == null || secretKey == null) {
                    callback(null, sucessResponse);
                } else {
                    commonService.getAmazonUsSellerOrders(apiname, request.userName, request.user.sellerName, updateTs, site, marketPlaceId, sellerId, accountNo, accessKeyId, secretKey, function(getAmazonUsSellerOrdersResponse) {
                        callback(null, getAmazonUsSellerOrdersResponse);
                    });
                }
            },
            function(getAmazonUsSellerOrdersResponse, callback) {
                var orderList;
                if (getAmazonUsSellerOrdersResponse.listOrdersResult != null && getAmazonUsSellerOrdersResponse.listOrdersResult.orders != null) {
                    for (var i in getAmazonUsSellerOrdersResponse.listOrdersResult.orders) {
                        //logger.info("------>"+getAmazonUsSellerOrdersResponse.listOrdersResult.orders[i].amazonOrderId);
                        if (orderList == null) {
                            orderList = '';
                        }
                        var order = getAmazonUsSellerOrdersResponse.listOrdersResult.orders[i];
                        orderList = '\'' + order.amazonOrderId + '\',' + orderList;
                    }
                    if (orderList != null) {
                        orderList = orderList.substring(0, orderList.length - 1);
                        logger.info("deleting the order if exist : ", orderList);
                        commonService.deleteOrder(apiname, request.userName, 'amazon', orderList, function(deleteOrderResponse) {
                            callback(null, getAmazonUsSellerOrdersResponse);
                        });
                    } else {
                        callback(null, getAmazonUsSellerOrdersResponse);
                    }
                } else {
                    callback(null, getAmazonUsSellerOrdersResponse);
                }
            },
            function(getAmazonUsSellerOrdersResponse, callback) {
                if (getAmazonUsSellerOrdersResponse.listOrdersResult != null && getAmazonUsSellerOrdersResponse.listOrdersResult.orders != null) {
                    commonService.insertAmazonOrder(apiname, request.userName, 'amazonUK', getAmazonUsSellerOrdersResponse, request.user.sellerName, function(insertAmazonOrderResponse) {
                        callback(null, sucessResponse);
                    });
                } else {
                    callback(null, sucessResponse);
                }
            },
            //Sync of Amazon DE - Germany
            function(sucessResponse, callback) {
                commonService.getMaxUpdateTs(apiname, request.userName, 'amazonDE', request.user.sellerName, function(getMaxUpdateTsResponse) {
                    var updateTs = '';
                    if (getMaxUpdateTsResponse.responseCode === 0) {
                        updateTs = JSON.stringify(getMaxUpdateTsResponse.response.updateTs);
                        updateTs = updateTs.substring(1, 11);
                    } else {
                        updateTs = '2014-11-30';
                    }
                    callback(null, updateTs);
                });
            },
            function(updateTs, callback) {
                var jsonContent = JSON.parse(contents);
                const amazonUsSite = "amazon_eu_site";
                const amazonUsMarketPlaceId = "amazon_de_marketplace_id";
                const amazonSellerId = request.user.sellerName.concat('_amazon_eu_seller_id');
                const amazonAccountNo = request.user.sellerName.concat('_amazon_eu_account_no');
                const amazonAccessKeyId = request.user.sellerName.concat('_amazon_eu_access_key_id');
                const amazonSecretKey = request.user.sellerName.concat('_amazon_eu_secret_key');
                var site = jsonContent[amazonUsSite];
                var marketPlaceId = jsonContent[amazonUsMarketPlaceId];
                var sellerId = jsonContent[amazonSellerId];
                var accountNo = jsonContent[amazonAccountNo];
                var accessKeyId = jsonContent[amazonAccessKeyId];
                var secretKey = jsonContent[amazonSecretKey];
                logger.info("site : " + site + " marketPlaceId: " + marketPlaceId + " sellerId: " + sellerId + " accountNo: " + accountNo + " accessKeyId: " + accessKeyId + " secretKey: " + secretKey + " updateTs: " + updateTs);
                if (site == null || marketPlaceId == null || sellerId == null || accountNo == null || accessKeyId == null || secretKey == null) {
                    callback(null, sucessResponse);
                } else {
                    commonService.getAmazonUsSellerOrders(apiname, request.userName, request.user.sellerName, updateTs, site, marketPlaceId, sellerId, accountNo, accessKeyId, secretKey, function(getAmazonUsSellerOrdersResponse) {
                        callback(null, getAmazonUsSellerOrdersResponse);
                    });
                }
            },
            function(getAmazonUsSellerOrdersResponse, callback) {
                var orderList;
                if (getAmazonUsSellerOrdersResponse.listOrdersResult != null && getAmazonUsSellerOrdersResponse.listOrdersResult.orders != null) {
                    for (var i in getAmazonUsSellerOrdersResponse.listOrdersResult.orders) {
                        if (orderList == null) {
                            orderList = '';
                        }
                        var order = getAmazonUsSellerOrdersResponse.listOrdersResult.orders[i];
                        orderList = '\'' + order.amazonOrderId + '\',' + orderList;
                    }
                    if (orderList != null) {
                        orderList = orderList.substring(0, orderList.length - 1);
                        logger.info("deleting the order if exist : ", orderList);
                        commonService.deleteOrder(apiname, request.userName, 'amazon', orderList, function(deleteOrderResponse) {
                            callback(null, getAmazonUsSellerOrdersResponse);
                        });
                    } else {
                        callback(null, getAmazonUsSellerOrdersResponse);
                    }
                } else {
                    callback(null, getAmazonUsSellerOrdersResponse);
                }
            },
            function(getAmazonUsSellerOrdersResponse, callback) {
                if (getAmazonUsSellerOrdersResponse.listOrdersResult != null && getAmazonUsSellerOrdersResponse.listOrdersResult.orders != null) {
                    commonService.insertAmazonOrder(apiname, request.userName, 'amazonDE', getAmazonUsSellerOrdersResponse, request.user.sellerName, function(insertAmazonOrderResponse) {
                        callback(null, sucessResponse);
                    });
                } else {
                    callback(null, sucessResponse);
                }
            },
            //Sync of Amazon ES - Spain
            function(sucessResponse, callback) {
                commonService.getMaxUpdateTs(apiname, request.userName, 'amazonES', request.user.sellerName, function(getMaxUpdateTsResponse) {
                    var updateTs = '';
                    if (getMaxUpdateTsResponse.responseCode === 0) {
                        updateTs = JSON.stringify(getMaxUpdateTsResponse.response.updateTs);
                        updateTs = updateTs.substring(1, 11);
                    } else {
                        updateTs = '2014-11-30';
                    }
                    callback(null, updateTs);
                });
            },
            function(updateTs, callback) {
                var jsonContent = JSON.parse(contents);
                const amazonUsSite = "amazon_eu_site";
                const amazonUsMarketPlaceId = "amazon_es_marketplace_id";
                const amazonSellerId = request.user.sellerName.concat('_amazon_eu_seller_id');
                const amazonAccountNo = request.user.sellerName.concat('_amazon_eu_account_no');
                const amazonAccessKeyId = request.user.sellerName.concat('_amazon_eu_access_key_id');
                const amazonSecretKey = request.user.sellerName.concat('_amazon_eu_secret_key');
                var site = jsonContent[amazonUsSite];
                var marketPlaceId = jsonContent[amazonUsMarketPlaceId];
                var sellerId = jsonContent[amazonSellerId];
                var accountNo = jsonContent[amazonAccountNo];
                var accessKeyId = jsonContent[amazonAccessKeyId];
                var secretKey = jsonContent[amazonSecretKey];
                logger.info("site : " + site + " marketPlaceId: " + marketPlaceId + " sellerId: " + sellerId + " accountNo: " + accountNo + " accessKeyId: " + accessKeyId + " secretKey: " + secretKey + " updateTs: " + updateTs);
                if (site == null || marketPlaceId == null || sellerId == null || accountNo == null || accessKeyId == null || secretKey == null) {
                    callback(null, sucessResponse);
                } else {
                    commonService.getAmazonUsSellerOrders(apiname, request.userName, request.user.sellerName, updateTs, site, marketPlaceId, sellerId, accountNo, accessKeyId, secretKey, function(getAmazonUsSellerOrdersResponse) {
                        callback(null, getAmazonUsSellerOrdersResponse);
                    });
                }
            },
            function(getAmazonUsSellerOrdersResponse, callback) {
                var orderList;
                if (getAmazonUsSellerOrdersResponse.listOrdersResult != null && getAmazonUsSellerOrdersResponse.listOrdersResult.orders != null) {
                    for (var i in getAmazonUsSellerOrdersResponse.listOrdersResult.orders) {
                        if (orderList == null) {
                            orderList = '';
                        }
                        var order = getAmazonUsSellerOrdersResponse.listOrdersResult.orders[i];
                        orderList = '\'' + order.amazonOrderId + '\',' + orderList;
                    }
                    if (orderList != null) {
                        orderList = orderList.substring(0, orderList.length - 1);
                        logger.info("deleting the order if exist : ", orderList);
                        commonService.deleteOrder(apiname, request.userName, 'amazon', orderList, function(deleteOrderResponse) {
                            callback(null, getAmazonUsSellerOrdersResponse);
                        });
                    } else {
                        callback(null, getAmazonUsSellerOrdersResponse);
                    }
                } else {
                    callback(null, getAmazonUsSellerOrdersResponse);
                }
            },
            function(getAmazonUsSellerOrdersResponse, callback) {
                if (getAmazonUsSellerOrdersResponse.listOrdersResult != null && getAmazonUsSellerOrdersResponse.listOrdersResult.orders != null) {
                    commonService.insertAmazonOrder(apiname, request.userName, 'amazonES', getAmazonUsSellerOrdersResponse, request.user.sellerName, function(insertAmazonOrderResponse) {
                        callback(null, sucessResponse);
                    });
                } else {
                    callback(null, sucessResponse);
                }
            },
            //Sync of Amazon FR - France
            function(sucessResponse, callback) {
                commonService.getMaxUpdateTs(apiname, request.userName, 'amazonFR', request.user.sellerName, function(getMaxUpdateTsResponse) {
                    var updateTs = '';
                    if (getMaxUpdateTsResponse.responseCode === 0) {
                        updateTs = JSON.stringify(getMaxUpdateTsResponse.response.updateTs);
                        updateTs = updateTs.substring(1, 11);
                    } else {
                        updateTs = '2014-11-30';
                    }
                    callback(null, updateTs);
                });
            },
            function(updateTs, callback) {
                var jsonContent = JSON.parse(contents);
                const amazonUsSite = "amazon_eu_site";
                const amazonUsMarketPlaceId = "amazon_fr_marketplace_id";
                const amazonSellerId = request.user.sellerName.concat('_amazon_eu_seller_id');
                const amazonAccountNo = request.user.sellerName.concat('_amazon_eu_account_no');
                const amazonAccessKeyId = request.user.sellerName.concat('_amazon_eu_access_key_id');
                const amazonSecretKey = request.user.sellerName.concat('_amazon_eu_secret_key');
                var site = jsonContent[amazonUsSite];
                var marketPlaceId = jsonContent[amazonUsMarketPlaceId];
                var sellerId = jsonContent[amazonSellerId];
                var accountNo = jsonContent[amazonAccountNo];
                var accessKeyId = jsonContent[amazonAccessKeyId];
                var secretKey = jsonContent[amazonSecretKey];
                logger.info("site : " + site + " marketPlaceId: " + marketPlaceId + " sellerId: " + sellerId + " accountNo: " + accountNo + " accessKeyId: " + accessKeyId + " secretKey: " + secretKey + " updateTs: " + updateTs);
                if (site == null || marketPlaceId == null || sellerId == null || accountNo == null || accessKeyId == null || secretKey == null) {
                    callback(null, sucessResponse);
                } else {
                    commonService.getAmazonUsSellerOrders(apiname, request.userName, request.user.sellerName, updateTs, site, marketPlaceId, sellerId, accountNo, accessKeyId, secretKey, function(getAmazonUsSellerOrdersResponse) {
                        callback(null, getAmazonUsSellerOrdersResponse);
                    });
                }
            },
            function(getAmazonUsSellerOrdersResponse, callback) {
                var orderList;
                if (getAmazonUsSellerOrdersResponse.listOrdersResult != null && getAmazonUsSellerOrdersResponse.listOrdersResult.orders != null) {
                    for (var i in getAmazonUsSellerOrdersResponse.listOrdersResult.orders) {
                        if (orderList == null) {
                            orderList = '';
                        }
                        var order = getAmazonUsSellerOrdersResponse.listOrdersResult.orders[i];
                        orderList = '\'' + order.amazonOrderId + '\',' + orderList;
                    }
                    if (orderList != null) {
                        orderList = orderList.substring(0, orderList.length - 1);
                        logger.info("deleting the order if exist : ", orderList);
                        commonService.deleteOrder(apiname, request.userName, 'amazon', orderList, function(deleteOrderResponse) {
                            callback(null, getAmazonUsSellerOrdersResponse);
                        });
                    } else {
                        callback(null, getAmazonUsSellerOrdersResponse);
                    }
                } else {
                    callback(null, getAmazonUsSellerOrdersResponse);
                }
            },
            function(getAmazonUsSellerOrdersResponse, callback) {
                if (getAmazonUsSellerOrdersResponse.listOrdersResult != null && getAmazonUsSellerOrdersResponse.listOrdersResult.orders != null) {
                    commonService.insertAmazonOrder(apiname, request.userName, 'amazonFR', getAmazonUsSellerOrdersResponse, request.user.sellerName, function(insertAmazonOrderResponse) {
                        callback(null, sucessResponse);
                    });
                } else {
                    callback(null, sucessResponse);
                }
            },
            //Sync of Amazon IT - Italy
            function(sucessResponse, callback) {
                commonService.getMaxUpdateTs(apiname, request.userName, 'amazonIT', request.user.sellerName, function(getMaxUpdateTsResponse) {
                    var updateTs = '';
                    if (getMaxUpdateTsResponse.responseCode === 0) {
                        updateTs = JSON.stringify(getMaxUpdateTsResponse.response.updateTs);
                        updateTs = updateTs.substring(1, 11);
                    } else {
                        updateTs = '2014-11-30';
                    }
                    callback(null, updateTs);
                });
            },
            function(updateTs, callback) {
                var jsonContent = JSON.parse(contents);
                const amazonUsSite = "amazon_eu_site";
                const amazonUsMarketPlaceId = "amazon_it_marketplace_id";
                const amazonSellerId = request.user.sellerName.concat('_amazon_eu_seller_id');
                const amazonAccountNo = request.user.sellerName.concat('_amazon_eu_account_no');
                const amazonAccessKeyId = request.user.sellerName.concat('_amazon_eu_access_key_id');
                const amazonSecretKey = request.user.sellerName.concat('_amazon_eu_secret_key');
                var site = jsonContent[amazonUsSite];
                var marketPlaceId = jsonContent[amazonUsMarketPlaceId];
                var sellerId = jsonContent[amazonSellerId];
                var accountNo = jsonContent[amazonAccountNo];
                var accessKeyId = jsonContent[amazonAccessKeyId];
                var secretKey = jsonContent[amazonSecretKey];
                logger.info("site : " + site + " marketPlaceId: " + marketPlaceId + " sellerId: " + sellerId + " accountNo: " + accountNo + " accessKeyId: " + accessKeyId + " secretKey: " + secretKey + " updateTs: " + updateTs);
                if (site == null || marketPlaceId == null || sellerId == null || accountNo == null || accessKeyId == null || secretKey == null) {
                    callback(null, sucessResponse);
                } else {
                    commonService.getAmazonUsSellerOrders(apiname, request.userName, request.user.sellerName, updateTs, site, marketPlaceId, sellerId, accountNo, accessKeyId, secretKey, function(getAmazonUsSellerOrdersResponse) {
                        callback(null, getAmazonUsSellerOrdersResponse);
                    });
                }
            },
            function(getAmazonUsSellerOrdersResponse, callback) {
                var orderList;
                if (getAmazonUsSellerOrdersResponse.listOrdersResult != null && getAmazonUsSellerOrdersResponse.listOrdersResult.orders != null) {
                    for (var i in getAmazonUsSellerOrdersResponse.listOrdersResult.orders) {
                        if (orderList == null) {
                            orderList = '';
                        }
                        var order = getAmazonUsSellerOrdersResponse.listOrdersResult.orders[i];
                        orderList = '\'' + order.amazonOrderId + '\',' + orderList;
                    }
                    if (orderList != null) {
                        orderList = orderList.substring(0, orderList.length - 1);
                        logger.info("deleting the order if exist : ", orderList);
                        commonService.deleteOrder(apiname, request.userName, 'amazon', orderList, function(deleteOrderResponse) {
                            callback(null, getAmazonUsSellerOrdersResponse);
                        });
                    } else {
                        callback(null, getAmazonUsSellerOrdersResponse);
                    }
                } else {
                    callback(null, getAmazonUsSellerOrdersResponse);
                }
            },
            function(getAmazonUsSellerOrdersResponse, callback) {
                if (getAmazonUsSellerOrdersResponse.listOrdersResult != null && getAmazonUsSellerOrdersResponse.listOrdersResult.orders != null) {
                    commonService.insertAmazonOrder(apiname, request.userName, 'amazonIT', getAmazonUsSellerOrdersResponse, request.user.sellerName, function(insertAmazonOrderResponse) {
                        callback(null, sucessResponse);
                    });
                } else {
                    callback(null, sucessResponse);
                }
            },

            //sync for 11 streets
            function(sucessResponse, callback) {
                commonService.getMaxUpdateTs(apiname, request.userName, 'elevenStreet', request.user.sellerName, function(getMaxUpdateTsResponse) {
                    var updateTs = '';
                    if (getMaxUpdateTsResponse.responseCode === 0) {
                        updateTs = JSON.stringify(getMaxUpdateTsResponse.response.updateTs);
                        updateTs = updateTs.substring(9, 11) + "" + updateTs.substring(6, 8) + "" + updateTs.substring(1, 5) + "0000";
                    } else {
                        var d = new Date();
                        d.setDate(d.getDate() - 6)
                        updateTs = ("0" + d.getDate()).slice(-2) + "" + ("0" + (d.getMonth() + 1)).slice(-2) + "" + d.getFullYear() + "0000";
                    }
                    callback(null, updateTs);
                });
            },
            function(updateTs, callback) {
                var d = new Date();
                var updateTill = ("0" + d.getDate()).slice(-2) + "" + ("0" + (d.getMonth() + 1)).slice(-2) + "" + d.getFullYear() + "2359";
                var jsonContent = JSON.parse(contents);
                const elevenStreetSite = "elevenStreet_site";
                const elevenStreetKey = request.user.sellerName.concat('_elevenStateKey');
                var site = jsonContent[elevenStreetSite];
                var sellerKey = jsonContent[elevenStreetKey];
                logger.info("updateTs : " + updateTs + " updateTill : " + updateTill + " elevenStreetSite : " + site + " elevenStreetKey :" + sellerKey);
                if (site == null || sellerKey == null) {
                    logger.info("eleven state sync cancelled because required param missing");
                    callback(null, failureResponse);
                } else {
                    site = site + "rest/ordservices/complete/" + updateTs + "/" + updateTill;
                    logger.info("site : " + site);
                    commonService.getElevenStatesComplete(apiname, request.userName, request.user.sellerName, updateTs, updateTill, site, sellerKey, function(getElevenStatesCompleteResponse) {
                        callback(null, getElevenStatesCompleteResponse);
                    });
                }
            },
            function(response, callback) {
                logger.info("response is :", response);
                if (response.responseCode === 0) {
                    logger.info("Processing the response");
                    var responseJsonString = JSON.stringify(response.response.result);
                    responseJsonString = responseJsonString.replace('ns2:orders', 'orders');
                    responseJsonString = responseJsonString.replace('ns2:order', 'order');
                    var responseJson = JSON.parse(responseJsonString);
                    responseJson = JSON.parse(responseJson);
                    logger.info("responseJson -> ", responseJson);
                    if (responseJson.orders.result_code != null && responseJson.orders.result_code[0] === '0') {
                        callback(null, response);
                    } else {
                        logger.info("deleting the order if exist");
                        var orderList;
                        for (var i in responseJson.orders.order) {
                            if (orderList == null) {
                                orderList = '';
                            }
                            var ord = responseJson.orders.order[i].ordNo[0];
                            orderList = '\'' + ord + '\',' + orderList;
                        }
                        if (orderList != null) {
                            orderList = orderList.substring(0, orderList.length - 1);
                            logger.info("deleting the order if exist : ", orderList);
                            commonService.deleteOrder(apiname, request.userName, 'elevenStreet', orderList, function(deleteOrderResponse) {
                                callback(null, response);
                            });
                        } else {
                            callback(null, response);
                        }
                    }
                } else {
                    callback(null, response);
                }
            },
            function(response, callback) {
                logger.info("Inserting Order, response is :", response);
                if (response.responseCode === 0) {
                    var responseJsonString = JSON.stringify(response.response.result);
                    responseJsonString = responseJsonString.replace('ns2:orders', 'orders');
                    responseJsonString = responseJsonString.replace('ns2:order', 'order');
                    var responseJson = JSON.parse(responseJsonString);
                    responseJson = JSON.parse(responseJson);
                    if (responseJson.orders.result_code != null && responseJson.orders.result_code[0] === '0') {
                        callback(null, sucessResponse);
                    } else {
                        commonService.insertElevenStreetOrder(apiname, request.userName, 'elevenStreet', responseJson, request.user.sellerName, function(res) {
                            callback(null, sucessResponse);
                        });
                    }
                } else {
                    callback(null, sucessResponse);
                }
            },
            //sync for 11Street Orders to be processed - packaging
            function(sucessResponse, callback) {
                commonService.getMaxUpdateTs(apiname, request.userName, 'elevenStreet', request.user.sellerName, function(getMaxUpdateTsResponse) {
                    var updateTs = '';
                    if (getMaxUpdateTsResponse.responseCode === 0) {
                        updateTs = JSON.stringify(getMaxUpdateTsResponse.response.updateTs);
                        updateTs = updateTs.substring(9, 11) + "" + updateTs.substring(6, 8) + "" + updateTs.substring(1, 5) + "0000";
                    } else {
                        var d = new Date();
                        d.setDate(d.getDate() - 6)
                        updateTs = ("0" + d.getDate()).slice(-2) + "" + ("0" + (d.getMonth() + 1)).slice(-2) + "" + d.getFullYear() + "0000";
                    }
                    callback(null, updateTs);
                });
            },
            function(updateTs, callback) {
                var d = new Date();
                var updateTill = ("0" + d.getDate()).slice(-2) + "" + ("0" + (d.getMonth() + 1)).slice(-2) + "" + d.getFullYear() + "2359";
                var jsonContent = JSON.parse(contents);
                const elevenStreetSite = "elevenStreet_site";
                const elevenStreetKey = request.user.sellerName.concat('_elevenStateKey');
                var site = jsonContent[elevenStreetSite];
                var sellerKey = jsonContent[elevenStreetKey];
                logger.info("updateTs : " + updateTs + " updateTill : " + updateTill + " elevenStreetSite : " + site + " elevenStreetKey :" + sellerKey);
                if (site == null || sellerKey == null) {
                    logger.info("eleven state sync cancelled because required param missing");
                    callback(null, failureResponse);
                } else {
                    site = site + "rest/ordservices/packaging/" + updateTs + "/" + updateTill;
                    logger.info("site : " + site);
                    commonService.getElevenStatesComplete(apiname, request.userName, request.user.sellerName, updateTs, updateTill, site, sellerKey, function(getElevenStatesCompleteResponse) {
                        callback(null, getElevenStatesCompleteResponse);
                    });
                }
            },
            function(response, callback) {
                logger.info("response is :", response);
                if (response.responseCode === 0) {
                    logger.info("Processing the response");
                    var responseJsonString = JSON.stringify(response.response.result);
                    responseJsonString = responseJsonString.replace('ns2:orders', 'orders');
                    responseJsonString = responseJsonString.replace('ns2:order', 'order');
                    var responseJson = JSON.parse(responseJsonString);
                    responseJson = JSON.parse(responseJson);
                    logger.info("responseJson -> ", responseJson);
                    if (responseJson.orders.result_code != null && responseJson.orders.result_code[0] === '0') {
                        callback(null, response);
                    } else {
                        logger.info("deleting the order if exist");
                        var orderList;
                        for (var i in responseJson.orders.order) {
                            if (orderList == null) {
                                orderList = '';
                            }
                            var ord = responseJson.orders.order[i].ordNo[0];
                            orderList = '\'' + ord + '\',' + orderList;
                        }
                        if (orderList != null) {
                            orderList = orderList.substring(0, orderList.length - 1);
                            logger.info("deleting the order if exist : ", orderList);
                            commonService.deleteOrder(apiname, request.userName, 'elevenStreet', orderList, function(deleteOrderResponse) {
                                callback(null, response);
                            });
                        } else {
                            callback(null, response);
                        }
                    }
                } else {
                    callback(null, response);
                }
            },
            function(response, callback) {
                logger.info("Inserting Order, response is :", response);
                if (response.responseCode === 0) {
                    var responseJsonString = JSON.stringify(response.response.result);
                    responseJsonString = responseJsonString.replace('ns2:orders', 'orders');
                    responseJsonString = responseJsonString.replace('ns2:order', 'order');
                    var responseJson = JSON.parse(responseJsonString);
                    responseJson = JSON.parse(responseJson);
                    if (responseJson.orders.result_code != null && responseJson.orders.result_code[0] === '0') {
                        callback(null, sucessResponse);
                    } else {
                        commonService.insertElevenStreetOrder(apiname, request.userName, 'elevenStreet', responseJson, request.user.sellerName, function(res) {
                            callback(null, sucessResponse);
                        });
                    }
                } else {
                    callback(null, sucessResponse);
                }
            },
            //Sync Sears Market Place
            function(sucessResponse, callback) {
                commonService.getMaxUpdateTs(apiname, request.userName, 'sears', request.user.sellerName, function(getMaxUpdateTsResponse) {
                    var updateTs = '';
                    var toTs = new Date();
                    toTs = date.format(toTs, 'YYYY-MM-DD');
                    if (getMaxUpdateTsResponse.responseCode === 0) {
                        updateTs = JSON.stringify(getMaxUpdateTsResponse.response.updateTs);
                        updateTs = updateTs.substring(1, 11);
                    } else {
                        updateTs = "2014-01-01";
                    }
                    logger.info("===========> updateTs : " + updateTs + " toTs : " + toTs);
                    callback(null, updateTs, toTs);
                });
            },
            function(updateTs, toTs, callback) {
                var jsonContent = JSON.parse(contents);
                const searsSite = "sears_site";
                const searsSellerId = request.user.sellerName.concat('_sears_seller_id');
                const searsSellerSecretKey = request.user.sellerName.concat('_sears_secret_key');
                const searsSellerEmail = request.user.sellerName.concat('_sears_seller_email');
                var site = jsonContent[searsSite];
                var sellerId = jsonContent[searsSellerId];
                var sellerSecretKey = jsonContent[searsSellerSecretKey];
                var sellerEmail = jsonContent[searsSellerEmail];
                var requestTs = "";
                var dt = new Date();
                requestTs = dt.getFullYear() + "-" + ("0" + (dt.getMonth() + 1)).slice(-2) + "-" + ("0" + dt.getDate()).slice(-2) + "T" + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + "Z";
                //var text = sellerId+":"+sellerEmail+":2017-12-17T19:39:05Z";
                var text = sellerId + ":" + sellerEmail + ":" + requestTs;
                var hash;
                var hmac;
                logger.info(request.userName + ":common_workflow:text " + text);
                logger.info(request.userName + ":common_workflow:sellerSecretKey " + sellerSecretKey);
                logger.info(request.userName + ":common_workflow:site " + site);
                /*hmac = crypto.createHmac(algorithm,sellerSecretKey);
            hmac.setEncoding('hex');
            hmac.end(text, function () {
                hash = hmac.read();
            });
            hash=hmac.read();
                        logger.info(request.userName + ":common_workflow:hash "+hash);*/
                if (site == null || sellerId == null || sellerSecretKey == null || sellerSecretKey.length === 0) {
                    logger.info(request.userName + ":common_workflow:sit or sellerId or sellerSecretKey is null");
                    callback(null, failureResponse);
                } else {
                    //sellerSecretKey="test";
                    hmac = crypto.createHmac(algorithm, sellerSecretKey);
                    hmac.setEncoding('hex');
                    hmac.end(text, function() {
                        hash = hmac.read();
                    });
                    hash = hmac.read();
                    logger.info(request.userName + ":common_workflow:hash " + hash);
                    commonService.getSearsSellerOrders(apiname, request.userName, request.user.sellerName, hash, site, sellerId, sellerEmail, updateTs, toTs, requestTs, function(getSearsSellerOrdersResponse) {
                        callback(null, getSearsSellerOrdersResponse);
                    });
                }
            },
            function(getSearsSellerOrdersResponse, callback) {
                logger.info(request.userName + ":common_workflow:syncSellerOrders:Sears JSON Response:");
                logger.info(getSearsSellerOrdersResponse);
                if (getSearsSellerOrdersResponse.responseCode === 0) {
                    var responseJson = JSON.parse(getSearsSellerOrdersResponse.response.result);
                    if (responseJson['po-response'] != null && responseJson['po-response']['purchase-order'] != null && responseJson['po-response']['purchase-order'].length > 0) {
                        logger.info("deleting the order if exist");
                        var orderList;
                        for (var i in responseJson['po-response']['purchase-order']) {
                            if (orderList == null) {
                                orderList = '';
                            }
                            //var ord = responseJson.poResponse.purchaseOrder[i].poNumberWithDate[0];
                            var ord = responseJson['po-response']['purchase-order'][i]['po-number-with-date'][0]
                            orderList = '\'' + ord + '\',' + orderList;
                        }
                        if (orderList != null) {
                            orderList = orderList.substring(0, orderList.length - 1);
                            logger.info("deleting the order if exist : ", orderList);
                            commonService.deleteOrder(apiname, request.userName, 'sears', orderList, function(deleteOrderResponse) {
                                callback(null, getSearsSellerOrdersResponse);
                            });
                        } else {
                            callback(null, getSearsSellerOrdersResponse);
                        }
                    } else {
                        callback(null, getSearsSellerOrdersResponse);
                    }
                } else {
                    callback(null, getSearsSellerOrdersResponse);
                }
            },
            function(getSearsSellerOrdersResponse, callback) {
                if (getSearsSellerOrdersResponse.responseCode === 0) {
                    var responseJson = JSON.parse(getSearsSellerOrdersResponse.response.result);
                    if (responseJson['po-response'] != null && responseJson['po-response']['purchase-order'] != null) {
                        commonService.insertSearsSellerOrder(apiname, request.userName, 'sears', responseJson['po-response']['purchase-order'], request.user.sellerName, function(insertSearsSellerOrderResponse) {
                            callback(null, sucessResponse);
                        });
                    } else {
                        callback(null, sucessResponse);
                    }
                } else {
                    callback(null, sucessResponse);
                }
            },
            //Sync for ebay start
            function(sucessResponse, callback) {
                commonService.getMaxUpdateTs(apiname, request.userName, 'ebay', request.user.sellerName, function(getMaxUpdateTsResponse) {
                    var updateTs = '';
                    if (getMaxUpdateTsResponse.responseCode === 0) {
                        updateTs = JSON.stringify(getMaxUpdateTsResponse.response.updateTs);
                        updateTs = updateTs.replace('"', '');
                        updateTs = updateTs.replace('"', '');
                        //updateTs=updateTs.substring(9,11)+""+updateTs.substring(6,8)+""+updateTs.substring(1,5)+"0000";
                    } else {
                        var d = new Date();
                        d.setDate(d.getDate() - 29)
                        updateTs = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + "T01:01:01.000Z";
                        //updateTs=("0"+d.getDate()).slice(-2)+""+("0"+(d.getMonth()+1)).slice(-2)+""+d.getFullYear()+"0000";
                    }
                    logger.info(request.userName + " ebay updateTs : " + updateTs);
                    callback(null, updateTs);
                });
            },
            function(updateTs, callback) {
                var jsonContent = JSON.parse(contents);
                const ebaySellerDevId = request.user.sellerName.concat('_ebaySellerDevId');
                const ebaySellerCertId = request.user.sellerName.concat('_ebaySellerCertId');
                const ebaySellerAppId = request.user.sellerName.concat('_ebaySellerAppIdKey');
                const ebaySellerAuthToken = request.user.sellerName.concat('_ebaySellerAuthToken');
                var sellerDevId = jsonContent[ebaySellerDevId];
                var sellerCertId = jsonContent[ebaySellerCertId];
                var sellerAppId = jsonContent[ebaySellerAppId];
                var sellerAuthToken = jsonContent[ebaySellerAuthToken];
                if (sellerDevId == null || sellerCertId == null || sellerAppId == null || sellerAuthToken == null) {
                    logger.info(request.userName + " Madatory parameter for seller in config file missing for seller ebay account");
                    callback(null, failureResponse, "");
                } else {
                    logger.info(request.userName + " Making call to ebay system to get the orders");
                    ebay.xmlRequest({
                        serviceName: 'Trading',
                        opType: 'GetOrders',
                        //ebay developer account detail
                        devId: sellerDevId,
                        certId: sellerCertId,
                        appId: sellerAppId,
                        sandbox: false,
                        //ebay seller authtoken generated
                        authToken: sellerAuthToken,
                        params: {
                            'ModTimeFrom': updateTs,
                            'OrderStatus': 'All',
                            'Pagination': {
                                'EntriesPerPage': 100, //default 25... max 100
                                'PageNumber': 1
                            },
                            'DetailLevel': 'ReturnAll',
                            'ErrorLanguage': 'en_US',
                            'WarningLevel': 'High'
                        }
                    }, function(error, results) {
                        logger.info(request.userName + " result : " + JSON.stringify(results));
                        callback(null, sucessResponse, JSON.stringify(results));
                    });
                }
            },
            function(response, ebayResult, callback) {
                if (response.responseCode === 0) {
                    var responseJson = JSON.parse(ebayResult);
                    if (responseJson.Ack === 'Success') {
                        var orderList;
                        for (var i in responseJson.Orders) {
                            if (orderList == null) {
                                orderList = '';
                            }
                            var ord = responseJson.Orders[i].OrderID;
                            orderList = '\'' + ord + '\',' + orderList;
                        }
                        if (orderList != null) {
                            orderList = orderList.substring(0, orderList.length - 1);
                            logger.info(request.userName + " ebay deleting the order if exist : ", orderList);
                            commonService.deleteOrder(apiname, request.userName, 'ebay', orderList, function(deleteOrderResponse) {
                                callback(null, sucessResponse, responseJson);
                            });
                        } else {
                            callback(null, sucessResponse, responseJson);
                        }
                    } else {
                        callback(null, failureResponse, "");
                    }
                } else {
                    callback(null, failureResponse, "");
                }
            },
            function(response, responseJson, callback) {
                if (response.responseCode === 0) {
                    commonService.insertEbayOrder(apiname, request.userName, 'ebay', responseJson, request.user.sellerName, function(res) {
                        callback(null, sucessResponse);
                    });
                } else {
                    callback(null, sucessResponse);
                }
            },
            //Sync for ebay end
            /*function(getSellerOrdersResponse,callback) {
                commonService.getSellerLocalOrder(apiname, request.userName,'lazada',request.user.sellerName,function(getSellerLocalOrderResponse) {
                    callback(null,getSellerLocalOrderResponse);
                });
            },*/
        ],
        function(err, results) {
            if (err) {
                logger.error(request.userName + ":common_workflow:syncSellerOrders:" + apiname + ":Exit", err);
                responseCallback(err);
            } else {
                logger.info(request.userName + ":common_workflow:syncSellerOrders:" + apiname + ":Exit", results);
                responseCallback(results);
            }
        });
};

commonWorkflow.getSellerOrders = function(apiname, lang, locale, request, responseCallback) {
    logger.info(request.userName + ":common_workflow:getSellerOrders" + apiname + ":Enter");
    async.waterfall(
        [
            function(callback) {
                commonService.getSellerLocalOrder(apiname, request.userName, 'lazada', request.user.sellerName, function(getSellerLocalOrderResponse) {
                    callback(null, getSellerLocalOrderResponse);
                });
            },
        ],
        function(err, results) {
            if (err) {
                logger.error(request.userName + ":common_workflow:getSellerOrders:" + apiname + ":Exit", err);
                responseCallback(err);
            } else {
                logger.info(request.userName + ":common_workflow:getSellerOrders:" + apiname + ":Exit", results);
                responseCallback(results);
            }
        });
};

commonWorkflow.trackOrder = function(apiname, lang, locale, request, responseCallback) {
    logger.info(request.userName + ":common_workflow:trackOrder" + apiname + ":Enter");

    var failureResponse = {
        "responseCode": -1,
        "response": "",
        "errorMsg": ""
    };
    async.waterfall(
        [
            function(callback) {
                if (request.shipmentProvider === "FedEx") {
                    logger.error(request.userName + ":common_workflow:trackOrder:" + apiname + ": FedEx Shipment");
                    commonService.trackFedExOrder(apiname, request.userName, request, function(trackingOrderResponse) {
                        callback(null, trackingOrderResponse);
                    });
                } else if (request.shipmentProvider === "Aramex") {
                    logger.error(request.userName + ":common_workflow:trackOrder:" + apiname + ": Aramex Shipment");
                    commonService.trackAramexOrder(apiname, request.userName, request, function(trackingOrderResponse) {
                        callback(null, trackingOrderResponse);
                    });
                } else if (request.shipmentProvider === "DHL") {
                    logger.error(request.userName + ":common_workflow:trackOrder:" + apiname + ": DHL Shipment");
                    commonService.trackDHLOrder(apiname, request.userName, request, function(trackingOrderResponse) {
                        callback(null, trackingOrderResponse);
                    });
                } else {
                    failureResponse.errorMsg = 'Please provide a valid shipment Provider';
                    callback(failureResponse, null);
                }
            },
        ],
        function(err, results) {
            if (err) {
                logger.error(request.userName + ":common_workflow:trackOrder:" + apiname + ":Exit", err);
                responseCallback(err);
            } else {
                logger.info(request.userName + ":common_workflow:trackOrder:" + apiname + ":Exit", results);
                responseCallback(results);
            }
        });
};

commonWorkflow.getSalesOrOrdersReport = function(apiname, lang, locale, request, responseCallback) {
    var failureResponse = {
        "responseCode": -1,
        "response": "",
        "errorMsg": "Issue in getSalesOrOrdersReport"
    };
    var type = request.type;
    var sucessResponse = {
        "responseCode": 0,
        "response": [{
            "today": "0",
            "thisWeek": "0",
            "thisMonth": "0"
        }],
        "errorMsg": ""
    }

    logger.info(request.userName + ":common_workflow:getSalesOrOrdersReport" + apiname + ":Enter");
    async.waterfall(
        [
            function(callback) {
                var startDate = moment(new Date()).format("YYYY-MM-DD");
                var endDate = moment(new Date()).add(1, 'days').format("YYYY-MM-DD");
                commonService.getSalesOrOrdersReport(apiname, request.userName, request.user.sellerName, startDate, endDate, function(response) {
                    if (type === "ORDERS" || type == "ORDERS") {
                        sucessResponse.response[0].today = response.orders;
                    } else {
                        sucessResponse.response[0].today = response.sales;
                    }
                    callback(null, sucessResponse);
                });
            },
            function(sucessResponse, callback) {

                var startDate = moment(new Date()).add(-2, 'days').format("YYYY-MM-DD");              
                var endDate = moment(new Date()).add(4, 'days').format("YYYY-MM-DD");

                if(request.thisWeek){
                    startDate = request.thisWeek.startDate;
                    endDate = request.thisWeek.endDate;
                }

                commonService.getSalesOrOrdersReport(apiname, request.userName, request.user.sellerName, startDate, endDate, function(response) {
                    if (type === "ORDERS" || type == "ORDERS") {
                        sucessResponse.response[0].thisWeek = response.orders;
                    } else {
                        sucessResponse.response[0].thisWeek = response.sales;
                    }
                    callback(null, sucessResponse);
                });
            },
            function(sucessResponse, callback) {
                var startDate = request.thisMonth.startDate;
                var endDate = request.thisMonth.endDate;

                commonService.getSalesOrOrdersReport(apiname, request.userName, request.user.sellerName, startDate, endDate, function(response) {
                    if (type === "ORDERS" || type == "ORDERS") {
                        sucessResponse.response[0].thisMonth = response.orders;
                    } else {
                        sucessResponse.response[0].thisMonth = response.sales;
                    }
                    callback(null, sucessResponse);
                });
            }
        ],
        function(err, results) {
            if (err) {
                logger.error(request.userName + ":common_workflow:getMarketPlaceOrders:" + apiname + ":Exit", err);
                responseCallback(err);
            } else {

                logger.info(request.userName + ":common_workflow:getMarketPlaceOrders:" + apiname + ":Exit", results);
                responseCallback(results);
            }
        });
};

commonWorkflow.getSalesOrOrdersGraph = function(apiname, lang, locale, request, responseCallback) {
    var failureResponse = {
        "responseCode": -1,
        "response": "",
        "errorMsg": "Issue in sync with market place"
    };

    var sucessResponse = {
        "responseCode": 0,
        "response": [],
        "errorMsg": ""
    };
    var startDate = '2018-05-01';
    var endDate = '2018-05-30';


    logger.info(request.userName + ":common_workflow:getSalesOrOrdersGraph" + apiname + ":Enter");
    async.waterfall(
        [
            function(callback) {
                commonService.getSalesOrOrdersGraph(apiname, request.userName, request.user.sellerName, startDate, endDate, 'amazon', function(response) {

                    var sample = {
                        "marketPlace": "",
                        "dates": [],
                        "data": []
                    };

                    sample.marketPlace = response.marketPlace;
                    sample.dates = response.dates;

                    if (request.type === "ORDERS") {
                        sample.data = response.orders;
                    } else {
                        sample.data = response.sales;
                    }
                    sucessResponse.response.push(sample);

                });
                callback(null, sucessResponse);


            },
            function(sucessResponse, callback) {
                commonService.getSalesOrOrdersGraph(apiname, request.userName, request.user.sellerName, startDate, endDate, 'elevenStreet', function(response) {

                    var sample = {
                        "marketPlace": "",
                        "dates": [],
                        "data": []
                    };

                    sample.marketPlace = response.marketPlace;
                    sample.dates = response.dates;

                    if (request.type === "ORDERS") {
                        sample.data = response.orders;
                    } else {
                        sample.data = response.sales;

                    }
                    sucessResponse.response.push(sample);

                    callback(null, sucessResponse);
                });
            },
            function(sucessResponse, callback) {
                commonService.getSalesOrOrdersGraph(apiname, request.userName, request.user.sellerName, startDate, endDate, 'sears', function(response) {

                    var sample = {
                        "marketPlace": "",
                        "dates": [],
                        "data": []
                    };

                    sample.marketPlace = response.marketPlace;
                    sample.dates = response.dates;

                    if (request.type === "ORDERS") {
                        sample.data = response.orders;
                    } else {
                        sample.data = response.sales;

                    }
                    sucessResponse.response.push(sample);

                    callback(null, sucessResponse);
                });
            },
            function(sucessResponse, callback) {
                commonService.getSalesOrOrdersGraph(apiname, request.userName, request.user.sellerName, startDate, endDate, 'lazada', function(response) {

                    var sample = {
                        "marketPlace": "",
                        "dates": [],
                        "data": []
                    };

                    sample.marketPlace = response.marketPlace;
                    sample.dates = response.dates;

                    if (request.type === "ORDERS") {
                        sample.data = response.orders;
                    } else {
                        sample.data = response.sales;

                    }
                    sucessResponse.response.push(sample);

                    callback(null, sucessResponse);
                });
            },
            function(sucessResponse, callback) {
                commonService.getSalesOrOrdersGraph(apiname, request.userName, request.user.sellerName, startDate, endDate, 'ebay', function(response) {

                    var sample = {
                        "marketPlace": "",
                        "dates": [],
                        "data": []
                    };

                    sample.marketPlace = response.marketPlace;
                    sample.dates = response.dates;

                    if (request.type === "ORDERS") {
                        sample.data = response.orders;
                    } else {
                        sample.data = response.sales;

                    }
                    sucessResponse.response.push(sample);

                    callback(null, sucessResponse);
                });
            }
        ],
        function(err, results) {
            if (err) {
                logger.error(request.userName + ":common_workflow:getMarketPlaceOrders:" + apiname + ":Exit", err);
                responseCallback(err);
            } else {
                logger.info(request.userName + ":common_workflow:getMarketPlaceOrders:" + apiname + ":Exit", results);
                responseCallback(sucessResponse);
            }
        });
};


module.exports = commonWorkflow;
