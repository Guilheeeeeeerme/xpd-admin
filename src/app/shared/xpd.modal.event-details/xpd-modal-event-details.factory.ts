// (function() {
// 	'use strict';

// 	eventDetailsModalService.$inject = ['$uibModal'];
import { IModalService } from 'angular-ui-bootstrap';
import modalTemplate from './xpd-modal-event-details.template.html';

export class EventDetailsModalService {

	constructor(private $uibModal: IModalService) {

	}

	public open(eventId) {

		return this.$uibModal.open({
			keyboard: false,
			backdrop: 'static',
			size: 'modal-sm',
			windowClass: 'xpd-operation-modal',
			template: modalTemplate,
			controller: 'modalEventDetailsController as medController',
			resolve: {
				eventId() {
					return eventId;
				},
			},
		});
	}

}

// })();
