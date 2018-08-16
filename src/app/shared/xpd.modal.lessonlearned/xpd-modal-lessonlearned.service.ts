import { IModalService } from 'angular-ui-bootstrap';
import './xpd-modal-lessonlearned.style.scss';
import modalTemplate from './xpd-modal-lessonlearned.template.html';

// (function() {
// 	'use strict';

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
