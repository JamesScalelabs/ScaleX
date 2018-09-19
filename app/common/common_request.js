/*jslint node: true */
'use strict';
var commonRequest = {};
var config = require('../../config/config');
var mysql_db = require('../../db/mysql_db');
var query_config = require('../../config/query_config');
var logger = config.logger;
var async = require('async');
var _ = require('lodash');
var request = require('request');
var jre = require('node-jre');
var to_json = require('xmljson').to_json;
var xml2js = require('xml2js');
var fedexAPI = require('fedex');
var util = require('util');
 var parser = require('xml2json');

 var soap = require('strong-soap').soap;

commonRequest.getSellerOrders = function(apiname,userName,sellerName,hash,text,url,modelCallback) {
        logger.info(userName+ ":common_request:getSellerOrders:" + apiname + ":Enter:");
	var failureResponse = {
		"responseCode": -1,
		"response": "",
		"errorMsg": "DB_ERROR"
	};
	var sucessResponse = {
		"responseCode": 0,
		"response": {},
		"errorMsg": ""
	};
	var sellerOrders = { 
		"totalOrders":"0",
		"orders" : []
	};
	var options = {
		uri : url + text + '&Signature=' + hash,
		method : 'GET'
	}
	logger.info(options);
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			logger.info(userName+ ":common_request:body:" +body);
			var jsonBody=JSON.parse(body);
			if (jsonBody.SuccessResponse != null ) {
				sellerOrders.totalOrders=jsonBody.SuccessResponse.Head.TotalCount;
				sellerOrders.orders=jsonBody.SuccessResponse.Body.Orders;
			}
		}
		else {
			logger.info(userName+ ":common_request:body:not found");
		}
		sucessResponse.response = sellerOrders;
		modelCallback(sucessResponse);
	});
};

commonRequest.getSellerOrderItems = function(apiname,userName,sellerName,hash,text,url,modelCallback) {
        logger.info(userName+ ":common_request:getSellerOrderItems:" + apiname + ":Enter:");
        var failureResponse = {
                "responseCode": -1,
                "response": "",
                "errorMsg": "DB_ERROR"
        };
        var sucessResponse = {
                "responseCode": 0,
                "response": {},
                "errorMsg": ""
        };
        var sellerOrderInfo= {
		"orderItems" : []
	};
        var options = {
                uri : url + text + '&Signature=' + hash,
                method : 'GET'
        }
        logger.info(options);
        request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
			logger.info(userName+ ":common_request:body:" +body);
                        var jsonBody=JSON.parse(body);
                        if (jsonBody.SuccessResponse != null ) {
                                sellerOrderInfo.orderItems=jsonBody.SuccessResponse.Body.OrderItems;
                        }
                }
                else {
                        logger.info(userName+ ":common_request:body:not found");
                }
                sucessResponse.response =sellerOrderInfo;
                modelCallback(sucessResponse);
        });
};

commonRequest.getAmazonUsSellerOrders = function(apiname,userName,sellerName,updateTs,site,marketPlaceId,sellerId,accountNo,accessKeyId,secretKey,modelCallback) {
	logger.info(userName+ ":common_request:getAmazonUsSellerOrders:" + apiname + ":Enter:");
	//updateTs="2017-12-06";
	var sucessResponse = {
                "responseCode": 0,
                "response": {},
                "errorMsg": ""
        };
	var output = jre.spawnSync(
	//var output = jre.spawn(
		['/home/ubuntu/scaleLabs/app/common/Amazon114.jar'],
		'com.amazonservices.mws.orders._2013_09_01.samples.HelloWorld',
		[sellerId,accountNo,accessKeyId,secretKey,site,updateTs,marketPlaceId,"args"],
		{ encoding: 'utf8' }
	).stdout.trim();
	logger.info("-------->"+userName+ ":common_request:getAmazonUsSellerOrders:output:\n",output);
	//modelCallback(sucessResponse);
//	modelCallback(JSON.stringify(output));
	try {
		//modelCallback(JSON.parse(output));
		JSON.parse(output);
		modelCallback(JSON.parse(output));
	} catch (e) {
		modelCallback(sucessResponse);
	}
	
};

commonRequest.getElevenStatesComplete = function(apiname,userName,sellerName,updateTs,updateTill,site,sellerKey,modelCallback) {
        logger.info(userName+ ":common_request:getElevenStatesComplete:" + apiname + ":Enter:");
	var successResponse = {
                "responseCode": 0,
                "response": { 
			"result": "",
		},
                "errorMsg": ""
        };
	var headers = {
		'Contenttype': 'application/xml',
		'Accept-Charset': 'utf8',
		'openapikey': sellerKey
	};
	var options = {
		url: site,
		method: 'GET',
		headers: headers
	};
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			logger.info("-------->"+userName+ ":common_request:getElevenStatesComplete:output:\n",body);
			//to_json(body,function (error, data) {
			//	logger.info("-------->"+userName+ ":common_request:getElevenStatesComplete:output:\n",data);
			//	logger.info("-------->"+userName+ ":common_request:getElevenStatesComplete:output:\n",JSON.stringify(data));
			//});
			var parser = new xml2js.Parser();
//			body = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"true\"?><ns2:orders xmlns:ns2=\"http://skt.tmall.business.openapi.spring.service.client.domain\"><ns2:order><ordNo>201403045695145</ordNo><ordPrdSeq>1</ordPrdSeq><addPrdNo>0</addPrdNo><addPrdYn>N</addPrdYn><clearanceEmail>test@11street.my</clearanceEmail ><dlvCstType>01</dlvCstType><dlvNo>140152139</dlvNo><lstDlvCst>1500</lstDlvCst><lstSellerDscPrc>100</lstSellerDscPrc><lstTmallDscPrc>500</lstTmallDscPrc><memID>test@11street.my</memID><memNo>14214395</memNo><ordAmt>10000</ordAmt><ordCnQty>0</ordCnQty><ordDt>04-03-2014 10:40:32</ordDt><ordEmail>test@11street.my</ordEmail ><ordNm>Kil Jun Jeong</ordNm><ordOptWonStl>0</ordOptWonStl><ordPayAmt>10900</ordPayAmt><ordPrtblTel>12314-766666</ordPrtblTel><ordQty>1</ordQty><ordStlEndDt>04-03-2014 10:40:32</ordStlEndDt><ordTlphnNo>12314-766666</ordTlphnNo><prdNm>[test]test product4</prdNm><prdNo>145019</prdNo><prdStckNo>1534049782</prdStckNo><rcvrBaseAddr>50929, Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur </rcvrBaseAddr><rcvrDtlsAddr>jl setia budi </rcvrDtlsAddr><rcvrMailNo>BKS001003</rcvrMailNo><rcvrNm>yujut45rfgtyh</rcvrNm><rcvrTlphn>8765-123456765432</rcvrTlphn><selPrc>10000</selPrc><sellerDscPrc>100</sellerDscPrc><sellerPrdCd>229067424</sellerPrdCd><tmallDscPrc>500</tmallDscPrc><partCode>SKU001</partCode></ns2:order><ns2:order><ordNo>201403045695143</ordNo><ordPrdSeq>1</ordPrdSeq><addPrdNo>0</addPrdNo><addPrdYn>N</addPrdYn><clearanceEmail>test@11street.my</clearanceEmail ><dlvCstType>03</dlvCstType><dlvNo>140152138</dlvNo><lstDlvCst>0</lstDlvCst><lstSellerDscPrc>0</lstSellerDscPrc><lstTmallDscPrc>0</lstTmallDscPrc><memID>test@11street.my</memID><memNo>14214395</memNo><ordAmt>0</ordAmt><ordCnQty>0</ordCnQty><ordDt>04-03-2014 10:40:32</ordDt><ordEmail>test@11street.my</ordEmail ><ordNm>Kil Jun Jeong</ordNm><ordOptWonStl>0</ordOptWonStl><ordPayAmt>0</ordPayAmt><ordPrtblTel>12314-766666</ordPrtblTel><ordQty>0</ordQty><ordStlEndDt>04-03-2014 10:40:32</ordStlEndDt><ordTlphnNo>12314-766666</ordTlphnNo><prdNm>[test]test product4</prdNm><prdNo>145019</prdNo><prdStckNo>1534049782</prdStckNo><rcvrBaseAddr>50929, Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur </rcvrBaseAddr><rcvrDtlsAddr>jl setia budi </rcvrDtlsAddr><rcvrMailNo>BKS001003</rcvrMailNo><rcvrNm>yujut45rfgtyh</rcvrNm><rcvrTlphn>8765-123456765432</rcvrTlphn><selPrc>10000</selPrc><sellerDscPrc>0</sellerDscPrc><sellerPrdCd>229067424</sellerPrdCd><tmallDscPrc>0</tmallDscPrc><partCode>SKU002</partCode></ns2:order></ns2:orders>";
			parser.parseString(body, function (err, result) {
				successResponse.response.result=JSON.stringify(result);
				modelCallback(successResponse);
			});
		} else {
			successResponse.responseCode = -1;
			modelCallback(successResponse);
		}
	});
};

commonRequest.getElevenStatesCompleteShip = function(apiname,userName,sellerName,site,sellerKey,modelCallback) {
	logger.info(userName+ ":common_request:getElevenStatesCompleteShip:" + apiname + ":Enter:");
        var successResponse = {
                "responseCode": 0,
                "response": {
                        "result": "",
                },
                "errorMsg": ""
        };
        var headers = {
                'Contenttype': 'application/xml',
                'Accept-Charset': 'utf8',
                'openapikey': sellerKey
        };
        var options = {
                url: site,
                method: 'GET',
                headers: headers
        };
        request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                        logger.info("-------->"+userName+ ":common_request:getElevenStatesCompleteShip:output:\n",body);
                        var parser = new xml2js.Parser();
                        parser.parseString(body, function (err, result) {
                                successResponse.response.result=JSON.stringify(result);
                                modelCallback(successResponse);
                        });
                } else {
                        successResponse.responseCode = -1;
                        modelCallback(successResponse);
                }
        });
};

commonRequest.getSearsSellerOrders = function(apiname,userName,sellerName,hash,site,sellerId,sellerEmail,updateTs,toTs,requestTs,modelCallback) {
	logger.info(userName+ ":common_request:getSearsSellerOrders:" + apiname + ":Enter:");
	logger.info(userName+ ":common_request:getSearsSellerOrders: hash: "+hash+" site: "+site+" sellerId: "+sellerId+" sellerEmail: "+sellerEmail+" updateTs: "+updateTs+" toTs: "+toTs+" requestTs: "+requestTs);
        var successResponse = {
                "responseCode": 0,
                "response": {
                        "result": "",
                },
                "errorMsg": ""
        };
	var header = "HMAC-SHA256 emailaddress="+sellerEmail+",timestamp="+requestTs+",signature="+hash;
        var headers = {
		'Authorization':header
	};
	var siteUrl=site+"sellerId="+sellerId+"&fromdate="+updateTs+"&todate="+toTs;
	var options = {
                url: siteUrl,
                method: 'GET',
                headers: headers
        };
        request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                        logger.info("-------->"+userName+ ":common_request:getSearsSellerOrders:output:\n",body);
                        var parser = new xml2js.Parser();
                        parser.parseString(body, function (err, result) {
                                successResponse.response.result=JSON.stringify(result);
                                modelCallback(successResponse);
                        });
                } else {
                        successResponse.responseCode = -1;
                        modelCallback(successResponse);
                }
        });
};

commonRequest.trackFedExOrder = function(apiname,userName,request, modelCallback) {
    	logger.info(userName+ ":common_request:trackFedExOrder:" + apiname + ":Enter:");
            var successResponse = {
                    "responseCode": 0,
                    "response": {
                            "result": "",
                    },
                    "errorMsg": ""
            };
         
     var fedex = new fedexAPI({
      environment: 'sandbox', // or live
      debug: true,
      key: '6z7g0eXTnENrjR8Q',
      password: 'MQOePNUT5v7hNR79FwDYADXiB',
      account_number: '604501202',
      meter_number: '119009361',
      imperial: true // set to false for metric
    });



    fedex.track({
      SelectionDetails: {
        PackageIdentifier: {
          Type: 'TRACKING_NUMBER_OR_DOORTAG',
          Value: request.trackingId
        }
      }
    }, function(err, res) {
      if(err) {
        successResponse.responseCode = -1;
        modelCallback(successResponse);
      }
       console.log("Response %j", res);
    successResponse.response.result=JSON.parse(JSON.stringify(res));
     modelCallback(successResponse);
   

});
};

commonRequest.trackAramexOrder = function(apiname,userName,request, modelCallback) {
	logger.info(userName+ ":common_request:trackAramexOrder:" + apiname + ":Enter:");
        var successResponse = {
                "responseCode": 0,
                "response": {
                        "result": "",
                },
                "errorMsg": ""
        };
        var failureResponse = {
                        "responseCode": -1,
                        "response": {},
                        "errorMsg": ""
                };

        // wsdl of the web service this client is going to invoke.
var url = './sandbox.wsdl';

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
               request.trackingId
            ]},
        "GetLastTrackingUpdateOnly": true
    }


};

var options = {};
soap.createClient(url, options, function(err, client) {
    var method = client['TrackShipments'];
    method(requestArgs, function(err, result, envelope, soapHeader) {
        if(err){
               failureResponse.errorMsg = "Unable to Track the Id Provided";
           modelCallback(failureResponse) ;
        }

        console.log(client.lastRequest);
        //response envelope
        console.log('Response Envelope: \n' + envelope);
        //'result' is the response body
        console.log('Result: \n' + JSON.stringify(result));
        var result = JSON.parse(JSON.stringify(result));
        if(result === undefined || result.Transaction === undefined){
        failureResponse.errorMsg = 'Unable to Track the Id Provided';

        modelCallback(successResponse);
        }else {
            successResponse.response.result =  result.Transaction;

        modelCallback(successResponse);
        }
        
    });
});
     
};

commonRequest.trackDHLOrder = function(apiname,userName,apiRequest, modelCallback) {
	logger.info(userName+ ":common_request:trackDHLOrder:" + apiname + ":Enter:");
        var successResponse = {
                "responseCode": 0,
                "response": {
                        "result": "",
                },
                "errorMsg": ""
        };

        var failureResponse = {
                        "responseCode": -1,
                        "response": {},
                        "errorMsg": ""
                };

var dhlTrackingRequest = '<?xml version="1.0" encoding="UTF-8"?> <req:KnownTrackingRequest xmlns:req="http://www.dhl.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.dhl.com TrackingRequestKnown.xsd"> <Request> <ServiceHeader> <MessageTime>2002-06-25T11:28:56-08:00</MessageTime> <MessageReference>1234567890123456789012345678</MessageReference> <SiteID>DServiceVal</SiteID> <Password>testServVal</Password> </ServiceHeader> </Request> <LanguageCode>en</LanguageCode> <AWBNumber>'
+apiRequest.trackingId+'</AWBNumber> <LevelOfDetails>ALL_CHECK_POINTS</LevelOfDetails> <PiecesEnabled>S</PiecesEnabled> </req:KnownTrackingRequest>';

request.post({
        url: "http://xmlpitest-ea.dhl.com/XMLShippingServlet",
        port: 80,
        method: "POST",
        headers: {
            'Content-Type': 'application/xml',
        },
        body: dhlTrackingRequest
    },
    function(error, response, body) {
        if(error)
        {
            failureResponse.errorMsg = "Unable to Track the Id Provided";
           modelCallback(failureResponse) ;
        } else{
            console.log(response.statusCode);
        var json = parser.toJson(body);
        console.log(json);
        var jsonObject = JSON.parse(json);
        
        console.log(jsonObject);
if(jsonObject !== undefined && jsonObject['req:TrackingResponse'] !== undefined && jsonObject['req:TrackingResponse']['AWBInfo'] !== undefined)
{
    var resToFrontEnd = JSON.parse(JSON.stringify(jsonObject['req:TrackingResponse']['AWBInfo']));
        if(resToFrontEnd[0] !== undefined)
        {
            if(resToFrontEnd[0].Status.ActionStatus === "success")
            {
                successResponse.response.result = resToFrontEnd;
                   modelCallback(successResponse) ;
            }

        }
        else if(resToFrontEnd !== undefined)
        {
            var resToFrontEnd = JSON.parse(JSON.stringify(jsonObject['req:TrackingResponse']['AWBInfo']));
            if(resToFrontEnd.Status.ActionStatus === "success")
            {
        successResponse.response.result = resToFrontEnd;
                   modelCallback(successResponse) ; 
            }
            else {
            failureResponse.errorMsg = resToFrontEnd.Status.ActionStatus;
           modelCallback(failureResponse) ;
        }
        } 
        else {
            failureResponse.errorMsg = 'Unable to Track the Id Provided';
           modelCallback(failureResponse) ;
        }  
}else {
        failureResponse.errorMsg = 'Unable to Track the Id Provided';
           modelCallback(failureResponse) ;
        }  




        }
        
        
    });
   

};

module.exports = commonRequest;
