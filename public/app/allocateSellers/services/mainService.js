angular.module('SLModule.allocateSellers')	
	.factory('AllocateSellerService', 
		function($http, slDashboardConfig) {	
			var asAPI = {};

			asAPI.getManagerRole = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.GET_MANAGER_ROLE, request);
			};

			asAPI.getAllocateSellers = function(request){
			return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.GET_ALLOCATED_SELLERS, request);
			};

			asAPI.allocateSeller = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.ALLOCATE_SELLER, request);
			};

			return asAPI;
		}
	);