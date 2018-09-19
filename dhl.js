
 var request = require("request");
 var parser = require('xml2json');

var parseString = require('xml2js').parseString;
//var utf8 = require('utf8');

var trackingId = "8564385550";
var dhlTrackingRequest = '<?xml version="1.0" encoding="UTF-8"?> <req:KnownTrackingRequest xmlns:req="http://www.dhl.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.dhl.com TrackingRequestKnown.xsd"> <Request> <ServiceHeader> <MessageTime>2002-06-25T11:28:56-08:00</MessageTime> <MessageReference>1234567890123456789012345678</MessageReference> <SiteID>DServiceVal</SiteID> <Password>testServVal</Password> </ServiceHeader> </Request> <LanguageCode>en</LanguageCode> <AWBNumber>'+trackingId+'</AWBNumber> <LevelOfDetails>ALL_CHECK_POINTS</LevelOfDetails> <PiecesEnabled>S</PiecesEnabled> </req:KnownTrackingRequest>';
request.post({
    url:"http://xmlpitest-ea.dhl.com/XMLShippingServlet",
    port: 80,
    method:"POST",
    headers:{
        'Content-Type': 'application/xml',
    },
     body: dhlTrackingRequest
},
function(error, response, body){
    console.log(response.statusCode);
    var json = parser.toJson(body);

console.log("to json -> %s",json);

var jsonObject = JSON.parse(json);
console.log(jsonObject);
console.log(JSON.stringify(jsonObject['req:TrackingResponse']['AWBInfo']));

console.log(error);
});