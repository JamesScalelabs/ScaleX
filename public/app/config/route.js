angular.module('slDashboard')
	.config(['$routeProvider', '$httpProvider', '$locationProvider', function ($routeProvider, $httpProvider, $locationProvider) {
		$httpProvider.interceptors.push('httpInterceptor');

		$routeProvider
			.when('/', {
				templateUrl: 'views/homepage.html',
				controller: 'HomeController'
			})
			.when('/userManagement', {
				templateUrl: 'views/userManagement.html',
				controller: 'UserManagementController',
				resolve: {
					isSignedIn: ['ValidationService', function (ValidationService) {
						return ValidationService.isSignedIn();
					}]
				}
			})
			.when('/allocateSellers', {
				templateUrl: 'views/allocateSellers.html',
				controller: 'AllocateSellerController',
				resolve: {
					isSignedIn: ['ValidationService', function (ValidationService) {
						return ValidationService.isSignedIn();
					}]
				}
			})

			.when('/orderStatus', {
				templateUrl: 'views/orderStatus.html',
				controller: 'OrderStatusController',
				resolve: {
					isSignedIn: ['ValidationService', function (ValidationService) {
						return ValidationService.isSignedIn();
					}]
				}
			})

			.when('/configMarketPlace', {
				templateUrl: 'views/configMarketPlace.html',
				controller: 'ConfigMarketPlaceController',
				resolve: {
					isSignedIn: ['ValidationService', function (ValidationService) {
						return ValidationService.isSignedIn();
					}]
				}
			})

			.when('/orderTracking', {
				templateUrl: 'views/orderTracking.html',
				controller: 'OrderTrackingController',
				resolve: {
					isSignedIn: ['ValidationService', function (ValidationService) {
						return ValidationService.isSignedIn();
					}]
				}
			})

			.when('/uploadCatalogue', {
				templateUrl: 'views/uploadCatalogue.html',
				controller: 'UploadCatalogueController',
				resolve: {
					isSignedIn: ['ValidationService', function (ValidationService) {
						return ValidationService.isSignedIn();
					}]
				}
			})
			.when('/reports', {
				templateUrl: 'views/reports.html',
				controller: 'ReportsController',
				resolve: {
					isSignedIn: ['ValidationService', function (ValidationService) {
						return ValidationService.isSignedIn();
					}]
				}
			})

			.when('/forgot-password', {
				templateUrl: 'views/forgot-password.html',
				controller: ''
			})

			.when('/changePassword', {
				templateUrl: 'views/changePassword.html',
				controller: 'ChangePasswordController',
				resolve: {
					isSignedIn: ['ValidationService', function (ValidationService) {
						return ValidationService.isSignedIn();
					}]
				}
			})

			.otherwise({
				redirectTo: '/'
			});
	}]);