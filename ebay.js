/**
 * ebay API request to Trading:GetOrders
 */
/*jslint node: true */
'use strict';
var ebaySeller = {};

var ebay = require('./node_modules/ebay-api/index.js');
var xmlBuilder = require('xml');

console.log('Entry');

ebaySeller.getOrders = function(CreateTimeFrom, CreateTimeTo,callback) {

    console.log(CreateTimeFrom, CreateTimeTo);
    ebay.xmlRequest({
        serviceName: 'Trading',
        opType: 'GetOrders',

        // app/environment
        devId: '5eb9f3d5-0989-4764-842e-19e43f050bbb',
        certId: 'PRD-5d8a3c478077-9147-486c-a3df-7281',
        appId: 'ScaleLab-ScaleLab-PRD-15d8a3c47-16a25d0d',
        sandbox: false,

        // per user
        authToken: 'AgAAAA**AQAAAA**aAAAAA**neikWg**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6ADkoKhC5iKoQ+dj6x9nY+seQ**1TAEAA**AAMAAA**8fRS6PSlR4m5aCJFd9PL+QOX4H1VpCMxrtCHPgYc7qm0haqg6h8/1QbZXMMsY1Osg74XPmPkCkq1uvPjrhRSGNQI/JQ0xwqTsIH18IzdOZMuvL1g/mnLt3/TPn2Yn69WIgbW2gz7Y1K1mxaHiWKJ8qw0msaTwKiHK0vLOMW7aCVsEE/ge+UUMzAvE60tlcdaOUjo+gBnrvCI3KQ5iK9jUQ2SfaaqUnolA4lyWUknBYkAMHfS4xtHla7Sy5c81bYtZNUADzA+Qa6N/P1+q8uNriXG1FuhoO0Odh8ObjkhV8rSdPkse8xy+GbI2wOHe4szSUHBMQzZSmkjwJ6NxsGKVgJtFVQplIrILf720ONTp88t1C9x/aulIxp+jidCWsADe8I9dP2bvPNZhJ3W4sVIHaXz+8xnIs8M7H31BSWrtlmznDbA24wKqSM9cfjs2qQ8LNpSMs8qFRl5JUGiyPW2RZYMgZRDwrScerDA1p+rvyVwy7wGkDfnV72W3U3LIi97QGzpb8JG188rJdvRScaQANAC/yhbmnBlOMBshTR+qEWrPdM1YglPzBYd6sOCa0i2G7/YoRabMPxywCJ3FFWzgoElM5kX3S/3hcMzxV1CsMWJwX4zndNQ4Nfam9vVY1Tq5KqBKU9LECb4GFWAVKNZO9ZOCxJwQZvNYHxPAW1hHRXHFgOAd0eG77gIPWgdCu+ZEa3pznvG9viCq7qOvHkzy11kMWGKCZqhAw/0CBCvX2foNr9bVE/q6C5o4aPRd6jr',

        params: {
            /*'CreateTimeFrom': CreateTimeFrom,
            'CreateTimeTo': CreateTimeTo,*/
            'ModTimeFrom': CreateTimeFrom,
            //'ModTimeTo': CreateTimeTo,
            'OrderStatus': 'All',
            'Pagination': {
                'EntriesPerPage': 100, //default 25... max 100
                'PageNumber': 1
            },
            'DetailLevel': 'ReturnAll',
            'ErrorLanguage': 'en_US',
            'WarningLevel': 'High'
        }
    }, function(error, results) {
        callback(results);
    });

};

/*ebaySeller.getOrders('2018-02-20T09:28:26.000Z','2018-03-10T09:28:26.000Z',function(response)
  {
      console.log('Inside Ebay Seller - caller method....');
      console.log(response);
      console.log('=========================================');
      console.log(JSON.stringify(response));
  });*/

/*ebaySeller.getItem = function(callback) {


    console.log('Inside get Item ...... local......');
    ebay.xmlRequest({
        serviceName: 'Trading',
        opType: 'GetItem',

        // app/environment
        devId: '5eb9f3d5-0989-4764-842e-19e43f050bbb',
        certId: 'SBX-132041a0f2e4-b7ae-4153-b55f-b349',
        appId: 'ScaleLab-ScaleLab-SBX-c132041a0-94ceac68',
        sandbox: true,

        // per user
        authToken: 'AgAAAA**AQAAAA**aAAAAA**tEthWg**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GmCJKHpgqdj6x9nY+seQ**+WcEAA**AAMAAA**FdxNbKuiTiZwxuJOdgZWlf/Uy/zJCKVQiz/BJTbYskrxPJQHBtVUqR9IhaX7O7fhWtTUfHGBs2aoGPqKrpZuW9Uj0n5Eq2v5AI077MAhJvYZYkf6mGKZwHlXlhfp8hbyTx/jP9mTlqo9lP0wC1tAMubHLg0UXCo3ciWgNZ51dRjt/WNrGzvItF69ruc+1XQQjJCvvruGyc8ZvPDA9E+meng6lHpKeeJvdKOvwxHFV+R0nSM19mpTfChDZRHmPoOZ92/pPw0Eq4tdZ3CaqpnNflBBKSIxfdCH7qmy5rhY1MVn8TOkn2n5jOcC/FIEE2ygij3EEn3XNSmhP546Fs2kkoXuRLCyxD3indgJyhnvuntUu8oJaJhlVdS46gVnJYSHrlwXl9xFFF64oPaHzG1ZHDUmY6k2bVKnknH8CTZi5olX4sxcyJbyM6R2Hk85EC+ZsAtoFCekxF2SLpmRqeVXuPmaFaAsuF4LvuXFVO/DXhzVdxrM5imOWEb5ZaENt8WL53qb1/38WDQ2ydNZCOmPXvl5h7g6snSFt3Qfyv0wMMKWG7sGxXfgnSMo33c6Mmt91XsH63j4YhGZRs3sRD75juFbo/oL/SNxvLpKlh83mjyqU2jl4k/8A7juaVgshXsLcNjEZ2fCns+2zDSxpqsiiphGUl99SgffkHQckPfbraswmaODUQrfeGSH49aFsElY0SztjPMpIJExZzF6T1NyY9g16YY+JKmXGsge2CZbeDZMJfIg9B02eGfvIFgNqntW',

        params: {
            'ItemID': 110255902092
        }
    }, function(error, results) {
        callback(results);
    });

};
*/
ebaySeller.addItem = function(requestParams, callback) {

    console.log('==================Inside add Item ...... local......==================');
    ebay.xmlRequest({
        serviceName: 'Trading',
        opType: 'AddItems',

        // app/environment
        /*devId: '56074bbe-0f5f-420e-b676-b963179896fa',
        certId: 'PRD-67ac8c8b6115-aac2-4ded-9adc-31b4',
        appId: 'NandanUp-testappl-PRD-667ac8c8b-41da7038',
        sandbox: false,

        // per user
        authToken: 'AgAAAA**AQAAAA**aAAAAA**tXIdWw**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6ADmYWjDJiLpA+dj6x9nY+seQ**WWEEAA**AAMAAA**DuzS44MHl9dQ0xSgvlbLEEGA9OMQ4pne7zcRuiJdw1UPQGR7p26ONWCWG358sbv8nHthyX3RWTyiLxPq3nlk7MjdNJH3rL6FXoHkWRLmcsLmx7eUuOEwK7udIaR8aIHe2ZsT17/9uU82jlx8KBpMdLCfs5T5JjWUZUMQKo8C8CT34zs7IYRubs8OWw4qrNNiSCc+aGnDOvErt+fyJ60hNkEDyPtCL+5+n67ONQj6wf2oD388wg1TjXYx0iBaDOfZZCkdY31dpSaamJmtEgT0aSCpRORDYg94Ptgie1U5PPl5ewbgzTCf2jhIrGxA1fcJyxBU3g+vXm7BQehi2HWc80SQLhXkxXdLf27QEXxuBjmCKCEO2gYhBlYXjuHkKTNphN9Nl5tauqHa9fH0J4E2wsS7TaaoRDVn3vJXnXdshGSbtZQYgnQYtQ9kt7T/6Pol8hmH91SmOziePkxyoiiOFYV8nR7vDsQVl2KHXglyJMDlFszM+5FlW6J7T58Gdxiw1hXfKAuezCX6sW0YgyUNDDTIjY8HxBjnec/IYGUNLyD3Xkc0JBbZpAA5L6eVd0bFe5hY52GZz0k7DTct9/GcWJSn22CNUJSUl3T0LXtAAAx7CmpxF4rsRQN4G2IvE6m8PyfFiDW7chM+6xCA7yGtjRh0zL2agQu8ZXXZOkzaln4jmU+2N/rFP0xGpRlTFoH/X0kmtAcqzCF3voTPHuypfa0FNm/QLPPPXpC+bgW9AsDdV8fo2PYCWqcu3xP7LylL',*/
	devId: '5eb9f3d5-0989-4764-842e-19e43f050bbb',
	certId: 'PRD-5d8a3c478077-9147-486c-a3df-7281',
	appId: 'ScaleLab-ScaleLab-PRD-15d8a3c47-16a25d0d',
	sandbox: false,
        authToken: 'AgAAAA**AQAAAA**aAAAAA**neikWg**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6ADkoKhC5iKoQ+dj6x9nY+seQ**1TAEAA**AAMAAA**8fRS6PSlR4m5aCJFd9PL+QOX4H1VpCMxrtCHPgYc7qm0haqg6h8/1QbZXMMsY1Osg74XPmPkCkq1uvPjrhRSGNQI/JQ0xwqTsIH18IzdOZMuvL1g/mnLt3/TPn2Yn69WIgbW2gz7Y1K1mxaHiWKJ8qw0msaTwKiHK0vLOMW7aCVsEE/ge+UUMzAvE60tlcdaOUjo+gBnrvCI3KQ5iK9jUQ2SfaaqUnolA4lyWUknBYkAMHfS4xtHla7Sy5c81bYtZNUADzA+Qa6N/P1+q8uNriXG1FuhoO0Odh8ObjkhV8rSdPkse8xy+GbI2wOHe4szSUHBMQzZSmkjwJ6NxsGKVgJtFVQplIrILf720ONTp88t1C9x/aulIxp+jidCWsADe8I9dP2bvPNZhJ3W4sVIHaXz+8xnIs8M7H31BSWrtlmznDbA24wKqSM9cfjs2qQ8LNpSMs8qFRl5JUGiyPW2RZYMgZRDwrScerDA1p+rvyVwy7wGkDfnV72W3U3LIi97QGzpb8JG188rJdvRScaQANAC/yhbmnBlOMBshTR+qEWrPdM1YglPzBYd6sOCa0i2G7/YoRabMPxywCJ3FFWzgoElM5kX3S/3hcMzxV1CsMWJwX4zndNQ4Nfam9vVY1Tq5KqBKU9LECb4GFWAVKNZO9ZOCxJwQZvNYHxPAW1hHRXHFgOAd0eG77gIPWgdCu+ZEa3pznvG9viCq7qOvHkzy11kMWGKCZqhAw/0CBCvX2foNr9bVE/q6C5o4aPRd6jr',
        params: requestParams,
    }, function(error, results) {
        callback(results);
    });

};
/*
var requestParams = {

    "ErrorLanguage": "en_US",
    "WarningLevel": "High",
    "Item": {
        "Title": "Harry Potter and the Philosopher's Stone",
        "Description": "This is the first book in the Harry Potter series. In excellent condition!",
        "PrimaryCategory": {
            "CategoryID": "377"
        },
        "StartPrice": "1.0",
        "CategoryMappingAllowed": "true",
        "Country": "US",
        "Currency": "USD",
        "ConditionID": "1000",
        "DispatchTimeMax": "3",
        "ListingDuration": "Days_7",
        "ListingType": "Chinese",
        "PaymentMethods": "PayPal",
        "PayPalEmailAddress": "scalelabs02-facilitator@gmail.com",
        "PictureDetails": {
            "PictureURL": "http://pics.ebay.com/aw/pics/dot_clear.gif"
        },
        "PostalCode": "95125",
        "Quantity": "1",
        "ReturnPolicy": {
            "ReturnsAcceptedOption": "ReturnsAccepted",
            "RefundOption": "MoneyBack",
            "ReturnsWithinOption": "Days_30",
            "Description": "If you are not satisfied, return the book for refund.",
            "ShippingCostPaidByOption": "Buyer"
        },
        "ShippingDetails": {
            "ShippingType": "Flat",
            "ShippingServiceOptions": {
                "ShippingServicePriority": "1",
                "ShippingService": "USPSMedia",
                "ShippingServiceCost": "2.50"
            }
        },
        "Site": "US"
    }
};
var bulkRequest = {
    "ErrorLanguage": "en_US",
    "WarningLevel": "High",
    "AddItemRequestContainer": [{
            "MessageID": "1",
            "Item": {
                "CategoryMappingAllowed": "true",
                "Country": "US",
                "Currency": "USD",
                "DispatchTimeMax": "3",
                "ListingDuration": "Days_7",
                "ListingType": "Chinese",
                "PaymentMethods": "PayPal",
                "PayPalEmailAddress": "scalelabs02-facilitator@gmail.com",
                "PictureDetails": {
                    "GalleryType": "Gallery",
                    "GalleryURL": "http://i16.ebayimg.com/01/c/03/c2/9d/d5_6.JPG",
                    "PictureURL": [
                        "http://i16.ebayimg.com/01/c/03/c2/9d/d5_7.JPG",
                        "http://i8.ebayimg.com/04/c/05/a7/ca/f2_7.JPG"
                    ]
                },
                "PostalCode": "95125",
                "PrimaryCategory": {
                    "CategoryID": "377"
                },
                "Quantity": "1",
                "ReturnPolicy": {
                    "ReturnsAcceptedOption": "ReturnsAccepted",
                    "RefundOption": "MoneyBack",
                    "ReturnsWithinOption": "Days_30",
                    "Description": "Text description of return policy details",
                    "ShippingCostPaidByOption": "Buyer"
                },
                "ShippingDetails": {
                    "ShippingType": "Flat",
                    "ShippingServiceOptions": {
                        "ShippingServicePriority": "1",
                        "ShippingService": "USPSMedia",
                        "ShippingServiceCost": "2.50"
                    }
                },
                "Site": "US",
                "StartPrice": "0.19",
                "Title": "Harry Potter and the Goblet of Fire",
                "UUID": "cbefc1e08af811d2dad80800200c9a68"
            }
        },
        {
            "MessageID": "2",
            "Item": {
                "CategoryMappingAllowed": "true",
                "Country": "US",
                "Currency": "USD",
                "Description": "This is t Potter series. In excellent condition!",
                "DispatchTimeMax": "3",
                "ListingDuration": "Days_7",
                "ListingType": "Chinese",
                "PaymentMethods": "PayPal",
                "PayPalEmailAddress": "scalelabs02-facilitator@gmail.com",
                "PictureDetails": {
                    "GalleryType": "Gallery",
                    "GalleryURL": "http://i16.ebayimg.com/01/c/03/c2/9d/d5_6.JPG",
                    "PictureURL": [
                        "http://i16.ebayimg.com/01/c/03/c2/9d/d5_7.JPG",
                        "http://i8.ebayimg.com/04/c/05/a7/ca/f2_7.JPG"
                    ]
                },
                "PostalCode": "95125",
                "PrimaryCategory": {
                    "CategoryID": "377"
                },
                "Quantity": "1",
                "ReturnPolicy": {
                    "ReturnsAcceptedOption": "ReturnsAccepted",
                    "RefundOption": "MoneyBack",
                    "ReturnsWithinOption": "Days_30",
                    "Description": "Text description of return policy details",
                    "ShippingCostPaidByOption": "Buyer"
                },
                "ShippingDetails": {
                    "ShippingType": "Flat",
                    "ShippingServiceOptions": {
                        "ShippingServicePriority": "1",
                        "ShippingService": "USPSMedia",
                        "ShippingServiceCost": "2.50"
                    }
                },
                "Site": "US",
                "StartPrice": "0.99",
                "Title": "Harry Potter and the Prisoner of Azkaban",
                "UUID": "44efc1e08ac71c1dad7c0800200c9af8"
            }
        }
    ]
};
*/
var bulkRequest = {
    "ErrorLanguage": "en_US",
    "WarningLevel": "High",
    "AddItemRequestContainer": [
      {
        "MessageID": "1",
        "Item": {
          "Title": "Harry Potter and the Goblet of Fire",
           "Description": "This is the first book in the Harry Potter series. In excellent condition!",
          "PrimaryCategory": { "CategoryID": "279" },
          "CategoryMappingAllowed": "true",
          "ConditionID": "1000",
          "Site": "US",
          "Quantity": "1",
          "StartPrice": "1.0",
          "ListingDuration": "Days_7",
          "ListingType": "Chinese",
          "DispatchTimeMax": "3",
          "ShippingDetails": {
            "ShippingType": "Flat",
            "ShippingServiceOptions": {
              "ShippingServicePriority": "1",
              "ShippingService": "USPSMedia",
              "ShippingServiceCost": "2.50"
            }
          },
          "ReturnPolicy": {
            "ReturnsAcceptedOption": "ReturnsAccepted",
            "RefundOption": "MoneyBack",
            "ReturnsWithinOption": "Days_30",
            "Description": "Text description of return policy details",
            "ShippingCostPaidByOption": "Buyer"
          },
          "Country": "US",
          "Currency": "USD",
          "PostalCode": "95125",
          "PaymentMethods": "PayPal",
          "PayPalEmailAddress": "scalelabs02-facilitator@gmail.com",
          "PictureDetails": { "PictureURL": "http://thumbs.ebaystatic.com/pict/41007087008080_0.jpg" }
        }
      },
      {
        "MessageID": "2",
        "Item": {
          "Title": "Harry Potter and the Goblet of Fire",
          "Description": "This the Harry Potter series. In excellent condition!",
          "PrimaryCategory": { "CategoryID": "279" },
          "CategoryMappingAllowed": "true",
          "ConditionID": "1000",
          "Site": "US",
          "Quantity": "1",
          "StartPrice": "1.0",
          "ListingDuration": "Days_7",
          "ListingType": "Chinese",
          "DispatchTimeMax": "3",
          "ShippingDetails": {
            "ShippingType": "Flat",
            "ShippingServiceOptions": {
              "ShippingServicePriority": "1",
              "ShippingService": "USPSMedia",
              "ShippingServiceCost": "2.50"
            }
          },
          "ReturnPolicy": {
            "ReturnsAcceptedOption": "ReturnsAccepted",
            "RefundOption": "MoneyBack",
            "ReturnsWithinOption": "Days_30",
            "Description": "Text description of return policy details",
            "ShippingCostPaidByOption": "Buyer"
          },
          "Country": "US",
          "Currency": "USD",
          "PostalCode": "95125",
          "PaymentMethods": "PayPal",
          "PayPalEmailAddress": "scalelabs02-facilitator@gmail.com",
          "PictureDetails": { "PictureURL": "http://thumbs.ebaystatic.com/pict/41007087008080_0.jpg" }
        }
      }
    ]
  };
ebaySeller.addItem(bulkRequest, function(response) {

    console.log('Inside Ebay Seller AddItem')
    console.log(response);
    console.log('=========================================');
    console.log('=========================================');
    JSON.stringify(response);
});
