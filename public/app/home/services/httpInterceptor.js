	angular
	  .module('SLModule.home').factory('httpInterceptor', function($q, $window, slDashboardConfig, localStorageService) {
	    return {
	      // optional method
	      'request': function(config) {
	      	config.headers.Authorization = slDashboardConfig.tokenVal;
	        config.headers.apiName = "ADMIN_DASHBOARD";
	        config.headers.username = slDashboardConfig.userName;
	        return config;
	      },
	      'responseError': function(errorResponse) {
	           switch (errorResponse.status) {
	             case 401:
	             	localStorageService.clearAll();
	             	$window.location = "/";
	               break;
	           }

	           return $q.reject(errorResponse);
	       }	      
	    };
	  });