(function () {
	angular.module('setup.test').controller('sectionSetupTestController', sectionSetupTestController);

	sectionSetupTestController.$inject = ['$scope', 'sectionSetupAPIService'];

	function sectionSetupTestController($scope, sectionSetupAPIService) {

		console.log(sectionSetupAPIService)

		$scope.data = {
			responseList: []
		};

		runTest();

		function runTest() {
			insertSection();
			getSectionsByWell();
			getOperationsBySection();
		}

		function insertSection() {
			var section = {
				enabled: true,
				mdBottom: 2100,
				mdTop: 2010,
				name: "Section Teste",
				sectionOrder: 5,
				size: 36,
				well: {
					id: 1
				}
			}

			sectionSetupAPIService.insertObject(
				section,
				(result) => successCallback(result, 'insertObject', getSectionById),
				(error) => errorCallback(error, 'insertObject')
			);
		}

		function getSectionById(section) {
			sectionSetupAPIService.getObjectById(
				section.id,
				(result) => successCallback(result, 'getObjectById', updateSection),
				(error) => errorCallback(error, 'getObjectById')
			);
		}

		function updateSection(section) {
			section.mdTop = 3010;
			section.mdBottom = 3100;
			section.name = 'Section Editada';
			section.size = 46;

			sectionSetupAPIService.updateObject(section,
				(result) => successCallback(result, 'updateObject'),
				(error) => errorCallback(error, 'updateObject')
			);
		}

		function getSectionsByWell() {
			sectionSetupAPIService.getListOfSectionsByWell(1,
				(result) => successCallback(result, 'getListOfSectionsByWell'),
				(error) => errorCallback(error, 'getListOfSectionsByWell')
			);
		}

		function getOperationsBySection() {
			sectionSetupAPIService.getListOfOperationsBySection(1,
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