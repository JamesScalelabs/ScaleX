'use strict';
var lazadaUpdateProduct = {};
var config = require('../../config/config');
var logger = config.logger;
var async = require('async');
var _ = require('lodash');
var request = require('request');
var jre = require('node-jre');
var to_json = require('xmljson').to_json;
var xml2js = require('xml2js');
var fedexAPI = require('fedex');
var util = require('util');
var parser = require('xml2json');
var crypto = require('crypto');
var algorithm = 'sha256';
var commonService = require('./common_service');
//var base64 = require('file-base64');
var htmlToPdf = require('html-to-pdf');
var fs = require("fs");
var contents = fs.readFileSync('./config/appkey_config.js', 'utf8');

var soap = require('strong-soap').soap;
var express = require("express");
var app = express();

lazadaUpdateProduct.updateProduct = function(request, responseCallback) {
    logger.info(apiname + ":Under lazadaUpdateProduct");
    var failureResponse = {
        "responseCode": -1,
        "response": "",
        "errorMsg": "DB_ERROR"
    };
    var successResponse = {
        "responseCode": 0,
        "response": {},
        "errorMsg": ""
    };
    /*var appKey = "6t9chyCv58GFhb_d4XdMy_JLJev05FYm1udHcPPaBlyyRz8oDVVz0Gha";
    var user = "trendzstyle2017.sl@gmail.com";*/
    var sellerName = "trendzstyle2017.sl@gmail.com";
    const sellerAppKey = sellerName.concat('_password');
    const sellerUser = sellerName.concat('_uname');
    var jsonContent = JSON.parse(contents);
    var appKey = jsonContent[sellerAppKey];
    var user = jsonContent[sellerUser];
    if (appKey == null || user == null) {
        failureResponse.errorMsg = 'Invalid User Credentials'
        responseCallback(failureResponse);
    }

    var body = {
        "Request": {
            "Product": {
                "Attributes": {
                    "name": "api update product sample",
                    "short_description": "This is an amazing product"
                },
                "Skus": {
                    "Sku": [{
                            "SellerSku": "api-create-test-1",
                            "quantity": "88",
                            "price": "350",
                            "package_length": "12",
                            "package_height": "23",
                            "package_weight": "34",
                            "package_width": "45",
                            "Images": ""
                        },
                        {
                            "SellerSku": "api-create-test-2",
                            "quantity": "44",
                            "price": "488.88",
                            "package_length": "10",
                            "package_height": "21",
                            "package_weight": "32",
                            "package_width": "43",
                            "package_content": "this is what's in the box, update",
                            "Images": {
                                "Image": [
                                    "http://sg.s.alibaba.lzd.co/original/59046bec4d53e74f8ad38d19399205e6.jpg",
                                    "http://sg.s.alibaba.lzd.co/original/179715d3de39a1918b19eec3279dd482.jpg",
                                    "http://sg.s.alibaba.lzd.co/original/e2ae2b41afaf310b51bc5764c17306cd.jpg"
                                ]
                            }
                        }
                    ]
                }
            }
        }
    };
    var url = "https://api.sellercenter.lazada.sg?";
    //var orderId = '111265824';

    user = user.replace('@', '%40');
    var timestamp = new Date().toISOString();
    timestamp = timestamp.replace(/:/g, "%3A");
    timestamp = timestamp.replace(/\..+/, '');
    timestamp = timestamp + '%2B00%3A00';

    var text = 'Action=UpdateProduct&Format=json&OrderId=' + orderId + '&Timestamp=' + timestamp + '&UserID=' + user + '&Version=1.0';
    var hmac;
    var hash;
    hmac = crypto.createHmac(algorithm, appKey);
    hmac.setEncoding('hex');
    hmac.end(text, function() {
        hash = hmac.read();
        //callback(null,hash,text);
    });
    hash = hmac.read();

    commonService.getSellerOrderItems(apiname, username, sellerName, hash, text, url, function(getSellerOrderItemsResponse) {
        if (getSellerOrderItemsResponse.responseCode === 0) {
            var orderItemIds = [];
            for (var j in getSellerOrderItemsResponse.response.orderItems) {
                orderItemIds.push(getSellerOrderItemsResponse.response.orderItems[j].OrderItemId);
            }
            logger.info(orderItemIds);
            var encryptedOrderItemIds = '%5B' + orderItemIds.toString() + '%5D';
            encryptedOrderItemIds = encryptedOrderItemIds.replace(',', '%2C');

            text = 'Action=GetDocument&DocumentType=invoice&Format=json&OrderItemIds=' + encryptedOrderItemIds + '&Timestamp=' + timestamp + '&UserID=' + user + '&Version=1.0';
            //var hmac;
            //var hash;
            hmac = crypto.createHmac(algorithm, appKey);
            hmac.setEncoding('hex');
            hmac.end(text, function() {
                hash = hmac.read();
                //callback(null,hash,text);
            });
            hash = hmac.read();

            var options = {
                uri: url + text + '&Signature=' + hash,
                method: 'GET'
            }
            logger.info(options);
            request(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    logger.info(":common_request:body:" + body);
                    var jsonBody = JSON.parse(body);
                    if (jsonBody.SuccessResponse != null) {
                        logger.info(":Success");
                        successResponse.response = jsonBody.SuccessResponse;
                        /* base64.decode(jsonBody.SuccessResponse.Body.Document.File, '/projects/veeresh/scaleslabs/downloads/invoice.html', function(err, output) {
                             logger.info("HTML BODY" + output);
                         });*/
                        var b = new Buffer(jsonBody.SuccessResponse.Body.Document.File, 'base64')
                        var html = b.toString();
                        //logger.info("HTML BODY" + html);

                        htmlToPdf.convertHTMLString(html, '/projects/veeresh/scaleslabs/downloads/lazadaInvoice_' + orderItemIds + '.pdf',
                            function(error, success) {
                                if (error) {
                                    logger.info('Invoice Could Not Be Generated');
                                    logger.info(error);
                                } else {
                                    logger.info('Invoice Generated Under /projects/veeresh/scaleslabs/downloads/lazadaInvoice_' + orderItemIds + '.pdf');
                                    logger.info(success);
                                }
                            }
                        );
                        responseCallback(successResponse);
                    } else {
                        responseCallback(failureResponse);
                    }

                } else {
                    logger.info(":common_request:body:not found");
                    responseCallback(failureResponse);
                }
            });
        }
    });

    /*commonService.getMaxUpdateTs(apiname, 'Veer', 'lazada', 'trendzstyle2017.sl@gmail.com', function(getMaxUpdateTsResponse) {
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


    });*/
    //var updateTs = '2010-02-25T23%3A46%3A11%2B00%3A00';

}

module.exports = lazadaUpdateProduct;