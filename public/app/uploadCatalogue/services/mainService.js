angular.module('SLModule.uploadCatalogue')	
	.factory('UploadCatalogueService', 
		function($http, slDashboardConfig) {	
			var ucAPI = {};

			ucAPI.uploadCatalogue = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.UPLOAD_PRODUCT, request);
			};

			ucAPI.managerUploadCatalogue = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.MANAGER_UPLOAD_PRODUCT, request);
			};

			ucAPI.getAllProducts = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.GET_ALL_PRODUCTS, request);
			};
			
			ucAPI.uploadProductLazada = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.UPLOAD_PRODUCT_LAZADA, request);
			};
			ucAPI.getProductExcel = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.GET_PRODUCT_EXCEL, request);
			};
			ucAPI.updateProductExcel = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.UPDATE_PRODUCT_EXCEL, request);
			};
			return ucAPI;
		}
	);