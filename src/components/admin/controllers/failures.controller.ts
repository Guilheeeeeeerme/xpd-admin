import { OperationServerService } from '../../../xpd-resources/ng/xpd.communication/operation-server.service';
import { DialogService } from '../../../xpd-resources/ng/xpd.dialog/xpd.dialog.factory';
import { FailureModalFactory } from '../../../xpd-resources/ng/xpd.modal.failure/xpd-modal-failure.factory';

export class FailuresController {

	// 'use strict';

	// angular.module('xpd.failure-controller')
	// 	.controller('FailuresController', FailuresController);

	public static $inject = ['$scope', 'failureModal', 'operationDataService', 'dialogService'];
	public actionClickButtonAddFailure: () => void;
	public actionClickButtonRemoveFailure: (failure: any) => void;
	public actionClickButtonEditFailure: (selectedFailure: any) => void;
	public operationDataFactory: any;

	constructor(
		$scope,
		failureModal: FailureModalFactory,
		operationDataService: OperationServerService,
		dialogService: DialogService) {

		const vm = this;

		$scope.modalData = {
			failuresList: [],
			failureOnGoing: null,
			operation: {},
			category: {
				roleList: [],
				parentList: [],
				lastSelected: null,
			},
		};

		vm.actionClickButtonAddFailure = actionClickButtonAddFailure;
		vm.actionClickButtonRemoveFailure = actionClickButtonRemoveFailure;
		vm.actionClickButtonEditFailure = actionClickButtonEditFailure;

		operationDataService.openConnection([]).then(function (operationDataFactory: any) {
			vm.operationDataFactory = operationDataFactory;
			$scope.modalData.operation = operationDataFactory.operationData.operationContext.currentOperation;
			$scope.modalData.failuresList = operationDataFactory.operationData.failureContext.failureList;
		});

		operationDataService.addEventListener('failuresController', 'setOnFailureChangeListener', populateFailureList);

		function populateFailureList() {
			const failureContext = vm.operationDataFactory.operationData.failureContext;

			$scope.modalData.failuresList = failureContext.failureList;
			$scope.modalData.failureOnGoing = failureContext.failureOnGoing;
		}

		function actionClickButtonAddFailure() {
			let newFailure = {};

			if ($scope.modalData.operation != null) {
				newFailure = {
					operation: {
						id: $scope.modalData.operation.id,
					},
				};
			}

			failureModal.open(newFailure);
		}

		function actionClickButtonEditFailure(selectedFailure) {
			if ($scope.modalData.operation != null) {
				selectedFailure.operation = { id: $scope.modalData.operation.id };
			}

			failureModal.open(selectedFailure);
		}

		function actionClickButtonRemoveFailure(failure) {
			dialogService.showConfirmDialog('Do you want to remove this failure',
				function () {
					removeFailure(failure);
				},
			);
		}

		function removeFailure(failure) {
			vm.operationDataFactory.emitRemoveFailure(failure);
		}

	}

}
