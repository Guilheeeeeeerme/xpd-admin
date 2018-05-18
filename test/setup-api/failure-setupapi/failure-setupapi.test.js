(function () {
	angular.module('setup.test').controller('failureSetupTestController', failureSetupTestController);

	failureSetupTestController.$inject = ['$scope', 'failureSetupAPIService'];

	function failureSetupTestController($scope, failureSetupAPIService) {

		$scope.data = {
			responseList: []
		};

		runTest();

		function runTest() {
			insertFailure();
			// listFailure();
			// getSectionsByWell();
			// getOperationsBySection();
		}

		function insertFailure() {
			var failure = {
				category: {id: 1},
				description: "FALHA DE TESTE",
				npt: true,
				onGoing: true,
				operation: {id: 5},
				startTime: "2018-05-18T12:00:00.000Z",
				endTime: "2018-05-18T13:00:00.000Z"
			}

			failureSetupAPIService.insertObject(failure,
				(result) => successCallback(result, 'insertObject', listByOperation),
				(error) => errorCallback(error, 'insertObject')
			);
		}

		// NINGUEM USA O LIST BY OPERATION NO SISTEMA
		function listByOperation() {
			listFailuresOnGoing();

			// failureSetupAPIService.listByOperation(5,
			// 	(result) => successCallback(result, 'listByOperation', listFailuresOnGoing),
			// 	(error) => errorCallback(error, 'listByOperation')
			// );
		}

		function listFailuresOnGoing() {
			failureSetupAPIService.listFailuresOnGoing(
				(result) => successCallback(result, 'listFailuresOnGoing', updateFailure),
				(error) => errorCallback(error, 'listFailuresOnGoing')
			);
		}

		function updateFailure(failure) {
			var failure = failure[0];
			failure.description = "FALHA DE TESTE EDITADA",
			failure.npt = false;
			failure.onGoing = false;
			failure.endTime = new Date()

			failureSetupAPIService.updateObject(failure,
				(result) => successCallback(result, 'updateObject', getFailuresOnInterval),
				(error) => errorCallback(error, 'updateObject')
			);
		}

		function getFailuresOnInterval(failure) {
			from = new Date(failure.startTime).getTime();
			to = new Date(failure.endTime).getTime();

			failureSetupAPIService.getFailuresOnInterval(from, to,
				(result) => successCallback(result, 'getFailuresOnInterval', listFailure),
				(error) => errorCallback(error, 'getFailuresOnInterval')
			);
		}

		function listFailure(failures) {
			failureSetupAPIService.listFailures(
				(result) => successCallback(result, 'listFailures', removeFailure),
				(error) => errorCallback(error, 'listFailures')
			);
		}

		function removeFailure(failures) {
			failureSetupAPIService.removeObject(failures[0],
				(result) => successCallback(result, 'removeObject'),
				(error) => errorCallback(error, 'removeObject')
			);
		}

		

		function getOperationsBySection() {
			failureSetupAPIService.getListOfOperationsBySection(1,
				(result) => successCallback(result, 'getListOfOperationsBySection'),
				(error) => errorCallback(error, 'getListOfOperationsBySection')
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