'use strict';
var flipKartGetShipmentIDs = {};
var request = require("request");
var express = require("express");
var app = express();

var Application_Id = '17155a8ab3515699927720a4088455327b168';
var Application_Secret = '3b7ab88aa6736c52521755986c1ebde17';


flipKartGetShipmentIDs.getShipmentIDs = function(token, orderItemIdList, responseCallback){
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
        url: "https://api.flipkart.net/sellers/v3/shipments?orderItemIds="+orderItemIdList,
        //port: 80,
        method: "GET",
        headers: {
            'Authorization': 'Bearer '+token,
            'Content-Type': 'application/json'
        }
    },
    function(error, response, body) {
        if(error){
            console.log("flipKartGetShipmentIDs.getShipmentIDs: Error");
            responseCallback(failureResponse);
        } else {
            console.log("flipKartGetShipmentIDs.getShipmentIDs: Success");
            var bodyy = JSON.parse(body);
            //console.log("getShipmentIDs.Body : " + JSON.stringify(bodyy));
            sucessResponse.response = bodyy;
            responseCallback(sucessResponse);
        }
        
    });
}


module.exports = flipKartGetShipmentIDs;