angular.module('slDashboard')
	.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
		  localStorageServiceProvider
			.setPrefix('slDashboard')
			.setStorageType('sessionStorage')
			.setNotify(true, true);
	}]);
