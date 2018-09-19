/*jslint node: true */
"use strict";
/**
 * Module dependencies.
 */

var fs = require('fs'),
    path = require('path'),
    config = require('../config/config');

/**
 * Common variables.
 */

var DEFAULT_LOCALE = config.i18n.DEFAULT_LOCALE,
    i18n_PATH = path.join(config.WEBAPP.PUBLIC_DIRECTORY, 'i18n'),
    LANGUAGES = {};

/**
 * Recursively require all files in `i18n_PATH`.
 * This is so that requiring all language files is a 1-time thing in the app's lifecycle.
 */

fs.readdirSync(i18n_PATH).forEach(function(file) {
    LANGUAGES[file.replace('.json', '')] = require(path.join(i18n_PATH, file));
});

/**
 * Helper functions.
 */

/**
 * Fetches appropriate string for locale.
 * If locale is invalid, returns string from `config.i18n.DEFAULT_LOCALE`.
 * 
 * @param {String} locale in `ab-CD` format.
 * @param {String} String key.
 * @return {String} Localized string.
 */

function getString(locale, stringKey) {
    if (!LANGUAGES[locale]) {
        locale = DEFAULT_LOCALE;
    }
    var msg=LANGUAGES[locale][stringKey];
    if(!msg){
        msg=stringKey;
    }
    return msg;
}

/**
 * Module exports.
 */

module.exports = {
    i18n_path: i18n_PATH,
    languages: LANGUAGES,
    getString: getString
};

