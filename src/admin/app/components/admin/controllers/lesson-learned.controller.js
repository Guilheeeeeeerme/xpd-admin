(function () {

	'use strict';

	angular.module('xpd.failure-controller')
		.controller('LessonLearnedController', LessonLearnedController);

	LessonLearnedController.$inject = ['$scope', 'lessonLearnedModal', '$uibModal', 'setupAPIService', 'operationDataFactory', 'lessonLearnedSetupAPIService', 'dialogFactory'];

	function LessonLearnedController($scope, lessonLearnedModal, $modal, setupAPIService, operationDataFactory, lessonLearnedSetupAPIService, dialogFactory){
    	var vm = this;

		$scope.modalData = {
    		lessonLearnedList: [],
			operation: {},
			lessonLearnedCategory: {
				roleList: [],
				parentList: [],
				lastSelected: null
			}
    	};

		vm.actionClickButtonAddLessonLearned = actionClickButtonAddLessonLearned;
		vm.actionClickButtonRemoveLessonLearned = actionClickButtonRemoveLessonLearned;
		vm.actionClickButtonEditLessonLearned = actionClickButtonEditLessonLearned;

		operationDataFactory.operationData = [];
		$scope.modalData.operation = operationDataFactory.operationData.operationContext.currentOperation;

		populateLessionLearnedList();

		function populateLessionLearnedList() {
			lessonLearnedSetupAPIService.list(
				getLessonLearnedListSuccessCallback,
				getLessonLearnedListErrorCallback
			);
		}

		function getLessonLearnedListSuccessCallback(lessonLearnedList) {
			$scope.modalData.lessonLearnedList = lessonLearnedList;
		}

		function getLessonLearnedListErrorCallback(error) {
			console.log(error);
		}

    	function actionClickButtonAddLessonLearned(){

			var selectedLessonLearned = {};

			if($scope.modalData.operation != null){
				selectedLessonLearned = {
					operation: {
						'id': $scope.modalData.operation.id
					}
				};
			}


			lessonLearnedModal.open(selectedLessonLearned, insertLessonLearnedCallback, updateLessonLearnedCallback);
		}

		function actionClickButtonEditLessonLearned(selectedLessonLearned) {
			if($scope.modalData.operation != null){
				selectedLessonLearned.operation = {'id':$scope.modalData.operation.id};
			}			

			lessonLearnedModal.open(selectedLessonLearned, insertLessonLearnedCallback, updateLessonLearnedCallback);
		}

		function updateLessonLearnedCallback(lessonlearned){
			setupAPIService.updateObject(
				'setup/lessonlearned',
				lessonlearned,
				populateLessionLearnedList
			);
		}

		function insertLessonLearnedCallback(lessonlearned){
			setupAPIService.insertObject(
				'setup/lessonlearned',
				lessonlearned,
				populateLessionLearnedList);
		}

		function actionClickButtonRemoveLessonLearned(lessonlearned) {
			dialogFactory.showConfirmDialog('Do you want to remove this Lesson Learned?',
				function () {
					removelessonlearned(lessonlearned);
				}
			);
		}

		function removelessonlearned(lessonlearned) {
			setupAPIService.removeObject(
				'setup/lessonlearned',
				lessonlearned,
				removeLessonLearnedSuccessCallback,
				removeLessonLearnedErrorCallback
			);
		}

		function removeLessonLearnedSuccessCallback(result) {
			populateLessionLearnedList();
		}

		function removeLessonLearnedErrorCallback(error) {
			console.log(error);
		}
	}
})();
