'use strict';
var request = require("request");
var jsonxml = require('jsontoxml');
//var XLSX = require('xlsx');
//var excel = require('excel4node');
var Excel = require('exceljs');
var commonService=require('./app/common/common_service');

console.log("====================creating the excel file for edit product====================");
/*var workbook = new excel.Workbook();
var worksheet = workbook.addWorksheet('Sheet 1');
worksheet.cell(1,1).number(100);
worksheet.cell(2,1).string('string_2');
workbook.write('Excel.xlsx');*/
var con = mysqldb.createConnection({
        host: "scalelabsdevdb.cababjt98r5d.us-east-1.rds.amazonaws.com",
        user: "scaleLabsDevDB",
        password: "scaleLabsDevDB",
        database : 'my_db'
});

var workbook = new Excel.Workbook();
var productId="9";
workbook.xlsx.readFile('/projects/rakesh/scaleslabs/templates/Catalog_Template_Edit_1.xlsx').then(function() {
	commonService.getProductInfo("apiName","testScript",productId,function(response) {

	});
	var worksheet = workbook.getWorksheet(1);
	var row = worksheet.getRow(5);
	row.getCell(1).value = 5;
	row.commit();
	workbook.xlsx.writeFile('new.xlsx');
});
