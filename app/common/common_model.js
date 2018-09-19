/*jslint node: true */
'use strict';
var commonModel = {};
var config = require('../../config/config');
var mysql_db = require('../../db/mysql_db');
var query_config = require('../../config/query_config');
var logger = config.logger;
var async = require('async');
var _ = require('lodash');
var mysqldb = require('mysql');
var moment = require('moment');

var con = mysqldb.createConnection({
    host: "scalelabsdevdb.cababjt98r5d.us-east-1.rds.amazonaws.com",
    user: "scaleLabsDevDB",
    password: "scaleLabsDevDB",
    database: 'my_db'
});

commonModel.getProductDetails = function(apiname, userName, productDetails, modelCallback) {
	logger.info(userName + ":common_model:getProductDetails:" + apiname + ":Enter");
	var failureResponse = {
        	"responseCode": -1,
        	"response": "",
        	"errorMsg": "DB_ERROR"
    	};
	var sucessResponse = {
		"responseCode": 0,
		"response": {
			"productDetails" : []
		},
		"errorMsg": ""
	};
	var productIdList = "";
	async.waterfall(
	[
	function(callback) {
	for (var i=0; i < productDetails.length ; i++) {
		productIdList = productIdList+productDetails[i].id+",";
	}
	productIdList=productIdList.substring(0,productIdList.length - 1);
	var sql = "select sellerSku,brand,name,color,category,materialOrFabric,productDescription,model,gender,quantity,price,image1,image2,image3,image4,image5,image6,image7,packageLength,packageWidth,packageHeight,packageWeight,watch_external_product_id,watch_external_product_id_type,watch_item_name,watch_manufacturer,watch_model,watch_part_number,watch_standard_price,watch_merchant_shipping_group_name,watch_target_audience_keywords1,watch_target_audience_keywords2,watch_target_audience_keywords3,watch_target_audience_keywords4,watch_target_audience_keywords5,watch_main_image_url,watch_band_material_type,watch_band_color,watch_dial_color,watch_display_type,watch_movement_type,shoes_feed_product_type,shoes_item_sku,shoes_merchant_shipping_group_name,shoes_outer_material_type1,shoes_outer_material_type2,shoes_material_type1,shoes_material_type2,shoes_color_name,shoes_size_name,baby_item_sku,baby_item_name,baby_quantity,baby_standard_price,baby_merchant_shipping_group_name,baby_color_name,baby_mfg_minimum,baby_mfg_minimum_unit_of_measure,beauty_item_sku,beauty_item_name,beauty_part_number,beauty_merchant_shipping_group_name,beauty_recommended_browse_nodes,computers_item_sku,computers_item_name,computers_merchant_shipping_group_name,computers_recommended_browse_nodes,computers_hard_disk_size1,computers_hard_disk_size2,computers_hard_disk_size3,computers_hard_disk_size4,computers_hard_disk_size5,computers_hard_disk_size6,computers_hard_disk_size7,computers_hard_disk_size8,computers_hard_disk_interface1,computers_hard_disk_interface2,computers_hard_disk_interface3,computers_hard_disk_interface4,computers_system_ram_type1,computers_system_ram_type2,computers_system_ram_type3,computers_system_ram_type4,computers_system_ram_type5,computers_system_ram_type6,computers_system_ram_type7,computers_operating_system,food_merchant_shipping_group_name,food_material_features,food_fc_shelf_life,food_fc_shelf_life_pad_time,food_product_expiration_type,furniture_item_name,furniture_merchant_shipping_group_name,sports_condition_type,sports_merchant_shipping_group_name,sports_item_type_name,toys_item_name,toys_merchant_shipping_group_name,toys_color_name,toys_mfg_minimum,clothing_merchant_shipping_group_name,clothing_color_name,clothing_department_name,giftcard_product_description,giftcard_item_type,giftcard_merchant_shipping_group_name,giftcard_bullet_point1,giftcard_bullet_point2,giftcard_bullet_point3,giftcard_bullet_point4,giftcard_bullet_point5,giftcard_target_audience_keywords1,giftcard_target_audience_keywords2,giftcard_target_audience_keywords3,giftcard_legal_disclaimer_description,giftcard_state_string,giftcard_format,giftcard_genre,health_item_package_quantity,health_merchant_shipping_group_name,health_unit_count,health_unit_count_type,home_merchant_shipping_group_name,home_color_name,home_material_type1,home_material_type2,home_material_type3,home_material_type4,home_material_type5,home_material_type6,home_material_type7,home_material_type8,home_material_type9,home_material_type10,home_thread_count,luggage_part_number,luggage_merchant_shipping_group_name,luggage_color_name,luggage_color_map,luggage_material_type1,luggage_material_type2,luggage_material_type3,luggage_material_type4,luggage_material_type5,musical_model,musical_merchant_shipping_group_name,office_model,office_merchant_shipping_group_name,office_list_price_with_tax,pet_merchant_shipping_group_name,jewellery_condition_type,jewellery_merchant_shipping_group_name,jewellery_color_map,jewellery_department_name,jewellery_material_type,jewellery_ring_size,jewellery_item_shape,ID from SELLER_PRODUCT_UPLOAD where ID in (";
	sql = sql+productIdList;
	sql = sql + ")";
	con.query(sql,[], function(err, result) {
		if (err) {
			logger.error(userName + ':common_model:getProductDetails:' + apiname + ':Error:' + err);
			failureResponse.errorMsg = "Error Fetching Product";
			callback(null,failureResponse);
		} else {
			if (result && result.length > 0) {
				for (var i = 0;i < result.length; i++) {
					var productDetail = {
						"sellerSku": result[i].sellerSku,
                                                "brand": result[i].brand,
                                                "name": result[i].name,
                                                "color": result[i].color,
                                                "category": result[i].category,
                                                "materialOrFabric": result[i].materialOrFabric,
                                                "productDescription": result[i].productDescription,
                                                "model": result[i].model,
                                                "gender": result[i].gender,
                                                "quantity": result[i].quantity,
                                                "price": result[i].price,
                                                "image1": result[i].image1,
                                                "image2": result[i].image2,
                                                "image3": result[i].image3,
                                                "image4": result[i].image4,
                                                "image5": result[i].image5,
                                                "image6": result[i].image6,
                                                "image7": result[i].image7,
                                                "packageLength": result[i].packageLength,
                                                "packageWidth": result[i].packageWidth,
                                                "packageHeight": result[i].packageHeight,
                                                "packageWeight": result[i].packageWeight,
                                                "watch_external_product_id": result[i].watch_external_product_id,
                                                "watch_external_product_id_type": result[i].watch_external_product_id_type,
                                                "watch_item_name": result[i].watch_item_name,
                                                "watch_manufacturer": result[i].watch_manufacturer,
                                                "watch_model": result[i].watch_model,
                                                "watch_part_number": result[i].watch_part_number,
                                                "watch_standard_price": result[i].watch_standard_price,
                                                "watch_merchant_shipping_group_name": result[i].watch_merchant_shipping_group_name,
                                                "watch_target_audience_keywords1": result[i].watch_target_audience_keywords1,
                                                "watch_target_audience_keywords2": result[i].watch_target_audience_keywords2,
                                                "watch_target_audience_keywords3": result[i].watch_target_audience_keywords3,
                                                "watch_target_audience_keywords4": result[i].watch_target_audience_keywords4,
                                                "watch_target_audience_keywords5": result[i].watch_target_audience_keywords5,
                                                "watch_main_image_url": result[i].watch_main_image_url,
                                                "watch_band_material_type": result[i].watch_band_material_type,
                                                "watch_band_color": result[i].watch_band_color,
                                                "watch_dial_color": result[i].watch_dial_color,
                                                "watch_display_type": result[i].watch_display_type,
                                                "watch_movement_type": result[i].watch_movement_type,
                                                "shoes_feed_product_type": result[i].shoes_feed_product_type,
                                                "shoes_item_sku": result[i].shoes_item_sku,
                                                "shoes_merchant_shipping_group_name": result[i].shoes_merchant_shipping_group_name,
                                                "shoes_outer_material_type1": result[i].shoes_outer_material_type1,
                                                "shoes_outer_material_type2": result[i].shoes_outer_material_type2,
                                                "shoes_material_type1": result[i].shoes_material_type1,
                                                "shoes_material_type2": result[i].shoes_material_type2,
                                                "shoes_color_name": result[i].shoes_color_name,
                                                "shoes_size_name": result[i].shoes_size_name,
                                                "baby_item_sku": result[i].baby_item_sku,
                                                "baby_item_name": result[i].baby_item_name,
                                                "baby_quantity": result[i].baby_quantity,
                                                "baby_standard_price": result[i].baby_standard_price,
                                                "baby_merchant_shipping_group_name": result[i].baby_merchant_shipping_group_name,
                                                "baby_color_name": result[i].baby_color_name,
                                                "baby_mfg_minimum": result[i].baby_mfg_minimum,
                                                "baby_mfg_minimum_unit_of_measure": result[i].baby_mfg_minimum_unit_of_measure,
                                                "beauty_item_sku": result[i].beauty_item_sku,
                                                "beauty_item_name": result[i].beauty_item_name,
                                                "beauty_part_number": result[i].beauty_part_number,
                                                "beauty_merchant_shipping_group_name": result[i].beauty_merchant_shipping_group_name,
                                                "beauty_recommended_browse_nodes": result[i].beauty_recommended_browse_nodes,
                                                "computers_item_sku": result[i].computers_item_sku,
                                                "computers_item_name": result[i].computers_item_name,
                                                "computers_merchant_shipping_group_name": result[i].computers_merchant_shipping_group_name,
                                                "computers_recommended_browse_nodes": result[i].computers_recommended_browse_nodes,
                                                "computers_hard_disk_size1": result[i].computers_hard_disk_size1,
                                                "computers_hard_disk_size2": result[i].computers_hard_disk_size2,
                                                "computers_hard_disk_size3": result[i].computers_hard_disk_size3,
                                                "computers_hard_disk_size4": result[i].computers_hard_disk_size4,
                                                "computers_hard_disk_size5": result[i].computers_hard_disk_size5,
                                                "computers_hard_disk_size6": result[i].computers_hard_disk_size6,
                                                "computers_hard_disk_size7": result[i].computers_hard_disk_size7,
                                                "computers_hard_disk_size8": result[i].computers_hard_disk_size8,
                                                "computers_hard_disk_interface1": result[i].computers_hard_disk_interface1,
                                                "computers_hard_disk_interface2": result[i].computers_hard_disk_interface2,
                                                "computers_hard_disk_interface3": result[i].computers_hard_disk_interface3,
                                                "computers_hard_disk_interface4": result[i].computers_hard_disk_interface4,
                                                "computers_system_ram_type1": result[i].computers_system_ram_type1,
                                                "computers_system_ram_type2": result[i].computers_system_ram_type2,
                                                "computers_system_ram_type3": result[i].computers_system_ram_type3,
                                                "computers_system_ram_type4": result[i].computers_system_ram_type4,
                                                "computers_system_ram_type5": result[i].computers_system_ram_type5,
                                                "computers_system_ram_type6": result[i].computers_system_ram_type6,
                                                "computers_system_ram_type7": result[i].computers_system_ram_type7,
                                                "computers_operating_system": result[i].computers_operating_system,
                                                "food_merchant_shipping_group_name": result[i].food_merchant_shipping_group_name,
                                                "food_material_features": result[i].food_material_features,
                                                "food_fc_shelf_life": result[i].food_fc_shelf_life,
                                                "food_fc_shelf_life_pad_time": result[i].food_fc_shelf_life_pad_time,
                                                "food_product_expiration_type": result[i].food_product_expiration_type,
                                                "furniture_item_name": result[i].furniture_item_name,
                                                "furniture_merchant_shipping_group_name": result[i].furniture_merchant_shipping_group_name,
                                                "sports_condition_type": result[i].sports_condition_type,
                                                "sports_merchant_shipping_group_name": result[i].sports_merchant_shipping_group_name,
                                                "sports_item_type_name": result[i].sports_item_type_name,
                                                "toys_item_name": result[i].toys_item_name,
                                                "toys_merchant_shipping_group_name": result[i].toys_merchant_shipping_group_name,
                                                "toys_color_name": result[i].toys_color_name,
                                                "toys_mfg_minimum": result[i].toys_mfg_minimum,
                                                "clothing_merchant_shipping_group_name": result[i].clothing_merchant_shipping_group_name,
                                                "clothing_color_name": result[i].clothing_color_name,
                                                "clothing_department_name": result[i].clothing_department_name,
                                                "giftcard_product_description": result[i].giftcard_product_description,
                                                "giftcard_item_type": result[i].giftcard_item_type,
                                                "giftcard_merchant_shipping_group_name": result[i].giftcard_merchant_shipping_group_name,
                                                "giftcard_bullet_point1": result[i].giftcard_bullet_point1,
                                                "giftcard_bullet_point2": result[i].giftcard_bullet_point2,
                                                "giftcard_bullet_point3": result[i].giftcard_bullet_point3,
                                                "giftcard_bullet_point4": result[i].giftcard_bullet_point4,
                                                "giftcard_bullet_point5": result[i].giftcard_bullet_point5,
                                                "giftcard_target_audience_keywords1": result[i].giftcard_target_audience_keywords1,
                                                "giftcard_target_audience_keywords2": result[i].giftcard_target_audience_keywords2,
                                                "giftcard_target_audience_keywords3": result[i].giftcard_target_audience_keywords3,
                                                "giftcard_legal_disclaimer_description": result[i].giftcard_legal_disclaimer_description,
                                                "giftcard_state_string": result[i].giftcard_state_string,
                                                "giftcard_format": result[i].giftcard_format,
                                                "giftcard_genre": result[i].giftcard_genre,
                                                "health_item_package_quantity": result[i].health_item_package_quantity,
                                                "health_merchant_shipping_group_name": result[i].health_merchant_shipping_group_name,
                                                "health_unit_count": result[i].health_unit_counthealth_unit_count,
                                                "health_unit_count_type": result[i].health_unit_count_type,
                                                "home_merchant_shipping_group_name": result[i].home_merchant_shipping_group_name,
                                                "home_color_name": result[i].home_color_name,
                                                "home_material_type1": result[i].home_material_type1,
                                                "home_material_type2": result[i].home_material_type2,
                                                "home_material_type3": result[i].home_material_type3,
                                                "home_material_type4": result[i].home_material_type4,
                                                "home_material_type5": result[i].home_material_type5,
                                                "home_material_type6": result[i].home_material_type6,
                                                "home_material_type7": result[i].home_material_type7,
                                                "home_material_type8": result[i].home_material_type8,
                                                "home_material_type9": result[i].home_material_type9,
                                                "home_material_type10": result[i].home_material_type10,
                                                "home_thread_count": result[i].home_thread_count,
                                                "luggage_part_number": result[i].luggage_part_number,
                                                "luggage_merchant_shipping_group_name": result[i].luggage_merchant_shipping_group_name,
                                                "luggage_color_name": result[i].luggage_color_name,
                                                "luggage_color_map": result[i].luggage_color_map,
                                                "luggage_material_type1": result[i].luggage_material_type1,
                                                "luggage_material_type2": result[i].luggage_material_type2,
                                                "luggage_material_type3": result[i].luggage_material_type3,
                                                "luggage_material_type4": result[i].luggage_material_type4,
                                                "luggage_material_type5": result[i].luggage_material_type5,
                                                "musical_model": result[i].musical_model,
                                                "musical_merchant_shipping_group_name": result[i].musical_merchant_shipping_group_name,
                                                "office_model": result[i].office_model,
                                                "office_merchant_shipping_group_name": result[i].office_merchant_shipping_group_name,
                                                "office_list_price_with_tax": result[i].office_list_price_with_tax,
                                                "pet_merchant_shipping_group_name": result[i].pet_merchant_shipping_group_name,
                                                "jewellery_condition_type": result[i].jewellery_condition_type,
                                                "jewellery_merchant_shipping_group_name": result[i].jewellery_merchant_shipping_group_name,
                                                "jewellery_color_map": result[i].jewellery_color_map,
                                                "jewellery_department_name": result[i].jewellery_department_name,
                                                "jewellery_material_type": result[i].jewellery_material_type,
                                                "jewellery_ring_size": result[i].jewellery_ring_size,
						"jewellery_item_shape": result[i].jewellery_item_shape,
						"id":result[i].ID
					};
					sucessResponse.response.productDetails.push(productDetail);
				}
				callback(null,sucessResponse);
			} else {
				failureResponse.errorMsg = "Error Fetching Product";
				callback(null,failureResponse);
			}
		}
	});
	},
	],
        function(err, results) {
            if (err) {
                logger.error(userName + ":common_model:getProductDetails:" + apiname + ":Exit:Error", err);
                modelCallback(err);
            } else {
		//logger.error(userName + ":common_model:getProductDetails:" + apiname + ":Exit:Success :JSON.stringify: ",JSON.stringify(results));
                logger.info(userName + ":common_model:getProductDetails:" + apiname + ":Exit:Success", results);
                modelCallback(results);
            }
        });
};

commonModel.getTotalOutOfStockMP = function(apiname, userName, sellerName, modelCallback) {
    logger.info(userName + ":common_model:getTotalOutOfStockMP:" + apiname + ":Enter");
    var sucessResponse = {
        "outOfStock": 0
    };

    async.waterfall(
        [
            function(callback) {
                con.query(query_config.DASHBOARD.TOTAL_STOCKS_QUERY, [sellerName], function(err, result) {
                    if (err) {
                        logger.error(userName + ':common_model:getTotalOutOfStockMP:" + apiname + ":Error:' + err);
                        failureResponse.errorMsg = "Error with DB";
                        callback(sucessResponse);
                    } else if (result && result.length > 0) {

                        var outOfStock = result[0].OUTOFSTOCK;

                        callback(null, sucessResponse);

                    } else{
                        callback(null, sucessResponse);
                    }
                });

            },
        ],
        function(err, results) {
            if (err) {
                logger.error(userName + ":common_model:getTotalOutOfStockMP:" + apiname + ":Exit:Error", err);
                modelCallback(err);
            } else {
                logger.error(userName + ":common_model:getTotalOutOfStockMP:" + apiname + ":Exit:Success", results);
                modelCallback(results);
            }
        });
};
commonModel.getTotalPendingOrders = function(apiname, userName, sellerName, startDate, endDate, modelCallback) {
    logger.info(userName + ":common_model:getTotalPendingOrders:" + apiname + ":Enter");
    var sucessResponse = {
        "lazada" : 0,
        "elevenStreet" : 0,
        "sears" : 0,
        "ebay" : 0,
        "amazonUS" : 0,
        "amazonCA" : 0,
        "amazonMX" : 0,
        "amazonUK" : 0,
        "amazonFR" : 0,
        "amazonDE" : 0,
        "amazonIT" : 0,
        "amazonES" : 0,
        "cDiscount" : 0,
        "etsy" : 0
    };

    async.waterfall(
        [
            function(callback) {
                con.query(query_config.DASHBOARD.TOTAL_PENDING_ORDERS, [sellerName], function(err, result) {
                                        console.log(this.sql);

                    if (err) {
                        logger.error(userName + ':common_model:getTotalPendingOrders:" + apiname + ":Error:' + err);
                        failureResponse.errorMsg = "Error with DB";
                        callback(failureResponse);
                    } else if (result && result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            console.log("===========================================+++++++++++===============");
                                console.log(result[i].MARKET_PLACE);
                            switch(result[i].MARKET_PLACE)
                            {

                                case 'lazada': sucessResponse.lazada = result[i].PENDING;break;
                                case 'elevenStreet': sucessResponse.elevenStreet = result[i].PENDING;break;
                                case 'sears': sucessResponse.sears = result[i].PENDING;break;
                                case 'ebay': sucessResponse.ebay = result[i].PENDING;break;
                                case 'amazon': sucessResponse.amazonUS = result[i].PENDING;break;
                                case 'amazonCA': sucessResponse.amazonCA = result[i].PENDING;break;
                                case 'amazonUK': sucessResponse.amazonUK = result[i].PENDING;break;
                                case 'amazonFR': sucessResponse.amazonFR = result[i].PENDING;break;
                                case 'amazonDE': sucessResponse.amazonDE = result[i].PENDING;break;
                                case 'amazonIT': sucessResponse.amazonIT = result[i].PENDING;break;
                                case 'amazonES': sucessResponse.amazonES = result[i].PENDING;break;
                                case 'cDiscount': sucessResponse.cDiscount = result[i].PENDING;break;
                                case 'etsy': sucessResponse.etsy = result[i].PENDING;break;
                            }

                        }

                        callback(null, sucessResponse);

                    } else {
                        callback(null, sucessResponse);
                    }
                });

            },
        ],
        function(err, results) {
            if (err) {
                logger.error(userName + ":common_model:getTotalPendingOrders:" + apiname + ":Exit:Error", err);
                modelCallback(err);
            } else {
                logger.error(userName + ":common_model:getTotalPendingOrders:" + apiname + ":Exit:Success", results);
                modelCallback(results);
            }
        });
};
commonModel.getMarketPlaceOrders = function(apiname, userName, sellerName, startDate, endDate, modelCallback) {
    logger.info(userName + ":common_model:getTotalOutOfStockMP:" + apiname + ":Enter");
    var sucessResponse = {
        "lazada" : 0,
        "elevenStreet" : 0,
        "sears" : 0,
        "ebay" : 0,
        "amazonUS" : 0,
        "amazonCA" : 0,
        "amazonMX" : 0,
        "amazonUK" : 0,
        "amazonFR" : 0,
        "amazonDE" : 0,
        "amazonIT" : 0,
        "amazonES" : 0,
        "cDiscount" : 0,
        "etsy" : 0
    };

    async.waterfall(
        [
            function(callback) {
                con.query(query_config.DASHBOARD.TOTAL_ORDERS_MARKET_PLACE, [sellerName, startDate, endDate], function(err, result) {
                                        console.log(this.sql);

                    if (err) {
                        logger.error(userName + ':common_model:getTotalOutOfStockMP:" + apiname + ":Error:' + err);
                        failureResponse.errorMsg = "Error with DB";
                        callback(failureResponse);
                    } else if (result && result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            console.log("===========================================+++++++++++===============");
                                console.log(result[i].MARKET_PLACE);
                            switch(result[i].MARKET_PLACE)
                            {

                                case 'lazada': sucessResponse.lazada = result[i].ORDERS;break;
                                case 'elevenStreet': sucessResponse.elevenStreet = result[i].ORDERS;break;
                                case 'sears': sucessResponse.sears = result[i].ORDERS;break;
                                case 'ebay': sucessResponse.ebay = result[i].ORDERS;break;
                                case 'amazon': sucessResponse.amazonUS = result[i].ORDERS;break;
                                case 'amazonCA': sucessResponse.amazonCA = result[i].ORDERS;break;
                                case 'amazonUK': sucessResponse.amazonUK = result[i].ORDERS;break;
                                case 'amazonFR': sucessResponse.amazonFR = result[i].ORDERS;break;
                                case 'amazonDE': sucessResponse.amazonDE = result[i].ORDERS;break;
                                case 'amazonIT': sucessResponse.amazonIT = result[i].ORDERS;break;
                                case 'amazonES': sucessResponse.amazonES = result[i].ORDERS;break;
                                case 'cDiscount': sucessResponse.cDiscount = result[i].ORDERS;break;
                                case 'etsy': sucessResponse.etsy = result[i].ORDERS;break;
                            }

                        }

                        callback(null, sucessResponse);

                    }
                });

            },
        ],
        function(err, results) {
            if (err) {
                logger.error(userName + ":common_model:getTotalOutOfStockMP:" + apiname + ":Exit:Error", err);
                modelCallback(err);
            } else {
                logger.error(userName + ":common_model:getTotalOutOfStockMP:" + apiname + ":Exit:Success", results);
                modelCallback(results);
            }
        });
};

commonModel.getSalesOrOrdersReport = function(apiname, userName, sellerName, startDate, endDate, modelCallback) {
    logger.info(userName + ":common_model:getSalesOrOrdersReport:" + apiname + ":Enter");
    var sucessResponse = {
        "orders": 0,
        "sales": 0
    };
    async.waterfall(
        [
            function(callback) {
                con.query(query_config.DASHBOARD.TOTAL_ORDERS_SALES, [sellerName, startDate, endDate], function(err, result) {
                    console.log(this.sql);
                    if (err) {
                        logger.error(userName + ':common_model:getTotalStockMP:" + apiname + ":Error:' + err);
                        failureResponse.errorMsg = "Error with DB";
                        callback(failureResponse);
                    } else if (result && result.length > 0) {

                        if (result[0].ORDERS === null || result[0].ORDERS == null) {
                            sucessResponse.orders = 0;

                        } else {
                            sucessResponse.orders = result[0].ORDERS;

                        }

                        if (result[0].SALES === null || result[0].SALES == null) {
                            sucessResponse.sales = 0;

                        } else {
                            sucessResponse.sales = result[0].SALES;

                        }

                    }
                    callback(null, sucessResponse);

                });

            },
        ],
        function(err, results) {
            if (err) {
                logger.error(userName + ":common_model:getTotalStockMP:" + apiname + ":Exit:Error", err);
                modelCallback(sucessResponse);
            } else {
                logger.error(userName + ":common_model:getTotalStockMP:" + apiname + ":Exit:Success", results);
                modelCallback(results);
            }
        });
};

commonModel.getSalesOrOrdersGraph = function(apiname, userName, sellerName, startDate, endDate, marketPlace, modelCallback) {
    logger.info(userName + ":common_model:getSalesOrOrdersReport:" + apiname + ":Enter");
    var sucessResponse = {
        "marketPlace": marketPlace,
        "dates": [],
        "orders": [],
        "sales": []
    };
    async.waterfall(
        [
            function(callback) {
                con.query(query_config.DASHBOARD.ORDERS_SALES_GRAPH, [sellerName, startDate, endDate, marketPlace], function(err, result) {
                    console.log(this.sql);
                    if (err) {
                        logger.error(userName + ':common_model:getSalesOrOrdersGraph:" + apiname + ":Error:' + err);
                        failureResponse.errorMsg = "Error with DB";
                        callback(failureResponse);
                    } else if (result && result.length > 0) {
                        console.log("=======================" + result.length);
                        for (var i = 0; i < result.length; i++) {

                            sucessResponse.dates.push(moment(result[i].DATE).format("YYYY-MM-DD"));
                            sucessResponse.orders.push(result[i].ORDERS);
                            sucessResponse.sales.push(result[i].SALES);

                        }
                        console.log(sucessResponse);

                    }
                    callback(null, sucessResponse);

                });
            },
        ],
        function(err, results) {
            if (err) {
                logger.error(userName + ":common_model:getSalesOrOrdersGraph:" + apiname + ":Exit:Error", err);
                modelCallback(sucessResponse);
            } else {
                logger.error(userName + ":common_model:getSalesOrOrdersGraph:" + apiname + ":Exit:Success", results);
                console.log(results);
                modelCallback(results);
            }
        });
};
commonModel.deleteOrder = function(apiname, userName, marketPlace, orderList, modelCallback) {
    logger.info(userName + ":common_model:deleteOrder:" + apiname + ":Enter:");
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
    var sql = query_config.COMMON.DELETE_LAZADA_ORDER;
    sql = sql + orderList + ')';
    logger.info(userName + ':common_model:deleteOrder:sql: ' + sql);
    con.query(sql, [], function(err, result) {
        if (err) {
            logger.error(userName + ':common_model:deleteOrder:' + apiname + ':Error:' + err);
            failureResponse.errorMsg = "Error Updating Order";
            modelCallback(failureResponse);
        } else {
            logger.info(userName + ':common_model:deleteOrder:' + apiname + ':Exit:', result);
            modelCallback(sucessResponse);
        }
    });
};

commonModel.getMaxUpdateTs = function(apiname, userName, marketPlace, seller, modelCallback) {
    logger.info(userName + ":common_model:getMaxUpdateTs:" + apiname + ":Enter:");
    var failureResponse = {
        "responseCode": -1,
        "response": "",
        "errorMsg": "DB_ERROR"
    };

    var sucessResponse = {
        "responseCode": 0,
        "response": {
            "updateTs": "",
        },
        "errorMsg": ""
    };

    con.query(query_config.COMMON.MAX_UPDATE_TS, [marketPlace, seller], function(err, result) {
        if (err) {
            logger.error(userName + ':common_model:getMaxUpdateTs:' + apiname + ':Error:' + err);
            failureResponse.errorMsg = "Error Fetching MAX_UPDATE_TS";
            modelCallback(failureResponse);
        } else {
            if (result && result.length > 0) {
                sucessResponse.response.updateTs = result[0].CREATE_TS;
                modelCallback(sucessResponse);
            } else {
                failureResponse.errorMsg = "No MAX_UPDATE_TS";
                modelCallback(failureResponse);
            }
        }
    });
};

commonModel.checkTableExist = function(apiname, userName, tableName, modelCallback) {
    logger.info(userName + ":common_model:checkTableExist:" + apiname + ":Enter:");
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

    con.query(query_config.COMMON.CHECK_TABLE_EXIST, [tableName], function(err, result) {
        if (err) {
            logger.error(userName + ':common_model:checkTableExist:" + apiname + ":Error:' + err);
            failureResponse.errorMsg = "Error with DB";
            modelCallback(failureResponse);
        } else {
            if (result && result.length > 0) {
                modelCallback(sucessResponse);
            } else {
                failureResponse.errorMsg = "No such table";
                modelCallback(failureResponse);
            }
        }
    });
};

commonModel.insertOrder = function(apiname, userName, marketPlace, orders, seller, modelCallback) {
    logger.info(userName + ":common_model:insertOrder:" + apiname + ":Enter:");
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
    for (var i in orders) {
        logger.info('query_config.COMMON.INSERT_LAZADA_ORDER : ' + query_config.COMMON.INSERT_LAZADA_ORDER);
        con.query(query_config.COMMON.INSERT_LAZADA_ORDER, [orders[i].OrderId, orders[i].CustomerFirstName, orders[i].CustomerLastName, orders[i].OrderNumber, orders[i].PaymentMethod, orders[i].Remarks, orders[i].DeliveryInfo, orders[i].Price, orders[i].GiftOption, orders[i].GiftMessage, orders[i].VoucherCode, orders[i].CreatedAt, orders[i].UpdatedAt, JSON.stringify(orders[i].AddressBilling), JSON.stringify(orders[i].AddressShipping), orders[i].NationalRegistrationNumber, orders[i].ItemsCount, orders[i].PromisedShippingTimes, orders[i].ExtraAttributes, orders[i].Statuses[0], orders[i].Voucher, orders[i].ShippingFee, marketPlace, seller], function(err, result) {
            //con.query(query_config.COMMON.INSERT_LAZADA_ORDER,[orders[i].OrderId,orders[i].CustomerFirstName,orders[i].CustomerLastName,orders[i].OrderNumber,orders[i].PaymentMethod,orders[i].Remarks,orders[i].DeliveryInfo],function(err, result) {
            if (err) {
                logger.error(userName + ':common_model:insertOrder:' + apiname + ':Error:' + err);
            }
        });
    }
    modelCallback(sucessResponse);
};

commonModel.getSellerLocalOrder = function(apiname, userName, marketPlace, seller, modelCallback) {
    logger.info(userName + ":common_model:getSellerLocalOrder:" + apiname + ":Enter:");
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
    var sellerOrders = {
        "totalOrders": "0",
        "orders": []
    };
    con.query(query_config.COMMON.GETALLSELLER, [seller], function(err, result) {
        if (err) {
            logger.error(userName + ':admin_model:getSellerLocalOrder:' + apiname + ':Error:' + err);
            sucessResponse.response = sellerOrders;
            modelCallback(sucessResponse);
        } else {
            if (result && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    //sellerOrders.totalOrders=i+1;
                    var order = {};
                    order.id = result[i].ID;
		    order.createTs = moment(result[i].CREATE_TS).format("YYYY-MM-DD");
                    order.productName = result[i].PRODUCT_NAME;
                    order.orderId = result[i].ORDER_ID;
                    order.price = result[i].PRICE;
                    order.itemCount = result[i].ITEM_COUNT;
                    order.status = result[i].STATUS;
                    order.customerFirstName = result[i].CUSTOMER_FIRST_NAME;
                    order.marketPlace = result[i].MARKET_PLACE;
                    order.trackingCode = result[i].TRACKING_CODE;
                    order.invoiceNumber = result[i].INVOICE_NUMBER;
		    order.currency = result[i].CURRENCY;
                    sellerOrders.orders.push(order);
                }
            }
            sucessResponse.response = sellerOrders;
            modelCallback(sucessResponse);
        }
    });
};

commonModel.updateSellerOrderItems = function(apiname, userName, sellerName, OrderItems, modelCallback) {
    logger.info(userName + ":common_model:updateSellerOrderItems:" + apiname + ":Enter:");
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
    con.query(query_config.COMMON.UPDATE_ORDER_INFO, [OrderItems.ShopId, OrderItems.Name, OrderItems.Sku, OrderItems.ShopSku, OrderItems.ShippingType, OrderItems.ItemPrice, OrderItems.PaidPrice, OrderItems.Currency, OrderItems.WalletCredits, OrderItems.TaxAmount, OrderItems.ShippingAmount, OrderItems.ShippingServiceCost, OrderItems.ShipmentProvider, OrderItems.IsDigital, OrderItems.DigitalDeliveryInfo, OrderItems.TrackingCode, OrderItems.TrackingCodePre, OrderItems.Reason, OrderItems.ReasonDetail, OrderItems.PurchaseOrderId, OrderItems.PurchaseOrderNumber, OrderItems.PackageId, OrderItems.ShippingProviderType, OrderItems.ReturnStatus, OrderItems.productMainImage, OrderItems.Variation, OrderItems.ProductDetailUrl, OrderItems.invoiceNumber, OrderItems.OrderId], function(err, result) {});
    modelCallback(sucessResponse);

};

commonModel.insertAmazonOrder = function(apiname, userName, marketPlace, ords, sellerName, modelCallback) {
    logger.info(userName + ":common_model:insertAmazonOrder:" + apiname + ":Enter:");
    var sucessResponse = {
        "responseCode": 0,
        "response": {},
        "errorMsg": ""
    };
    for (var i in ords.listOrdersResult.orders) {
        for (var j in ords.listOrdersResult.orders[i].orderItem) {
            logger.info(i, " : ", j, " : ", ords.listOrdersResult.orders[i].amazonOrderId);

            var d1 = new Date(ords.listOrdersResult.orders[i].purchaseDate);
            var d2 = new Date(ords.listOrdersResult.orders[i].lastUpdateDate);
            var d3 = new Date(ords.listOrdersResult.orders[i].earliestShipDate);
            var purchaseDateL = d1.getFullYear() + "-" + (d1.getMonth() + 1) + "-" + d1.getDate() + " " + d1.getHours() + ":" + d1.getMinutes() + ":" + d1.getSeconds();
            var lastUpdateDateL = d2.getFullYear() + "-" + (d2.getMonth() + 1) + "-" + d2.getDate() + " " + d2.getHours() + ":" + d2.getMinutes() + ":" + d2.getSeconds();
            var earliestShipDateL = d3.getFullYear() + "-" + (d3.getMonth() + 1) + "-" + d3.getDate() + " " + d3.getHours() + ":" + d3.getMinutes() + ":" + d3.getSeconds();
            var giftWrapPriceAmountL = "";
            var orderTotalAmountL = "";
            var itemPriceAmountL = "";
            var itemTaxAmountL = "";
            var itemPriceCurrencyCodeL = "";
            var shippingPriceAmountL = "";
            var shippingTaxAmountL = "";
            if (ords.listOrdersResult.orders[i].orderItem[j].giftWrapPrice != null) {
                giftWrapPriceAmountL = ords.listOrdersResult.orders[i].orderItem[j].giftWrapPrice.amount;
            }
            if (ords.listOrdersResult.orders[i].orderTotal != null) {
                orderTotalAmountL = ords.listOrdersResult.orders[i].orderTotal.amount;
            }
            if (ords.listOrdersResult.orders[i].orderItem[j].itemPrice != null) {
                itemPriceAmountL = ords.listOrdersResult.orders[i].orderItem[j].itemPrice.amount;
            }
            if (ords.listOrdersResult.orders[i].orderItem[j].itemTax != null) {
                itemTaxAmountL = ords.listOrdersResult.orders[i].orderItem[j].itemTax.amount;
            }
            if (ords.listOrdersResult.orders[i].orderItem[j].itemPrice != null) {
                itemPriceCurrencyCodeL = ords.listOrdersResult.orders[i].orderItem[j].itemPrice.currencyCode;
            }
            if (ords.listOrdersResult.orders[i].orderItem[j].shippingPrice != null) {
                shippingPriceAmountL = ords.listOrdersResult.orders[i].orderItem[j].shippingPrice.amount;
            }
            if (ords.listOrdersResult.orders[i].orderItem[j].shippingTax != null) {
                shippingTaxAmountL = ords.listOrdersResult.orders[i].orderItem[j].shippingTax.amount;
            }
            var l1 = ords.listOrdersResult.orders[i].amazonOrderId;
            var l2 = ords.listOrdersResult.orders[i].buyerName;
            var l3 = ords.listOrdersResult.orders[i].amazonOrderId;
            var l4 = ords.listOrdersResult.orders[i].paymentMethod;
            var l5 = ords.listOrdersResult.orders[i].orderItem[j].giftMessageText;
            var l6 = JSON.stringify(ords.listOrdersResult.orders[i].shippingAddress);
            var l7 = ords.listOrdersResult.orders[i].orderItem[j].quantityOrdered;
            con.query(query_config.COMMON.INSERT_AMAZON_ORDER, [l1, l2, '', l3, l4, '', '0', orderTotalAmountL, '0', l5, '', purchaseDateL, lastUpdateDateL, l6, l6, '', l7, earliestShipDateL, ords.listOrdersResult.orders[i].orderStatus, shippingPriceAmountL, sellerName, ords.listOrdersResult.orders[i].orderItem[j].title, ords.listOrdersResult.orders[i].orderItem[j].sellerSKU, ords.listOrdersResult.orders[i].orderItem[j].sellerSKU, ords.listOrdersResult.orders[i].shipServiceLevel, itemPriceAmountL, itemPriceAmountL, itemPriceCurrencyCodeL, itemTaxAmountL, shippingPriceAmountL, shippingTaxAmountL, '0', ords.listOrdersResult.orders[i].orderItem[j].asin, ords.listOrdersResult.orders[i].orderItem[j].orderItemId, ords.listOrdersResult.orders[i].shipmentServiceLevelCategory, ords.listOrdersResult.orders[i].orderItem[j].invoiceData, giftWrapPriceAmountL, marketPlace], function(err, result) {
                if (err) {
                    logger.error(userName + ':common_model:insertAmazonOrder:' + apiname + ':Error:' + err);
                }
            });
        }
    }
    modelCallback(sucessResponse);
};

commonModel.insertElevenStreetOrder = function(apiname, userName, marketPlace, responseJson, sellerName, modelCallback) {
    logger.info(userName + ":common_model:insertElevenStreetOrder:" + apiname + ":Enter:");
    logger.info("responseJson : ", JSON.stringify(responseJson));
    var sucessResponse = {
        "responseCode": 0,
        "response": {},
        "errorMsg": ""
    };
    for (var i in responseJson.orders.order) {
        var orderNumber = responseJson.orders.order[i].ordNo[0];
        if (responseJson.orders.order[i].lstDlvCst && responseJson.orders.order[i].lstDlvCst[0] != null) {
            var shippingFee = responseJson.orders.order[i].lstDlvCst[0];
        }
        var shippingNo = responseJson.orders.order[i].dlvNo[0];
        var buyerEmail = responseJson.orders.order[i].ordEmail[0];
        var buyerNo = responseJson.orders.order[i].memNo[0];
        var totalAmount = responseJson.orders.order[i].ordAmt[0];
        var orderDate = responseJson.orders.order[i].ordDt[0];
        var buyerName = responseJson.orders.order[i].ordNm[0];
        var totalAmountAllProd = responseJson.orders.order[i].ordPayAmt[0];
        var buyerPhoneNo = responseJson.orders.order[i].ordPrtblTel[0];
        var ordQty = responseJson.orders.order[i].ordQty[0];
        var productName = responseJson.orders.order[i].prdNm[0];
        var productNum = responseJson.orders.order[i].prdNo[0];
        var buyerAddress = responseJson.orders.order[i].rcvrBaseAddr[0];
        var buyerAddressPincode = responseJson.orders.order[i].rcvrMailNo[0];
        var sellerPrice = responseJson.orders.order[i].selPrc[0];
        var sellerDiscount = responseJson.orders.order[i].sellerDscPrc[0];
        var sellerProductNum = responseJson.orders.order[i].sellerPrdCd[0];
        var basicDiscount = responseJson.orders.order[i].lstTmallDscPrc[0];
        var cancelledQuantity = responseJson.orders.order[i].ordCnQty[0];
        var sku = responseJson.orders.order[i].partCode[0];
        con.query(query_config.COMMON.INSERT_ELEVEN_STATES_ORDER, [orderNumber, buyerName, buyerName, orderNumber, 'paymentComplete', '', '', sellerPrice, '', '', '', orderDate, orderDate, buyerAddress + ", pin code : " + buyerAddressPincode + ", ph no: " + buyerPhoneNo, buyerAddress + ", pin code : " + buyerAddressPincode + ", ph no: " + buyerPhoneNo, '', ordQty, '', 'paymentComplete', shippingFee, sellerName, productName, sku, sku, '', totalAmount, totalAmount, 'MYR', '', shippingFee, '', '0', orderNumber, orderNumber, '', '', '', marketPlace], function(err, result) {
            if (err) {
                logger.error(userName + ':common_model:insertElevenStreetOrder:' + apiname + ':Error:' + err);
            }
        });
    }
    modelCallback(sucessResponse);
};

commonModel.insertElevenStreetOrderSeller = function(apiname, userName, marketPlace, responseJson, sellerName, modelCallback) {
    logger.info(userName + ":common_model:insertElevenStreetOrder:" + apiname + ":Enter:");
    logger.info("responseJson : ", JSON.stringify(responseJson));
    var sucessResponse = {
        "responseCode": 0,
        "response": {},
        "errorMsg": ""
    };
    for (var i in responseJson.orders.order) {
        var orderNumber = responseJson.orders.order[i].ordNo[0];
        var shippingFee = responseJson.orders.order[i].dlvCst[0];
        var shippingNo = responseJson.orders.order[i].dlvNo[0];
        var buyerEmail = responseJson.orders.order[i].ordEmail[0];
        var buyerNo = responseJson.orders.order[i].memNo[0];
        var totalAmount = responseJson.orders.order[i].ordAmt[0];
        var orderDate = responseJson.orders.order[i].ordDt[0];
        var buyerName = responseJson.orders.order[i].ordNm[0];
        var totalAmountAllProd = responseJson.orders.order[i].ordPayAmt[0];
        var buyerPhoneNo = responseJson.orders.order[i].ordPrtblTel[0];
        var ordQty = responseJson.orders.order[i].ordQty[0];
        var productName = responseJson.orders.order[i].prdNm[0];
        var productNum = responseJson.orders.order[i].prdNo[0];
        var buyerAddress = responseJson.orders.order[i].rcvrBaseAddr[0];
        var buyerAddressPincode = responseJson.orders.order[i].rcvrMailNo[0];
        var sellerPrice = responseJson.orders.order[i].selPrc[0];
        var sellerDiscount = responseJson.orders.order[i].sellerDscPrc[0];
        var sellerProductNum = responseJson.orders.order[i].sellerPrdCd[0];
        var basicDiscount = responseJson.orders.order[i].lstTmallDscPrc[0];
        var cancelledQuantity = responseJson.orders.order[i].ordCnQty[0];
        var sku = responseJson.orders.order[i].partCode[0];
        con.query(query_config.COMMON.INSERT_ELEVEN_STATES_ORDER, [orderNumber, buyerName, buyerName, orderNumber, 'paymentComplete', '', '', sellerPrice, '', '', '', orderDate, orderDate, buyerAddress + ", pin code : " + buyerAddressPincode + ", ph no: " + buyerPhoneNo, buyerAddress + ", pin code : " + buyerAddressPincode + ", ph no: " + buyerPhoneNo, '', ordQty, '', 'paymentComplete', shippingFee, sellerName, productName, sku, sku, '', totalAmount, totalAmount, 'MYR', '', shippingFee, '', '0', orderNumber, orderNumber, '', '', '', marketPlace], function(err, result) {
            if (err) {
                logger.error(userName + ':common_model:insertElevenStreetOrder:' + apiname + ':Error:' + err);
            }
        });
    }
    modelCallback(sucessResponse);
};

commonModel.insertSearsSellerOrder = function(apiname, userName, marketPlace, responseJson, sellerName, modelCallback) {
    logger.info(userName + ":common_model:insertSearsSellerOrder:" + apiname + ":Enter:");
    var sucessResponse = {
        "responseCode": 0,
        "response": {},
        "errorMsg": ""
    };
    for (var i in responseJson) {
        //logger.info(i+" -----------> "+responseJson[i]['po-number-with-date'][0]);
        logger.info(i + " Inserting sears seller order " + responseJson[i]['po-number-with-date'][0]);
        var orderNumber = responseJson[i]['po-number-with-date'][0];
        var shippingFee = responseJson[i]['po-line'][0]['po-line-header'][0]['shipping-and-handling'][0]
        var buyerEmail = responseJson[i]['customer-email'][0];
        var totalAmount = responseJson[i]['balance-due'][0];
        var orderDate = responseJson[i]['po-date'][0] + " " + ['po-time'][0]
        var buyerName = responseJson[i]['customer-name'][0];
        var ordQty = responseJson[i]['po-line'][0]['po-line-header'][0]['order-quantity'][0];
        var productName = responseJson[i]['po-line'][0]['po-line-header'][0]['item-name'][0];
        var productNum = responseJson[i]['po-line'][0]['po-line-header'][0]['order-quantity'][0];
        var buyerAddress = JSON.stringify(responseJson[i]['shipping-detail'][0]);
        var sellerPrice = responseJson[i]['balance-due'][0];
        var expectedShippingDate = responseJson[i]['expected-ship-date'][0];
        var shipmentTrackingNumber = "";
        var shipMethod = "";
        if (responseJson[i]['po-shipment-info'] != null && responseJson[i]['po-shipment-info'][0]['shipment'] != null) {
            var shipmentTrackingNumber = responseJson[i]['po-shipment-info'][0]['shipment'][0]['shipment-tracking-number'][0];
            var shipMethod = responseJson[i]['po-shipment-info'][0]['shipment'][0]['ship-method'][0];
        }
        var status = responseJson[i]['po-status'][0];
        con.query(query_config.COMMON.INSERT_SEARS_ORDER, [orderNumber, buyerName, orderNumber, totalAmount, orderDate, orderDate, buyerAddress, buyerAddress, ordQty, expectedShippingDate, status, shippingFee, marketPlace, sellerName, productName, shipMethod, sellerPrice, shippingFee, shipmentTrackingNumber, productNum, orderNumber, buyerEmail], function(err, result) {
            //logger.error(userName + ':common_model:insertSearsSellerOrder:' + apiname + ':Error:' + err);
        });
    }
    modelCallback(sucessResponse);
};

commonModel.insertEbayOrder = function(apiname, userName, marketPlace, responseJson, sellerName, modelCallback) {
    logger.info(userName + ":common_model:insertEbayOrder:" + apiname + ":Enter:");
    var sucessResponse = {
        "responseCode": 0,
        "response": {},
        "errorMsg": ""
    };
    for (var i in responseJson.Orders) {
        var orderNumber = responseJson.Orders[i].OrderID;
        var custFirstName = responseJson.Orders[i].Transactions[0].Buyer.UserFirstName;
        var custLastName = responseJson.Orders[i].Transactions[0].Buyer.UserLastName;
        var paymentMethod = responseJson.Orders[i].PaymentMethods;
        var price = responseJson.Orders[i].Subtotal.amount;
        var createdAt = responseJson.Orders[i].CreatedTime;
        var addressBilling = JSON.stringify(responseJson.Orders[i].ShippingAddress);
        var addressShipping = JSON.stringify(responseJson.Orders[i].ShippingAddress);
        var status = responseJson.Orders[i].OrderStatus;
        var shippingFee = responseJson.Orders[i].ShippingServiceSelected.ShippingServiceCost.amount;
        var marketPlace = "ebay";
        var productName = responseJson.Orders[i].Transactions[0].Item.Title;
        var sku = responseJson.Orders[i].Transactions[0].Item.SKU;
        var shippingType = responseJson.Orders[i].Transactions[0].ShippingDetails.ShipmentTrackingDetails.ShippingCarrierUsed;
        var currency = responseJson.Orders[i].Subtotal.currencyID;
        var taxAmount = responseJson.Orders[i].Transactions[0].Taxes.TotalTaxAmount.amount;
        var shippmentProvider = responseJson.Orders[i].Transactions[0].ShippingDetails.ShipmentTrackingDetails[0].ShippingCarrierUsed;
        var shippmentTrackingCode = responseJson.Orders[i].Transactions[0].ShippingDetails.ShipmentTrackingDetails[0].ShipmentTrackingNumber;
        var cusrEmail = responseJson.Orders[i].Transactions[0].Buyer.Email;
        con.query(query_config.COMMON.INSERT_EBAY_ORDER, [orderNumber, custFirstName, custLastName, orderNumber, paymentMethod, price, createdAt, addressBilling, addressShipping, status, shippingFee, 'ebay', sellerName, productName, sku, sku, shippingType, price, price, currency, taxAmount, shippingFee, shippmentProvider, shippmentTrackingCode, shippingType, cusrEmail], function(err, result) {
            if (err) {
                logger.error(userName + ':common_model:insertEbayOrder:' + apiname + ':Error:' + err);
            }
        });
    }
    modelCallback(sucessResponse);
};

commonModel.getInvoiceDetails = function(apiname, userName, orderId, modelCallback) {
    logger.info(userName + ":common_model:getInvoiceDetails:" + apiname + ":Enter:");
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

    var itemDetails = {
        "totalItems": "0",
        "invoiceDetails": []
    };

    var sql = query_config.COMMON.GET_INVOICE_DETAILS;
    sql = sql + " '" + orderId + "' ";
    logger.info(userName + ':common_model:getInvoiceDetails:sql: ' + sql);
    con.query(sql, [], function(err, result) {
        if (err) {
            logger.error(userName + ':common_model:getInvoiceDetails:' + apiname + ':Error:' + err);
            failureResponse.errorMsg = "Error Updating Order";
            modelCallback(failureResponse);
        } else {
            logger.info(userName + ':common_model:getInvoiceDetails:' + apiname + ':Exit:', result);
            if (result && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    itemDetails.totalItems = i + 1;
                    var detail = {};
                    detail.ADDRESS_BILLING = result[i].ADDRESS_BILLING;
                    detail.ORDER_ID = result[i].ORDER_ID;
                    detail.CREATED_AT = result[i].CREATED_AT;
                    detail.PRODUCT_NAME = result[i].PRODUCT_NAME;
                    detail.ITEM_COUNT = result[i].ITEM_COUNT;
                    detail.PRICE = result[i].PRICE;
                    detail.ITEM_PRICE = result[i].ITEM_PRICE;
                    itemDetails.invoiceDetails.push(detail);
                }
                sucessResponse.response = itemDetails;
                modelCallback(sucessResponse);
            } else {
                modelCallback(failureResponse);
            }
        }
    });
};

module.exports = commonModel;
