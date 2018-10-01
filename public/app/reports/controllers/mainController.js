angular.module('SLModule.reports')
    .controller("ReportsController", ["$scope", "ReportsService", "localStorageService", function ($scope, ReportsService, localStorageService) {
        var userData = localStorageService.get('userData');
        var userName = { "userName": userData.userName };
        $scope.firstTab = true;
        $scope.secondTab = false;
        $scope.onLoad = true;
        $scope.toggleTab = function (tab) {
            if (tab == 'first') {
                $scope.firstTab = true;
                $scope.secondTab = false;
            } else {
                $scope.firstTab = false;
                $scope.secondTab = true;
            }
        }
        ReportsService.getProductLevelInventoryReport(userName).success(function (result) {
            $scope.onLoad = false;
            if (result.responseCode === 0) {

                $scope.productLevelInventoryRemainingData = result.response.productLevelInventoryRemaining;
                $scope.overallInventoryWorth = result.response.overallInventoryWorth;
                $scope.inventoryWorthByCategory = result.response.inventoryWorthByCategory;
                $scope.NumberOfProductsToBeRestocked = result.response.numberOfProductsToBeRestocked;
            } else {

                $scope.alerts.alert = true;
                $scope.alerts.type = 'danger';
                $scope.alerts.msg = result.errorMsg;
            }
        }).error(function (data, status, headers, config) {
            $scope.onLoad = false;
            $scope.onGSOrder = false;
            $scope.alerts.alert = true;
            $scope.alerts.type = 'danger';
            $scope.alerts.msg = SharedService.getErrorMessage(status);
        });

        ReportsService.getTopProductsSold(userName).success(function (result) {
            $scope.onLoad = false;
            if (result.responseCode === 0) {
                $scope.overallProductsSold = result.response.overallProductsSold;
                $scope.productsSoldByCategory = result.response.productsSoldByCategory;
                $scope.productsSoldByRegion = result.response.productsSoldByRegion;
            } else {
                $scope.alerts.alert = true;
                $scope.alerts.type = 'danger';
                $scope.alerts.msg = result.errorMsg;
            }
        }).error(function (data, status, headers, config) {
            $scope.onLoad = false;
            $scope.onGSOrder = false;
            $scope.alerts.alert = true;
            $scope.alerts.type = 'danger';
            $scope.alerts.msg = SharedService.getErrorMessage(status);
        });

    }]);