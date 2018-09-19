angular.module('SLModule.orderTracking')	
	.factory('OrderTrackingService', 
		function($http, slDashboardConfig) {	
			var otAPI = {};

			otAPI.trackOrder = function(request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.TRACK_ORDER, request);
			};

			return otAPI;
		}
	);