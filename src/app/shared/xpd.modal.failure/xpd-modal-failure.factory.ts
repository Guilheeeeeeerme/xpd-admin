import { IModalService } from 'angular-ui-bootstrap';
import modalTemplate from './xpd-modal-failure.template.html';

// (function() {
// 	'use strict';

// 	failureModal.$inject = ['$uibModal'];

export class FailureModalFactory {

	constructor (private $uibModal: IModalService) {

	}

	public open(selectedFailure) {

		if (selectedFailure.startTime) {
			selectedFailure.startTime = new Date(selectedFailure.startTime);
		}

		if (selectedFailure.endTime) {
			selectedFailure.endTime = new Date(selectedFailure.endTime);
		}

		return this.$uibModal.open({
			keyboard: false,
			backdrop: 'static',
			template: modalTemplate,
			windowClass: 'xpd-operation-modal',
			controller: 'modalFailureController as mfController',
			size: 'modal-md',
			resolve: {
				selectedFailure() {
					return selectedFailure;
				},
			},
		});
	}

}

// })();
