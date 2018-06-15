(function () {

	'use strict';

	angular.module('xpd.admin').controller('OperationDashboardController', operationDashboardController);

	operationDashboardController.$inject = ['$scope', 'operationDataFactory'];

	function operationDashboardController($scope, operationDataFactory) {

		var vm = this;

		$scope.dados = {};

		operationDataFactory.operationData = [];

		$scope.operationData = operationDataFactory.operationData;
	}

})();