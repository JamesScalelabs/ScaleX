angular.module('SLModule.orderStatus')
	.factory('OrderStatusService',
		function ($http, slDashboardConfig) {
			var asAPI = {};

			asAPI.getSellerOrders = function (request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.GET_SELLER_ORDERS, request);
			};

			asAPI.syncSellerOrders = function (request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.SYNC_SELLER_ORDERS, request);
			}

			asAPI.getSellerOrdersCount = function (request) {
				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.GET_SELLER_ORDERS_COUNT, request);
			}
			asAPI.downloadInvoice = function (request) {
				var config = {
					responseType: "blob"
				};

				return $http.post(slDashboardConfig.restServer + slDashboardConfig.restApis.DOWNLOAD_INVOICE, request, config);
			}



			return asAPI;
		}
	);
