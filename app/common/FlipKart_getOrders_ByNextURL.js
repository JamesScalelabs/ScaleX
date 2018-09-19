'use strict';
var flipKartGetOrdersByNextURL = {};
var request = require("request");
var express = require("express");
var app = express();
var config = require('../../config/config');
var logger = config.logger;


var Application_Id = '17155a8ab3515699927720a4088455327b168';
var Application_Secret = '3b7ab88aa6736c52521755986c1ebde17';

flipKartGetOrdersByNextURL.getOrdersByNextURL = function(token, nextURL, responseCallback) {
    var failureResponse = {
        "responseCode": -1,
        "response": {},
        "errorMsg": "Issue with nextURL"
    };

    var sucessResponse = {
        "responseCode": 0,
        "response": "",
        "errorMsg": ""
    };
    console.log("Inside flipKartGetOrdersByNextURL");
    request.get({
            url: "https://api.flipkart.net/sellers/v2" + nextURL,
            //port: 80,
            method: "GET",
            headers: {
                'Authorization': 'Bearer '+token,
                'Content-Type': 'application/json'
            }
        },
        function(error, response, body) {
            if(error){
                console.log("nextURL error : " + error);
                responseCallback(failureResponse);
            }
            var bodyy = JSON.parse(body);
            //console.log("nextURL.Body : " + JSON.stringify(bodyy));
            console.log("nextURL.Body.hasMore : ", bodyy.hasMore);
            sucessResponse.response = bodyy;
            responseCallback(sucessResponse);
        });

};

module.exports = flipKartGetOrdersByNextURL;