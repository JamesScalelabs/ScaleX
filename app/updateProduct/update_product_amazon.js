'use strict';
var request = require("request");
var jsonxml = require('jsontoxml');
var fs = require("fs");
var config = require('../../config/config');
//var contents = fs.readFileSync('./config/appkey_config.js', 'utf8');
//var commonService = require('../common/common_service');
var logger = config.logger;

var failureResponse = {
    "responseCode": -1,
    "response": {},
    "errorMsg": "Issue with Quantity Update"
};

var sucessResponse = {
    "responseCode": 0,
    "response": "",
    "errorMsg": ""
};

var sellerId = 'A1TC9EJGKUWOMD'
var accountNo = '6638-7568-5850';
var accessKeyId = 'AKIAIFABL6PFIMU44WYA';
var secretKey = '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';
var sellerIdEu = '';
var accountNoEu = '';
var accessKeyIdEu = '';
var secretKeyEu = '';

var amazonMws = require('amazon-mws')(accessKeyId, secretKey);
var FeedContent = fs.readFileSync('../../catalogue/amazon/amazon_update_quantity.txt', 'UTF-8');
logger.info("File ----- ", FeedContent);

amazonMws.feeds.submit({
    'Version': '2009-01-01',
    'Action': 'SubmitFeed',
    'FeedType': '_POST_FLAT_FILE_INVLOADER_DATA_', //Should be used to update the product
    'FeedContent': FeedContent,
    'SellerId': sellerId,
    'MWSAuthToken': accountNo
}, function(error, response) {
    if (error) {
        console.log('error ', error);
        return;
    }
    console.log('response on SubmitFeed : ', response);
    var FeedSubmissionId = response.FeedSubmissionInfo.FeedSubmissionId;
    console.log('-------------------- ');
    amazonMws.feeds.search({
        'Version': '2009-01-01',
        'Action': 'GetFeedSubmissionResult',
        'SellerId': sellerId,
        'MWSAuthToken': accountNo,
        'FeedSubmissionId': FeedSubmissionId
    }, function(error, response) {
        if (error) {
            logger.info("error : ", error);
            return;
        }
        logger.info("response on GetFeedSubmissionList : ", response);
    });
});