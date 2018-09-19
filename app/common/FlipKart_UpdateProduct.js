'use strict';
var flipKartUpdateProduct = {};
var request = require("request");
var express = require("express");
var app = express();
var config = require('../../config/config');
var Application_Id = '17155a8ab3515699927720a4088455327b168';
var Application_Secret = '3b7ab88aa6736c52521755986c1ebde17';
var logger = config.logger;

flipKartUpdateProduct.updateOrder = function(token, request, responseCallback) {
    var failureResponse = {
        "responseCode": -1,
        "response": {},
        "errorMsg": "Issue with nextURL"
    };

    var successResponse = {
        "responseCode": 0,
        "response": "",
        "errorMsg": ""
    };

    //Uncomment this when all the required fields are available in DB
    /*var bodyy = {
        request.sellerSku: {
            "product_id": "<product-id>", //Need to add this field in DB
            "price": {
                "mrp": 0, //Need to add this field in DB
                "selling_price": request.price,
                "currency": "INR"
            },
            "tax": {//Need to add this field in DB
                "hsn": "<harmonized-system-nomenclature>",
                "tax_code": "<tax-code to determine goods-service-tax>"
            },
            "listing_status": "ACTIVE|INACTIVE",//Need to add this field in DB
            "shipping_fees": {
                "local": 0,//Need to add this field in DB
                "zonal": 0,//Need to add this field in DB
                "national": 0,//Need to add this field in DB
                "currency": "INR"
            },
            "fulfillment_profile": "NON_FBF|FBF_LITE|FBF",
            "fulfillment": {
                "dispatch_sla": 1,
                "shipping_provider": "FLIPKART|SELLER|FLIPKART_SELLER",
                "procurement_type": "REGULAR|EXPRESS|INTERNATIONAL|MADE_TO_ORDER|DOMESTIC"
            },
            "packages": [{
                "id": "<flipkart-system-id>",
                "name": "<package-identifier>",
                "dimensions": {
                    "length": 1,
                    "breadth": 1,
                    "height": 1
                },
                "weight": 1,
                "description": "",
                "handling": {
                    "fragile": true
                },
                "notional_value": {
                    "amount": 1,
                    "unit": "PERCENTAGE|<CURRENCY>"
                }
            }],
            "locations": [{
                "id": "<location-id>",
                "status": "ENABLED|DISABLED",
                "inventory": 0
            }],
            "address_label": {
                "manufacturer_details": [
                    "<address_of_manufacturer>"
                ],
                "importer_details": [
                    "<address_of_importer>"
                ],
                "packer_details": [
                    "<address_of_packer>"
                ],
                "countries_of_origin": [
                    "<iso_alpha2_code_of_country_of_origin>"
                ]
            },
            "dating_label": {
                "mfg_date": "<Manufacturing date of the product in linux EPOCH (Seconds)>",
                "shelf_life": "<Shelf life of the product in Seconds>"
            }
        }
    };*/

    //Below xml is to update Price & Quantity only
    var bodyy = {
        request.sellerSku: {
            "product_id": "CTHF7FW4JKH9Q29M",
            "price": {
                //"mrp": 500,
                "selling_price": request.price,
                "currency": "INR"
            },
            "locations": [{
                //"id": "LOC8bdd7abceca4423a839d935584ee6f19",
                "inventory": request.quantity
            }]
        }
    }

    //Update product listings in Flipkart’s Marketplace.
    request.post({
            url: "https://api.flipkart.net/sellers/listings/v3/update",
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

}

module.exports = flipKartUpdateProduct;