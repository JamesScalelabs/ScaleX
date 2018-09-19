"use strict";

var soap = require('strong-soap').soap;
// wsdl of the web service this client is going to invoke.
var url = 'sandbox.wsdl';

//var url = 'aramex.wsdl';
var requestArgs = {
    "ShipmentTrackingRequest": {
        "ClientInfo": {
            "UserName": "testingapi@aramex.com",
            "Password": "R123456789$r",
            "Version": "v1.0",
            "AccountNumber": "20016",
            "AccountPin": "331421",
            "AccountEntity": "AMM",
            "AccountCountryCode": "JO"
        },
        "Shipments": {"string": [
               "123456786"
            ]},
        "GetLastTrackingUpdateOnly": true
    }


};

var options = {};
soap.createClient(url, options, function(err, client) {
    var method = client['TrackShipments'];
    method(requestArgs, function(err, result, envelope, soapHeader) {
    	console.log(client.lastRequest);
        //response envelope
        console.log('Response Envelope: \n' + envelope);
        //'result' is the response body
        console.log('Result: \n' + JSON.stringify(result));
    });
});