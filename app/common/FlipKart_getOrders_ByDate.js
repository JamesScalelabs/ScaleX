'use strict';
var request = require("request");
var express = require("express");
var app = express();
var config = require('../../config/config');
var mysql_db = require('../../db/mysql_db');
var query_config = require('../../config/query_config');
var logger = config.logger;
var flipKart_getOrders_ByNextURL = require('./FlipKart_getOrders_ByNextURL');
var flipKart_getShipmentIDs = require('./FlipKart_getShipmentIDs');
var flipKart_getSellerAndBuyerAddress = require('./FlipKart_getSellerAndBuyerAddress');
var async = require('async');
var mysqldb = require('mysql');

var con = mysqldb.createConnection({
    host: "scalelabsdevdb.cababjt98r5d.us-east-1.rds.amazonaws.com",
    user: "scaleLabsDevDB",
    password: "scaleLabsDevDB",
    database: 'my_db'
});

var Application_Id = '17155a8ab3515699927720a4088455327b168';
var Application_Secret = '3b7ab88aa6736c52521755986c1ebde17';
var token = 'fed39524-dcb6-45f8-aa2a-d3877488e11b';

var bodyy = {
    "filter": {
        "states": [
            "Approved", "packed", "ready_to_dispatch"   //Possible values: approved, packed, ready_to_dispatch, and cancelled
        ],
        /*"orderDate": { //Keep this filter to fetch the order from perticular date
            "fromDate": "2018-06-04T16:36:59",
            "toDate": "2018-07-04T16:36:59"
        }*/
    }
};

//This operation fetches order items of the satisfying the applied filter criterias.
//By Above Filter states = "Approved" will return all the new orders list

/*Note: If in response hasMore = 'true' then that means the number of search results
are more than the pageSize value. if hasMore = 'true' then we need to hit the
nextPageUrl that we get from Response to get remaining set of Order List
*/
request.post({
        url: "https://api.flipkart.net/sellers/v2/orders/search",
        //port: 80,
        method: "POST",
        headers: {
            'Authorization': 'Bearer fed39524-dcb6-45f8-aa2a-d3877488e11b',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyy)
    },
    function(error, response, body) {
        //console.log("response : " + response);
        var bodyy = JSON.parse(body);
        //console.log("body : " + JSON.stringify(bodyy));
        console.log("body.hasMore : ", bodyy.hasMore);
        //var loop = true;
        var hasMore = bodyy.hasMore;
        var nextURL = bodyy.nextPageUrl;
        var orderItemIdList = [];
        var orderItems = bodyy.orderItems;
        var seller = "trendzstyle2017.sl@gmail.com";
        for (var i = 0; i < orderItems.length; i++) {
            //console.log("inside for loop :", orderItems[i].orderItemId);
            orderItemIdList.push(orderItems[i].orderItemId);
            con.query(query_config.COMMON.INSERT_FLIPKART_ORDER, [orderItems[i].orderId, "", "", orderItems[i].orderId, orderItems[i].paymentType, orderItems[i].Remarks, orderItems[i].DeliveryInfo, orderItems[i].priceComponents.sellingPrice, orderItems[i].GiftOption, orderItems[i].GiftMessage, orderItems[i].VoucherCode, orderItems[i].orderDate, orderItems[i].updatedAt, "", "", orderItems[i].NationalRegistrationNumber, orderItems[i].quantity, orderItems[i].deliverByDate, orderItems[i].status, orderItems[i].priceComponents.shippingCharge, seller, orderItems[i].title, orderItems[i].sku, orderItems[i].sku, orderItems[i].shipmentType, orderItems[i].priceComponents.sellingPrice, orderItems[i].priceComponents.totalPrice, "INR", orderItems[i].TAX_AMOUNT, orderItems[i].priceComponents.shippingCharge, orderItems[i].priceComponents.shippingCharge, orderItems[i].IS_DIGITAL, orderItems[i].PURCHASE_ORDER_ID, orderItems[i].PURCHASE_ORDER_NUM, orderItems[i].SHIPPING_PROVIDER_TYPE, orderItems[i].INVOICE_NUMBER, orderItems[i].GIFT_WRAP_PRICE, "flipkart"], function(err, result) {
                if (err) {
                    //logger.error(userName + ':Flipkart_getOrders_ByDate:insertOrder:' + apiname + ':Error:' + err);
                    console.log("Couldnt Insert");
                }
            });
        }
        async.waterfall(
            [function(callback) {
                    (function loop() {
                        if (hasMore) {
                            console.log("Inside While Loop");
                            flipKart_getOrders_ByNextURL.getOrdersByNextURL(token, nextURL, function(nextURLResponse) {
                                if (nextURLResponse.responseCode === 0) {
                                    hasMore = nextURLResponse.response.hasMore;
                                    nextURL = nextURLResponse.response.nextPageUrl;
                                    orderItems = nextURLResponse.response.orderItems;
                                    for (var i = 0; i < orderItems.length; i++) {
                                        console.log("inside for loop :", orderItems[i].orderItemId);
                                        orderItemIdList.push(orderItems[i].orderItemId);
                                        con.query(query_config.COMMON.INSERT_FLIPKART_ORDER, [orderItems[i].orderId, "", "", orderItems[i].orderId, orderItems[i].paymentType, orderItems[i].Remarks, orderItems[i].DeliveryInfo, orderItems[i].priceComponents.sellingPrice, orderItems[i].GiftOption, orderItems[i].GiftMessage, orderItems[i].VoucherCode, orderItems[i].orderDate, orderItems[i].updatedAt, "", "", orderItems[i].NationalRegistrationNumber, orderItems[i].quantity, orderItems[i].deliverByDate, orderItems[i].status, orderItems[i].priceComponents.shippingCharge, "", orderItems[i].title, orderItems[i].sku, orderItems[i].sku, orderItems[i].shipmentType, orderItems[i].priceComponents.sellingPrice, orderItems[i].priceComponents.totalPrice, "INR", orderItems[i].TAX_AMOUNT, orderItems[i].priceComponents.shippingCharge, orderItems[i].priceComponents.shippingCharge, orderItems[i].IS_DIGITAL, orderItems[i].PURCHASE_ORDER_ID, orderItems[i].PURCHASE_ORDER_NUM, orderItems[i].SHIPPING_PROVIDER_TYPE, orderItems[i].INVOICE_NUMBER, orderItems[i].GIFT_WRAP_PRICE, "flipkart"], function(err, result) {
                                            if (err) {
                                                //logger.error(userName + ':Flipkart_getOrders_ByDate:insertOrder:' + apiname + ':Error:' + err);
                                                console.log("Couldnt Insert");
                                            }
                                        });
                                    }
                                    /*async.eachSeries(orderItems, function(orderItems, callback) {
                                        console.log("inside for loop :", orderItems.orderItemId);
                                        orderItemIdList.push(orderItems.orderItemId);
                                        callback();
                                    }, function(err_1) {
                                        if (err_1) {
                                            console.log("Error....!!");
                                        } else {
                                            console.log("Success...!!");
                                        }
                                    });*/
                                    console.log("hasMore===== : ", hasMore);
                                    //console.log("orderItemIdList : ", orderItemIdList);
                                    loop();
                                } else {
                                    console.log(nextURLResponse.errorMsg);
                                    callback(nextURLResponse.errorMsg, null);
                                }
                            });
                        } else {
                            console.log("Inside else block");
                            callback(null, orderItemIdList);
                        }
                    }());
                },
                function(orderItemIdList, callback) {
                    if (orderItemIdList !== null && orderItemIdList.length > 0) {
                        flipKart_getShipmentIDs.getShipmentIDs(token, orderItemIdList, function(getShipmentIDsResponse) {
                            if (getShipmentIDsResponse.responseCode === 0) {
                                var shipmentIDsList = [];
                                var shipmentIDs = getShipmentIDsResponse.response.shipments;
                                for (var i = 0; i < shipmentIDs.length; i++) {
                                    console.log("inside for loop :", shipmentIDs[i].shipmentId);
                                    shipmentIDsList.push(shipmentIDs[i].shipmentId);
                                }
                                callback(null, shipmentIDsList);
                            } else {
                                callback(getShipmentIDsResponse, null);
                            }
                        });
                    }
                },
                function(shipmentIDsList, callback) {
                    if (shipmentIDsList !== null && shipmentIDsList.length > 0) {
                        flipKart_getSellerAndBuyerAddress.getAddress(token, shipmentIDsList, function(getSellerAndBuyerAddressResponse) {
                            if (getSellerAndBuyerAddressResponse.responseCode === 0) {
                                //var addressList = [];
                                var addressList = getSellerAndBuyerAddressResponse.response.shipments;
                                console.log("Test1 : ", addressList[0].subShipments[0]);
                                console.log("Test2 : ", addressList[0].subShipments[0].courierDetails.deliveryDetails.vendorName);
                                for (var i = 0; i < addressList.length; i++) {
                                    console.log("Updating : ", addressList[i].subShipments[0].courierDetails.deliveryDetails.vendorName);
                                    con.query(query_config.COMMON.UPDATE_FLIPKART_ORDER, [addressList[i].subShipments[0].courierDetails.deliveryDetails.vendorName, addressList[i].subShipments[0].courierDetails.pickupDetails.trackingId, addressList[i].buyerDetails.firstName, addressList[i].buyerDetails.lastName, JSON.stringify(addressList[i].subShipments[0].courierDetails.deliveryDetails), JSON.stringify(addressList[i].billingAddress), JSON.stringify(addressList[i].deliveryAddress), addressList[i].orderId], function(err, result) {
                                        if (err) {
                                            //logger.error(userName + ':Flipkart_getOrders_ByDate:insertOrder:' + apiname + ':Error:' + err);
                                            console.log("Couldnt Insert");
                                        }
                                    });
                                }
                                callback(null, addressList);
                            } else {
                                callback(getSellerAndBuyerAddressResponse, null);
                            }
                        });
                    }
                }
            ],
            function(error, successResponse) {
                if (error) {
                    console.log("Error : ", error);
                } else {
                    console.log("Success : ", "successResponse");
                }
            });

    });