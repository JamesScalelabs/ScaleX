angular.module('SLModule.userManagement')

.controller('UserManagementController',["$scope","$uibModal","$window","UserManagementService","slDashboardConfig","localStorageService","SharedService",
	function($scope,$uibModal,$window,UserManagementService,slDashboardConfig,localStorageService,SharedService){ 
		console.log('UserManagementController'); 

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

       

        $scope.selectedGroup="ADMIN";
        $scope.groupName =["ADMIN","MANAGER","SELLER"];

        $scope.updatedTime=new Date();
        adminUser = localStorageService.get('userData').userName; 

        $scope.availableUsers = [];

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
            $scope.addUserRequest = {
                "userName":adminUser,
                "user" : {
                    "userName" : "",
                    "password" : "",
                    "retypePassword":"",
                    "groupName" : "ADMIN",
                    "address" : "",
                    "description" : "",
                    "firstName": "",
                    "lastName" : "",
                    "contactNumber":""
                }
         };

        };
    $scope.createUser = function(){
        $scope.onCreate = true;        
        
        console.log('Inside Create User....User Details to be Added',$scope.addUserRequest);
        UserManagementService.addUser($scope.addUserRequest).success(function(result) {
                if (result.responseCode === 0) {  
                        $scope.onCreate = false; 
                        $scope.alerts.alert = true;
                        $scope.alerts.type = 'success';
                        $scope.alerts.msg = "User Added Successfully" ;   
                        $('#addUser').modal('hide');

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
    $scope.updateUser = function(){
        var updateRequest = {
                    "userName":adminUser,
                        "user": {
                        "userName" : $scope.userDataToBeChanged.userName,
                        "address" : $scope.userDataToBeChanged.address,
                        "description" : $scope.userDataToBeChanged.description,
                        "status":$scope.userDataToBeChanged.status,
                        "firstName" : $scope.userDataToBeChanged.firstName,
                        "lastName" : $scope.userDataToBeChanged.lastName,
                        "contactNumber" : $scope.userDataToBeChanged.contactNumber
                     }
                };

        $scope.updateAlerts.alert = false;
        $scope.alerts.alert = false;
        $scope.onUpdate = true;

         
         UserManagementService.updateUserDetails(updateRequest).success(function(result) {
                if (result.responseCode === 0) {
                    $scope.onUpdate = false;
                    $scope.alerts.alert = true;
                    $scope.alerts.type = 'success';
                    $scope.alerts.msg = "User Updated Successfully";              
                    $('#editUser').modal('hide');

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
    $scope.onChangeStatusFunc = function(status){

        if(status){
            $scope.disableUser();
        }else{
            $scope.enableUser();
        }

    }
    $scope.enableUser = function(){
        $scope.onChangeStatus = true;
        UserManagementService.enableUser($scope.deleteRequest).success(function(result) {
                if (result.responseCode === 0) {
                    $scope.onChangeStatus = false;
                    $scope.alerts.alert = true;
                    $scope.alerts.type = 'success';
                    $scope.alerts.msg = "User Enabled Successfully!!";
                   
                    initPage();
                }
                else {
                    $scope.onChangeStatus = false;
                    $scope.delAlerts.alert = true;
                    $scope.delAlerts.type = 'danger';
                    $scope.delAlerts.msg = result.errorMsg; 
                 }
            }).
            error(function(data, status, headers, config) {
                $scope.onChangeStatus = false;
                $scope.delAlerts.alert = true;
                $scope.delAlerts.type = 'danger';
                $scope.delAlerts.msg = SharedService.getErrorMessage(status);
            });
    }
    $scope.disableUser = function(){
        $scope.onChangeStatus = true;
        UserManagementService.disableUser($scope.deleteRequest).success(function(result) {
                if (result.onChangeStatus === 0) {
                    $scope.onDelete = false;
                    $scope.alerts.alert = true;
                    $scope.alerts.type = 'success';
                    $scope.alerts.msg = "User Disabled Successfully!!";
                   
                    initPage();
                }
                else {
                    $scope.onChangeStatus = false;
                    $scope.delAlerts.alert = true;
                    $scope.delAlerts.type = 'danger';
                    $scope.delAlerts.msg = result.errorMsg; 
                 }
            }).
            error(function(data, status, headers, config) {
                $scope.onChangeStatus = false;
                $scope.delAlerts.alert = true;
                $scope.delAlerts.type = 'danger';
                $scope.delAlerts.msg = SharedService.getErrorMessage(status);
            });
    }
    $scope.deleteUser = function(){
        $scope.onDelete = true;

         console.log('Inside Delete User....User Details to be Deleted',$scope.deleteRequest);
         UserManagementService.deleteUser($scope.deleteRequest).success(function(result) {
                if (result.responseCode === 0) {
                    $scope.onDelete = false;
                    $scope.alerts.alert = true;
                    $scope.alerts.type = 'success';
                    $scope.alerts.msg = "User Deleted Successfully!!";
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
    $scope.userDataToBeChanged=[];
	
	   $scope.availableUserGridData = [];

        $scope.availableUserGrid = {};
        $scope.availableUserGrid.data = 'availableUserGridData';
        $scope.availableUserGrid.enableSorting = true;

        $scope.availableUserGrid.enableColumnResizing = true;
        $scope.availableUserGrid.enableFiltering = false;
        $scope.availableUserGrid.enableGridMenu = true;
        $scope.availableUserGrid.enableRowHeaderSelection = false;
        $scope.availableUserGrid.multiSelect = false;
        $scope.availableUserGrid.modifierKeysToMultiSelect = false;
        $scope.availableUserGrid.noUnselect = false;
        $scope.availableUserGrid.rowHeight =30;
        $scope.availableUserGrid.showGridFooter = false;
        $scope.availableUserGrid.showColumnFooter = false;
        $scope.availableUserGrid.paginationPageSizes = [10, 20, 30];
        $scope.availableUserGrid.paginationPageSize = 10;
        $scope.availableUserGrid.enableSelectAll = true;
        $scope.availableUserGrid.exporterMenuCsv = false;
        $scope.availableUserGrid.exporterMenuPdf = false;
        $scope.availableUserGrid.enableRowSelection=false;

       $scope.availableUserGrid.onRegisterApi = function(gridApi) {
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                $scope.userDataToBeChanged = row.entity;
                $scope.deleteRequest = {
                    "userName":adminUser,
                    "user":{
                        "userName": $scope.userDataToBeChanged.userName
                    }
                };
            });
            $scope.gridApi = gridApi;
        };


         $scope.availableUserGrid.columnDefs = [        
              
            {
                name: 'firstName',
                displayName:  'First Name',
                width: 100,
                enableColumnMenu: false,
                visible: true
            }, 
            {
                name: 'userName',
                displayName: 'User Name',
                width: 200,
                enableColumnMenu: true,
                visible: true,
                cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                  return 'clrblue';
                }
            }, 
            {
                name: 'lastName',
                displayName:  'Last Name',
                width: 100,
                enableColumnMenu: false,
                visible: false
            },
            {
                name: 'groupName',
                displayName:  'Group',
                width: 80,
                enableColumnMenu: false,
                visible: true
            },
            {
                name: 'address',
                displayName:  'Address',
                width: 180,
                enableColumnMenu: false,
                visible: true
            },
             {
                name: 'description',
                displayName:  'Description',
                width: 250,
                enableColumnMenu: false,
                visible: true
            },
             {
                name: 'contactNumber',
                displayName:  'Contact Number',
                width: 160,
                enableColumnMenu: false,
                visible: true
            },
            {
                name: 'status',
                displayName:  'Status',
                cellTemplate:'<label class="switch">'+
                '<input type="checkbox" ng-change="grid.appScope.onChangeStatusFunc({{row.entity.status}})" class="statusCheckbox" ng-model="row.entity.status">'+
                  '<span class="slider round"></span>'+ 
                '</label>',
                width: 80,
                enableColumnMenu: false,
                visible: true
            },
            {
                name: 'Action',
                cellTemplate: '<span data-placement="top" data-toggle="tooltip" title="Edit">&nbsp;&nbsp;<button  class="btn btn-primary btn-xs icon-edit" data-title="Edit" data-toggle="modal" data-target="#editUser" ><span class="fa fa-pencil-square-o"></span></button></span>'+
                    '&nbsp;&nbsp;<span data-placement="top" data-toggle="tooltip" title="Delete"><button  class="btn btn-danger btn-xs icon-edit" data-title="Delete" data-toggle="modal" data-target="#delete" ><span class="fa fa-trash-o"></span></button></span>',
                width: 100,
                enableColumnMenu: false,
                visible: true
            }
        ];


    initPage = function(){

        var getAllUserRequest = { 
                     "userName":adminUser,
                };

        $scope.onGetUser =true;
        $scope.onCreate = false;
        $scope.onUpdate = false;
        $scope.onDelete = false;
        $scope.onChangeStatus = false;

        $scope.disableAddButton = false;
        $scope.disableUpdateButton = false;
        $scope.disbleDelButton = false;


        $scope.availableUserGridData=[];

        UserManagementService.getAllUsers(getAllUserRequest).success(function(result) {
            if (result.responseCode === 0) {
                $scope.onGetUser = false;
                    $scope.availableUsers = result.response.availableUsers;
                    $scope.availableUsers.forEach(function(row) {                        
                         $scope.availableUserGridData.push(row);
                    });

                }
            else {
                $scope.onGetUser = false;
                $scope.alerts.alert = true;
                $scope.alerts.type = 'danger';
                $scope.alerts.msg = result.errorMsg;
                $scope.onSubmit = false;
                $scope.disableSubmit = false;
            }
        }).
        error(function(data, status, headers, config) {
            $scope.onGetUser = false;
            $scope.alerts.alert = true;
            $scope.alerts.type = 'danger';
            $scope.alerts.msg = SharedService.getErrorMessage(status);
        });

    };

    initPage();
}]);