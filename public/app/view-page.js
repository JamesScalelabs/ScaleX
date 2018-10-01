var app = angular.module('app', [
    'ui.grid',
    'ui.grid.selection',
    'ui.grid.resizeColumns',
    'ui.grid.autoResize',
    'ui.grid.pagination',
    'LocalStorageModule']);

angular.module('app')
    .config(['localStorageServiceProvider', function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('slDashboard')
            .setStorageType('sessionStorage')
            .setNotify(true, true);
    }]);


angular.element(document).ready(function () {

    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    console.log('document Loaded Bootstrapping the application');
    angular.bootstrap(document, ['app']);



});


app.controller('MainCtrl', ['$scope', '$http', '$window', 'localStorageService',
    function ($scope, $http, $window, localStorageService) {



        console.log('Arun Raju');

        userData = localStorageService.get('userData');
        console.log(userData);

        displayData = localStorageService.get('displayData');

        $scope.sellerName = localStorageService.get('sellerName');
        $scope.productName = localStorageService.get('productName');



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
        $scope.orderDetailsGrid.enableRowSelection = true;




        $scope.orderDetailsGrid.columnDefs = [
            {
                name: 'createTs',
                displayName: 'Order Create Time',
                width: 85,
                enableColumnMenu: false,
                cellTemplate: '<center>{{row.entity.createTs}}</center>',
                visible: true
            },
            {
                name: 'productName',
                displayName: 'Product Name',
                width: 210,
                enableColumnMenu: false,
                cellTemplate: '<center>{{row.entity.productName}}</center>',
                visible: true
            },
            {
                name: 'orderId',
                displayName: 'Order Id',
                width: 200,
                enableColumnMenu: false,
                cellTemplate: '<center>{{row.entity.orderId}}</center>',
                visible: true
            },
            {
                name: 'price',
                displayName: 'Price',
                width: 130,
                enableColumnMenu: false,
                cellTemplate: '<center>{{row.entity.currency}} {{row.entity.price}}</center>',
                visible: true
            },
            {
                name: 'itemCount',
                displayName: 'Item Count',
                width: 130,
                enableColumnMenu: false,
                cellTemplate: '<center>{{row.entity.itemCount}}</center>',
                visible: true
            },
            {
                name: 'status',
                displayName: 'Status',
                width: 180,
                enableColumnMenu: false,
                cellTemplate: '<center>{{row.entity.status}}</center>',
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
                name: 'updatedAt',
                displayName: 'Invoice',
                width: 80,
                enableColumnMenu: false,
                cellTemplate: '<center><a href="#""><i class="fa fa-download" aria-hidden="true"></i></a></center>',
                visible: true
            }
        ];


        displayData.forEach(function (row) {
            $scope.orderDetailsGridData.push(row);
        });


    }]);
;
