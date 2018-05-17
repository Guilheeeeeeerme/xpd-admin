(function () {
	angular.module('setup.test').controller('categorySetupTestController', categorySetupTestController);

	categorySetupTestController.$inject = ['$scope', 'categorySetupAPIService'];

	function categorySetupTestController($scope, categorySetupAPIService) {

		$scope.data = {};
	
		// TESTE OK
		// categorySetupAPIService.getCategoryName(1,
		// 	function (result) {
		// 		$scope.data.getCategoryName = {
		// 			success: result
		// 		};
		// 	},
		// 	function (error) {
		// 		$scope.data.getCategoryName = {
		// 			error: error
		// 		};
		// 	}
		// );

		// TESTE OK
		// categorySetupAPIService.getList(
		// 	function (result) {
		// 		$scope.data.getList = {
		// 			success: result
		// 		};
		// 	},
		// 	function (error) {
		// 		$scope.data.getList = {
		// 			error: error
		// 		};
		// 	}
		// );

		// TESTE OK
		// var category = {
		// 	initial: 'C01',
		// 	name: 'category 1',
		// 	parentId: 1,
		// };
		// categorySetupAPIService.insertObject(category,
		// 	function (result) {
		// 		$scope.data.getList = {
		// 			success: result
		// 		};
		// 	},
		// 	function (error) {
		// 		$scope.data.getList = {
		// 			error: error
		// 		};
		// 	}
		// );

		// TESTE OK
		// var category = {
		// 	id: 2,
		// 	initial: 'C02',
		// 	name: 'category 2',
		// 	parentId: 1,
		// };
		// categorySetupAPIService.removeObject(category,
		// 	function (result) {
		// 		$scope.data.getList = {
		// 			success: result
		// 		};
		// 	},
		// 	function (error) {
		// 		$scope.data.getList = {
		// 			error: error
		// 		};
		// 	}
		// );

		// TESTE OK
		// var category = {
		// 	id: 2,
		// 	initial: 'C01',
		// 	name: 'category 1',
		// 	parentId: 1,
		// };
		// categorySetupAPIService.updateObject(category,
		// 	function (result) {
		// 		$scope.data.getList = {
		// 			success: result
		// 		};
		// 	},
		// 	function (error) {
		// 		$scope.data.getList = {
		// 			error: error
		// 		};
		// 	}
		// );

	}
})();