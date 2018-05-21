(function () {

	'use strict';

	angular.module('setup.test').controller('readingSetupTestController', readingSetupTestController);

	readingSetupTestController.$inject = ['$scope', 'readingSetupAPIService'];

	function readingSetupTestController($scope, readingSetupAPIService) {

		var fromDate = new Date(2018, 1, 1, 0, 0, 0, 0);
		var toDate = new Date(2018, 1, 2, 0, 0, 0, 0);

		$scope.dados = {};
		$scope.dados.error = {};
		$scope.dados.success = {};

		readingSetupAPIService.getAllReadingSince(
			fromDate.getTime(), 
			function (result) {
				$scope.dados.success.getAllReadingSince = result;
			}, 
			function (error) {
				$scope.dados.error.getAllReadingSince = error;
			}
		);

		readingSetupAPIService.getTick(
			fromDate.getTime(), 
			function (result) {
				$scope.dados.success.getTick = result;
			}, 
			function (error) {
				$scope.dados.error.getTick = error;
			}
		);

		readingSetupAPIService.getAllReadingByStartEndTime(
			fromDate.getTime(),
			toDate.getTime(),
			function (result) {
				$scope.dados.success.getAllReadingByStartEndTime = result;
			}, 
			function (error) {
				$scope.dados.error.getAllReadingByStartEndTime = error;
			}
		);

	}

})();