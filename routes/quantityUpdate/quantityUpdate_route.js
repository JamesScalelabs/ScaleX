/*jslint node: true */
'use strict';
var express = require('express');
var quantityUpdateRoute = express.Router();
var config = require('../../config/config');
var api = require('../../lib/api');
var quantityUpdateWorkflow = require('../../app/quantityUpdate/quantity_update_workflow');
var logger = config.logger;

quantityUpdateRoute.post('/quantityUpdate',function(req,res){
var sucessResponse = {
   "responseCode": 0,
   "response": {},
   "errorMsg": ""
    };

logger.info(req.body.userName + ":quantityUpdateRoute:quantityUpdateRoute:" + req.headers.apiname + ":Request Received:",req.body);
quantityUpdateWorkflow.
});