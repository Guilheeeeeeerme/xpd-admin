import { OperationDataFactory } from '../../../../../xpd-resources/ng/xpd.communication/operation-server-data.factory';
import { DialogFactory } from '../../../../../xpd-resources/ng/xpd.dialog/xpd.dialog.factory';
import { LessonLearnedModalFactory } from '../../../../../xpd-resources/ng/xpd.modal.lessonlearned/xpd-modal-lessonlearned.factory';
import { LessonLearnedSetupAPIService } from '../../../../../xpd-resources/ng/xpd.setupapi/lessonlearned-setupapi.service';

export class LessonLearnedController {

	// 'use strict';

	// angular.module('xpd.failure-controller')
	// 	.controller('LessonLearnedController', LessonLearnedController);

	public static $inject = ['$scope', 'lessonLearnedModal', 'lessonLearnedSetupAPIService', 'operationDataFactory', 'dialogFactory'];
	public actionClickButtonAddLessonLearned: () => void;
	public actionClickButtonRemoveLessonLearned: (lessonlearned: any) => void;
	public actionClickButtonEditLessonLearned: (selectedLessonLearned: any) => void;
	public operationDataFactory: any;

	constructor(
		$scope: any,
		lessonLearnedModal: LessonLearnedModalFactory,
		lessonLearnedSetupAPIService: LessonLearnedSetupAPIService,
		operationDataFactory: OperationDataFactory,
		dialogFactory: DialogFactory) {
		const vm = this;

		$scope.modalData = {
			lessonLearnedList: [],
			operation: {},
			lessonLearnedCategory: {
				roleList: [],
				parentList: [],
				lastSelected: null,
			},
		};

		vm.actionClickButtonAddLessonLearned = actionClickButtonAddLessonLearned;
		vm.actionClickButtonRemoveLessonLearned = actionClickButtonRemoveLessonLearned;
		vm.actionClickButtonEditLessonLearned = actionClickButtonEditLessonLearned;

		operationDataFactory.openConnection([]).then(function (response) {
			vm.operationDataFactory = response;
			$scope.modalData.operation = operationDataFactory.operationData.operationContext.currentOperation;
		});

		populateLessionLearnedList();

		function populateLessionLearnedList() {
			lessonLearnedSetupAPIService.getList(
				getLessonLearnedListSuccessCallback,
				getLessonLearnedListErrorCallback,
			);
		}

		function getLessonLearnedListSuccessCallback(lessonLearnedList) {
			$scope.modalData.lessonLearnedList = lessonLearnedList;
		}

		function getLessonLearnedListErrorCallback(error) {
			console.log(error);
		}

		function actionClickButtonAddLessonLearned() {

			let newLessonLearned = {};

			if ($scope.modalData.operation != null) {
				newLessonLearned = {
					operation: {
						id: $scope.modalData.operation.id,
					},
				};
			}

			lessonLearnedModal.open(newLessonLearned, lessonLearnedModalSuccessCallback, lessonLearnedModalErrorCallback);
		}

		function actionClickButtonEditLessonLearned(selectedLessonLearned) {
			if ($scope.modalData.operation != null) {
				selectedLessonLearned.operation = { id: $scope.modalData.operation.id };
			}

			lessonLearnedModal.open(selectedLessonLearned, lessonLearnedModalSuccessCallback, lessonLearnedModalErrorCallback);
		}

		function lessonLearnedModalSuccessCallback(lessonlearned) {
			populateLessionLearnedList();
		}

		function lessonLearnedModalErrorCallback() {
			dialogFactory.showConfirmDialog('Error on inserting lesson learned, please try again!');
		}

		function actionClickButtonRemoveLessonLearned(lessonlearned) {
			dialogFactory.showConfirmDialog('Do you want to remove this Lesson Learned?',
				function () {
					removelessonlearned(lessonlearned);
				},
			);
		}

		function removelessonlearned(lessonlearned) {
			lessonLearnedSetupAPIService.removeObject(
				lessonlearned,
				removeLessonLearnedSuccessCallback,
				removeLessonLearnedErrorCallback,
			);
		}

		function removeLessonLearnedSuccessCallback(result) {
			populateLessionLearnedList();
		}

		function removeLessonLearnedErrorCallback(error) {
			console.log(error);
		}
	}
}
