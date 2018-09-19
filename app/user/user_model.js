/*jslint node: true */
'use strict';
var userDB = {};
var config = require('../../config/config');
var mysql_db = require('../../db/mysql_db');
var query_config = require('../../config/query_config');
var logger = config.logger;
var async = require('async');
var _ = require('lodash');
var mysqldb = require('mysql');

var con = mysqldb.createConnection({
        host: "scalelabsdevdb.cababjt98r5d.us-east-1.rds.amazonaws.com",
        user: "scaleLabsDevDB",
        password: "scaleLabsDevDB",
	database : 'my_db'
});

userDB.authenticateUser = function(apiname, userName, password, modelCallback) {
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
	logger.info(userName+ ":user_model:authenticateUser:" + apiname + ":Enter:"+userName+":");
			con.query(query_config.COMMON.VALIDATE_USER_CREDENTIALS,[userName,password],function (err, result) {
			//con.query(query_config.COMMON.VALIDATE_USER_CREDENTIALS,function (err, result) {
			if (err){
				logger.error(userName + ':user_model:authenticateUser:' + apiname + ':Error:' + err);
				failureResponse.errorMsg = "DB_ERROR_TO_FETCH_USERDETAILS";
				modelCallback(failureResponse);
			}
			else
			{
				logger.info(userName + ':user_model:authenticateUser:' + apiname + 'result:',result);
				if (result && result.length > 0) {
					sucessResponse.response.groupName=result[0].GROUP_NAME;
                                        modelCallback(sucessResponse);
				}
				else
				{
					failureResponse.errorMsg="User Validation Failed";
					modelCallback(failureResponse);
				}
			}
			});
		//}
	//});
};

userDB.deleteUser = function(apiname, userName, modelCallback) {
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
        logger.info(userName+ ":user_model:deleteUser:" + apiname + ":Enter:"+userName+":");
	con.query(query_config.COMMON.DELETE_USER,[userName],function (err, result) {
		if (err){
			logger.error(userName + ':user_model:deleteUser:' + apiname + ':Error:' + err);
			failureResponse.errorMsg = "DB_ERROR_TO_UPDATE";
			modelCallback(failureResponse);
		}
		else
		{
			logger.info(userName + ':user_model:deleteUser:' + apiname + 'result:',result);
			modelCallback(sucessResponse);
		}
	});
};

userDB.createUser = function(apiname, userName,newPassword,groupName,modelCallback) {
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
	logger.info(userName+ ":user_model:createUser:" + apiname + ":Enter:"+userName+":");
	con.query(query_config.COMMON.CREATE_USER,[userName,newPassword,groupName],function (err, result) {
                if (err){
                        logger.error(userName + ':user_model:createUser:' + apiname + ':Error:' + err);
                        failureResponse.errorMsg = "DB_ERROR_TO_INSERT";
                        modelCallback(failureResponse);
                }
                else
                {
                        logger.info(userName + ':user_model:createUser:' + apiname + 'result:',result);
                        modelCallback(sucessResponse);
                }
        });
};
	

module.exports = userDB;
