(function() {
	'use strict';

	angular.module('xpd.admin')
		.controller('DataAcquisitionController', dataAcquisitionController);

	dataAcquisitionController.$inject = ['$scope', 'operationDataFactory'];

	function dataAcquisitionController($scope, operationDataFactory) {

		let vm = this;

		$scope.dados = {
			acquisitionJson: false,
			readingJson: false,
		};

		operationDataFactory.openConnection([]).then(function(response) {
			operationDataFactory = response;
			$scope.readingData = operationDataFactory.operationData.readingContext;
			$scope.acquisitionData = operationDataFactory.operationData.dataAcquisitionContext;
		});

		vm.changeViewAcquisition = changeViewAcquisition;
		vm.changeViewReading = changeViewReading;

		function changeViewAcquisition() {
			if ($scope.dados.acquisitionJson) {
				$scope.dados.acquisitionJson = false;
			} else {
				$scope.dados.acquisitionJson = true;
			}
		}

		function changeViewReading() {
			if ($scope.dados.readingJson) {
				$scope.dados.readingJson = false;
			} else {
				$scope.dados.readingJson = true;
			}
		}

	}

})();
