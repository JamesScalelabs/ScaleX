angular.module('SLModule.configMarketPlace')	
	.factory('ConfigMarketPlaceService', 
		function($http, slDashboardConfig) {	
			var umAPI = {};

			umAPI.getAllMP = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.GET_ALL_MP, request);
			};	
			umAPI.createMP = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.CREATE_MP, request);
			};	
			umAPI.updateMP = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.UPDATE_MP_DETAILS, request);
			};	
			umAPI.deleteMP = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.DELETE_MP, request);
			};

			return umAPI;
		}
	);