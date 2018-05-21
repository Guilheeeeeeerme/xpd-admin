(function () {
	angular.module('setup.test').controller('categorySetupTestController', categorySetupTestController);

	categorySetupTestController.$inject = ['$scope', 'categorySetupAPIService'];

	function categorySetupTestController($scope, categorySetupAPIService) {

		$scope.data = {
			responseList: []
		};
	
		runTest();

		function runTest() {
			insertCategory();
			getCategoryName();
			getList();
		}

		function insertCategory() {
			var category = {
				initial: 'C01',
				name: 'category 1',
				parentId: 1,
			};

			categorySetupAPIService.insertObject(
				category,
				(result) => successCallback(result, 'insertObject', updateCategory),
				(error) => errorCallback(error, 'insertObject')
			);
		}

		function getCategoryName() {
			categorySetupAPIService.getCategoryName(1,
				(result) => successCallback(result, 'getCategoryName'),
				(error) => errorCallback(error, 'getCategoryName')
			);
		}

		function getList() {
			categorySetupAPIService.getList(
				(result) => successCallback(result, 'getList'),
				(error) => errorCallback(error, 'getList')
			);
		}

		function updateCategory(category) {
			var category = angular.copy(category);
			category.initial = 'C02';
			category.name = 'category 2';
		
			categorySetupAPIService.updateObject(category,
				(result) => successCallback(result, 'updateObject', removeCategory),
			(error) => errorCallback(error, 'updateObject')
			);
		}

		function removeCategory(category) {

			categorySetupAPIService.removeObject(category,
				(result) => successCallback(result, 'removeObject'),
				(error) => errorCallback(error, 'removeObject')
			);
		}

		function successCallback(result, method, nextTest) {

			$scope.data.responseList.push({
				method: method,
				code: 200,
				status: 'success',
				data: result,
			});

			nextTest && nextTest(result);
		}

		function errorCallback(error, method) {
			error.data.method = method;
			$scope.data.responseList.push(error.data);
		}
	}
})();