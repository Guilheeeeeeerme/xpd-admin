(function () {
	angular.module('setup.test').controller('operationSetupTestController', operationSetupTestController);

	operationSetupTestController.$inject = ['$scope', '$http', 'operationSetupAPIService'];

	function operationSetupTestController($scope, $http, operationSetupAPIService) {

		$scope.data = {
			responseList: []
		};

		runTest();	

		function runTest() {
			$http.get('./operation-setupapi/operation.json').then(function (response) {
				var operation = response.data.operation;
				insertOperation(operation);
			});	
			getDefaultFields();
			getOperationList();
			// getOperationQueue()
		}

		function insertOperation(operation) {
			operationSetupAPIService.insertObject(
				operation,
				(result) => successCallback(result, 'insertObject', getOperationById),
				(error) => errorCallback(error, 'insertObject')
			);
		}

		function getOperationById(operation) {
			operationSetupAPIService.getObjectById(
				operation.id,
				(result) => successCallback(result, 'getObjectById', updateOperation),
				(error) => errorCallback(error, 'getObjectById')
			);
		}

		function updateOperation(operation) {
			operation.name = "OPERATION TESTE EDITADA"
			operation.length = 500;
			operation.startHoleDepth = 3000;
			operation.section = {
				id: 1
			};

			operationSetupAPIService.updateObject(operation,
				(result) => successCallback(result, 'updateObject', getOperationAlarms),
				(error) => errorCallback(error, 'updateObject')
			);
		}

		function getOperationAlarms(operation) {
			operationSetupAPIService.getOperationAlarms(
				operation.id,
				(result) => successCallback(result, 'getOperationAlarms'),
				(error) => errorCallback(error, 'getOperationAlarms')
			);
		}

		function getDefaultFields() {
			operationSetupAPIService.getDefaultFields('bha',
				(result) => successCallback(result, 'getDefaultFields'),
				(error) => errorCallback(error, 'getDefaultFields')
			);
		}

		function getOperationList() {
			operationSetupAPIService.getList(
				(result) => successCallback(result, 'getList'),
				(error) => errorCallback(error, 'getList')
			);
		}

		function getOperationQueue() {
			// FIXME: REVISAR ESSA ROTA
			operationSetupAPIService.getOperationQueue(1,
				(result) => successCallback(result, 'getOperationQueue'),
				(error) => errorCallback(error, 'getOperationQueue')
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