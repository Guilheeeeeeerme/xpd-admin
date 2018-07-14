import { OperationServerService } from '../../../xpd-resources/ng/xpd.communication/operation-server.service';

export class DataAcquisitionController {
	// 'use strict';

	// angular.module('xpd.admin')
	// 	.controller('DataAcquisitionController', dataAcquisitionController);

	public static $inject = ['$scope', 'operationDataService'];
	public changeViewAcquisition: () => void;
	public changeViewReading: () => void;
	public operationDataFactory: any;

	constructor($scope, operationDataService: OperationServerService) {

		const vm = this;

		$scope.dados = {
			acquisitionJson: false,
			readingJson: false,
		};

		operationDataService.openConnection([]).then(function(operationDataFactory: any) {
			vm.operationDataFactory = operationDataFactory;
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

}
