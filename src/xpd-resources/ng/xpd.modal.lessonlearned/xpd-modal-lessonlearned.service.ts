import { IModalService } from 'angular-ui-bootstrap';
import modalTemplate from './xpd-modal-lessonlearned.template.html';

// (function() {
// 	'use strict';

// 	angular.module('xpd.modal-lessonlearned').factory('lessonLearnedModal', lessonLearnedModal);

// 	lessonLearnedModal.$inject = ['$uibModal'];

export class LessonLearnedModalService {

	constructor (private $uibModal: IModalService) {

	}

	public open(selectedLessonLearned, modalSuccessCallback, modalErrorCallback) {

		if (selectedLessonLearned.startTime) {
			selectedLessonLearned.startTime = new Date(selectedLessonLearned.startTime);
		}

		if (selectedLessonLearned.endTime) {
			selectedLessonLearned.endTime = new Date(selectedLessonLearned.endTime);
		}

		return this.$uibModal.open({
			keyboard: false,
			backdrop: 'static',
			template: modalTemplate,
			windowClass: 'xpd-operation-modal',
			controller: 'modalLessonLearnedController as mllController',
			size: 'modal-md',
			resolve: {
				selectedLessonLearned() {
					return selectedLessonLearned;
				},
				modalSuccessCallback() {
					return modalSuccessCallback;
				},
				modalErrorCallback() {
					return modalErrorCallback;
				},
			},
		});
	}

}

// })();
