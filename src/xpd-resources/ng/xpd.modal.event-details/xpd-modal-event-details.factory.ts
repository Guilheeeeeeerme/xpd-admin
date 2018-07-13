// (function() {
// 	'use strict';

// 	angular.module('xpd.modal-event-details').factory('eventDetailsModal', eventDetailsModal);

// 	eventDetailsModal.$inject = ['$uibModal'];
import { IModalService } from 'angular-ui-bootstrap';
import modalTemplate from '../xpd-resources/ng/xpd.modal.event-details/xpd-modal-event-details.template.html';

export class EventDetailsModalFactory {

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
