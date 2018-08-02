import { EventLogSetupAPIService } from '../../shared/xpd.setupapi/eventlog-setupapi.service';

export class SlipsToSlipsController {
	// 'use strict';

	public static $inject = ['$scope', '$routeParams', 'eventlogSetupAPIService'];
	public operationId: any;
	public eventType: any;

	constructor(
		private $scope,
		private $routeParams,
		private eventlogSetupAPIService: EventLogSetupAPIService) {

		const vm = this;

		$scope.slipsToSlipsData = {
			connectionTimes: null,
			fromDate: null,
			toDate: null,
			type: null,
		};

		this.operationId = $routeParams.operationId;
		this.eventType = $routeParams.type;

		this.getEventTimes();

	}

	private getEventTimes() {

		if (this.operationId != null) {

			((this.eventType === 'connections') ? this.$scope.slipsToSlipsData.type = 'CONN' : this.$scope.slipsToSlipsData.type = 'TRIP');

			this.eventlogSetupAPIService.listByFilters(this.$scope.slipsToSlipsData.type, this.operationId, null, null, null).then(
				(arg) => { this.getEventTimesSuccessCallback(arg); },
				(arg) => { this.getEventTimesErrorCallback(arg); },
			);
		}
	}

	private getEventTimesSuccessCallback(times) {
		if (times == null || times.length === 0) { return; }

		times.reverse();

		this.$scope.slipsToSlipsData.fromDate = new Date(times[0].startTime);
		this.$scope.slipsToSlipsData.toDate = new Date(times[times.length - 1].startTime);

		this.$scope.slipsToSlipsData.minDate = new Date(times[0].startTime);
		this.$scope.slipsToSlipsData.maxDate = new Date(times[times.length - 1].startTime);

		this.$scope.slipsToSlipsData.connectionTimes = times;
	}

	private getEventTimesErrorCallback(error) {
		console.log(error);
	}

	private onChangePeriodSuccessCallback(times) {
		times.reverse();
		this.$scope.slipsToSlipsData.connectionTimes = times;
	}

	private onChangePeriodErrorCallback(error) {
		console.log(error);
	}

	public onChangePeriod(fromDate, toDate) {

		if (this.operationId != null) {
			this.eventlogSetupAPIService.listByFilters('CONN', this.operationId, null, this.$scope.slipsToSlipsData.fromDate, this.$scope.slipsToSlipsData.toDate).then(
				(arg) => { this.onChangePeriodSuccessCallback(arg); },
				(arg) => { this.onChangePeriodErrorCallback(arg); },
			);
		}
	}
}
// })();
