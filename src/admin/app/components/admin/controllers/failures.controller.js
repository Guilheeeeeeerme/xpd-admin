(function () {

	'use strict';

	angular.module('xpd.failure-controller')
		.controller('FailuresController', FailuresController);

	FailuresController.$inject = ['$scope', 'failureModal', '$uibModal', 'setupAPIService', 'operationDataFactory', 'failureSetupAPIService', 'dialogFactory'];

	function FailuresController($scope, failureModal, $modal, setupAPIService, operationDataFactory, failureSetupAPIService, dialogFactory){
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
			failureSetupAPIService.listFailures(function(response){
				$scope.modalData.failuresList = response.filter(function(failure){
					return !failure.onGoing;
				});

				$scope.modalData.failureOnGoing = response.filter(function(failure){
					return failure.onGoing;
				});
			});
		}

    	function actionClickButtonAddFailure(){
			var selectedFailure = {};
    	
    	if($scope.modalData.operation != null){
    		selectedFailure = {
					operation: {
						'id': $scope.modalData.operation.id
					}
				};
    	}

			failureModal.open(selectedFailure, insertFailureCallback, updateFailureCallback);
		}

		function actionClickButtonEditFailure(selectedFailure) {
			if($scope.modalData.operation != null){
				selectedFailure.operation = {'id':$scope.modalData.operation.id};
			}

			failureModal.open(selectedFailure, insertFailureCallback, updateFailureCallback);
		}

		function updateFailureCallback(){
   			populateFailureList();
		}

		function insertFailureCallback(failure){
			if(failure && failure.onGoing)
				$scope.$parent.controller.modalActionButtonClose();
			else
				populateFailureList();
		}

		function actionClickButtonRemoveFailure(failure) {
			dialogFactory.showConfirmDialog('Do you want to remove this failure',
				function () {
					removeFailure(failure);
				}
			);
		}

		function removeFailure(failure) {
			setupAPIService.removeObject(
				'setup/failure',
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
