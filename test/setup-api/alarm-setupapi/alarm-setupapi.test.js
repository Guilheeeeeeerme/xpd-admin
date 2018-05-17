(function () {
	'use strict';

	angular.module('setup.test').controller('alarmSetupTestController', alarmSetupTestController);

	alarmSetupTestController.$inject = ['$scope', 'alarmSetupAPIService'];

	function alarmSetupTestController($scope, alarmSetupAPIService) {

		$scope.dados = {

		};

		alarmSetupAPIService.getByOperationType('BHA', 5,
			function (result) {
				$scope.dados.getByOperationType = {
					success: result
				};
			},
			function (error) {
				$scope.dados.getByOperationType = {
					success: error
				};
			}
		);

		console.log(alarmSetupAPIService);
	}


})();