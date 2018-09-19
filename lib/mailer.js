/*jslint node: true */
'use strict';
var config = require('../config/config');
var mailer = require('nodemailer');
//var nunjucks = require('nunjucks');
//var moment = require('moment');
//var api = require('../lib/api');
//var mailer = require('../lib/mailer');

//var fs = require('fs');



var transporter = mailer.createTransport(config.MAIL);

/**
 * Utility to send mails
 * @param  {String} to         
 * @param  {String} cc         
 * @param  {String} bcc        
 * @param  {String} subject    
 * @param  {HTML} body       
 * @param  {String} priority   'high', 'normal' (default) or 'low'
 * @param  {Array of file paths} attachment
 * @return {Int}  0 for error, 1 for success
 */
function send (to, cc, bcc, subject, body) {
    var mailOptions = {
        from: config.MAIL.DEFAULT_SENDER,
        to: to,
        cc: cc,
        bcc: bcc,
        subject: subject,
        html: body
    };
    transporter.sendMail(mailOptions, function(err, info) {
        
        if (err) {
            console.log("MAIL NOT SENT");
        } else {
            console.log("MAIL SENT");
        }
    });
}

function sendMailReport(to, cc, bcc, user, description){
    var subject = 'User Registration';

    var body = 'User Name : ' + user + '</b><br>' + 'Password : ' + description;
    
    send(to, cc, bcc, subject, body);
}

module.exports = {
    sendMailReport : sendMailReport

};
