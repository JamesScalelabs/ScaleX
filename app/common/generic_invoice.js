'use strict';
var generic_invoice = {};
var config = require('../../config/config');
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
var crypto = require('crypto');
var algorithm = 'sha256';
var commonService = require('./common_service');
var common_model = require('./common_model');
//var base64 = require('file-base64');
var htmlToPdf = require('html-to-pdf');
var fs = require("fs");
var contents = fs.readFileSync('./config/appkey_config.js', 'utf8');
var PDFParser = require("pdf2json");
var dateFormat = require("dateformat");
var converter = require('number-to-words');

var soap = require('strong-soap').soap;
var express = require("express");
var app = express();

generic_invoice.getInvoice = function(apiname, lang, locale, request, responseCallback) {
    logger.info(apiname + ":Under generic_invoice");
    var failureResponse = {
        "responseCode": -1,
        "response": "",
        "errorMsg": "DB_ERROR"
    };
    var successResponse = {
        "responseCode": 0,
        "response": {},
        "errorMsg": ""
    };

    //common_model.getInvoiceDetails('apiname', 'userName', '105-6613991-9075453', function(getInvoiceDetailsResponse) {
    common_model.getInvoiceDetails('getInvoice',request.userName,request.id, function(getInvoiceDetailsResponse) {
        if (getInvoiceDetailsResponse.responseCode === 0) {
            var b = new Buffer(fs.readFileSync('/projects/veeresh/scaleslabs/downloads/InvoiceTemplet.html', 'utf8'));
            var html = b.toString();
            html = html.replace('&_BankName', '');
            var address = getInvoiceDetailsResponse.response.invoiceDetails[0].ADDRESS_BILLING;
            address = JSON.parse(address);
            var invoice_Number = getInvoiceDetailsResponse.response.invoiceDetails[0].ORDER_ID;
            var Dated = dateFormat(getInvoiceDetailsResponse.response.invoiceDetails[0].CREATED_AT, "yyyy-mm-dd");
            var Total_Sum_RoundOff = getInvoiceDetailsResponse.response.invoiceDetails[0].PRICE; //Should be the sum of all items
            var AmountInWords = converter.toWords(getInvoiceDetailsResponse.response.invoiceDetails[0].PRICE) + ' only';
            logger.info("AmountInWords---- ", AmountInWords);

            var totalItems = getInvoiceDetailsResponse.response.totalItems;
            var itemeTemplet = '<tr> <td style="border-left: 1px solid #000000;" align="center" valign="middle" bgcolor="#FFFFFF">&_SlNo</td> <td style="border-left: 1px solid #000000;" align="center" valign="middle" bgcolor="#FFFFFF">&_goodsDescription</td> <td style="border-left: 1px solid #000000;" align="center" valign="middle" bgcolor="#FFFFFF"><br></td> <td style="border-left: 1px solid #000000;" align="center" valign="middle" bgcolor="#FFFFFF">&_QTY</td> <td style="border-left: 1px solid #000000;" align="center" valign="middle" bgcolor="#FFFFFF">PCS</td> <td style="border-left: 1px solid #000000;" align="center" valign="middle" bgcolor="#FFFFFF">&_RatePerUnit</td> <td style="border-left: 1px solid #000000;" align="center" valign="middle" bgcolor="#FFFFFF">&_IGST</td> <td style="border-left: 1px solid #000000; border-right: 1px solid #000000;" align="center" valign="middle" bgcolor="#FFFFFF">&_RatePerUnit</td> </tr><tr> <td style="border-left: 1px solid #000000;" align="center" valign="middle" bgcolor="#FFFFFF"><br></td> <td style="border-left: 1px solid #000000;" align="center" valign="middle" bgcolor="#FFFFFF"><br></td> <td style="border-left: 1px solid #000000;" align="center" valign="middle" bgcolor="#FFFFFF"><br></td> <td style="border-left: 1px solid #000000;" align="center" valign="middle" bgcolor="#FFFFFF"><br></td> <td style="border-left: 1px solid #000000;" align="center" valign="middle" bgcolor="#FFFFFF"><br></td> <td style="border-left: 1px solid #000000;" align="center" valign="middle" bgcolor="#FFFFFF"><br></td> <td style="border-left: 1px solid #000000;" align="center" valign="middle" bgcolor="#FFFFFF"><br></td> <td style="border-left: 1px solid #000000; border-right: 1px solid #000000;" align="center" valign="middle" bgcolor="#FFFFFF"><br></td> </tr>';
            var itemsList = '';

            html = html.replace(/&_Address/g, address.name + '<br>' + address.addressLine1 + '<br>' + address.city + '<br>' + address.stateOrRegion + ' ' + address.postalCode + '<br>' + address.countryCode).
            replace(/&_OrderNumber/g, invoice_Number).
            replace('&_Dated', Dated).
            replace('&_TotalAmount', Total_Sum_RoundOff).
            replace('&_AmountInWords', AmountInWords);


            for (var i = 0; i < totalItems; i++) {
                itemsList = itemsList.concat(itemeTemplet).replace('&_SlNo', i + 1).replace('&_goodsDescription', getInvoiceDetailsResponse.response.invoiceDetails[i].PRODUCT_NAME).
                replace('&_QTY', getInvoiceDetailsResponse.response.invoiceDetails[i].ITEM_COUNT).
                replace(/&_RatePerUnit/g, getInvoiceDetailsResponse.response.invoiceDetails[i].ITEM_PRICE).
                replace('&_IGST', '');
                //itemsList = itemsList.replace('&_SlNo', i+2);
                //goodsDescription, QTY, Rate Per Unit, IGST Per Unit, Total Amount, 
            }
            html = html.replace('&_DescriptionLoop', itemsList);

            /*var pdfParser = new PDFParser();
            pdfParser.loadPDF('/projects/veeresh/scaleslabs/downloads/TestInvoiceTemplet.pdf');
            pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
            pdfParser.on("pdfParser_dataReady", pdfData => {
                logger.info("Success----");
                fs.writeFile("/projects/veeresh/scaleslabs/downloads/TestInvoiceTemplet.json", JSON.stringify(pdfData));
            });*/

            //htmlToPdf.convertHTMLString(html, '/projects/veeresh/scaleslabs/downloads/Invoice_'+invoice_Number+'.pdf',
		logger.info("html : ",html);
            htmlToPdf.convertHTMLString(html, '/projects/rakesh/scaleslabs/invoice/'+request.id+'.pdf',
                function(error, success) {
                    if (error) {
                        logger.info('Invoice Could Not Be Generated');
                        logger.info(error);
			responseCallback(failureResponse);
                    } else {
                        logger.info('Invoice Generated Under /projects/rakesh/scaleslabs/invoice/'+request.id+'.pdf');
                        logger.info(success);
			responseCallback(successResponse);
                    }
                }
            );
        } else {
            logger.info("Error ", getInvoiceDetailsResponse.errorMsg);
            responseCallback(failureResponse);
        }
    });




    /*htmlToPdf.convertHTMLFile('/projects/veeresh/scaleslabs/downloads/InvoiceTemplet.html', '/projects/veeresh/scaleslabs/downloads/InvoiceTemplet.pdf',
        function(error, success) {
            if (error) {
                console.log('Oh noes! Errorz!');
                console.log(error);
            } else {
                console.log('Woot! Success!');
                console.log(success);
            }
        }
    );*/


}

module.exports = generic_invoice;
