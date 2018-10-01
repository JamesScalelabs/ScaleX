angular.module('SLModule.reports')
	.factory('ReportsService',
		function ($http, slDashboardConfig) {
			var reportsAPI = {};

			reportsAPI.getProductLevelInventoryReport = function (request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.GET_PRODUCT_LEVEL_INVENTORY_REPORT, request);
			};
			reportsAPI.getTopProductsSold = function (request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.GET_TOP_PRODUCTS_SOLD, request);
			};

			return reportsAPI;
		}
	);