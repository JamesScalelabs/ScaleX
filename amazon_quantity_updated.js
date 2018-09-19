'use strict';
var request = require("request");
var jsonxml = require('jsontoxml');

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

var amazonUpdateQuantityRequest = '<?xml version="1.0" encoding="UTF-8"?> <AmazonEnvelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="mzn-envelope.xsd"> <Header> <DocumentVersion>1.01</DocumentVersion> <MerchantIdentifier>M_SELLER_354577</MerchantIdentifier> </Header> <MessageType>Inventory</MessageType> <Message> <MessageID>1</MessageID> <OperationType>Update</OperationType> <Inventory> <SKU>ASUS8VM</SKU> <Quantity>6</Quantity> <FulfillmentLatency>1</FulfillmentLatency> </Inventory> </Message> </AmazonEnvelope>';


console.log("==================amazonUpdateQuantityRequest====================");
console.log(amazonUpdateQuantityRequest);
request.post({
        url: "https://mws.amazonservices.com/",
        port: 80,
        method: "POST",
        headers: {
            'Content-Type': 'application/xml',
        },
        body: amazonUpdateQuantityRequest
    },
    function(error, response, body) {
        console.log("response" + response);
        console.log("body" + body);
    });