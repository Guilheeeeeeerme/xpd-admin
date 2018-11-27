import { IModalServiceInstance } from 'angular-ui-bootstrap';
import { FailureModalFactory } from '../xpd.modal.failure/xpd-modal-failure.factory';
import { LessonLearnedModalService } from '../xpd.modal.lessonlearned/xpd-modal-lessonlearned.service';
import { EventLogSetupAPIService } from '../xpd.setupapi/eventlog-setupapi.service';
import { LessonLearnedSetupAPIService } from '../xpd.setupapi/lessonlearned-setupapi.service';

// (function() {

// 	'use strict',

// 	modalEventDetailsController.$inject = ['$scope', '$uibModalInstance', 'eventlogSetupAPIService', 'eventId'];

export class ModalEventDetailsController {

	public static $inject: string[] = [
		'$scope',
		'$uibModalInstance',
		'eventlogSetupAPIService',
		'eventId',
		'failureModal',
		'lessonLearnedModal',
		'lessonLearnedSetupAPIService',
	];
	public selectedEvent: any;

	constructor(
		private $scope: any,
		private $uibModalInstance: IModalServiceInstance,
		private eventlogSetupAPIService: EventLogSetupAPIService,
		private eventId: number,
		private failureModal: FailureModalFactory,
		private lessonLearnedModal: LessonLearnedModalService,
		private lessonLearnedSetupAPIService: LessonLearnedSetupAPIService) {

		this.selectedEvent = null;
		$scope.eventDetails = {};

		this.getEventById();

	}

	public modalActionButtonClose() {
		this.$scope.eventDetails = {};
		this.$uibModalInstance.close();
	}

	public actionClickFailuresButton(event) {
		this.failureModal.open(
			{
				operation: {
					id: event.operationId,
				},
				startTime: event.startTime,
				endTime: event.endTime,
			},
			() => { this.successCallback(); },
			() => { this.errorCallback(); },
		);
	}

	public actionClickLessonsLearnedButton(event) {
		this.lessonLearnedModal.open(
			{
				operation: {
					id: event.operationId,
				},
				startTime: event.startTime,
				endTime: event.endTime,
			},
			() => { this.successCallback(); },
			() => { this.errorCallback(); },
		);
	}

	private successCallback() {
		this.getEventById();
	}

	private errorCallback() {
		console.log('error');
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
			operationId: this.selectedEvent.operation.id,
		};
	}

}
// })();
