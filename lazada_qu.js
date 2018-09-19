'use strict';
var lazadaQU = {};
var jsonxml = require('jsontoxml');
var crypto = require('crypto');
var algorithm = 'sha256';
var requestApi = require('request');



lazadaQU.quantityUpdate = function(request, responseCallback) {

    console.log(request);
    console.log(request.quantity);

    var requestXML = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<Request>' +
        '<Product>' +
        '<Skus>' +
        '<Sku>' +
        '<SellerSku>$sellerSku</SellerSku>' +
        '<Quantity>$quantity</Quantity>' +
        '<Price/>' +
        '<SalePrice/>' +
        '<SaleStartDate/>' +
        '<SaleEndDate/>' +
        '</Sku>' +
        '</Skus>'+
        '</Product>' +
        '</Request>';

       requestXML =  requestXML.replace('$sellerSku',request.sellerSku);
        requestXML = requestXML.replace('$quantity', request.quantity);

        console.log(requestXML);

       var user = request.uname.replace('@','%40');

    var text = 'Action=UpdatePriceQuantity&Format=json&Timestamp=' + request.timestamp + '&UserID=' + user + '&Version=1.0';
    var hash;
    var hmac = crypto.createHmac(algorithm, request.appKey);
    hmac.setEncoding('hex');
    hmac.end(text, function() {
        hash = hmac.read();
    });
    hash = hmac.read();
    var url = 'https://api.sellercenter.lazada.com.my/?';


    var finalUrl = url + text + '&Signature=' + hash;
    console.log("finalUrl : " + finalUrl);
    var options = {
        uri: finalUrl,
        method: 'POST',
        body: requestXML
    }
    requestApi(options, function(error, response, body) {
        console.log("lazada response body : ", body);
    });


};

console.log(new Date().toISOString());
var timestamp = new Date().toISOString().replace(/:/g, "%3A").replace(/\..+/, '') + '%2B00%3A00';
console.log(timestamp);

var sellerSku = 'JNE09100-BLACK-KR-002-S';
var quantity = 10;


var request = {
    "uname": "trendzstyle2017.sl@gmail.com",
    "appKey": "6t9chyCv58GFhb_d4XdMy_JLJev05FYm1udHcPPaBlyyRz8oDVVz0Gha",
    "timestamp": timestamp,
    "sellerSku": sellerSku,
    "quantity": quantity
};


lazadaQU.quantityUpdate(request, function(response) {

    console.log(response);
});