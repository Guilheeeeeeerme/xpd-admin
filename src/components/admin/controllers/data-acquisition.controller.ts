import { OperationDataFactory } from '../../../xpd-resources/ng/xpd.communication/operation-server-data.factory';

export class DataAcquisitionController {
	// 'use strict';

	// angular.module('xpd.admin')
	// 	.controller('DataAcquisitionController', dataAcquisitionController);

	public static $inject = ['$scope', 'operationDataFactory'];
	public operationDataFactory: any;
	public changeViewAcquisition: () => void;
	public changeViewReading: () => void;

	constructor($scope, operationDataFactory: OperationDataFactory) {

		const vm = this;

		$scope.dados = {
			acquisitionJson: false,
			readingJson: false,
		};

		operationDataFactory.openConnection([]).then(function(response) {
			vm.operationDataFactory = response;
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
