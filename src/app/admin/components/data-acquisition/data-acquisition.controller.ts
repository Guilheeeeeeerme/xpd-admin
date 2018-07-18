import { OperationDataService } from '../../../shared/xpd.operation-data/operation-data.service';

export class DataAcquisitionController {
	// 'use strict';

	// 	.controller('DataAcquisitionController', dataAcquisitionController);

	public static $inject = ['$scope', 'operationDataService'];
	public changeViewAcquisition: () => void;
	public changeViewReading: () => void;
	public operationDataFactory: any;

	constructor($scope, operationDataService: OperationDataService) {

		const vm = this;

		$scope.dados = {
			acquisitionJson: false,
			readingJson: false,
		};

		operationDataService.openConnection([]).then(function() {
			vm.operationDataFactory = operationDataService.operationDataFactory;
			$scope.readingData = vm.operationDataFactory.operationData.readingContext;
			$scope.acquisitionData = vm.operationDataFactory.operationData.dataAcquisitionContext;
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

}
