(function () {

	'use strict';

	angular.module('xpd.failure-controller')
		.controller('FailuresController', FailuresController);

	FailuresController.$inject = ['$scope', 'failureModal', '$uibModal', 'operationDataFactory', 'failureSetupAPIService', 'dialogFactory'];

	function FailuresController($scope, failureModal, $modal, operationDataFactory, failureSetupAPIService, dialogFactory) {
		var vm = this;

		$scope.modalData = {
			failuresList: [],
			failureOnGoing: [],
			operation: {},
			category: {
				roleList: [],
				parentList: [],
				lastSelected: null
			}
		};

		vm.actionClickButtonAddFailure = actionClickButtonAddFailure;
		vm.actionClickButtonRemoveFailure = actionClickButtonRemoveFailure;
		vm.actionClickButtonEditFailure = actionClickButtonEditFailure;

		operationDataFactory.operationData = [];

		$scope.modalData.operation = operationDataFactory.operationData.operationContext.currentOperation;

		populateFailureList();

		function populateFailureList() {
			failureSetupAPIService.listFailures(function (response) {
				$scope.modalData.failuresList = response.filter(function (failure) {
					return !failure.onGoing;
				});

				$scope.modalData.failureOnGoing = response.filter(function (failure) {
					return failure.onGoing;
				});
			});
		}

		function actionClickButtonAddFailure() {
			var newFailure = {};

			if ($scope.modalData.operation != null) {
				newFailure = {
					operation: {
						'id': $scope.modalData.operation.id
					}
				};
			}

			failureModal.open(newFailure, failureModalSuccessCallback, failureModalErrorCallback);
		}

		function actionClickButtonEditFailure(selectedFailure) {
			if ($scope.modalData.operation != null) {
				selectedFailure.operation = { 'id': $scope.modalData.operation.id };
			}

			failureModal.open(selectedFailure, failureModalSuccessCallback, failureModalErrorCallback);
		}

		function failureModalSuccessCallback(failure) {
			populateFailureList();
		}

		function failureModalErrorCallback() {
			dialogFactory.showConfirmDialog('Error on inserting failure, please try again!');
		}

		function actionClickButtonRemoveFailure(failure) {
			dialogFactory.showConfirmDialog('Do you want to remove this failure',
				function () {
					removeFailure(failure);
				}
			);
		}

		function removeFailure(failure) {
			failureSetupAPIService.removeObject(
				failure,
				removeFailureSuccessCallback,
				removeFailureErrorCallback
			);
		}

		function removeFailureSuccessCallback(result) {
			populateFailureList();
		}

		function removeFailureErrorCallback(error) {
			console.log(error);
		}

	}
})();
