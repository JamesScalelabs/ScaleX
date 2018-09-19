angular.module('SLModule.home')
    .factory('ValidationService', 
        function($http, slDashboardConfig, $q, $location, localStorageService, $window) {
            var validateAPI = {};
            var userData = {};

            if (localStorageService.get('userData')) {
                userData = localStorageService.get('userData');
            }

            validateAPI.isSignedIn = function() {
                if (userData.userName && userData.token) {
                    slDashboardConfig.signedIn = true;
                    slDashboardConfig.userName = userData.userName;
                    slDashboardConfig.tokenVal = userData.token;

                    return true;
                } else {    
                    $window.location = "/";
                    return $q.reject("");            
                }
            };
            return validateAPI;
        }
    );