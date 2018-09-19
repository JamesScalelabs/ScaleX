/*jslint node: true */
"use strict";
/**
 * Module dependencies.
 */
var i18n = require('./i18n');
var api = {};

var chance = require('chance').Chance();

/**
 * Global variables.
 */

var Status = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNSUPPORTED_ACTION: 405,
    VALIDATION_FAILED: 422,
    SERVER_ERROR: 500
};
/**
 * Helper functions.
 */
function jsonResponse(res, body, options) {
    options = options || {};
    options.status = options.status || Status.OK;
    res.status(options.status).json(body || null);
}



api.generateOperatorTCN = function() {
    return chance.string({
        length: 8,
        pool: '0123456789ABCDEF'
    }) + '-' + chance.string({
        length: 4,
        pool: '0123456789ABCDEF'
    }) + '-' + chance.string({
        length: 4,
        pool: '0123456789ABCDEF'
    }) + '-' + chance.string({
        length: 4,
        pool: '0123456789ABCDEF'
    }) + '-' + chance.string({
        length: 12,
        pool: '0123456789ABCDEF'
    });
};


api.translate = function(locale, code) {
    return i18n.getString(locale, code);
};
api.ok = function(req, res, data) {
    jsonResponse(res, data, {
        status: Status.OK
    });
};
api.badRequest = function(req, res, data) {
    jsonResponse(res, data, {
        status: Status.BAD_REQUEST
    });
};
api.unauthorized = function(req, res, data) {
    jsonResponse(res, data, {
        status: Status.UNAUTHORIZED
    });
};
api.forbidden = function(req, res, data) {
    jsonResponse(res, data, {
        status: Status.FORBIDDEN
    });
};
api.notFound = function(req, res, data) {
    jsonResponse(res, data, {
        status: Status.NOT_FOUND
    });
};
api.unsupportedAction = function(req, res, data) {
    jsonResponse(res, data, {
        status: Status.UNSUPPORTED_ACTION
    });
};
api.invalid = function(req, res, data) {
    jsonResponse(res, data, {
        status: Status.VALIDATION_FAILED
    });
};
api.serverError = function(req, res, data) {
    jsonResponse(res, data, {
        status: Status.SERVER_ERROR
    });
};
/**
 * Module exports.
 */
module.exports = api;
