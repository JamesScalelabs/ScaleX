'use strict';
var request = require("request");
var express = require("express");
var app = express();

var Application_Id = '17155a8ab3515699927720a4088455327b168';
var Application_Secret = '3b7ab88aa6736c52521755986c1ebde17';
var sku = 'CH-MSHS-GD-001,CH-HS-GD-001'; //Added 2 SKU

//Retrieve the information listed against the provided SKU Ids.
request.get({
        url: "https://api.flipkart.net/sellers/listings/v3/" + sku,
        //port: 80,
        method: "GET",
        headers: {
            'Authorization': 'Bearer fed39524-dcb6-45f8-aa2a-d3877488e11b',
            'Content-Type': 'application/json'
        },
        //body: ''
    },
    function(error, response, body) {
        console.log("response : " + response);
        console.log("body : " + body);
    });