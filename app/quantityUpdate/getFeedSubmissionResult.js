'use strict';
var request = require("request");
//var jsonxml = require('jsontoxml');
//var fs = require("fs");
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

var sellerId = 'A1TC9EJGKUWOMD';
var accountNo = '6638-7568-5850';
var accessKeyId = 'AKIAIFABL6PFIMU44WYA';
var secretKey = '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';
var sellerIdEu = '';
var accountNoEu = '';
var accessKeyIdEu = '';
var secretKeyEu = '';

var amazonMws = require('amazon-mws')(accessKeyId, secretKey);


/*amazonMws.feeds.search({
        'Version': '2009-01-01',
        'Action': 'GetFeedSubmissionResult',
        'SellerId': sellerId,
        'MWSAuthToken': accountNo,
        'FeedSubmissionId': '72138017713'
    }, function(error, response) {
        if (error) {
            logger.info("errorrrrrrrrrrr : ");
            logger.info("error : ", error);
            return;
        }
        logger.info("Successsss : ");
        logger.info("response on GetFeedSubmissionList : ", response);
    });*/


//GetFeedSubmissionList
amazonMws.feeds.search({
        'Version': '2009-01-01',
        'Action': 'GetFeedSubmissionList',
        'SellerId': sellerId,
        'MWSAuthToken': accountNo
        //'FeedSubmissionId': '72030017713'
    }, function(error, response) {
        if (error) {
            logger.info("errorrrrrrrrrrr : ");
            logger.info("error : ", error);
            return;
        }
        logger.info("Successsss : ");
        logger.info("response on GetFeedSubmissionList : ", response);
    });