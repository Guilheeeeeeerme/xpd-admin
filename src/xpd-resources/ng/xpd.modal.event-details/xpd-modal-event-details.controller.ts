import { IModalServiceInstance } from 'angular-ui-bootstrap';
import { EventLogSetupAPIService } from '../xpd.setupapi/eventlog-setupapi.service';

// (function() {

// 	'use strict',

// 	angular.module('xpd.modal-event-details').controller('modalEventDetailsController', modalEventDetailsController);

// 	modalEventDetailsController.$inject = ['$scope', '$uibModalInstance', 'eventlogSetupAPIService', 'eventId'];

export class ModalEventDetailsController {

	public static $inject: string[] = [
		'$scope',
		'$uibModalInstance',
		'eventlogSetupAPIService',
		'eventId',
	];
	public modalActionButtonClose: () => void;

	constructor(
		$scope: any,
		$uibModalInstance: IModalServiceInstance,
		eventlogSetupAPIService: EventLogSetupAPIService,
		eventId: number) {

		const vm = this;

		let selectedEvent = null;
		$scope.eventDetails = {};

		vm.modalActionButtonClose = modalActionButtonClose;

		getEventById();

		function getEventById() {
			eventlogSetupAPIService.getWithDetails(eventId, function (event) {
				selectedEvent = event;
				prepareEventToModal();
			});
		}

		// prepareEventToModal();

		function prepareEventToModal() {

			let eventType;
			if (selectedEvent.eventType === 'TRIP') {
				eventType = 'Trip';
			} else if (selectedEvent.eventType === 'CONN') {
				eventType = 'Connection';
			}

			const str = selectedEvent.state;

			$scope.eventDetails = {
				eventType,
				state: str.substr(0, 1).toUpperCase() + str.substr(1),
				startTime: new Date(selectedEvent.startTime),
				endTime: new Date(selectedEvent.endTime),
				duration: selectedEvent.duration,
				score: selectedEvent.score,
				failures: selectedEvent.failures,
				lessonsLearned: selectedEvent.lessonsLearned,
				alarms: selectedEvent.alarms,
			};
		}

		function modalActionButtonClose() {
			$scope.eventDetails = {};

			$uibModalInstance.close();
		}

	}

}
// })();
