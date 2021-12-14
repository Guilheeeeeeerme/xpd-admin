import * as angular from 'angular';
import { OperationDataService } from '../../../shared/xpd.operation-data/operation-data.service';
import { EventLogSetupAPIService } from '../../../shared/xpd.setupapi/eventlog-setupapi.service';
import { ReadingSetupAPIService } from '../../../shared/xpd.setupapi/reading-setupapi.service';
import { OperationActivitiesEstimatorService } from './operation-activities-estimator/operation-activities-estimator.service';

export class OperationDashboardController {

	public static $inject = [
		'$scope',
		'$filter',
		'operationDataService',
		'readingSetupAPIService',
		'eventlogSetupAPIService',
		'operationActivitiesEstimatorService'];
	public operationDataFactory: any;
	private listTrackingEventByOperationPromise: any;

	constructor(
		private $scope: any,
		private $filter,
		private operationDataService: OperationDataService,
		private readingSetupAPIService: ReadingSetupAPIService,
		private eventlogSetupAPIService: EventLogSetupAPIService,
		private operationActivitiesEstimatorService: OperationActivitiesEstimatorService) {

		const vm = this;

		$scope.contractTimePerformance = [];
		$scope.contractTimePerformance.TRIP = {};
		$scope.contractTimePerformance.CONN = {};
		$scope.contractTimePerformance.BOTH = {};
		$scope.statusPanel = {};
		$scope.jointInfo = {};
		$scope.removeMarker = null;
		$scope.lastSelectedPoint = null;
		$scope.selectedReadings = [];
		$scope.dados = {
			connectionEvents: [],
			tripEvents: [],
			timeEvents: [],
		};

		operationDataService.openConnection([
			'event',
			'reading',
			'operation',
			'chronometer',
			'well',
			'alarm',
			'jointLog',
			'state',
			'direction',
			'operationQueue',
			'score',
			'operationProgress',
			'bitDepth',
			'failure',
			'forecast',
			'parallelEvent',
			'shift',
		]).then(() => {
				vm.operationDataFactory = operationDataService.operationDataFactory;
				$scope.operationData = vm.operationDataFactory.operationData;

				vm.generateEstimatives();
				vm.loadEvents();

				operationDataService.on($scope, 'setOnParallelEventChangeListener', () => { vm.loadEvents(); });
				operationDataService.on($scope, 'setOnEventChangeListener', (data) => { vm.loadEvents(); });

				operationDataService.on($scope, 'setOnEstimativesChangeListener', () => { vm.generateEstimatives(); });
				operationDataService.on($scope, 'setOnForecastChangeListener', () => { vm.generateEstimatives(); });

				operationDataService.on($scope, 'setOnJointChangeListener', () => { vm.generateEstimatives(); });
				operationDataService.on($scope, 'setOnCurrentJointListener', () => { vm.generateEstimatives(); });
				operationDataService.on($scope, 'setOnNoCurrentJointListener', () => { vm.generateEstimatives(); });
		});
	}

	public removeReadingFromList(index) {
		const readingRemoved = this.$scope.selectedReadings.splice(index, 1);
		this.$scope.removeMarker = readingRemoved[0].timestamp;
	}

	private generateEstimatives() {

		if (this.$scope.operationData.stateContext && this.$scope.operationData.forecastContext) {

			try {

				const currentState = this.$scope.operationData.stateContext.currentState;
				const estimatives = this.$scope.operationData.forecastContext.estimatives;
				const rawEstimatives = this.$scope.operationData.forecastContext.rawEstimatives;

				this.generateExpectation(estimatives);
				this.generateRawExpectation(currentState, rawEstimatives);

			} catch (error) {
				console.error(error);
			}
		}

		try {
			this.calcAccScore();
		} catch (error) {
			// faça nada
		}

	}

	private generateExpectation(estimatives) {

		const estimatedAt = new Date(estimatives.estimatedAt).getTime();

		const nextActivitiesEstimatives = this.operationActivitiesEstimatorService.estimateNextActivities(estimatedAt, estimatives.vTargetEstimative);

		let operationFinalTimeEstimative = angular.copy(estimatedAt);

		for (const activity of nextActivitiesEstimatives) {
			operationFinalTimeEstimative = Math.max(activity.finalTime, operationFinalTimeEstimative);
		}

		this.$scope.operationFinalTimeEstimative = operationFinalTimeEstimative;
		this.$scope.nextActivitiesEstimatives = nextActivitiesEstimatives;

	}

	private generateRawExpectation(currentState, rawEstimatives) {
		let rawExpectations: any = {};
		const estimatedAt = new Date(rawEstimatives.estimatedAt).getTime();

		const vOptimumStateJointInterval = rawEstimatives.vOptimumEstimative.filter((line) => {
			return line[currentState] != null;
		})[0][currentState];

		const vStandardStateJointInterval = rawEstimatives.vStandardEstimative.filter((line) => {
			return line[currentState] != null;
		})[0][currentState];

		const vPoorStateJointInterval = rawEstimatives.vPoorEstimative.filter((line) => {
			return line[currentState] != null;
		})[0][currentState];

		const stateExpectedDuration = (1000 * vOptimumStateJointInterval.BOTH.finalTime);
		const vOptimumStateExpectedDuration = (1000 * vOptimumStateJointInterval.BOTH.finalTime);
		const vStandardStateExpectedDuration = (1000 * vStandardStateJointInterval.BOTH.finalTime);
		const vPoorStateExpectedDuration = (1000 * vPoorStateJointInterval.BOTH.finalTime);

		// EXPECTED TRIP/CONN
		this.$scope.contractTimePerformance.CONN = this.getContractTimePerformance('CONN', vOptimumStateJointInterval, vStandardStateJointInterval, vPoorStateJointInterval);
		this.$scope.contractTimePerformance.TRIP = this.getContractTimePerformance('TRIP', vOptimumStateJointInterval, vStandardStateJointInterval, vPoorStateJointInterval);
		this.$scope.contractTimePerformance.BOTH = this.getContractTimePerformance('BOTH', vOptimumStateJointInterval, vStandardStateJointInterval, vPoorStateJointInterval);

		rawExpectations = {
			stateExpectedEndTime: estimatedAt + stateExpectedDuration,
			vOptimumStateExpectedDuration,
			vStandardStateExpectedDuration,
			vPoorStateExpectedDuration,
		};

		this.$scope.rawExpectations = rawExpectations;
	}

	private getContractTimePerformance(eventType, vOptimumStateJointInterval, vStandardStateJointInterval, vPoorStateJointInterval) {
		return {
			voptimumTime: (vOptimumStateJointInterval[eventType].finalTime / (vOptimumStateJointInterval[eventType].finalJoint - vOptimumStateJointInterval[eventType].initialJoint)),
			vstandardTime: (vStandardStateJointInterval[eventType].finalTime / (vStandardStateJointInterval[eventType].finalJoint - vStandardStateJointInterval[eventType].initialJoint)),
			vpoorTime: (vPoorStateJointInterval[eventType].finalTime / (vPoorStateJointInterval[eventType].finalJoint - vPoorStateJointInterval[eventType].initialJoint)),
		};
	}

	private calcAccScore() {
		this.$scope.scoreData = {
			accScore: this.$scope.operationData.shiftContext.accScore.totalScore / this.$scope.operationData.shiftContext.accScore.eventScoreQty,
		};
	}

	private loadEvents() {

		if (this.$scope.operationData != null &&
			this.$scope.operationData.operationContext &&
			this.$scope.operationData.operationContext.currentOperation &&
			this.$scope.operationData.operationContext.currentOperation.running) {

			if (!this.listTrackingEventByOperationPromise) {

				this.listTrackingEventByOperationPromise = this.listTrackingEventByOperation(
					this.$scope.operationData.operationContext.currentOperation.id);

				this.listTrackingEventByOperationPromise.then((trackingEvents) => {
					this.organizeEventsOnLists(trackingEvents);
					this.listTrackingEventByOperationPromise = null;
				});

			}
		}

	}

	private listTrackingEventByOperation(operationId) {
		return this.eventlogSetupAPIService.listTrackingEventByOperation(operationId);
	}

	private organizeEventsOnLists(trackingEvents) {

		this.$scope.dados.connectionEvents = [];
		this.$scope.dados.tripEvents = [];
		this.$scope.dados.timeEvents = [];
		this.$scope.dados.connectionTimes = [];
		this.$scope.dados.tripTimes = [];

		trackingEvents.map((event) => {

			if (event.id && event.duration) {

				if (event.eventType === 'CONN') {
					this.$scope.dados.connectionEvents.push(event);
				}

				if (event.eventType === 'TRIP') {
					this.$scope.dados.tripEvents.push(event);
				}

				if (event.eventType === 'TIME') {
					this.$scope.dados.timeEvents.push(event);
				}

			}

		});

		this.$scope.dados.connectionTimes = this.$scope.dados.connectionEvents.slice(-200);
		this.$scope.dados.tripTimes = this.$scope.dados.tripEvents.slice(-200);

		const lastConn = this.$scope.dados.connectionEvents[this.$scope.dados.connectionEvents.length - 1];
		const lastTrip = this.$scope.dados.tripEvents[this.$scope.dados.tripEvents.length - 1];

		this.$scope.dados.lastConnDuration = (lastConn.duration / 1000);
		this.$scope.dados.lastTripDuration = (lastTrip.duration / 1000);

	}

}
