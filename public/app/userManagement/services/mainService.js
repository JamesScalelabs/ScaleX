angular.module('SLModule.userManagement')	
	.factory('UserManagementService', 
		function($http, slDashboardConfig) {	
			var umAPI = {};

			umAPI.getAllUsers = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.GET_ALL_USERS, request);
			};	


			umAPI.addUser = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.CREATE_USER, request);
			};	

			umAPI.updateUserDetails = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.UPDATE_USER_DETAILS, request);
			};			

			umAPI.deleteUser = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.DELETE_USER, request);
			};

			umAPI.enableUser = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.ENABLE_USER, request);
			};	
			umAPI.disableUser = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.DISABLE_USER, request);
			};	

			return umAPI;
		}
	);