'use strict';

var accessKey = process.env.AWS_ACCESS_KEY_ID || 'YOUR_KEY';
var accessSecret = process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET';

var amazonMws = require('../../lib/amazon-mws')(accessKey, accessSecret);
var fs = require('fs');

var feedRequest = function () {

    //var FeedContent = fs.readFileSync('./file.txt', 'UTF-8');
    var amazonUpdateQuantityRequest = '<?xml version="1.0" encoding="UTF-8"?> <AmazonEnvelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="mzn-envelope.xsd"> <Header> <DocumentVersion>1.01</DocumentVersion> <MerchantIdentifier>M_SELLER_354577</MerchantIdentifier> </Header> <MessageType>Inventory</MessageType> <Message> <MessageID>1</MessageID> <OperationType>Update</OperationType> <Inventory> <SKU>ASUS8VM</SKU> <Quantity>6</Quantity> <FulfillmentLatency>1</FulfillmentLatency> </Inventory> </Message> </AmazonEnvelope>';


    amazonMws.feeds.submit({
        'Version': '2009-01-01',
        'Action': 'Update',
        'FeedType': '_POST_PRODUCT_DATA_',
        'FeedContent': FeedContent,
        'SellerId': 'AW8KPK2NDWFUQ',
        'MWSAuthToken': '2772-9183-7986'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
};

feedRequest();