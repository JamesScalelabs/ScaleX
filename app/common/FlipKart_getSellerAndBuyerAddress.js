'use strict';
var flipKartGetSellerAndBuyerAddress = {};
var request = require("request");
var express = require("express");
var app = express();

var Application_Id = '17155a8ab3515699927720a4088455327b168';
var Application_Secret = '3b7ab88aa6736c52521755986c1ebde17';


flipKartGetSellerAndBuyerAddress.getAddress = function(token, shipmentIDsList, responseCallback){
    var failureResponse = {
        "responseCode": -1,
        "response": {},
        "errorMsg": "Issue with getShipmentIDs"
    };

    var sucessResponse = {
        "responseCode": 0,
        "response": "",
        "errorMsg": ""
    };
    request.get({
        url: "https://api.flipkart.net/sellers/v3/shipments/"+shipmentIDsList,
        //port: 80,
        method: "GET",
        headers: {
            'Authorization': 'Bearer '+token,
            'Content-Type': 'application/json'
        }
    },
    function(error, response, body) {
        if(error){
            console.log("flipKartGetSellerAndBuyerAddress.getAddress: Error");
            responseCallback(failureResponse);
        } else {
            console.log("flipKartGetSellerAndBuyerAddress.getAddress: Success");
            var bodyy = JSON.parse(body);
            //console.log("getAddress.Body : " + JSON.stringify(bodyy));
            sucessResponse.response = bodyy;
            responseCallback(sucessResponse);
        }
        
    });
}


module.exports = flipKartGetSellerAndBuyerAddress;