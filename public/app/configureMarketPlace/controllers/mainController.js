angular.module('SLModule.configMarketPlace')

.controller('ConfigMarketPlaceController',["$scope","$window","ConfigMarketPlaceService","slDashboardConfig","localStorageService","SharedService",
	function($scope,$window,ConfigMarketPlaceService,slDashboardConfig,localStorageService,SharedService){ 
	console.log('ConfigMarketPlaceController'); 

        $scope.alerts = {
            "alert": false,
            "type": "",
            "msg": ""
        };
        $scope.addAlerts = {
            "alert": false,
            "type": "",
            "msg": ""
        };
        $scope.updateAlerts = {
            "alert": false,
            "type": "",
            "msg": ""
        };
        $scope.delAlerts = {
            "alert": false,
            "type": "",
            "msg": ""
        };

        $scope.closeAlert = function() {
            $scope.alerts.alert = false;
        };
        $scope.closeAddAlert = function() {
            $scope.addAlerts.alert = false;
        };
        $scope.closeUpdateAlert = function() {
            $scope.updateAlerts.alert = false;
        };
        $scope.closeDelAlert = function() {
            $scope.delAlerts.alert = false;
        };

        $scope.updatedTime=new Date();
        adminUser = localStorageService.get('userData').userName; 

        $scope.availableMP = [];

        $scope.enableAddButton=function(){
            $scope.disableAddButton = false;
        };
        $scope.enableUpdateButton=function(){
            $scope.disableUpdateButton = false;
        };
        $scope.enableDelButton = function(){
            $scope.disableDelButton = false;
        };

        $scope.clearData = function(){

            $scope.createMPRequest = {
                "userName":adminUser,
                "marketPlace": {
                    "marketPlace" : "",
                    "newCatEPR" :"",
                    "updateCatEPR":"",
                    "updatePriceEPR" : "",
                    "newCatLoc":"",
                    "updateCatLoc":"",
                    "updatePriceLoc":"",
                    "getOrderEPR":""
                 }
            };

        };


    $scope.createMP = function(){
        $scope.onCreate = true;        
        console.log('Inside Create Market Place....MarketPlace Details to be Added',$scope.createMPRequest);
        ConfigMarketPlaceService.createMP($scope.createMPRequest).success(function(result) {
                if (result.responseCode === 0) {  
                        $scope.onCreate = false; 
                        $scope.alerts.alert = true;
                        $scope.alerts.type = 'info';
                        $scope.alerts.msg = "Market Place Added Successfully" ;   
                        $('#addMP').modal('hide');

                        initPage();

                  }
                    else {
                    $scope.onCreate = false;
                    $scope.addAlerts.alert = true;
                    $scope.addAlerts.type = 'danger';
                    $scope.addAlerts.msg = result.errorMsg;
                }
            }).
            error(function(data, status, headers, config) {
                $scope.onCreate = false;
                $scope.addAlerts.alert = true;
                $scope.addAlerts.type = 'danger';
                $scope.addAlerts.msg = SharedService.getErrorMessage(status);
            });
    };
    $scope.updateMP = function(){
        var updateMPRequest = {
            "userName":adminUser,
            "marketPlace": {
                "marketPlace" : $scope.mpToBeChanged.marketPlace,
                "newCatEPR" :$scope.mpToBeChanged.newCatEPR,
                "updateCatEPR":$scope.mpToBeChanged.updateCatEPR,
                "updatePriceEPR" : $scope.mpToBeChanged.updatePriceEPR,
                "newCatLoc":$scope.mpToBeChanged.newCatLoc,
                "updateCatLoc":$scope.mpToBeChanged.updateCatLoc,
                "updatePriceLoc":$scope.mpToBeChanged.updatePriceLoc,
                "getOrderEPR":$scope.mpToBeChanged.getOrderEPR,
                "status":$scope.mpToBeChanged.status,
             }
        };

        $scope.updateAlerts.alert = false;
        $scope.alerts.alert = false;
        $scope.onUpdate = true;

         console.log('Inside Update Market Place....Market Place Details to be Updated',updateMPRequest);
         ConfigMarketPlaceService.updateMP(updateMPRequest).success(function(result) {
                if (result.responseCode === 0) {
                    $scope.onUpdate = false;
                    $scope.alerts.alert = true;
                    $scope.alerts.type = 'info';
                    $scope.alerts.msg = "Market Place Updated Successfully";              
                    $('#editMP').modal('hide');

                    initPage();
                }
                else {
                    $scope.onUpdate = false;
                    $scope.updateAlerts.alert = true;
                    $scope.updateAlerts.type = 'danger';
                    $scope.updateAlerts.msg = result.errorMsg;
                 }
            }).
            error(function(data, status, headers, config) {
                $scope.onUpdate = false;
                $scope.updateAlerts.alert = true;
                $scope.updateAlerts.type = 'danger';
                $scope.updateAlerts.msg = SharedService.getErrorMessage(status);
            });
    };
    $scope.deleteMP = function(){
        $scope.onDelete = true;
        var delMPRequest = {
        "userName":"",
            "marketPlace":{
                "marketPlace":$scope.mpToBeChanged.marketPlace
            }
        };
         console.log('Inside Delete Market Place....Market Place Details to be Deleted',delMPRequest);
         ConfigMarketPlaceService.deleteMP(delMPRequest).success(function(result) {
                if (result.responseCode === 0) {
                    $scope.onDelete = false;
                    $scope.alerts.alert = true;
                    $scope.alerts.type = 'info';
                    $scope.alerts.msg = "Market Place Deleted Successfully!!";
                    $('#delete').modal('hide');

                    initPage();
                }
                else {
                    $scope.onDelete = false;
                    $scope.delAlerts.alert = true;
                    $scope.delAlerts.type = 'danger';
                    $scope.delAlerts.msg = result.errorMsg; 
                 }
            }).
            error(function(data, status, headers, config) {
                $scope.onDelete = false;
                $scope.delAlerts.alert = true;
                $scope.delAlerts.type = 'danger';
                $scope.delAlerts.msg = SharedService.getErrorMessage(status);
            });
    };

    $scope.gridOptions=[];
    $scope.mpToBeChanged=[];
   
       $scope.availableMPGridData = [];
       $scope.mpToBeChanged=[];

        $scope.availableMPGrid = {};
        $scope.availableMPGrid.data = 'availableMPGridData';
        $scope.availableMPGrid.enableSorting = true;

        $scope.availableMPGrid.enableColumnResizing = true;
        $scope.availableMPGrid.enableFiltering = false;
        $scope.availableMPGrid.enableGridMenu = true;
        $scope.availableMPGrid.enableRowHeaderSelection = false;
        $scope.availableMPGrid.multiSelect = false;
        $scope.availableMPGrid.modifierKeysToMultiSelect = false;
        $scope.availableMPGrid.noUnselect = false;

        $scope.availableMPGrid.showGridFooter = false;
        $scope.availableMPGrid.showColumnFooter = false;
        $scope.availableMPGrid.paginationPageSizes = [10, 20, 30];
        $scope.availableMPGrid.paginationPageSize = 10;
        $scope.availableMPGrid.enableSelectAll = true;
        $scope.availableMPGrid.exporterMenuCsv = false;
        $scope.availableMPGrid.exporterMenuPdf = false;
        $scope.availableMPGrid.enableRowSelection=true;

       $scope.availableMPGrid.onRegisterApi = function(gridApi) {
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                $scope.mpToBeChanged = row.entity;             
            });

            $scope.gridApi = gridApi;
        };


         $scope.availableMPGrid.columnDefs = [        
               
            {
                name: 'marketPlace',
                displayName:  'Market Place',
                enableColumnMenu: false,
                visible: true,
                width:150
            }, 
            {
                name: 'newCatEPR',
                displayName: 'EPR - New Catalogue',
                width: 250,
                enableColumnMenu: true,
                visible: true
            }, 
            {
                name: 'updateCatEPR',
                displayName:  'EPR - Update Catalogue',
                width: 250,
                enableColumnMenu: false,
                visible: true
            },
            {
                name: 'updatePriceEPR',
                displayName:  'EPR - Update Price',
                width: 250,
                enableColumnMenu: false,
                visible: true
            },
            {
                name: 'newCatLoc',
                displayName:  'New Catalogue Location',
                width: 250,
                enableColumnMenu: false,
                visible: true
            },
             {
                name: 'updateCatLoc',
                displayName:  'Update Catalogue Location',
                width: 250,
                enableColumnMenu: false,
                visible: true
            },
             {
                name: 'updatePriceLoc',
                displayName:  'Update Price Location',
                width: 250,
                enableColumnMenu: false,
                visible: true
            },
            {
                name: 'getOrderEPR',
                displayName:  'EPR - Get Order',
                width: 250,
                enableColumnMenu: false,
                visible: true
            },
            {
                name: 'status',
                displayName:  'Status',
                cellTemplate:'<div class="statusInn"><input type="checkbox" ng-model="row.entity.status" ng-show="false">'+
                              '<span> {{row.entity.status?"Active":"Inactive"}}</span></div>',
                width: 80,
                enableColumnMenu: false,
                visible: true
            },
            {
                name: 'Action',
                cellTemplate: '<span data-placement="top" data-toggle="tooltip" title="Edit">&nbsp;&nbsp;<button  class="btn btn-primary btn-xs icon-edit" data-title="Edit" data-toggle="modal" data-target="#editMP" ><span class="fa fa-pencil-square-o"></span></button></span>'+
                    '&nbsp;&nbsp;<span data-placement="top" data-toggle="tooltip" title="Delete"><button  class="btn btn-danger btn-xs icon-edit" data-title="Delete" data-toggle="modal" data-target="#delete" ><span class="fa fa-trash-o"></span></button></span>',
                width: 100,
                enableColumnMenu: false,
                visible: true
            }
        ];


    initPage = function(){
        var getAllMPRequest = { 
                     "userName":adminUser,
            };

        $scope.onGetMP =true;
        $scope.onCreate = false;
        $scope.onUpdate = false;
        $scope.onDelete = false;

        $scope.disableAddButton = false;
        $scope.disableUpdateButton = false;
        $scope.disbleDelButton = false;


        $scope.availableMPGridData=[];

        ConfigMarketPlaceService.getAllMP(getAllMPRequest).success(function(result) {
            if (result.responseCode === 0) {

                if(result.response.marketPlaces){
                    $scope.availableMP = result.response.marketPlaces;
                    $scope.availableMP.forEach(function(row) {                        
                         $scope.availableMPGridData.push(row);
                    });
                }
                else
                {
                    $scope.alerts.alert = true;
                    $scope.alerts.type = 'warning';
                    $scope.alerts.msg = "No Market Places are available!! Please Add a marketPlace!!";
                    $scope.onSubmit = false;
                    $scope.disableSubmit = false;
                }
                $scope.onGetMP = false;
                    

                }
            else {
                $scope.onGetMP = false;
                $scope.alerts.alert = true;
                $scope.alerts.type = 'danger';
                $scope.alerts.msg = result.errorMsg;
                $scope.onSubmit = false;
                $scope.disableSubmit = false;
            }
        }).
        error(function(data, status, headers, config) {
            $scope.onGetMP = false;
            $scope.alerts.alert = true;
            $scope.alerts.type = 'danger';
            $scope.alerts.msg = SharedService.getErrorMessage(status);
        });

    };

    initPage();


}]);