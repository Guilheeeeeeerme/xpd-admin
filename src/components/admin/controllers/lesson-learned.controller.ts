import { OperationDataService } from '../../../xpd-resources/ng/xpd.communication/operation-server-data.factory';
import { DialogService } from '../../../xpd-resources/ng/xpd.dialog/xpd.dialog.factory';
import { LessonLearnedModalService } from '../../../xpd-resources/ng/xpd.modal.lessonlearned/xpd-modal-lessonlearned.service';
import { LessonLearnedSetupAPIService } from '../../../xpd-resources/ng/xpd.setupapi/lessonlearned-setupapi.service';

export class LessonLearnedController {

	// 'use strict';

	// angular.module('xpd.failure-controller')
	// 	.controller('LessonLearnedController', LessonLearnedController);

	public static $inject = ['$scope', 'lessonLearnedModal', 'lessonLearnedSetupAPIService', 'operationDataService', 'dialogService'];
	public operationDataFactory: any;

	constructor(
		private $scope: any,
		private lessonLearnedModal: LessonLearnedModalService,
		private lessonLearnedSetupAPIService: LessonLearnedSetupAPIService,
		operationDataService: OperationDataService,
		private dialogService: DialogService) {
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

		operationDataService.openConnection([]).then(function (operationDataFactory: any) {
			vm.operationDataFactory = operationDataFactory;
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
		this.dialogService.showConfirmDialog('Do you want to remove this Lesson Learned?',
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
		this.dialogService.showConfirmDialog('Error on inserting lesson learned, please try again!');
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
