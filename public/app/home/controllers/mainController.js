angular.module('SLModule.home')


	.controller('HomeController', ["$scope", "$uibModal", "$window", "HomeService", "slDashboardConfig", "localStorageService",
		function ($scope, $uibModal, $window, HomeService, slDashboardConfig, localStorageService) {

			console.log("home cont tt");
			console.log("localStorageService.get('userData')", localStorageService.get('userData'))
			var options = {
				year: "numeric", month: "short",
				day: "numeric", hour: "2-digit", minute: "2-digit"
			};
			var colors = ['firebrick', 'black', 'blue', 'fuchsia', 'gray', 'green',
				'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red',
				'teal', 'indian red'];

			$scope.updatedAt = new Date();
			$scope.formattedDate = $scope.updatedAt.toLocaleTimeString("en-us", options);
			var userData = {
				"userName": "",
				"token": "",
				"groupName": ""
			};
			$scope.signInData = {
				"userName": "",
				"password": ""
			}

			$scope.onLogin = false;

			$scope.alerts = {
				"alert": false,
				"type": "",
				"msg": ""
			};

			function getMarketPlaceData(data) {
				HomeService.getStockDetails(data).success(function (data) {
					$scope.stockData = data.response;
					$scope.noOfStock = data.response.length;

				});
			}
			function getGraphData(udata) {
				$scope.series = [];
				$scope.labels = [];
				$scope.graphsData = [];

				HomeService.getGraphData(udata).success(function (data) {
					$scope.labels = data.response[0].dates;
					for (let i in data.response) {
						$scope.series.push(data.response[i].marketPlace);
						$scope.graphsData.push(data.response[i].data);
					}
				});
			}
			function getGraphData1(udata) {
				$scope.series1 = [];
				$scope.labels = [];
				$scope.graphsData1 = [];

				HomeService.getGraphData(udata).success(function (data) {
					$scope.labels = data.response[0].dates;
					for (let i in data.response) {
						$scope.series1.push(data.response[i].marketPlace);
						$scope.graphsData1.push(data.response[i].data);
					}
				});
			}
			function getSalesOrdersReport(udata) {
				HomeService.getSalesandOrdersReport(udata).success(function (data) {
					if (udata.type === "ORDERS") {
						$scope.orders = data.response[0];
					} else {
						$scope.sales = data.response[0]
					}

				});
			}
			function dashboardDatasetup() {
				var date = new Date(), y = date.getFullYear(), m = date.getMonth();
				var monthfirstDay = new Date(y, m, 1);
				var monthlastDay = new Date(y, m + 1, 0);
				var curr = new Date; // get current date
				var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
				var last = first + 6; // last day is the first day + 6

				var weekfirstday = new Date(curr.setDate(first)).toUTCString();
				var weeklastday = new Date(curr.setDate(last)).toUTCString();

				var udata = {
					"userName": userData.userName,
					"user": {
						"sellerName": userData.userName
					},
					thisMonth: {
						"startDate": monthfirstDay,
						"endDate": monthlastDay
					}
				}
				var orderdata = {
					"userName": userData.userName,
					"user": {
						"sellerName": userData.userName
					},
					"type": "ORDERS",
					thisMonth: {
						"startDate": monthfirstDay,
						"endDate": monthlastDay
					},
					thisWeek: {
						"startDate": weekfirstday,
						"endDate": weeklastday
					}
				}
				var graphdata = {
					"userName": userData.userName,
					"user": {
						"sellerName": userData.userName
					},
					"startDate": monthfirstDay,
					"endDate": monthlastDay
				}
				getMarketPlaceData(udata);
				getGraphData(graphdata);
				getSalesOrdersReport(orderdata);
			}
			$scope.closeAlert = function () {
				$scope.alerts.alert = false;
			};

			if (localStorageService.get('userData')) {
				userData = localStorageService.get('userData');

				if (userData.userName && userData.token && userData.groupName) {
					slDashboardConfig.signedIn = true;
					slDashboardConfig.userName = userData.userName;
					slDashboardConfig.tokenVal = userData.token;
					slDashboardConfig.groupName = userData.groupName;

					$scope.isAdmin = userData.groupName == "ADMIN";
					$scope.isManager = userData.groupName == "MANAGER";
					$scope.isSeller = userData.groupName == "SELLER";
					dashboardDatasetup();
				} else {
					slDashboardConfig.signedIn = false;
				}
			}


			$scope.signedIn = {
				"status": slDashboardConfig.signedIn
			};

			$scope.onSubmit = false;
			$scope.disableSubmit = false;

			$scope.signIn = function () {
				$scope.onSubmit = true;
				$scope.disableSubmit = true;
				$scope.alerts.alert = false;
				$scope.onLogin = true;

				HomeService.signIn($scope.signInData).success(function (result) {

					if (result.responseCode === 0) {
						$scope.onLogin = false;
						userData.userName = $scope.signInData.userName;
						userData.token = result.response.token;
						userData.groupName = result.response.groupName;

						$scope.isAdmin = userData.groupName == "ADMIN";
						$scope.isManager = userData.groupName == "MANAGER";
						$scope.isSeller = userData.groupName == "SELLER";

						slDashboardConfig.tokenVal = result.response.token;
						slDashboardConfig.userName = $scope.signInData.userName;
						slDashboardConfig.groupName = result.response.groupName;
						localStorageService.set('userData', userData);
						$scope.signedIn.status = true;
						dashboardDatasetup();
					} else {
						$scope.onLogin = false;
						$scope.disableSubmit = false;
						$scope.alerts.alert = true;
						$scope.alerts.type = 'danger';
						$scope.alerts.msg = result.errorMsg;
						$scope.onSubmit = false;
						$scope.disableSubmit = false;
					}
				}).
					error(function (data, status, headers, config) {
						$scope.onLogin = false;
						$scope.alerts.alert = true;
						$scope.alerts.type = 'danger';
						$scope.alerts.msg = SharedService.getErrorMessage(status);
						$scope.onSubmit = false;
						$scope.disableSubmit = false;
					});

			};

			$scope.onEnter = function (keyEvent) {
				if (keyEvent.charCode === 13) {
					$scope.signIn();
				}
			};


			$scope.onClick = function (points, evt) {
				console.log(points, evt);
			};


			$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
			$scope.options = {
				elements: {
					line: { fill: false }
				},
				legend: { display: true },
				scales: {
					yAxes: [
						{
							id: 'y-axis-1',
							type: 'linear',
							display: true,
							position: 'left'
						}
					]
				}
			};
			$scope.coloptions = {
				legend: { display: true },
				scales: {
					yAxes: [
						{
							id: 'y-axis-1',
							type: 'linear',
							display: true,
							position: 'left'
						}
					]
				}
			};

		}])
