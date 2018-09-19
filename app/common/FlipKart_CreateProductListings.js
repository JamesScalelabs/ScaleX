'use strict';
var request = require("request");
var express = require("express");
var app = express();

var Application_Id = '17155a8ab3515699927720a4088455327b168';
var Application_Secret = '3b7ab88aa6736c52521755986c1ebde17';

var bodyy = {
    "SH1-TESTGREY-Full": {
        "product_id": "KTBF5GF4SN6YM6FZ",
        "price": {
            "mrp": 1249,
            "selling_price": 1000,
            "currency": "INR"
        },
        "tax": {
            "hsn": "34060010",
            "tax_code": "GST_12"
        },
        "listing_status": "INACTIVE",
        "shipping_fees": {
            "local": 0,
            "zonal": 0,
            "national": 0,
            "currency": "INR"
        },
        "fulfillment_profile": "NON_FBF",
        "fulfillment": {
            "dispatch_sla": 1,
            "shipping_provider": "FLIPKART",
            "procurement_type": "REGULAR"
        },
        "packages": [{
            "name": "SH1-TESTGREY-Full",
            "dimensions": {
                "length": 11,
                "breadth": 8,
                "height": 9
            },
            "weight": 2,
            "description": "Skycandle Solid Men's Polo Neck White T-Shirt Testing",
            "handling": {
                "fragile": false
            },
            "notional_value": {
                "amount": 100,
                "unit": "PERCENTAGE"
            }
        }],
        "locations": [{
            "id": "LOC8bdd7abceca4423a839d935584ee6f19",
            "status": "ENABLED",
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
};

//Create product listings in Flipkart’s Marketplace.
/*This call creates new listings against the specified SKUs. If the SKU already exists
in the system, then this call will overwrite the listing information associated with
it. The rules for listing a product in the marketplace are subject to change, so it
is recommended to handle errors explicitly. It is also recommended to call upon the
validate API (to be announced) prior to making this call.*/
request.post({
        url: "https://api.flipkart.net/sellers/listings/v3",
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