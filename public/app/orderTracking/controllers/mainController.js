    angular.module('SLModule.orderTracking')

        .controller('OrderTrackingController', ["$scope", "$uibModal", "$window", "OrderTrackingService", "slDashboardConfig", "localStorageService", "SharedService", "$filter",
            function($scope, $uibModal, $window, OrderStatusService, slDashboardConfig, localStorageService, SharedService, $filter) {


                console.log("Inside OrderTrackingController... ");
                $scope.searched = false;
                $scope.providerList = ["Select", "FedEx", "Aramex", "DHL"];
                $scope.selectedShipmentProvider = "Select";
            

                $scope.pickedUp = true;
                $scope.arrived = true;
                $scope.departed = true;
                $scope.delivered = false;
                $scope.disableGo = true;

                userData = localStorageService.get('userData');
                userName = userData.userName;
                groupName = userData.groupName;

                var options = {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                };
                $scope.updatedAt = new Date();
                $scope.formattedDate = $scope.updatedAt.toLocaleTimeString("en-us", options);

                $scope.alerts = {
                    "alert": false,
                    "type": "",
                    "msg": ""
                };
                $scope.closeAlert = function() {
                    $scope.alerts.alert = false;
                };



                $scope.trackingDetailsToView = [];

                $scope.trackingDetailsGridData = [];

                $scope.trackingDetailsGrid = {};
                $scope.trackingDetailsGrid.data = 'trackingDetailsGridData';
                $scope.trackingDetailsGrid.enableSorting = false;

                $scope.trackingDetailsGrid.enableColumnResizing = true;
                $scope.trackingDetailsGrid.enableFiltering = false;
                $scope.trackingDetailsGrid.enableGridMenu = false;
                $scope.trackingDetailsGrid.enableRowHeaderSelection = false;
                $scope.trackingDetailsGrid.multiSelect = false;
                $scope.trackingDetailsGrid.modifierKeysToMultiSelect = false;
                $scope.trackingDetailsGrid.noUnselect = false;
                $scope.trackingDetailsGrid.rowHeight = 30;
                $scope.trackingDetailsGrid.enableSelectAll = true;
                $scope.trackingDetailsGrid.exporterMenuCsv = false;
                $scope.trackingDetailsGrid.exporterMenuPdf = false;
                $scope.trackingDetailsGrid.enableRowSelection = true;

                aramexDetails = function() {
                    $scope.trackingDetailsGrid.columnDefs = [{
                            name: 'Waybill Number',
                            displayName: 'Waybill Number',
                            width: 160,
                            enableColumnMenu: false,
                            cellTemplate: '<center>{{row.entity.WaybillNumber}}</center>',
                            visible: true
                        },
                        {
                            name: 'Code',
                            displayName: 'Code',
                            width: 160,
                            enableColumnMenu: false,
                            cellTemplate: '<center>{{row.entity.UpdateCode}}</center>',
                            visible: true
                        },
                        {
                            name: 'Description',
                            displayName: 'Description',
                            width: 160,
                            enableColumnMenu: false,
                            cellTemplate: '<center>{{row.entity.UpdateDescription}}</center>',
                            visible: true
                        },
                        {
                            name: 'Date & Time',
                            displayName: 'Date & Time',
                            width: 160,
                            enableColumnMenu: false,
                            cellTemplate: '<center>{{row.entity.UpdateDateTime}}</center>',
                            visible: true
                        },
                        {
                            name: 'Location',
                            displayName: 'Location',
                            width: 160,
                            enableColumnMenu: false,
                            cellTemplate: '<center>{{row.entity.UpdateLocation}}</center>',
                            visible: true
                        },
                        {
                            name: 'Comments',
                            displayName: 'Comments',
                            width: 160,
                            enableColumnMenu: false,
                            cellTemplate: '<center>{{row.entity.Comments}}</center>',
                            visible: true
                        },
                        {
                            name: 'Problem Code',
                            displayName: 'Problem Code',
                            width: 160,
                            enableColumnMenu: false,
                            cellTemplate: '<center>{{row.entity.ProblemCode}}</center>',
                            visible: true
                        }
                    ]
                };

                fedexDetails = function() {
                    $scope.trackingDetailsGridData = [];
                    $scope.trackingDetailsGrid.columnDefs = [{
                            name: 'Tracking Number',
                            displayName: 'Tracking Number',
                            width: 160,
                            enableColumnMenu: false,
                            cellTemplate: '<center>{{row.entity.TrackingNumber}}</center>',
                            visible: true
                        },

                        {
                            name: 'Carrier Code',
                            displayName: 'Carrier Code',
                            width: 160,
                            enableColumnMenu: false,
                            cellTemplate: '<center>{{row.entity.CarrierCode}}</center>',
                            visible: true
                        },{
                            name: 'Operating Company Or CarrierDescription',
                            displayName: 'Operating Company Or CarrierDescription',
                            width: 400,
                            enableColumnMenu: false,
                            cellTemplate: '<center>{{row.entity.OperatingCompanyOrCarrierDescription}}</center>',
                            visible: true
                        },{
                            name: 'Ship Time stamp',
                            displayName: 'Ship Time stamp',
                            width: 160,
                            enableColumnMenu: false,
                            cellTemplate: '<center>{{row.entity.ShipTimestamp}}</center>',
                            visible: true
                        },{
                            name: 'Delivery Attempts',
                            displayName: 'Delivery Attempts',
                            width: 160,
                            enableColumnMenu: false,
                            cellTemplate: '<center>{{row.entity.DeliveryAttempts}}</center>',
                            visible: true
                        }
                    ]
                };
                dhlDetails = function() {
                    $scope.trackingDetailsGridData = [];
                    $scope.trackingDetailsGrid.columnDefs = [{
                            name: 'AWBNumber',
                            displayName: 'AWB Number',
                            width: 160,
                            enableColumnMenu: false,
                            cellTemplate: '<center>{{row.entity.AWBNumber}}</center>',
                            visible: true
                        },

                        {
                            name: 'Origin Service Area',
                            displayName: 'Origin Service Area',
                            width: 160,
                            enableColumnMenu: false,
                            cellTemplate: '<center>{{row.entity.ShipmentInfo.OriginServiceArea.Description}}</center>',
                            visible: true
                        },
                        {
                            name: 'Destination ServiceArea Description',
                            displayName: 'Destination ServiceArea Description',
                            width: 160,
                            enableColumnMenu: false,
                            cellTemplate: '<center>{{row.entity.ShipmentInfo.DestinationServiceArea.Description}}</center>',
                            visible: true
                        },
                        {
                            name: 'ShipperName',
                            displayName: 'ShipperName',
                            width: 250,
                            enableColumnMenu: false,
                            cellTemplate: '<center>{{row.entity.ShipmentInfo.ShipperName}}</center>',
                            visible: true
                        },
                        {
                            name: 'Shipper Account Number',
                            displayName: 'Shipper Account Number',
                            width: 160,
                            enableColumnMenu: false,
                            cellTemplate: '<center>{{row.entity.ShipmentInfo.ShipperAccountNumber}}</center>',
                            visible: true
                        },
                        {
                            name: 'Shipment Date',
                            displayName: 'Shipment Date',
                            width: 160,
                            enableColumnMenu: false,
                            cellTemplate: '<center>{{row.entity.ShipmentInfo.ShipmentDate}}</center>',
                            visible: true
                        }
                    ]
                };

                $scope.trackOrder = function() {
                    $scope.onLoad = true;
                    var trackOrderRequest = {
                        "userName": userName,
                        "shipmentProvider": $scope.selectedShipmentProvider,
                        "trackingId": $scope.trackingId,
                    };
                    renderView = function(shipmentProvider, result) {
                        $scope.searched = true;
                        $scope.trackingDetailsGridData = [];
                        if (shipmentProvider === "FedEx") {
                            console.log('Rendering for FedEx');
                            fedexDetails();
                            result.CompletedTrackDetails[0].TrackDetails.forEach(function(row) {
                                
                                $scope.trackingDetailsGridData.push(row);
                            });
                        }

                        if (shipmentProvider === "Aramex") {
                            console.log('Rendering for Aramex');
                            aramexDetails();

                            result.TrackingResult.forEach(function(row) {
                                $scope.trackingDetailsGridData.push(row);
                            });
                        }

                        if (shipmentProvider === "DHL") {
                            console.log('Rendering for DHL');
                            dhlDetails();

                            result.forEach(function(row) {
                                $scope.trackingDetailsGridData.push(row);
                            });
                        }
                    }

                    OrderStatusService.trackOrder(trackOrderRequest).success(function(result) {
                        if (result.responseCode === 0) {
                            $scope.onLoad = false;
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'info';
                            $scope.alerts.msg = "Order Tracking success ";
                            $scope.trackingDetailsGridData = [];
                            console.log(result.response.result);
                            renderView($scope.selectedShipmentProvider, result.response.result);



                        } else {
                            $scope.onLoad = false;
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'danger';
                            $scope.alerts.msg = result.errorMsg;
                        }
                    }).error(function(data, status, headers, config) {
                        $scope.onGSOrder = false;
                        $scope.alerts.alert = true;
                        $scope.alerts.type = 'danger';
                        $scope.alerts.msg = SharedService.getErrorMessage(status);
                    });

                };

                $scope.trackingIDChanged = function() {
                    console.log("Tracking Id Changed");
                    if ($scope.trackingId.length > 1 && $scope.selectedShipmentProvider != "Select") {
                        console.log('Inside If');
                        $scope.disableGo = false;
                    } else {
                        $scope.disableGo = true;
                    }
                }
                $scope.shipmentProviderChanged = function() {
                    console.log("ShipmentProviderChanged Id Changed");
                    if ($scope.trackingId.length > 1 && $scope.selectedShipmentProvider != "Select") {
                        console.log('Inside If');
                        $scope.disableGo = false;
                    } else {
                        $scope.disableGo = true;
                    }
                }



            }
        ]);