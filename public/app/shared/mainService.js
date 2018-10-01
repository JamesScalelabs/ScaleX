angular
	.module('SLModule.shared')
	.factory('SharedService', ['$http', 'slDashboardConfig',
		function ($http, slDashboardConfig) {
			var sharedAPI = {};

			sharedAPI.getErrorMessage = function (errorCode) {
				var errMsg = "OTHR_ERR_CODE";

				switch (errorCode) {
					case 404:
						errMsg = "404_ERR_CODE";
						break;
					case 500:
						errMsg = "500_ERR_CODE";
						break;
					case 502:
						errMsg = "502_ERR_CODE";
						break;
					case 403:
						errMsg = "403_ERR_CODE";
						break;
					case 0:
						errMsg = "TIME_OUT_CODE";
						break;
				}

				return errMsg;
			};

			sharedAPI.getManagerRole = function (request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.GET_MANAGER_ROLE, request);
			};

			sharedAPI.getAllocateSellers = function (request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.GET_ALLOCATED_SELLERS, request);
			};



			return sharedAPI;
		}
	]);