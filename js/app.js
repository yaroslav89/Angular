var App = angular.module('galleryApp',['ngRoute']);

	App.config(['$routeProvider', function($routeProvider){
		$routeProvider
	
		.when('/', {
		templateUrl: 'pages/shop.html',
		controller: 'shopCtrl'
		})

		.when('/cart', {
			templateUrl: 'pages/cart.html',
			controller: 'cartCtrl'
		});
	}]);

	App.controller('shopCtrl', ['$http', '$scope', function ($http, $scope) {
			$scope.manufacture = "BMW";

			$scope.select = function() {
				$http.get('data/cars.json').success(function(data){
						$scope.content = data[$scope.manufacture];
				});
			}
			$scope.addCart = function(id) {
				var array = [];
				var obj = {};
				$http.get('data/cars.json').success(function(data){
						if (angular.isUndefined(localStorage.data)) {
							obj = data[$scope.manufacture][id-1];
							array.push(obj);
							localStorage.data = JSON.stringify(array);
							showMessage(true);
						} else {
							array = JSON.parse(localStorage.data);
							obj = data[$scope.manufacture][id-1];
								if (carsIncart().indexOf(obj.model) < 0) {
									array.push(obj);
									localStorage.data = JSON.stringify(array);
									showMessage(true);
								} else {
									showMessage();
								}
						}
					});
			}

			function carsIncart() {
				if (angular.isDefined(localStorage.data)) {
					var modelArr = [];
					var storage = JSON.parse(localStorage.data);

					angular.forEach(storage, function(value){
						modelArr.push(value.model);
					});
					return modelArr;
				}
			}

			function showMessage(success) {
				if (success) {
					angular.element('.task-info').find('p').text('Added to cart');
					angular.element('.task-info').css({backgroundColor: '#1DE9B6'});
				} else {
					angular.element('.task-info').find('p').text('Car already exist in you cart');
					angular.element('.task-info').css({backgroundColor: '#ff1744'});
				}
				angular.element('.task-info').css({top: $(window).scrollTop()}).stop().slideDown(500).delay(600).slideUp(500);
			}

			$(window).on('scroll',function(){
				angular.element('.task-info').css({top: $(window).scrollTop()});
			});

			$scope.select();
	}]);
	
	App.controller('cartCtrl', ['$scope','$route', function ($scope,$route) {
			$scope.totalPrice = 0;
			
			if (angular.isDefined(localStorage.data)) {
				$scope.cartData = JSON.parse(localStorage.data);
				$scope.totalPrice = getTotalPrice($scope.cartData);
			}

			$scope.emptyCart = function() {
				localStorage.removeItem('data');
				$route.reload();
			} 

			$scope.del = function(md) {
				if (angular.isDefined(localStorage.data)) {
					var arr = JSON.parse(localStorage.data);
					var models = [];
					var id;

						angular.forEach(arr, function(value){
							models.push(value.model);
						});

						id = models.indexOf(md);
						arr.splice(id,1);
						localStorage.data = JSON.stringify(arr);

						if (JSON.parse(localStorage.data).length < 1) {
							localStorage.removeItem('data');
						}

						$route.reload();		
				}
			}

			function getTotalPrice(arr) {
				var price = 0;
				for (var i = 0; i <arr.length; i++) {
					price += parseInt(arr[i].price);
				}
				return price;
			}
	}]);

