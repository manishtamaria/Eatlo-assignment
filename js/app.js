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
			when('/admin', {
				templateUrl: 'partials/admin.html',
				controller: 'adminCtrl'
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
	$scope.hello = "manish welcome !!";
	$scope.locations = appService.getAllOutlets();
}]);
app.controller('adminCtrl', ['$scope', '$http', 'appService', function($scope, $http, appService){
	$http.get('data.json').success(function(data){

	})
}]);
app.controller('outletCtrl', ['$scope', '$routeParams','$location', 'appService', function($scope, $routeParams, $location, $appService){
	$scope.cartedItemIds = [];
	$scope.cartItems = [];
	$scope.itemCount = 0;
	$scope.totalAmount = 0;
	$scope.currentOutletData = $appService.getOutletById(parseInt($routeParams.outletId));
	$scope.currentOutlet = $appService.getOutletById(parseInt($routeParams.outletId));
	if($scope.currentOutlet == undefined){
		$location.path('/outlets')
	}
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
	$scope.addItemToCart = function(item){
		item.totalPrice = item.price;
		$scope.selectedItem = item;
		$scope.totalAmount += item.price;
		$scope.addedToCart($scope.selectedItem);
	};
	$scope.addedToCart = function (item){
		if(item.quantity ==0){
			item.quantity = 1;
		}
		$scope.itemCount++;
		var currItemId = item.itemId;
		if($scope.cartedItemIds.indexOf(currItemId) == -1){
			$scope.cartedItemIds.push(currItemId);
			$scope.cartItems.push(item);
		}
		else{
			angular.forEach($scope.cartItems, function(key,index){
				if(key.itemId == currItemId ){
					console.log(index);
					var currItem = _.findWhere($scope.cartItems, {itemId:currItemId});
					$scope.cartItems[index].quantity += 1;
					$scope.cartItems[index].totalPrice =  $scope.cartItems[index].quantity * item.price;
				}
			})
		}
		$scope.decreaseItemCount = function(item){
			$scope.itemCount--;
			$scope.totalAmount -= item.price;
			angular.forEach($scope.cartItems, function(key, index){
				if(key.itemId == item.itemId){
					$scope.cartItems[index].quantity -= 1;
					$scope.cartItems[index].totalPrice =  $scope.cartItems[index].quantity * item.price;
					if($scope.cartItems[index].quantity == 0){
						$scope.cartedItemIds = _.without($scope.cartedItemIds, item.itemId);
						$scope.cartItems = _.without($scope.cartItems, _.findWhere($scope.cartItems, {itemId: item.itemId}));
						//var index = $scope.cartItems.indexOf(item);
						//$scope.cartItems.splice(index, 1);
					}

				}
			});
		};
		$scope.increaseItemCount = function(item){
			$scope.itemCount++;
			$scope.totalAmount += item.price;
			angular.forEach($scope.cartItems, function(key, index){
				if(key.itemId == item.itemId){
					$scope.cartItems[index].quantity += 1;
					$scope.cartItems[index].totalPrice =  $scope.cartItems[index].quantity * item.price;
				}
			});
		};
		$scope.deleteItem = function(item){
			angular.forEach($scope.cartItems, function(key, index) {
				if (key.itemId == item.itemId) {
					$scope.itemCount -= $scope.cartItems[index].quantity;
					$scope.totalAmount -= $scope.cartItems[index].quantity * item.price;
					$scope.cartedItemIds = _.without($scope.cartedItemIds, item.itemId);
					$scope.cartItems = _.without($scope.cartItems, _.findWhere($scope.cartItems, {itemId: item.itemId}));
					//var index = $scope.cartItems.indexOf(item);
					//$scope.cartItems.splice(index, 1);
				}
			});
		}

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