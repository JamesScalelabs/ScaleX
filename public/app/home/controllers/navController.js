angular.module('SLModule.home')

	.controller('NavigationController', ["$window", "$scope", "HomeService", "slDashboardConfig", "localStorageService",
		function ($window, $scope, HomeService, slDashboardConfig, localStorageService) {

			(function ($) {
				"use strict"; // Start of use strict
				// Configure tooltips for collapsed side navigation
				$('.navbar-sidenav [data-toggle="tooltip"]').tooltip({
					template: '<div class="tooltip navbar-sidenav-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
				})
				// Toggle the side navigation
				$("#sidenavToggler").click(function (e) {
					e.preventDefault();
					$("body").toggleClass("sidenav-toggled");
					$(".navbar-sidenav .nav-link-collapse").addClass("collapsed");
					$(".navbar-sidenav .sidenav-second-level, .navbar-sidenav .sidenav-third-level").removeClass("show");
				});
				// Force the toggled class to be removed when a collapsible nav link is clicked
				$(".navbar-sidenav .nav-link-collapse").click(function (e) {
					e.preventDefault();
					$("body").removeClass("sidenav-toggled");
				});
				// Prevent the content wrapper from scrolling when the fixed side navigation hovered over
				$('body.fixed-nav .navbar-sidenav, body.fixed-nav .sidenav-toggler, body.fixed-nav .navbar-collapse').on('mousewheel DOMMouseScroll', function (e) {
					var e0 = e.originalEvent,
						delta = e0.wheelDelta || -e0.detail;
					this.scrollTop += (delta < 0 ? 1 : -1) * 30;
					e.preventDefault();
				});


				$('.navbar-nav>li>a').on('click', function () {
					$('.navbar-collapse').collapse('hide');
				});











				// Scroll to top button appear
				$(document).scroll(function () {
					var scrollDistance = $(this).scrollTop();
					if (scrollDistance > 100) {
						$('.scroll-to-top').fadeIn();
					} else {
						$('.scroll-to-top').fadeOut();
					}
				});
				// Configure tooltips globally
				$('[data-toggle="tooltip"]').tooltip()
				// Smooth scrolling using jQuery easing
				$(document).on('click', 'a.scroll-to-top', function (event) {
					var $anchor = $(this);
					$('html, body').stop().animate({
						scrollTop: ($($anchor.attr('href')).offset().top)
					}, 1000, 'easeInOutExpo');
					event.preventDefault();
				});
			})(jQuery); // End of use strict

			$scope.signedIn = {
				"status": slDashboardConfig.signedIn
			};

			var signOutData = {
				"userName": slDashboardConfig.userName,
				"token": slDashboardConfig.tokenVal
			};

			var userData = {
				"userName": "",
				"token": "",
				"groupName": ""
			};

			if (localStorageService.get('userData')) {
				userData = localStorageService.get('userData');

				if (userData.userName && userData.token && userData.groupName) {
					$scope.signedIn.status = true;
					$scope.isAdmin = userData.groupName === "ADMIN" ? true : false;
					$scope.userName = userData.userName;

					signOutData.userName = userData.userName;
					signOutData.token = userData.token;
				} else {
					$scope.signedIn.status = false;
				}
			}

			$scope.$on("LocalStorageModule.notification.setitem", function (key, newVal, type) {
				if (newVal.key === "userData") {
					userData = localStorageService.get('userData');

					if (userData.userName && userData.token && userData.groupName) {
						$scope.signedIn.status = true;
						$scope.isAdmin = userData.groupName === "ADMIN" ? true : false;
						$scope.userName = userData.userName;

						signOutData.userName = userData.userName;
						signOutData.token = userData.token;
					} else {
						$scope.signedIn.status = false;
					}
				}
			});
		}])

	.controller('LogoutController', ["$window", "$scope", "HomeService", "slDashboardConfig", "localStorageService", "SharedService",
		function ($window, $scope, HomeService, slDashboardConfig, localStorageService, SharedService) {
			$scope.signedIn = {
				"status": slDashboardConfig.signedIn
			};
			var signOutData = {
				"userName": slDashboardConfig.userName,
				"token": slDashboardConfig.tokenVal
			};

			var userData = {
				"userName": "",
				"token": "",
				"groupName": ""
			};

			if (localStorageService.get('userData')) {
				userData = localStorageService.get('userData');

				if (userData.userName && userData.token) {
					$scope.signedIn.status = true;
					$scope.userName = userData.userName;

					signOutData.userName = userData.userName;
					signOutData.token = userData.token;
				} else {
					$scope.signedIn.status = false;
				}
			}
			$scope.logout = function () {
				console.log('Inside Logout clearing all session storage');
				localStorageService.clearAll();
				$scope.signedIn.status = false;
				// HomeService.signOut(signOutData).success(function(response) {
				$window.location = "#/";
				$window.location.reload();
				//}).
				//error(function(data, status, headers, config) {
				//  $window.location = "/";
				//});                   
			};


		}])

	.controller('ChangePasswordController', ["$window", "$scope", "HomeService", "slDashboardConfig", "localStorageService", "SharedService",
		function ($window, $scope, HomeService, slDashboardConfig, localStorageService, SharedService) {

			$scope.alerts = {
				"alert": false,
				"type": "",
				"msg": ""
			};

			$scope.closeAlert = function () {
				$scope.alerts.alert = false;
			};

			$scope.cpData = {
				"userName": "",
				"newPassword": "",
				"oldPassword": "",
				"renewPassword": "",
				"groupName": ""
			};

			$scope.onChangePassword = false;
			if (localStorageService.get('userData')) {
				userData = localStorageService.get('userData');

				if (userData.userName && userData.token && userData.groupName) {

					$scope.cpData.userName = userData.userName;
					$scope.cpData.groupName = userData.groupName;

				} else {
					$scope.signedIn.status = false;
				}
			}

			$scope.changePassword = function () {
				$scope.onChangePassword = true;
				console.log('Inside Chnage Password', $scope.cpData);
				HomeService.changePassword($scope.cpData).success(function (result) {
					if (result.responseCode === 0) {
						$scope.onChangePassword = false;
						$scope.alerts.alert = true;
						$scope.alerts.type = 'info';
						$scope.alerts.msg = "Password Changed Successfully";

					} else {
						$scope.alerts.alert = true;
						$scope.alerts.type = 'danger';
						$scope.alerts.msg = result.errorMsg;
					}
				}).
					error(function (data, status, headers, config) {
						$scope.onChangePassword = false;
						$scope.alerts.alert = true;
						$scope.alerts.type = 'danger';
						$scope.alerts.msg = SharedService.getErrorMessage(status);
						$scope.onSubmit = false;
						$scope.disableSubmit = false;
					});

			}


		}])