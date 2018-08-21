import { DialogService } from '../../../shared/xpd.dialog/xpd.dialog.factory';
import { LessonLearnedModalService } from '../../../shared/xpd.modal.lessonlearned/xpd-modal-lessonlearned.service';
import { OperationDataService } from '../../../shared/xpd.operation-data/operation-data.service';
import { LessonLearnedSetupAPIService } from '../../../shared/xpd.setupapi/lessonlearned-setupapi.service';

export class LessonLearnedController {

	// 'use strict';

	// 	.controller('LessonLearnedController', LessonLearnedController);

	public static $inject = ['$scope', 'lessonLearnedModal', 'lessonLearnedSetupAPIService', 'operationDataService', 'dialogService'];
	public operationDataFactory: any;

	constructor(
		private $scope: any,
		private lessonLearnedModal: LessonLearnedModalService,
		private lessonLearnedSetupAPIService: LessonLearnedSetupAPIService,
		private operationDataService: OperationDataService,
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

		operationDataService.openConnection(['operation']).then(() => {
			vm.operationDataFactory = operationDataService.operationDataFactory;
			$scope.modalData.operation = vm.operationDataFactory.operationData.operationContext.currentOperation;
		});

		this.populateLessionLearnedList();
	}

	public actionClickButtonEditLessonLearned(selectedLessonLearned) {
		if (this.$scope.modalData.operation != null) {
			selectedLessonLearned.operation = { id: this.$scope.modalData.operation.id };
		}

		this.lessonLearnedModal.open(selectedLessonLearned,
			(arg) => { this.lessonLearnedModalSuccessCallback(arg); },
			(arg) => { this.lessonLearnedModalErrorCallback(); });
	}

	public actionClickButtonRemoveLessonLearned(lessonlearned) {
		const self = this;
		this.dialogService.showConfirmDialog('Do you want to remove this Lesson Learned?',
			() => {
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

		this.lessonLearnedModal.open(newLessonLearned,
			(arg) => { this.lessonLearnedModalSuccessCallback(arg); },
			(arg) => { this.lessonLearnedModalErrorCallback(); });
	}

	private populateLessionLearnedList() {
		this.lessonLearnedSetupAPIService.getList().then(
			(arg) => { this.getLessonLearnedListSuccessCallback(arg); },
			(arg) => { this.getLessonLearnedListErrorCallback(arg); },
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
			lessonlearned).then(
				(arg) => { this.removeLessonLearnedSuccessCallback(arg); },
				(arg) => { this.removeLessonLearnedErrorCallback(arg); },
		);
	}

	private removeLessonLearnedSuccessCallback(result) {
		this.populateLessionLearnedList();
	}

	private removeLessonLearnedErrorCallback(error) {
		console.log(error);
	}

}
