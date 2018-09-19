'use strict';
var request = require("request");
var express = require("express");
var app = express();

var Application_Id = '17155a8ab3515699927720a4088455327b168';
var Application_Secret = '3b7ab88aa6736c52521755986c1ebde17';

var bodyy = {
    "CH-HS-GD-001": {
        "product_id": "CTHF7FW4JKH9Q29M",
        "price": {
            "mrp": 500,
            "selling_price": 100,
            "currency": "INR"
        }
    }
};

//Update product listings’ price in Flipkart’s Marketplace.
request.post({
        url: "https://api.flipkart.net/sellers/listings/v3/update/price",
        //port: 80,
        method: "POST",
        headers: {
            'Authorization': 'Bearer fed39524-dcb6-45f8-aa2a-d3877488e11b',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyy)
    },
    function(error, response, body) {
        console.log("response : " + response);
        console.log("body : " + body);
    });