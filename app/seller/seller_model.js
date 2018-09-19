/*jslint node: true */
'use strict';
var sellerDB = {};
var config = require('../../config/config');
var mysql_db = require('../../db/mysql_db');
var query_config = require('../../config/query_config');
var logger = config.logger;
var async = require('async');
var _ = require('lodash');
var mysqldb = require('mysql');
var fs = require("fs");
var dataValidate = fs.readFileSync('./config/product_data_validation.js', 'utf8');

var con = mysqldb.createConnection({
        host: "scalelabsdevdb.cababjt98r5d.us-east-1.rds.amazonaws.com",
        user: "scaleLabsDevDB",
        password: "scaleLabsDevDB",
	database : 'my_db'
});

sellerDB.insertProduct = function(apiname, userName, pd, modelCallback) {
        logger.info(userName+ ":seller_model:insertProduct:" + apiname + ":Enter:"+userName+":");
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
	var tableColumns = "CREATE_TS,UPDATE_TS,SELLER_ID,sellerSku,brand,name,color,materialOrFabric,productDescription,model,gender,quantity,price,image1,image2,image3,image4,image5,image6,image7,packageLength,packageWidth,packageHeight,packageWeight,typeOfFashion,size,sleeveType,neckType,pattern,length,typeOfWear,bottomsLength,bottomFitType,bottomClosure,bottomType,bottomWaist,jacketType,jacketClosureType,jacketLength,sareeBorderColor,blouseAttached,styleOfSaree,bagsPattern,bagType,bagCompartments,bagLockType,shoeType,jewelleryType,jewellerySize,jewelleryMetalType,earringStyle,watchShape,watchDialColour,watchStrapMaterial,watchType,watchSize,lazada_upload_status,elevenStreet_upload_status,sears_upload_status,ebay_upload_status,amazonUS_upload_status,amazonCA_upload_status,amazonMX_upload_status,amazonUK_upload_status,amazonFR_upload_status,amazonDE_upload_status,amazonIT_upload_status,amazonES_upload_status,cDiscount_upload_status,etsy_upload_status";
	var columnValue ="CURDATE(),CURDATE(),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'new','new','new','new','new','new','new','new','new','new','new','new','new','new'";
	var insertStmt = "insert into SELLER_PRODUCT_UPLOAD ("+tableColumns+") values("+columnValue+")";
	logger.info(userName+ ":seller_model:insertProduct:" + apiname + ":insertStmt: "+insertStmt+"");
        for(var i = 0; i < pd.length; i++) {
		var prodName = pd[i].name;
		con.query(insertStmt,[userName,pd[i].sellerSku,pd[i].brand,pd[i].name,pd[i].color,pd[i].materialOrFabric,pd[i].productDescription,pd[i].model,pd[i].gender,pd[i].quantity,pd[i].price,pd[i].image1,pd[i].image2,pd[i].image3,pd[i].image4,pd[i].image5,pd[i].image6,pd[i].image7,pd[i].packageLength,pd[i].packageWidth,pd[i].packageHeight,pd[i].packageWeight,pd[i].typeOfFashion,pd[i].size,pd[i].sleeveType,pd[i].neckType,pd[i].pattern,pd[i].length,pd[i].typeOfWear,pd[i].bottomsLength,pd[i].bottomFitType,pd[i].bottomClosure,pd[i].bottomType,pd[i].bottomWaist,pd[i].jacketType,pd[i].jacketClosureType,pd[i].jacketLength,pd[i].sareeBorderColor,pd[i].blouseAttached,pd[i].styleOfSaree,pd[i].bagsPattern,pd[i].bagType,pd[i].bagCompartments,pd[i].bagLockType,pd[i].shoeType,pd[i].jewelleryType,pd[i].jewellerySize,pd[i].jewelleryMetalType,pd[i].earringStyle,pd[i].watchShape,pd[i].watchDialColour,pd[i].watchStrapMaterial,pd[i].watchType,pd[i].watchSize],function (err, result) {
			if (err){
				logger.error(userName + ':seller_model:insertProduct:insert failed for product name:'+prodName+' ');
				logger.error(userName + ':seller_model:insertProduct:' + apiname + ':Error:' + err);
			} else {
				logger.error(userName + ':seller_model:insertProduct:inserted product for product name:'+prodName+' ');
			}
		});
        }
	modelCallback(sucessResponse);
};

sellerDB.insertProduct_old = function(apiname, userName,request,i,fileName,tableName,column_name, modelCallback) {
	logger.info(userName+ ":seller_model:insertProduct:" + apiname + ":Enter:"+userName+":");
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
	fileName="./properties/"+fileName;
	var insertStmt = "";
	var column_values="CURDATE(),CURDATE(),'new',";
	column_values=column_values+"'"+userName+"'";
	var fs = require('fs'), readline = require('readline');
	var rd = readline.createInterface({
		input: fs.createReadStream(fileName),
		console: false
	});
	rd.on('line', function(line) {
		var tmp = line.split('=');
		var column_json_key = tmp[0];
		var column_json_value = request.productDetails[i][column_json_key];
		if (column_json_value == null) {
			column_json_value="";
		}
		column_json_value=column_json_value.replace(/'/g,"\\'");
		column_values=column_values+",'"+column_json_value+"'";
		insertStmt = "INSERT INTO "+tableName+" ("+column_name+") values ("+column_values+")";
	}).on('close', function() {
		logger.info("insertStmt : "+insertStmt);
		con.query(insertStmt,[],function (err, result) {
			if (err){
				logger.error(userName + ":seller_model:insertProduct:" + apiname + ':Error:' + err);
				modelCallback(failureResponse);
			} else {
				modelCallback(sucessResponse);
			}
		});
	});
};

sellerDB.uploadProduct = function(apiname, userName, productDetails, modelCallback) {
	logger.info(userName+ ":seller_model:uploadProduct:" + apiname + ":Enter:"+userName+":");
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
		con.query(query_config.SELLER.INSERT_NEW_PRODUCT,[userName,productDetails[i].itemType,productDetails[i].itemSku,productDetails[i].externalProductId,productDetails[i].externalProductIdType,productDetails[i].brandName,productDetails[i].itemName,productDetails[i].manufacturer,productDetails[i].departmentName1,productDetails[i].departmentName2,productDetails[i].departmentName3,productDetails[i].departmentName4,productDetails[i].departmentName5,productDetails[i].materialType1,productDetails[i].materialType2,productDetails[i].materialType3,productDetails[i].materialType4,productDetails[i].materialType5,productDetails[i].metalType,productDetails[i].settingType,productDetails[i].gemType,productDetails[i].standardPrice,productDetails[i].quantity,productDetails[i].merchantShippingGroupName,productDetails[i].mainOfferImage,productDetails[i].swatchImageUrl,productDetails[i].offerImage1,productDetails[i].offerImage2,productDetails[i].offerImage3,productDetails[i].offerImage4,productDetails[i].offerImage5,productDetails[i].offerImage6,productDetails[i].offerImage7,productDetails[i].offerImage8,productDetails[i].offerImage,productDetails[i].feedProductType,productDetails[i].updateDelete,productDetails[i].productDescription,productDetails[i].bulletPoint1,productDetails[i].bulletPoint2,productDetails[i].bulletPoint3,productDetails[i].bulletPoint4,productDetails[i].bulletPoint5,productDetails[i].targetAudienceKeywords1,productDetails[i].targetAudienceKeywords2,productDetails[i].targetAudienceKeywords3,productDetails[i].targetAudienceKeywords4,productDetails[i].targetAudienceKeywords5,productDetails[i].specificUsesKeywords1,productDetails[i].specificUsesKeywords2,productDetails[i].specificUsesKeywords3,productDetails[i].specificUsesKeywords4,productDetails[i].specificUsesKeywords5,productDetails[i].genericKeywords1,productDetails[i].genericKeywords2,productDetails[i].genericKeywords3,productDetails[i].genericKeywords4,productDetails[i].genericKeywords5,productDetails[i].websiteShippingWeight,productDetails[i].websiteShippingWeightUnitOfMeasure,productDetails[i].displayDimensionsUnitOfMeasure,productDetails[i].itemDisplayDiameter,productDetails[i].itemDisplayHeight,productDetails[i].itemDisplayWidth,productDetails[i].itemDisplayLength,productDetails[i].itemLength,productDetails[i].itemWidth,productDetails[i].itemHeight,productDetails[i].itemDimensionsUnitOfMeasure,productDetails[i].itemDisplayWeight,productDetails[i].itemDisplayWeightUnitOfMeasure,productDetails[i].fulfillmentCenterId,productDetails[i].packageLength,productDetails[i].packageHeight,productDetails[i].packageWidth,productDetails[i].packageDimensionsUnitOfMeasure,productDetails[i].packageWeight,productDetails[i].packageWeightUnitOfMeasure, productDetails[i].countryOfOrigin,productDetails[i].prop65,productDetails[i].cpsiaCautionaryStatement1,productDetails[i].cpsiaCautionaryStatement2,productDetails[i].cpsiaCautionaryStatement3,productDetails[i].cpsiaCautionaryStatement4,productDetails[i].cpsiaCautionaryDescription,productDetails[i].fabricType1,productDetails[i].fabricType2,productDetails[i].fabricType3,productDetails[i].fabricType4,productDetails[i].fabricType5,productDetails[i].fabricType6,productDetails[i].fabricType7,productDetails[i].fabricType8,productDetails[i].fabricType9,productDetails[i].fabricType10,productDetails[i].importDesignation,productDetails[i].conditionType,productDetails[i].conditionNote,productDetails[i].currency,productDetails[i].productSiteLaunchDate,productDetails[i].productTaxCode,productDetails[i].listPrice,productDetails[i].salePrice,productDetails[i].saleFromDate,productDetails[i].saleEndDate,productDetails[i].merchantReleaseDate,productDetails[i].itemPackageQuantity,productDetails[i].fulfillmentLatency,productDetails[i].restockDate,productDetails[i].maxAggregateShipQuantity,productDetails[i].offeringCanBeGiftMessaged,productDetails[i].offeringCanBeGiftwrapped,productDetails[i].isDiscontinuedByManufacturer,productDetails[i].maxOrderQuantity,productDetails[i].offeringStartDate],function (err, result) {
			if (err){
                                logger.error(userName + ':seller_model:uploadProduct:' + apiname + ':Error:' + err);
                                failureResponse.errorMsg = "Failure in uploading product, Please try again or contact support team!!";
				modelCallback(failureResponse);
			}
		});
	}	
	modelCallback(sucessResponse);
};

sellerDB.updateProduct = function(apiname, userName, productDetails, modelCallback) {
    logger.info(userName + ":seller_model:updateProduct:" + apiname + ":Enter:" + userName + ":");
    var failureResponse = {
        "responseCode": -1,
        "response": "",
        "errorMsg": "DB_ERROR"
    };

    var sucessResponse = {
        "responseCode": 0,
        "response": {
            "successfully_Updated": "",
            "failed_to_update": ""
        },
        "errorMsg": ""
    };
    var successfully_Updated = 0;
    var failed_to_update = 0;
    var jsondataValidate = JSON.parse(dataValidate);
    for (var i = 0; i < productDetails.length; i++) {
        var marketPlace = productDetails[i].marketPlace;
        try {
            var dataMapJSON = JSON.parse(fs.readFileSync('./config/' + marketPlace + '_data_map_config.js', 'utf8'));
            for (var attributename in dataMapJSON) {
                console.log("Category : " + attributename + ": " + dataMapJSON[attributename]);
                if (productDetails[i][attributename]) {
                    var checkData = dataMapJSON[attributename];
                    for (var dataname in checkData) {
                        console.log(dataname + ": " + checkData[dataname]);
                        console.log("Category Value = ", productDetails[i][attributename]);
                        if (productDetails[i][attributename] === dataname) {
                            productDetails[i][attributename] = checkData[dataname];
                            break;
                        }
                    }
                }
            }
        } catch (ex) {
            logger.info("No Data Map File Found For ", marketPlace + " : " + ex);
        }

        var category = jsondataValidate[productDetails[i].category];
        var dataCheckcount = 0;
        var valid_Data = 0;
        if (category) {
            for (var attributename in category) {
                dataCheckcount++;
                console.log("Category : " + attributename + ": " + category[attributename]);
                if (productDetails[i][attributename]) {
                    var checkData = category[attributename];
                    for (var dataname in checkData) {
                        console.log(dataname + ": " + checkData[dataname]);
                        console.log("category Value = ", productDetails[i][attributename]);
                        if (productDetails[i][attributename] === checkData[dataname]) {
                            valid_Data = valid_Data + 1;
                            break;
                        }
                    }
                }
            }
        }
        if (valid_Data >= dataCheckcount) {
            valid_Data = false;
            con.query(query_config.SELLER.UPDATE_PRODUCT, [productDetails[i].sellerSku, productDetails[i].brand, productDetails[i].name, productDetails[i].color, productDetails[i].category, productDetails[i].materialOrFabric, productDetails[i].productDescription, productDetails[i].model, productDetails[i].gender, productDetails[i].quantity, productDetails[i].price, productDetails[i].image1, productDetails[i].image2, productDetails[i].image3, productDetails[i].image4, productDetails[i].image5, productDetails[i].image6, productDetails[i].image7, productDetails[i].packageLength, productDetails[i].packageWidth, productDetails[i].packageHeight, productDetails[i].packageWeight, productDetails[i].watch_external_product_id, productDetails[i].watch_external_product_id_type, productDetails[i].watch_item_name, productDetails[i].watch_manufacturer, productDetails[i].watch_model, productDetails[i].watch_part_number, productDetails[i].watch_standard_price, productDetails[i].watch_merchant_shipping_group_name, productDetails[i].watch_target_audience_keywords1, productDetails[i].watch_target_audience_keywords2, productDetails[i].watch_target_audience_keywords3, productDetails[i].watch_target_audience_keywords4, productDetails[i].watch_target_audience_keywords5, productDetails[i].watch_main_image_url, productDetails[i].watch_band_material_type, productDetails[i].watch_band_color, productDetails[i].watch_dial_color, productDetails[i].watch_display_type, productDetails[i].watch_movement_type, productDetails[i].shoes_feed_product_type, productDetails[i].shoes_item_sku, productDetails[i].shoes_merchant_shipping_group_name, productDetails[i].shoes_outer_material_type1, productDetails[i].shoes_outer_material_type2, productDetails[i].shoes_material_type1, productDetails[i].shoes_material_type2, productDetails[i].shoes_color_name, productDetails[i].shoes_size_name, productDetails[i].baby_item_sku, productDetails[i].baby_item_name, productDetails[i].baby_quantity, productDetails[i].baby_standard_price, productDetails[i].baby_merchant_shipping_group_name, productDetails[i].baby_color_name, productDetails[i].baby_mfg_minimum, productDetails[i].baby_mfg_minimum_unit_of_measure, productDetails[i].beauty_item_sku, productDetails[i].beauty_item_name, productDetails[i].beauty_part_number, productDetails[i].beauty_merchant_shipping_group_name, productDetails[i].beauty_recommended_browse_nodes, productDetails[i].computers_item_sku, productDetails[i].computers_item_name, productDetails[i].computers_merchant_shipping_group_name, productDetails[i].computers_recommended_browse_nodes, productDetails[i].computers_hard_disk_size1, productDetails[i].computers_hard_disk_size2, productDetails[i].computers_hard_disk_size3, productDetails[i].computers_hard_disk_size4, productDetails[i].computers_hard_disk_size5, productDetails[i].computers_hard_disk_size6, productDetails[i].computers_hard_disk_size7, productDetails[i].computers_hard_disk_size8, productDetails[i].computers_hard_disk_interface1, productDetails[i].computers_hard_disk_interface2, productDetails[i].computers_hard_disk_interface3, productDetails[i].computers_hard_disk_interface4, productDetails[i].computers_system_ram_type1, productDetails[i].computers_system_ram_type2, productDetails[i].computers_system_ram_type3, productDetails[i].computers_system_ram_type4, productDetails[i].computers_system_ram_type5, productDetails[i].computers_system_ram_type6, productDetails[i].computers_system_ram_type7, productDetails[i].computers_operating_system, productDetails[i].food_merchant_shipping_group_name, productDetails[i].food_material_features, productDetails[i].food_fc_shelf_life, productDetails[i].food_fc_shelf_life_pad_time, productDetails[i].food_product_expiration_type, productDetails[i].furniture_item_name, productDetails[i].furniture_merchant_shipping_group_name, productDetails[i].sports_condition_type, productDetails[i].sports_merchant_shipping_group_name, productDetails[i].sports_item_type_name, productDetails[i].toys_item_name, productDetails[i].toys_merchant_shipping_group_name, productDetails[i].toys_color_name, productDetails[i].toys_mfg_minimum, productDetails[i].clothing_merchant_shipping_group_name, productDetails[i].clothing_color_name, productDetails[i].clothing_department_name, productDetails[i].giftcard_product_description, productDetails[i].giftcard_item_type, productDetails[i].giftcard_merchant_shipping_group_name, productDetails[i].giftcard_bullet_point1, productDetails[i].giftcard_bullet_point2, productDetails[i].giftcard_bullet_point3, productDetails[i].giftcard_bullet_point4, productDetails[i].giftcard_bullet_point5, productDetails[i].giftcard_target_audience_keywords1, productDetails[i].giftcard_target_audience_keywords2, productDetails[i].giftcard_target_audience_keywords3, productDetails[i].giftcard_legal_disclaimer_description, productDetails[i].giftcard_state_string, productDetails[i].giftcard_format, productDetails[i].giftcard_genre, productDetails[i].health_item_package_quantity, productDetails[i].health_merchant_shipping_group_name, productDetails[i].health_unit_count, productDetails[i].health_unit_count_type, productDetails[i].home_merchant_shipping_group_name, productDetails[i].home_color_name, productDetails[i].home_material_type1, productDetails[i].home_material_type2, productDetails[i].home_material_type3, productDetails[i].home_material_type4, productDetails[i].home_material_type5, productDetails[i].home_material_type6, productDetails[i].home_material_type7, productDetails[i].home_material_type8, productDetails[i].home_material_type9, productDetails[i].home_material_type10, productDetails[i].home_thread_count, productDetails[i].luggage_part_number, productDetails[i].luggage_merchant_shipping_group_name, productDetails[i].luggage_color_name, productDetails[i].luggage_color_map, productDetails[i].luggage_material_type1, productDetails[i].luggage_material_type2, productDetails[i].luggage_material_type3, productDetails[i].luggage_material_type4, productDetails[i].luggage_material_type5, productDetails[i].musical_model, productDetails[i].musical_merchant_shipping_group_name, productDetails[i].office_model, productDetails[i].office_merchant_shipping_group_name, productDetails[i].office_list_price_with_tax, productDetails[i].pet_merchant_shipping_group_name, productDetails[i].jewellery_condition_type, productDetails[i].jewellery_merchant_shipping_group_name, productDetails[i].jewellery_color_map, productDetails[i].jewellery_department_name, productDetails[i].jewellery_material_type, productDetails[i].jewellery_ring_size, productDetails[i].jewellery_item_shape, productDetails[i].sellerSku], function(err, result) {
                if (err) {
                    failed_to_update = failed_to_update + 1;
                    logger.error(userName + ':seller_model:updateProduct:' + apiname + ':Error:' + err);
                    failureResponse.errorMsg = "Failure in updating product, Please try again or contact support team!!";
                    modelCallback(failureResponse);
                } else {
                    logger.info("Success----: ", result);
                    successfully_Updated = successfully_Updated + 1;
                    // Below part is to upload the product in their website
                    switch (marketPlace) {
                        case "amazon":
                            logger.info("Switch Case : amazon");
                            break;
                        case "flipkart":
                            logger.info("Switch Case : flipkart");
                            flipKartUpdateProduct.updateOrder("token", productDetails[i], function(updateOrderResponse){
                                if(updateOrderResponse.responseCode === 0) {
                                    logger.info("Success: Product SKU: "+productDetails[i].sellerSku+" update in "+marketPlace+" marketplace");
                                } else {
                                    logger.info("Error: Product SKU: "+productDetails[i].sellerSku+" could not be updated in "+marketPlace+" marketplace");
                                }
                            });
                            break;
                        case "lazada":
                            logger.info("Switch Case : lazada");
                            break;
                        case "elevenStreet":
                            logger.info("Switch Case : elevenStreet");
                            break;
                        default:
                            logger.info("Switch Case : No Match Found");
                            break;
                    }
                }
            });
        } else {
            failed_to_update++;
        }

    }
    sucessResponse.response.failed_to_update = failed_to_update;
    sucessResponse.response.successfully_Updated = successfully_Updated;
    modelCallback(sucessResponse);
};

sellerDB.getProductLevelInventoryReport = function(apiname, userName, modelCallback) {
    logger.info(userName + ":seller_model:getProductLevelInventoryReport:" + apiname + ":Enter:" + userName + ":");
    var failureResponse = {
        "responseCode": -1,
        "response": "",
        "errorMsg": "DB_ERROR"
    };

    var sucessResponse = {
        "responseCode": 0,
        "response": {
            "productLevelInventoryRemaining": [],
            "overallInventoryWorth": "",
            "inventoryWorthByCategory": [],
            "numberOfProductsToBeRestocked": []
        },
        "errorMsg": ""
    };
    async.waterfall(
        [
            function(callback) {
                con.query(query_config.SELLER.PRODUCT_LEVEL_INVENTORY, [userName, userName], function(err, result) {
                    if (err) {
                        logger.error(userName + ':seller_model:getProductLevelInventoryReport:PRODUCT_LEVEL_INVENTORY ' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "Failure in retriving product, Please try again or contact support team!!";
                        modelCallback(failureResponse);
                    } else if (result && result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            var res = {
                                "name": result[i].name,
                                "quantity": result[i].quantity,
                                "soldQty": result[i].SoldQty,
                                "remainingQty": result[i].RemainingQty
                            };
                            sucessResponse.response.productLevelInventoryRemaining.push(res);
                        }
                        callback(null, sucessResponse);

                    } else {
                        callback(null, sucessResponse);
                    }
                });
            },
            function(response, callback) {
                con.query(query_config.SELLER.OVERALL_INVENTORY_WORTH, [userName], function(err, result) {
                    if (err) {
                        logger.error(userName + ':seller_model:getProductLevelInventoryReport:OVERALL_INVENTORY_WORTH ' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "Failure in retriving product, Please try again or contact support team!!";
                        modelCallback(failureResponse);
                    } else if (result && result.length > 0) {
                        sucessResponse.response.overallInventoryWorth = result[0].Overall_Inventory_Worth;
                        callback(null, sucessResponse);
                    } else {
                        callback(null, sucessResponse);
                    }
                });
            },
            function(response, callback) {
                con.query(query_config.SELLER.INVENTORY_WORTH_BY_CATEGORY, [userName], function(err, result) {
                    if (err) {
                        logger.error(userName + ':seller_model:getProductLevelInventoryReport:INVENTORY_WORTH_BY_CATEGORY ' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "Failure in retriving product, Please try again or contact support team!!";
                        modelCallback(failureResponse);
                    } else if (result && result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            var res = {
                                "brand": result[i].category,
                                "overallInventoryWorth": result[i].Overall_Inventory_Worth
                            };
                            sucessResponse.response.inventoryWorthByCategory.push(res);
                        }
                        callback(null, sucessResponse);

                    } else {
                        callback(null, sucessResponse);
                    }
                });
            },
            function(response, callback) {
                con.query(query_config.SELLER.NUMBER_OF_PRODUCTS_TO_BE_RESTOCKED, [userName, userName], function(err, result) {
                    if (err) {
                        logger.error(userName + ':seller_model:getProductLevelInventoryReport:NUMBER_OF_PRODUCTS_TO_BE_RESTOCKED ' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "Failure in retriving product, Please try again or contact support team!!";
                        modelCallback(failureResponse);
                    } else if (result && result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            var res = {
                                "name": result[i].name,
                                "quantity": result[i].quantity,
                                "remainingQty": result[i].RemainingQty,
                                "percentageRemaining": result[i].Percentage_Remaining
                            };
                            sucessResponse.response.numberOfProductsToBeRestocked.push(res);
                        }
                        callback(null, sucessResponse);

                    } else {
                        callback(null, sucessResponse);
                    }
                });
            }
        ],
        function(err, results) {
            if (err) {
                logger.error(userName + ":seller_workflow:getProductLevelInventoryReport:" + apiname + ":Exit", err);
                modelCallback(err);
            } else {
                logger.info(userName + ":seller_workflow:getProductLevelInventoryReport:" + apiname + ":Exit", results);
                modelCallback(results);
            }
        });
};

sellerDB.getTopProductsSold = function(apiname, userName, modelCallback) {
    logger.info(userName + ":seller_model:getTopProductsSold:" + apiname + ":Enter:" + userName + ":");
    var failureResponse = {
        "responseCode": -1,
        "response": "",
        "errorMsg": "DB_ERROR"
    };

    var sucessResponse = {
        "responseCode": 0,
        "response": {
            "overallProductsSold": [],
            "productsSoldByCategory": [],
            "productsSoldByRegion": []
        },
        "errorMsg": ""
    };
    async.waterfall(
        [
            function(callback) {
                con.query(query_config.SELLER.OVERALL_PRODUCTS_SOLD, [userName], function(err, result) {
                    if (err) {
                        logger.error(userName + ':seller_model:getProductLevelInventoryReport:OVERALL_PRODUCTS_SOLD ' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "Failure in retriving product, Please try again or contact support team!!";
                        modelCallback(failureResponse);
                    } else if (result && result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            var res = {
                                "productName": result[i].PRODUCT_NAME,
                                "totalOrders": result[i].Total_Orders
                            };
                            sucessResponse.response.overallProductsSold.push(res);
                        }
                        callback(null, sucessResponse);

                    } else {
                        callback(null, sucessResponse);
                    }
                });
            },
            function(response, callback) {
                con.query(query_config.SELLER.TOP_PRODUCT_SOLD_BY_CATEGORY, [userName], function(err, result) {
                    if (err) {
                        logger.error(userName + ':seller_model:getProductLevelInventoryReport:TOP_PRODUCT_SOLD_BY_CATEGORY ' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "Failure in retriving product, Please try again or contact support team!!";
                        modelCallback(failureResponse);
                    } else if (result && result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            var res = {
                                "category": result[i].category,
                                "totalOrders": result[i].Total_Orders
                            };
                            sucessResponse.response.productsSoldByCategory.push(res);
                        }
                        callback(null, sucessResponse);

                    } else {
                        callback(null, sucessResponse);
                    }
                });
            },
            function(response, callback) {
                con.query(query_config.SELLER.TOP_PRODUCT_SOLD_BY_REGION, [userName], function(err, result) {
                    if (err) {
                        logger.error(userName + ':seller_model:getProductLevelInventoryReport:TOP_PRODUCT_SOLD_BY_REGION ' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "Failure in retriving product, Please try again or contact support team!!";
                        modelCallback(failureResponse);
                    } else if (result && result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            var res = {
                                "marketPlace": result[i].MARKET_PLACE,
                                "totalOrders": result[i].Total_Orders
                            };
                            sucessResponse.response.productsSoldByRegion.push(res);
                        }
                        callback(null, sucessResponse);

                    } else {
                        callback(null, sucessResponse);
                    }
                });
            }
        ],
        function(err, results) {
            if (err) {
                logger.error(userName + ":seller_workflow:getProductLevelInventoryReport:" + apiname + ":Exit", err);
                modelCallback(err);
            } else {
                logger.info(userName + ":seller_workflow:getProductLevelInventoryReport:" + apiname + ":Exit", results);
                modelCallback(results);
            }
        });
};
/*sellerDB.getAllProducts = function(apiname,userName,jsonKeyList,columnNameList,tableName,marketPlace,productCategory,productDetail,selectColumn,modelCallback) {
	logger.info("-------------------------------->>>>>>",selectColumn);
	logger.info(userName+ ":seller_model:getAllProducts:" + apiname + ":Enter:"+userName+":");
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
	var productDetails = { "productDetails" :[] };
	con.query(selectColumn,[],function (err, result) {
		if (err){
                        logger.error(userName + ':seller_model:getAllProducts:' + apiname + ':Error:' + err);
			modelCallback(failureResponse);
		} else {
			if (result && result.length > 0) {
				logger.info("-------------------------------0----------------------------------->>>>>>11111 ",productCategory);
				for (var i = 0;i < result.length; i++) {
					var productDetailBkp = JSON.parse(JSON.stringify(productDetail));
					for (var j=0;j < jsonKeyList.length; j++) {
						productDetailBkp[jsonKeyList[j]] = result[i][columnNameList[j]];
					}
					productDetailBkp.id=result[i].ID;
					productDetailBkp.status=result[i].STATUS;
					productDetailBkp.sellerName=result[i].SELLER_NAME;
					productDetailBkp.marketPlace=marketPlace;
                                        productDetailBkp.productCategory=productCategory;
					productDetails.productDetails[i] = productDetailBkp;
				}
				logger.info(userName+ ":seller_model:getAllProducts:" + apiname + ":Exit:");
				sucessResponse.response=productDetails;
				modelCallback(sucessResponse);
			} else {
				logger.info(userName+ ":seller_model:getAllProducts:" + apiname + ":No Product available:");
				modelCallback(failureResponse);
			}
		}
	});
};*/

/*sellerDB.getAllProducts = function(apiname, userName, modelCallback) {
        logger.info(userName+ ":seller_model:getAllProducts:" + apiname + ":Enter:"+userName+":");
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
	var productDetails = { "productDetails" :[] };
	con.query(query_config.SELLER.GET_ALL_SELLER_PRODUCT,[userName],function (err, result) {
		if (err){
			logger.error(userName + ':seller_model:getAllProducts:' + apiname + ':Error:' + err);
			failureResponse.errorMsg = "Issue in retriving the products, Please try again or contact support team!!";
			modelCallback(failureResponse);
                } else {
			if (result && result.length > 0) {
				for (var i = 0;i < result.length; i++) {
					var productDetail = {
						"id" : "",
						"sellerSku" : "",
						"brand" : "",
						"name" : "",
						"color" : "",
						"materialOrFabric" : "",
						"model" : "",
						"quantity" : "",
						"price" : ""
					}

                                        productDetail.id=result[i].ID;
                                        productDetail.sellerSku=result[i].sellerSku;
                                        productDetail.brand=result[i].brand;
                                        productDetail.name=result[i].name;
                                        productDetail.color=result[i].color;
                                        productDetail.materialOrFabric=result[i].materialOrFabric;
                                        productDetail.model=result[i].model;
                                        productDetail.quantity=result[i].quantity;
                                        productDetail.price=result[i].price;
                                        productDetail.lazadaUploadStatus=result[i].lazada_upload_status;
                                        productDetail.elevenStreetUploadStatus=result[i].elevenStreet_upload_status;
                                        productDetail.searsUploadStatus=result[i].sears_upload_status;
                                        productDetail.ebayUploadStatus=result[i].ebay_upload_status;
                                        productDetail.amazonUsUploadStatus=result[i].amazonUS_upload_status;
                                        productDetail.amazonCaUploadStatus=result[i].amazonCA_upload_status;
                                        productDetail.amazonMxUploadStatus=result[i].amazonMX_upload_status;
                                        productDetail.amazonUkUploadStatus=result[i].amazonUK_upload_status;
                                        productDetail.amazonFrUploadStatus=result[i].amazonFR_upload_status;
                                        productDetail.amazonDeUploadStatus=result[i].amazonDE_upload_status;
                                        productDetail.amazonItUploadStatus=result[i].amazonIT_upload_status;
                                        productDetail.amazonEsUploadStatus=result[i].amazonES_upload_status;
                                        productDetail.cDiscountUploadStatus=result[i].cDiscount_upload_status;
                                        productDetail.etsyUploadStatus=result[i].etsy_upload_status;

					productDetails.productDetails.push(productDetail);
				}
			} else {
				logger.info(userName+ ":seller_model:getAllProducts:" + apiname + ":No Product available:");
			}
			sucessResponse.response=productDetails;
			logger.info(userName+ ":seller_model:getAllProducts:" + apiname + ":Exit:");
			modelCallback(sucessResponse);
		}
	});
};*/

sellerDB.getAllProducts = function(apiname, userName, modelCallback) {
        logger.info(userName+ ":seller_model:getAllProducts:" + apiname + ":Enter:"+userName+":");
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
        var productDetails = { "productDetails" :[] };
        con.query(query_config.SELLER.GET_ALL_SELLER_PRODUCT,[userName],function (err, result) {
                if (err){
                        logger.error(userName + ':seller_model:getAllProducts:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "Issue in retriving the products, Please try again or contact support team!!";
                        modelCallback(failureResponse);
                } else {
                        if (result && result.length > 0) {
                                for (var i = 0;i < result.length; i++) {
                                        var productDetail = {
                                                "id" : "",
                                                "sellerSku" : "",
                                                "brand" : "",
                                                "name" : "",
                                                "color" : "",
                                                "materialOrFabric" : "",
                                                "model" : "",
                                                "quantity" : "",
                                                "price" : "",
                                                "lazada_upload_status" : "",
                                                "elevenStreet_upload_status" : "",
                                                "sears_upload_status" : "",
                                                "ebay_upload_status" : "",
                                                "amazonUS_upload_status" : "",
                                                "amazonCA_upload_status" : "",
                                                "amazonMX_upload_status" : "",
                                                "amazonUK_upload_status" : "",
                                                "amazonFR_upload_status" : "",
                                                "amazonDE_upload_status" : "",
                                                "amazonIT_upload_status" : "",
                                                "amazonES_upload_status" : "",
                                                "cDiscount_upload_status" : "",
                                                "etsy_upload_status" : "",
                                        }

                                        productDetail.id=result[i].ID;
                                        productDetail.sellerSku=result[i].sellerSku;
                                        productDetail.brand=result[i].brand;
                                        productDetail.name=result[i].name;
                                        productDetail.color=result[i].color;
                                        productDetail.materialOrFabric=result[i].materialOrFabric;
                                        productDetail.model=result[i].model;
                                        productDetail.quantity=result[i].quantity;
                                        productDetail.price=result[i].price;
                                        productDetail.lazadaUploadStatus=result[i].lazada_upload_status;
                                        productDetail.elevenStreetUploadStatus=result[i].elevenStreet_upload_status;
                                        productDetail.searsUploadStatus=result[i].sears_upload_status;
                                        productDetail.ebayUploadStatus=result[i].ebay_upload_status;
                                        productDetail.amazonUsUploadStatus=result[i].amazonUS_upload_status;
                                        productDetail.amazonCaUploadStatus=result[i].amazonCA_upload_status;
                                        productDetail.amazonMxUploadStatus=result[i].amazonMX_upload_status;
                                        productDetail.amazonUkUploadStatus=result[i].amazonUK_upload_status;
                                        productDetail.amazonFrUploadStatus=result[i].amazonFR_upload_status;
                                        productDetail.amazonDeUploadStatus=result[i].amazonDE_upload_status;
                                        productDetail.amazonItUploadStatus=result[i].amazonIT_upload_status;
                                        productDetail.amazonEsUploadStatus=result[i].amazonES_upload_status;
                                        productDetail.cDiscountUploadStatus=result[i].cDiscount_upload_status;
                                        productDetail.etsyUploadStatus=result[i].etsy_upload_status;

                                        productDetails.productDetails.push(productDetail);
                                }
                        } else {
                                logger.info(userName+ ":seller_model:getAllProducts:" + apiname + ":No Product available:");
                        }
                        sucessResponse.response=productDetails;
                        logger.info(userName+ ":seller_model:getAllProducts:" + apiname + ":Exit:");
                        modelCallback(sucessResponse);
                }
        });
};


module.exports = sellerDB;
