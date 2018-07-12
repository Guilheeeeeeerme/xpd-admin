(function() {

	'use strict';

	angular.module('xpd.failure-controller')
		.controller('FailuresController', FailuresController);

	FailuresController.$inject = ['$scope', 'failureModal', 'operationDataFactory', 'dialogFactory'];

	function FailuresController($scope, failureModal, operationDataFactory, dialogFactory) {
		let vm = this;

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

		operationDataFactory.operationData = [];
		operationDataFactory.openConnection([]).then(function(response) {
			operationDataFactory = response;
			$scope.modalData.operation = operationDataFactory.operationData.operationContext.currentOperation;
			$scope.modalData.failuresList = operationDataFactory.operationData.failureContext.failureList;
		});

		operationDataFactory.addEventListener('failuresController', 'setOnFailureChangeListener', populateFailureList);

		function populateFailureList() {
			let failureContext = operationDataFactory.operationData.failureContext;

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
			dialogFactory.showConfirmDialog('Do you want to remove this failure',
				function() {
					removeFailure(failure);
				},
			);
		}

		function removeFailure(failure) {
			operationDataFactory.emitRemoveFailure(failure);
		}

	}
})();
