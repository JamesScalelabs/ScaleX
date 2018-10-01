angular.module('SLModule.orderStatus')

    .controller('OrderStatusController', ["$scope", "$uibModal", "$window", "OrderStatusService", "slDashboardConfig", "localStorageService", "SharedService", "$filter", "FileSaver", "Blob",
        function ($scope, $uibModal, $window, OrderStatusService, slDashboardConfig, localStorageService, SharedService, $filter, FileSaver, Blob) {
            console.log('OrderStatusController');

            $scope.enableVA = false;

            $scope.searchText = "";


            $scope.alerts = {
                "alert": false,
                "type": "",
                "msg": ""
            };
            $scope.syncAlerts = {
                "alert": false,
                "type": "",
                "msg": ""
            };
            $scope.onSyncFS = false;
            $scope.orderDetailsToView = [];
            $scope.allOrderDetails = [];

            $scope.closeAlert = function () {
                $scope.alerts.alert = false;
            };
            $scope.closeSyncAlert = function () {
                $scope.synclerts.alert = false;
            };

            $scope.orderDetailsView = [];
            $scope.orderDetailsGridDataOriginal = [];
            ordersSummary = {
                "productName": "",
                "lazada": "",
                "flipKart": "",
                "ebay": "",
                "amazon": ""
            };


            $scope.updatedTime = new Date();

            userData = localStorageService.get('userData');
            userName = userData.userName;
            groupName = userData.groupName;
            $scope.userType = userData.groupName;
            $scope.managerList = ["Select"];
            $scope.sellerList = ["Select"];
            $scope.selectedManager = "Select";
            $scope.selectedSeller = "Select";

            $scope.isAdmin = (groupName === "ADMIN") ? true : false;
            $scope.isManager = (groupName === "MANAGER") ? true : false;

            $scope.selectedSeller = (groupName === "SELLER") ? userName : "Select";

            if ($scope.selectedManager === "Select" && $scope.selectedSeller === "Select") {
                $scope.alerts.alert = true;
                $scope.alerts.type = 'warning';
                $scope.alerts.msg = "Please Select Manager to display the Seller List!!";
            }
            console.log($scope.isAdmin + "   " + $scope.isManager);

            function saveFileAs(blob) {
                // It is necessary to create a new blob object with mime-type explicitly set
                // otherwise only Chrome works like it should
                var newBlob = new Blob([blob], { type: "application/pdf" })

                // IE doesn't allow using a blob object directly as link href
                // instead it is necessary to use msSaveOrOpenBlob
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(newBlob);
                    return;
                }

                // For other browsers: 
                // Create a link pointing to the ObjectURL containing the blob.
                const data = window.URL.createObjectURL(newBlob);
                var link = document.createElement('a');
                link.href = data;
                link.download = "invoice.pdf";
                link.click();
                setTimeout(function () {
                    // For Firefox it is necessary to delay revoking the ObjectURL
                    window.URL.revokeObjectURL(data);
                }, 100);
            }

            $scope.downloadInvoice = function (invoiceId) {
                $scope.onSyncFS = true;
                console.log(invoiceId);
                var syncSellerOrdersRequest = {
                    "userName": "test",
                    "id": invoiceId,
                };


                OrderStatusService.downloadInvoice(syncSellerOrdersRequest).success(function (result) {
                    saveFileAs(result);
                }).
                    error(function (data, status, headers, config) {
                        $scope.onGSOrder = false;
                        $scope.alerts.alert = true;
                        $scope.alerts.type = 'danger';
                        $scope.alerts.msg = SharedService.getErrorMessage(status);
                    });
            };

            $scope.syncSellerOrders = function () {
                $scope.onSyncFS = true;
                var syncSellerOrdersRequest = {
                    "userName": userName,
                    "user": {
                        "sellerName": $scope.selectedSeller
                    }
                };


                OrderStatusService.syncSellerOrders(syncSellerOrdersRequest).success(function (result) {
                    if (result.responseCode === 0) {
                        $scope.onSyncFS = false;
                        $scope.alerts.alert = true;
                        $scope.alerts.type = 'info';
                        $scope.alerts.msg = "Data Sync is successful! ";
                        $scope.getSO();
                    } else {
                        $scope.onSyncFS = false;
                        $scope.alerts.alert = true;
                        $scope.alerts.type = 'danger';
                        $scope.alerts.msg = result.errorMsg;
                    }
                }).
                    error(function (data, status, headers, config) {
                        $scope.onGSOrder = false;
                        $scope.alerts.alert = true;
                        $scope.alerts.type = 'danger';
                        $scope.alerts.msg = SharedService.getErrorMessage(status);
                    });
            };

            $scope.populateSeller = function () {

                $scope.alerts.alert = false;

                if ($scope.selectedManager === "Select") {
                    $scope.alerts.alert = true;
                    $scope.alerts.type = 'warning';
                    $scope.alerts.msg = "Please Select Manager to display the Seller List!!";

                    $scope.sellerList = ["Select"];
                    $scope.selectedSeller = "Select";

                    $scope.orderDetailsGridData = [];

                } else {
                    var getASRequest = {
                        "userName": userName,
                        "user": {
                            "managerUserName": $scope.selectedManager
                        }
                    };

                    $scope.onSyncFS = true;
                    SharedService.getAllocateSellers(getASRequest).success(function (result) {
                        $scope.onSyncFS = false;
                        if (result.responseCode === 0 && result.response.allocatedUser) {

                            _.forEach(result.response.allocatedUser, function (data) {
                                $scope.sellerList.push(data.value);
                            });


                        } else {
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'danger';
                            $scope.alerts.msg = result.errorMsg;
                            $scope.disableSubmit = false;
                        }
                    }).
                        error(function (data, status, headers, config) {
                            $scope.onGetSeller = false;
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'danger';
                            $scope.alerts.msg = SharedService.getErrorMessage(status);
                        });
                }

            };

            getSellerOrders = function () {

                $scope.onSyncFS = true;
                var getSellerOrdersCountRequest = {
                    "userName": userName,
                    "user": {
                        "sellerName": $scope.selectedSeller
                    }
                };

                $scope.orderDetailsGridData = [];


                if (($scope.selectedManager !== "Select") && ($scope.selectedSeller === "Select")) {
                    $scope.alerts.alert = true;
                    $scope.alerts.type = 'warning';
                    $scope.alerts.msg = "Please Select Manager to display the Seller List!!";
                } else {
                    OrderStatusService.getSellerOrdersCount(getSellerOrdersCountRequest).success(function (result) {
                        if (result.responseCode === 0) {
                            $scope.onSyncFS = false;
                            $scope.enableVA = true;

                            $scope.sellerOrdersCount = result.response.productList;

                            $scope.sellerOrdersCount.forEach(function (row) {
                                $scope.orderDetailsGridData.push(row);
                                $scope.orderDetailsGridDataOriginal.push(row);
                            });
                        } else {
                            $scope.onSyncFS = false;
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'danger';
                            $scope.alerts.msg = result.errorMsg;
                            $scope.onSubmit = false;
                            $scope.disableSubmit = false;
                        }
                    }).
                        error(function (data, status, headers, config) {
                            $scope.onGSOrder = false;
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'danger';
                            $scope.alerts.msg = SharedService.getErrorMessage(status);
                        });
                }

            };


            $scope.viewOrderDetail = function (productName) {
                console.log('Inside View Order Detail' + productName);
                $scope.onSyncFS = true;
                var getSellerOrders = {
                    "userName": userName,
                    "user": {
                        "sellerName": $scope.selectedSeller
                    }
                };
                OrderStatusService.getSellerOrders(getSellerOrders).success(function (result) {
                    if (result.responseCode === 0) {


                        $scope.onSyncFS = false;

                        temp = result.response.orders;

                        if (productName === 'all' || productName == 'all') {
                            displayData = temp;
                            localStorageService.set('productName', "Multiple Porudcts!");
                        } else {

                            displayData = _.filter(temp, {
                                "productName": productName
                            });
                            localStorageService.set('productName', productName);

                        }
                        console.log(displayData);



                        localStorageService.set('displayData', displayData);
                        localStorageService.set('sellerName', $scope.selectedSeller);

                        displayData.forEach(function (row) {
                            $scope.orderDetailsGridData.push(row);
                            $scope.orderDetailsGridDataOriginal.push(row)
                        });
                        $scope.enableVA = true;

                        //  $window.open(slDashboardConfig.restServer + "newPage.html" , '_blank');         

                    } else {
                        $scope.onSyncFS = false;
                        $scope.alerts.alert = true;
                        $scope.alerts.type = 'danger';
                        $scope.alerts.msg = result.errorMsg;
                        $scope.onSubmit = false;
                        $scope.disableSubmit = false;
                    }
                }).
                    error(function (data, status, headers, config) {
                        $scope.onGSOrder = false;
                        $scope.alerts.alert = true;
                        $scope.alerts.type = 'danger';
                        $scope.alerts.msg = SharedService.getErrorMessage(status);
                    });


            };


            summaryDetails = function () {
                $scope.gridOptions = [];
                $scope.orderDetailsToView = [];

                $scope.orderDetailsGridData = [];

                $scope.orderDetailsGrid = {};
                $scope.orderDetailsGrid.data = 'orderDetailsGridData';
                $scope.orderDetailsGrid.enableSorting = true;

                $scope.orderDetailsGrid.enableColumnResizing = true;
                $scope.orderDetailsGrid.enableFiltering = false;
                $scope.orderDetailsGrid.enableGridMenu = true;
                $scope.orderDetailsGrid.enableRowHeaderSelection = false;
                $scope.orderDetailsGrid.multiSelect = false;
                $scope.orderDetailsGrid.modifierKeysToMultiSelect = false;
                $scope.orderDetailsGrid.noUnselect = false;
                $scope.orderDetailsGrid.rowHeight = 30;
                $scope.orderDetailsGrid.showGridFooter = false;
                $scope.orderDetailsGrid.showColumnFooter = false;
                $scope.orderDetailsGrid.paginationPageSizes = [10, 20, 30];
                $scope.orderDetailsGrid.paginationPageSize = 10;
                $scope.orderDetailsGrid.enableSelectAll = true;
                $scope.orderDetailsGrid.exporterMenuCsv = false;
                $scope.orderDetailsGrid.exporterMenuPdf = false;
                $scope.orderDetailsGrid.enableRowSelection = false;

                $scope.orderDetailsGrid.onRegisterApi = function (gridApi) {
                    gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                        $scope.orderDetailsToView = row.entity;
                    });
                    $scope.gridApi = gridApi;
                };

                $scope.orderDetailsGrid.columnDefs = [{
                    name: 'createTs',
                    displayName: 'Created Time',
                    width: 110,
                    enableColumnMenu: false,
                    visible: true
                },
                {
                    name: 'productName',
                    displayName: 'Product Name',
                    width: 410,
                    enableColumnMenu: false,
                    visible: true
                },
                {
                    name: 'orderId',
                    displayName: 'Order Id',
                    width: 200,
                    enableColumnMenu: false,
                    visible: true
                },
                {
                    name: 'price',
                    displayName: 'Price',
                    width: 130,
                    enableColumnMenu: false,
                    cellTemplate: '<p>{{row.entity.currency}} {{row.entity.price}}</p>',
                    visible: true
                },
                {
                    name: 'itemCount',
                    displayName: 'Item Count',
                    width: 130,
                    enableColumnMenu: false,
                    visible: true
                },
                {
                    name: 'status',
                    displayName: 'Status',
                    width: 180,
                    enableColumnMenu: false,
                    visible: true
                },
                {
                    name: 'customerFirstName',
                    displayName: 'Customer Name',
                    width: 250,
                    enableColumnMenu: false,
                    cellTemplate: '<center>{{row.entity.customerFirstName}}</center>',
                    visible: true
                },
                {
                    name: 'marketPlace',
                    displayName: 'Market Place',
                    width: 130,
                    enableColumnMenu: false,
                    cellTemplate: '<center>{{row.entity.marketPlace}}</center>',
                    visible: true
                },
                {
                    name: 'invoiceNumber',
                    displayName: 'Invoice Number',
                    width: 120,
                    enableColumnMenu: false,
                    cellTemplate: '<center>{{row.entity.invoiceNumber}}</center>',
                    visible: true
                },
                {
                    name: 'id',
                    displayName: 'Invoice',
                    width: 80,
                    enableColumnMenu: false,
                    cellTemplate: '<center><a href = "" class="fa fa-download" aria-hidden="true" ng-click="grid.appScope.downloadInvoice(row.entity.id)"></a></center>',
                    visible: true
                }

                ];
                /*$scope.orderDetailsGrid.columnDefs = [        
            {
                name: 'Action',
                cellClass: 'ui-grid-vcenter',
                cellTemplate: '<button  style="line-height: .25;" class="btn btn-xs btn-success  " data-title="View" data-toggle="modal"'+
                ' ng-click="grid.appScope.viewOrderDetail(row.entity.productName)" >View</button>',
                width: 70,
                enableColumnMenu: false,
                visible: true
            },    
            {
                name: 'productName',
                displayName:  'Product Name',
                width: 600,
                enableColumnMenu: false,
                cellTemplate : '<center>{{row.entity.productName}}</center>',
                visible: true
            },
            {
                name: 'lazada',
                displayName: 'Lazada',
                width: 70,
                enableColumnMenu: false,
                cellTemplate : '<center>{{row.entity.lazada?row.entity.lazada:0}}</center>',
                visible: true
            },
            {
                 name: 'elevenStreet',
                displayName: '11Street',
                enableColumnMenu: false,
                width: 70,
                cellTemplate : '<center>{{row.entity.elevenStreet?row.entity.elevenStreet:0}}</center>',
                visible: true
            },
            {
                name: 'sears',
                displayName: 'Sears',
                width: 70,
                enableColumnMenu: false,
                cellTemplate : '<center>{{row.entity.sears?row.entity.sears:0}}</center>',
                visible: true,
            },
             {
                name: 'ebay',
                displayName: 'Ebay',
                width: 70,
                enableColumnMenu: false,
                cellTemplate : '<center>{{row.entity.ebay?row.entity.ebay:0}}</center>',
                visible: true,
            },
            {
                name: 'cDiscount',
                displayName: 'CDiscount',
                width: 90,
                enableColumnMenu: false,
                cellTemplate : '<center>{{row.entity.ebay?row.entity.ebay:0}}</center>',
                visible: true,
            },
             {
                name: 'amazon',
                displayName: 'Amazon-US',
                enableColumnMenu: false,
                width: 100,
                cellTemplate : '<center>{{row.entity.amazon?row.entity.amazon:0}}</center>',
                visible: true
            },
            {
                name: 'amazonCA',
                displayName: 'Amazon-CA',
                enableColumnMenu: false,
                width: 100,
                cellTemplate : '<center>{{row.entity.amazonCA?row.entity.amazonCA:0}}</center>',
                visible: true
            },
            {
                name: 'amazonMX',
                displayName: 'Amazon-MX',
                enableColumnMenu: false,
                width: 100,
                cellTemplate : '<center>{{row.entity.amazonMX?row.entity.amazonMX:0}}</center>',
                visible: true
            },
            {
                name: 'amazonUK',
                displayName: 'Amazon-UK',
                enableColumnMenu: false,
                width: 100,
                cellTemplate : '<center>{{row.entity.amazonUK?row.entity.AmazonUK:0}}</center>',
                visible: true
            },            
            {
                 name: 'amazonFR',
                displayName: 'Amazon  France',
                enableColumnMenu: false,
                width: 130,
                cellTemplate : '<center>{{row.entity.amazonFR?row.entity.amazonFR:0}}</center>',
                visible: true
            },
            {
                 name: 'amazonDE',
                displayName: 'Amazon Germany',
                enableColumnMenu: false,
                width: 135,
                cellTemplate : '<center>{{row.entity.amazonDE?row.entity.amazonDE:0}}</center>',
                visible: true
            },
            {
                 name: 'amazonIT',
                displayName: 'Amazon Italy',
                enableColumnMenu: false,
                width: 110,
                cellTemplate : '<center>{{row.entity.amazonIT?row.entity.amazonIT:0}}</center>',
                visible: true
            },
            {
                 name: 'amazonES',
                displayName: 'Amazon Spain',
                enableColumnMenu: false,
                width: 120,
                cellTemplate : '<center>{{row.entity.amazonES?row.entity.amazonES:0}}</center>',
                visible: true
            },

            {
              name: 'total',
              displayName: 'Total',
              enableColumnMenu: false,
              width: 70,
              cellTemplate : '<center>{{row.entity.total?row.entity.total:0}}</center>',
              visible: true
            }
        ];
*/
            };

            $scope.getAllocateSellers = function () {

                console.log('Inside Get Allocat Sellers');
                var getASRequest = {
                    "userName": userName,
                    "user": {
                        "managerUserName": $scope.selectedManager
                    }
                };

                if ($scope.selectedManager == "Select") {
                    $scope.alerts.alert = true;
                    $scope.alerts.type = 'warning';
                    $scope.alerts.msg = "Please Select Manager to display the Seller List!!";
                    $scope.configure = [];
                } else {
                    $scope.onGetSeller = true;
                    SharedService.getAllocateSellers(getASRequest).success(function (result) {
                        $scope.closeAlert();
                        $scope.onGetSeller = false;
                        if (result.responseCode === 0) {

                            if (result.response.allocatedUser)
                                pushToConfig.selectedData = result.response.allocatedUser;
                            if (result.response.unAllocatedUser)
                                pushToConfig.availableData = result.response.unAllocatedUser;

                            $scope.configure.push(pushToConfig);

                        } else {
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'danger';
                            $scope.alerts.msg = result.errorMsg;
                            $scope.disableSubmit = false;
                        }
                    }).
                        error(function (data, status, headers, config) {
                            $scope.onGetSeller = false;
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'danger';
                            $scope.alerts.msg = SharedService.getErrorMessage(status);
                        });
                }
            };


            initPage = function () {
                summaryDetails();

                var getManagerListReq = {
                    "userName": userName
                };

                if (groupName !== "SELLER") {
                    $scope.onSyncFS = true;
                    SharedService.getManagerRole(getManagerListReq).success(function (result) {
                        $scope.onSyncFS = false;
                        if (result.responseCode === 0) {
                            result.response.managerUsers.forEach(function (row) {
                                $scope.managerList.push(row.userName);
                            });
                        } else {
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'danger';
                            $scope.alerts.msg = result.errorMsg;
                            $scope.disableSubmit = false;
                        }
                    }).
                        error(function (data, status, headers, config) {
                            $scope.onSyncFS = false;
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'danger';
                            $scope.alerts.msg = SharedService.getErrorMessage(status);
                        });
                } else {
                    $scope.viewOrderDetail('all');
                }
            };
            if ($scope.isManager == true) {
                $scope.selectedManager = userName;
                $scope.populateSeller();
            }
            $scope.getSO = function () {
                if ($scope.selectedManager !== "Select" && $scope.selectedSeller !== "Select") {
                    $scope.viewOrderDetail('all');

                }
            };
            initPage();

            $scope.refreshData = function () {
                console.log('search Triggered');
                console.log($scope.orderDetailsGrid.data);
                $scope.orderDetailsGridData = $filter('filter')($scope.orderDetailsGridDataOriginal, $scope.searchText);
            };


        }
    ]);