angular.module('SLModule.home')	
	.factory('HomeService', 
		function($http, slDashboardConfig) {	
			var homeAPI = {};

			homeAPI.signIn = function(signInData) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.LOGIN, signInData);
			};			

			homeAPI.signOut = function(signOutData) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.LOGOUT, signOutData);
			};	

			homeAPI.changePassword = function(cpData) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.RESET_PASSWORD, cpData);
			};		

			homeAPI.getStockDetails = function(userData) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.GET_STOCK_DETAILS, userData);
			};

			homeAPI.getGraphData = function(postData){
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.GET_SALES_OR_ORDERS_GRAPH, postData);
			};

			homeAPI.getSalesandOrdersReport = function(postData){
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.GET_SALES_OR_ORDERS_REPORT, postData); 
			}


			return homeAPI;
		}
	);