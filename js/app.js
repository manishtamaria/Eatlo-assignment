var app = angular.module('app', ['ngRoute']);


app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/outlets', {
				templateUrl: 'partials/menu-page.html',
				controller: 'appCtrl'
			}).
			when('/outlets/:outletId', {
				templateUrl: 'partials/outlet-detail.html',
				controller: 'outletCtrl'
			}).
			otherwise({
				redirectTo: '/outlets'
			});
	}]);
app.controller('appCtrl',['$scope', '$http', 'appService', function($scope, $http, appService){
	if(appService.getAllOutlets().length == [])
		$http.get('data.json').success(function(data){
			appService.setAllOutlets(data);
			$scope.allOutletData = data;
		});
	$scope.hello = "manish welcome";
	$scope.locations = appService.getAllOutlets();
}]);
app.controller('outletCtrl', ['$scope', '$routeParams', 'appService', function($scope, $routeParams, $appService){
	$scope.currentOutletData = $appService.getOutletById(parseInt($routeParams.outletId));
	$scope.currentOutlet = $appService.getOutletById(parseInt($routeParams.outletId));
	var allData = $scope.currentOutletData.items;
	$scope.categoryBased = function(category){
		var sortedList = [];
		angular.forEach(allData, function(key){
			switch (category){
				case "veg":
					if(key.isVeg){
						sortedList.push(key)
					}
					break;
				case "nonveg":
					if(!key.isVeg){
						sortedList.push(key)
					}
					break;
				case "all":
					sortedList.push(key)
			}
		});
		$scope.currentOutlet.items = sortedList;
	};

}]);

app.service('appService', function($rootScope){

	var allOutlets =[];
	var currentOutlet;

	function getOutletById (id){
		var ot;
		angular.forEach(allOutlets, function(outlet){
			if(outlet.id == id)
			 	ot = outlet;
		});
		return ot;
	}

	return {
		getAllOutlets : function(){
			return allOutlets;
		},
		getOutletById :function(id){
			return getOutletById(id);
		},
		setCurrentOutlet : function(data){
			currentOutlet = data;
		},
		setAllOutlets :function(data){
			allOutlets = data;
		}
	};
});