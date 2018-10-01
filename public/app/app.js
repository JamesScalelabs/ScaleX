var slDashboard = angular
    .module('slDashboard',
        ['SLModule.home',
            'SLModule.userManagement',
            'SLModule.allocateSellers',
            'SLModule.configMarketPlace',
            'SLModule.orderStatus',
            'SLModule.uploadCatalogue',
            'SLModule.orderTracking',
            'SLModule.shared',
            'SLModule.reports',
            'ngRoute',
            'ngAnimate',
            'ngSanitize',
            'ngFileSaver',
            'ui.bootstrap',
            // 'ngTouch',   
            'ui.grid',
            'ui.grid.edit',
            'ui.grid.selection',
            'ui.grid.resizeColumns',
            'ui.grid.autoResize',
            'ui.grid.pagination',
            'ui.grid.cellNav',
            'LocalStorageModule',
            'chart.js'

        ]).config(function (ChartJsProvider) {
            ChartJsProvider.setOptions({ colors: ['#f00', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
        });


angular.element(document).ready(function () {
    var slDashboardConfig = {};
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    $http.get('data/appConfig.json').then(function (response) {
        slDashboardConfig.restServer = response.data.restServer;
        slDashboardConfig.restApis = response.data.restApis;
        slDashboardConfig.responseTimeout = response.data.responseTimeout;

        angular.bootstrap(document, ['slDashboard']);
    });

    //Adding The Constant
    slDashboard.constant('slDashboardConfig', slDashboardConfig);


});

