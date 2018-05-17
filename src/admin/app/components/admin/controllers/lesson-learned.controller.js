(function () {

	'use strict';

	angular.module('xpd.failure-controller')
		.controller('LessonLearnedController', LessonLearnedController);

	LessonLearnedController.$inject = ['$scope', 'lessonLearnedModal', '$uibModal', 'lessonLearnedSetupAPIService', 'operationDataFactory', 'dialogFactory'];

	function LessonLearnedController($scope, lessonLearnedModal, $modal, lessonLearnedSetupAPIService, operationDataFactory, dialogFactory){
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
			lessonLearnedSetupAPIService.getList(
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
			lessonLearnedSetupAPIService.updateObject(
				lessonlearned,
				populateLessionLearnedList
			);
		}

		function insertLessonLearnedCallback(lessonlearned){
			lessonLearnedSetupAPIService.insertObject(
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
			lessonLearnedSetupAPIService.removeObject(
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
