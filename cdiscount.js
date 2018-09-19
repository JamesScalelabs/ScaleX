"use strict";

var soap = require('strong-soap').soap;
var XMLHandler = soap.XMLHandler;
var util = require('util');
 var request = require("request");
 var parser = require('xml2json');

var parseString = require('xml2js').parseString;

var url = 'https://wsvc.cdiscount.com/MarketplaceAPIService.svc?wsdl';

var cDiscountGetProductListRequest = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"> <s:Body> <GetOrderList xmlns="http://www.cdiscount.com"> <headerMessage xmlns:a="http://schemas.datacontract.org/2004/07/Cdiscount.Framework.Core.Communication.Messages" xmlns:i="http://www.w3.org/2001/XMLSchema-instance"> <a:Context> <a:CatalogID>1</a:CatalogID> <a:CustomerPoolID>1</a:CustomerPoolID> <a:SiteID>100</a:SiteID> </a:Context> <a:Localization> <a:Country>Fr</a:Country> <a:Currency>Eur</a:Currency> <a:DecimalPosition>2</a:DecimalPosition> <a:Language>En</a:Language> </a:Localization> <a:Security> <a:DomainRightsList i:nil="true" /> <a:IssuerID i:nil="true" /> <a:SessionID i:nil="true" /> <a:SubjectLocality i:nil="true" /> <a:TokenId>367aad969d4f487087ab8f894d946d3f</a:TokenId> <a:UserName i:nil="true" /> </a:Security> <a:Version>1.0</a:Version> </headerMessage> <orderFilter xmlns:i="http://www.w3.org/2001/XMLSchema-instance"> <BeginCreationDate>2017-11-25T00:00:00.00</BeginCreationDate> <BeginModificationDate>2012-11-25T01:00:00.00</BeginModificationDate> <EndCreationDate>2017-12-25T23:59:59.99</EndCreationDate> <EndModificationDate>2017-12-25T02:00:00.00</EndModificationDate> <FetchOrderLines>true</FetchOrderLines> <States> <OrderStateEnum>CancelledByCustomer</OrderStateEnum> <OrderStateEnum>WaitingForSellerAcceptation</OrderStateEnum> <OrderStateEnum>AcceptedBySeller</OrderStateEnum> <OrderStateEnum>PaymentInProgress</OrderStateEnum> <OrderStateEnum>WaitingForShipmentAcceptation</OrderStateEnum> <OrderStateEnum>Shipped</OrderStateEnum> <OrderStateEnum>RefusedBySeller</OrderStateEnum> <OrderStateEnum>AutomaticCancellation</OrderStateEnum> <OrderStateEnum>PaymentRefused</OrderStateEnum> <OrderStateEnum>ShipmentRefusedBySeller</OrderStateEnum> <OrderStateEnum>RefusedNoShipment</OrderStateEnum> </States> </orderFilter> </GetOrderList> </s:Body> </s:Envelope>';

console.log("cDiscountGetProductListRequest");
console.log(cDiscountGetProductListRequest);
request.post({
    url:"https://wsvc.cdiscount.com/MarketplaceAPIService",
    port: 80,
    method:"POST",
    headers:{
        'Content-Type': 'application/xml',
    },
     body: cDiscountGetProductListRequest
},
function(error, response, body){
  console.log("response" + response);
  console.log("body" + body);
});