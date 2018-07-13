import { OperationDataFactory } from '../../../xpd-resources/ng/xpd.communication/operation-server-data.factory';
import { DialogFactory } from '../../../xpd-resources/ng/xpd.dialog/xpd.dialog.factory';
import { LessonLearnedModalFactory } from '../../../xpd-resources/ng/xpd.modal.lessonlearned/xpd-modal-lessonlearned.factory';
import { LessonLearnedSetupAPIService } from '../../../xpd-resources/ng/xpd.setupapi/lessonlearned-setupapi.service';

export class LessonLearnedController {

	// 'use strict';

	// angular.module('xpd.failure-controller')
	// 	.controller('LessonLearnedController', LessonLearnedController);

	public static $inject = ['$scope', 'lessonLearnedModal', 'lessonLearnedSetupAPIService', 'operationDataFactory', 'dialogFactory'];
	public operationDataFactory: any;

	constructor(
		private $scope: any,
		private lessonLearnedModal: LessonLearnedModalFactory,
		private lessonLearnedSetupAPIService: LessonLearnedSetupAPIService,
		operationDataFactory: OperationDataFactory,
		private dialogFactory: DialogFactory) {
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

		operationDataFactory.openConnection([]).then(function (response) {
			vm.operationDataFactory = response;
			$scope.modalData.operation = operationDataFactory.operationData.operationContext.currentOperation;
		});

		this.populateLessionLearnedList();
	}

	public actionClickButtonEditLessonLearned(selectedLessonLearned) {
		if (this.$scope.modalData.operation != null) {
			selectedLessonLearned.operation = { id: this.$scope.modalData.operation.id };
		}

		this.lessonLearnedModal.open(selectedLessonLearned, this.lessonLearnedModalSuccessCallback, this.lessonLearnedModalErrorCallback);
	}

	public actionClickButtonRemoveLessonLearned(lessonlearned) {
		const self = this;
		this.dialogFactory.showConfirmDialog('Do you want to remove this Lesson Learned?',
			function () {
				self.removelessonlearned(lessonlearned);
			},
		);
	}

	public actionClickButtonAddLessonLearned() {

		let newLessonLearned = {};

		if (this.$scope.modalData.operation != null) {
			newLessonLearned = {
				operation: {
					id: this.$scope.modalData.operation.id,
				},
			};
		}

		this.lessonLearnedModal.open(newLessonLearned, this.lessonLearnedModalSuccessCallback, this.lessonLearnedModalErrorCallback);
	}

	private populateLessionLearnedList() {
		this.lessonLearnedSetupAPIService.getList(
			this.getLessonLearnedListSuccessCallback,
			this.getLessonLearnedListErrorCallback,
		);
	}

	private getLessonLearnedListSuccessCallback(lessonLearnedList) {
		this.$scope.modalData.lessonLearnedList = lessonLearnedList;
	}

	private getLessonLearnedListErrorCallback(error) {
		console.log(error);
	}

	private lessonLearnedModalSuccessCallback(lessonlearned) {
		this.populateLessionLearnedList();
	}

	private lessonLearnedModalErrorCallback() {
		this.dialogFactory.showConfirmDialog('Error on inserting lesson learned, please try again!');
	}

	private removelessonlearned(lessonlearned) {
		this.lessonLearnedSetupAPIService.removeObject(
			lessonlearned,
			this.removeLessonLearnedSuccessCallback,
			this.removeLessonLearnedErrorCallback,
		);
	}

	private removeLessonLearnedSuccessCallback(result) {
		this.populateLessionLearnedList();
	}

	private removeLessonLearnedErrorCallback(error) {
		console.log(error);
	}

}
