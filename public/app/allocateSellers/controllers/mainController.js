angular.module('SLModule.allocateSellers')

.controller('AllocateSellerController',["$scope","$window","AllocateSellerService","slDashboardConfig","localStorageService",
	function($scope,$window,AllocateSellerService,slDashboardConfig,localStorageService){ 
			console.log('AllocateSellerController'); 

        $scope.updatedTime=new Date();
        adminUser = localStorageService.get('userData').userName; 

        $scope.alerts = {
            "alert": false,
            "type": "",
            "msg": ""
        };
        $scope.onGetSeller=false;

        $scope.closeAlert = function() {
            $scope.alerts.alert = false;
        };
			$scope.configure=[];
			$scope.updatedTime = new Date();
			$scope.muList=[];
			$scope.muList=["Select"];
      $scope.selectedManager="Select";
			$scope.configure=[];


		    $scope.availableDataModel = [];
	  		$scope.selectedDataModel = [];
	  		$scope.assignRoleData = [];
	  		var originalAvailableData = [];

      pushToConfig = {
        "selectedData":[],
        "availableData":[]
      };

      if($scope.selectedManager=="Select"){
              $scope.alerts.alert = true;
              $scope.alerts.type = 'warning';
              $scope.alerts.msg = "Please Select Manager to display the Seller List!!";
              $scope.configure=[];
        }


        $scope.doCancel = function(){
           
        };

        $scope.allocateSellers = function(){
          $scope.onGetSeller = true;
          var asRequest = { 
                 "userName":adminUser,
                 "user" : {
                  "managerUserName" : $scope.selectedManager,
                  "allocatedSeller" : []
                 }
               };
               $scope.configure[0].selectedData.forEach(function(row){
                var temp ={
                            "seller":""
                          };
                  temp.seller = row.value.toString();
                 asRequest.user.allocatedSeller.push(temp);
                 
               });
               console.log('allocate Seller Request');
               console.log(asRequest);

         AllocateSellerService.allocateSeller(asRequest).success(function(result) {
            $scope.onGetSeller = false;
            if (result.responseCode === 0) {
              $scope.alerts.alert = true;
              $scope.alerts.type = 'info';
              $scope.alerts.msg = "Seller/Sellers Allocated Successfully!!!!";
              $scope.disableSubmit = false;
            }
              else {
              $scope.alerts.alert = true;
              $scope.alerts.type = 'danger';
              $scope.alerts.msg = result.errorMsg;
              $scope.disableSubmit = false;
            }
          }).
          error(function(data, status, headers, config) {        
            $scope.onGetSeller = false;
            $scope.addAlerts.alert = true;
            $scope.addAlerts.type = 'danger';
            $scope.addAlerts.msg = SharedService.getErrorMessage(status);
          });
     };


        $scope.getAllocateSellers = function(){
          
          console.log('Inside Get Allocat Sellers');
           var getASRequest = { 
                             "userName":adminUser,
                             "user" : {
                                "managerUserName" : $scope.selectedManager
                              }
                          }; 

            if($scope.selectedManager=="Select"){
              $scope.alerts.alert = true;
              $scope.alerts.type = 'warning';
              $scope.alerts.msg = "Please Select Manager to display the Seller List!!";
              $scope.configure=[];
            }
            else{
              $scope.onGetSeller = true;
            AllocateSellerService.getAllocateSellers(getASRequest).success(function(result) {
              $scope.closeAlert();
              $scope.onGetSeller = false;
            if (result.responseCode === 0) {

              if(result.response.allocatedUser)
                  pushToConfig.selectedData = result.response.allocatedUser;
              if(result.response.unAllocatedUser)
                 pushToConfig.availableData = result.response.unAllocatedUser;

              $scope.configure.push(pushToConfig);

            }
              else {
              $scope.alerts.alert = true;
              $scope.alerts.type = 'danger';
              $scope.alerts.msg = result.errorMsg;
              $scope.disableSubmit = false;
            }
          }).
          error(function(data, status, headers, config) { 
                $scope.onGetSeller = false;  
                $scope.addAlerts.alert = true;
                $scope.addAlerts.type = 'danger';
                $scope.addAlerts.msg = SharedService.getErrorMessage(status);
          });
        }
        };



	  		 $scope.addToSelected = function() {
          _.forEach($scope.availableDataModel, function(value) {
            tempArray = [];
            
            tempArray = _.filter($scope.configure[0].availableData, {
                    'id': value
                });               

                $scope.configure[0].selectedData.push(tempArray[0]);
                _.pull($scope.configure[0].availableData, tempArray[0]);                
          });
         // addToPackageData();
        };

        $scope.removeFromSelected = function() {
          _.forEach($scope.selectedDataModel, function(value) {
            tempArray = [];
            
            tempArray = _.filter($scope.configure[0].selectedData, {
                    'id': value
                });               

                $scope.configure[0].availableData.push(tempArray[0]);
                _.pull($scope.configure[0].selectedData, tempArray[0]);   
                $scope.packageSetupData = _.reject($scope.packageSetupData, {'package': value});              
          });
        };

        $scope.addAll = function() {
          var filteredData = _.clone($scope.configure[0].availableData, true);

            _.forEach(filteredData, function(value) {              
                $scope.configure[0].selectedData.push(value);  
                _.pull($scope.configure[0].availableData, value);   
          });         

          $scope.configure[0].availableData = [];
       //   addToPackageData();
        };

        $scope.removeAll = function() {
          _.forEach($scope.configure[0].selectedData, function(value) {             
                $scope.configure[0].availableData.push(value);                
          });           

          $scope.configure[0].selectedData = [];
          $scope.packageSetupData = [];
        };

    initPage = function() {
      $scope.onGetSeller = true;
      var getManagerListReq = {
          "userName":adminUser
      };

        AllocateSellerService.getManagerRole(getManagerListReq).success(function(result) {
              $scope.onGetSeller = false;
            if (result.responseCode === 0) {
               result.response.managerUsers.forEach(function(row) {
                   $scope.muList.push(row.userName);
              });
            }
              else {
              $scope.alerts.alert = true;
              $scope.alerts.type = 'danger';
              $scope.alerts.msg = result.errorMsg;
              $scope.disableSubmit = false;
            }
          }).
          error(function(data, status, headers, config) {
                $scope.onGetSeller = false;  
                $scope.addAlerts.alert = true;
                $scope.addAlerts.type = 'danger';
                $scope.addAlerts.msg = SharedService.getErrorMessage(status);
          });
    };


    initPage();
		


  
}]);