import { IModalServiceInstance } from 'angular-ui-bootstrap';
import { EventLogSetupAPIService } from '../xpd.setupapi/eventlog-setupapi.service';

// (function() {

// 	'use strict',

// 	modalEventDetailsController.$inject = ['$scope', '$uibModalInstance', 'eventlogSetupAPIService', 'eventId'];

export class ModalEventDetailsController {

	public static $inject: string[] = [
		'$scope',
		'$uibModalInstance',
		'eventlogSetupAPIService',
		'eventId',
	];
	public selectedEvent: any;

	constructor(
		private $scope: any,
		private $uibModalInstance: IModalServiceInstance,
		private eventlogSetupAPIService: EventLogSetupAPIService,
		private eventId: number) {

		this.selectedEvent = null;
		$scope.eventDetails = {};

		this.getEventById();

	}

	public modalActionButtonClose() {
		this.$scope.eventDetails = {};
		this.$uibModalInstance.close();
	}

	private getEventById() {
		this.eventlogSetupAPIService.getWithDetails(this.eventId).then( (event) => {
			this.selectedEvent = event;
			this.prepareEventToModal();
		});
	}

	private prepareEventToModal() {

		let eventType;

		if (this.selectedEvent.eventType === 'TRIP') {
			eventType = 'Trip';
		} else if (this.selectedEvent.eventType === 'CONN') {
			eventType = 'Connection';
		}

		const str = this.selectedEvent.state;

		this.$scope.eventDetails = {
			eventType,
			state: str.substr(0, 1).toUpperCase() + str.substr(1),
			startTime: new Date(this.selectedEvent.startTime),
			endTime: new Date(this.selectedEvent.endTime),
			duration: this.selectedEvent.duration,
			score: this.selectedEvent.score,
			failures: this.selectedEvent.failures,
			lessonsLearned: this.selectedEvent.lessonsLearned,
			alarms: this.selectedEvent.alarms,
		};
	}

}
// })();
