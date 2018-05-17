(function () {
	angular.module('setup.test').controller('wellSetupTestController', wellSetupTestController);

	wellSetupTestController.$inject = ['$scope', 'wellSetupAPIService'];

	function wellSetupTestController($scope, wellSetupAPIService) {

		$scope.data = {
			responseList: []
		};

		runTest();

		function runTest() {
			insertWell();
			getList();
		}

		function insertWell(callback) {
			var well = {
				name: "Well Test",
				current: true,
				running: false,
				airGap: 10,
				waterDepth: 2000,
				onshore: false
			}

			wellSetupAPIService.insertObject(
				well,
				(result) => successCallback(result, 'insertObject', getWellById),
				(error) => errorCallback(error, 'insertObject')
			);
		}

		function getList() {
			wellSetupAPIService.getList(
				(result) => successCallback(result, 'getList'),
				(error) => errorCallback(error, 'getList')
			);
		}

		function getWellById(well) {
			wellSetupAPIService.getObjectById(
				well.id,
				(result) => successCallback(result, 'getObjectById', updateWell),
				(error) => errorCallback(error, 'getObjectById')
			);
		}

		function updateWell(well) {
			well.name = 'Well 2';
			well.airGap = 20;
			well.waterDepth = 4000;
			well.current = false;

			wellSetupAPIService.updateObject(well,
				(result) => successCallback(result, 'updateObject', removeWell),
				(error) => errorCallback(error, 'updateObject')
			);
		}

		function removeWell(well) {

			wellSetupAPIService.removeObject(well,
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