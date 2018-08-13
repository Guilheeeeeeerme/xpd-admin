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

	private colors = [
		'#1CE6FF', '#FF34FF', '#008941', '#A30059',
		'#7A4900', '#63FFAC', '#B79762', '#8FB0FF',
		'#4FC601', '#3B5DFF', '#FF2F80', '#7B4F4B',
		'#BA0900', '#6B7900', '#00C2A0', '#FFAA92', '#FF90C9', '#B903AA', '#D16100',
		'#A1C299', '#300018', '#0AA6D8', '#013349', '#00846F',
		'#372101', '#FFB500', '#C2FFED', '#A079BF', '#CC0744', '#C0B9B2', '#C2FF99', '#001E09',
		'#00489C', '#6F0062', '#0CBD66', '#EEC3FF', '#456D75', '#B77B68', '#7A87A1', '#788D66',
		'#885578', '#FAD09F', '#FF8A9A', '#D157A0', '#BEC459', '#456648', '#0086ED', '#886F4C',
		'#34362D', '#B4A8BD', '#00A6AA', '#452C2C', '#636375', '#A3C8C9', '#FF913F', '#938A81',
		'#575329', '#00FECF', '#B05B6F', '#8CD0FF', '#3B9700', '#04F757', '#C8A1A1', '#1E6E00',
		'#7900D7', '#A77500', '#6367A9', '#A05837', '#6B002C', '#772600', '#D790FF', '#9B9700',
		'#549E79', '#FFF69F', '#201625', '#72418F', '#BC23FF', '#99ADC0', '#3A2465', '#922329',
		'#5B4534', '#FDE8DC', '#404E55', '#0089A3', '#CB7E98', '#A4E804', '#324E72', '#6A3A4C',
		'#83AB58', '#001C1E', '#D1F7CE', '#004B28', '#C8D0F6', '#A3A489', '#806C66', '#222800',
		'#BF5650', '#E83000', '#66796D', '#DA007C', '#FF1A59', '#8ADBB4', '#1E0200', '#5B4E51',
		'#C895C5', '#320033', '#FF6832', '#66E1D3', '#CFCDAC', '#D0AC94', '#7ED379', '#012C58',
	];
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

		operationDataService.openConnection([]).then(() => {
			vm.operationDataFactory = operationDataService.operationDataFactory;
			$scope.operationData = vm.operationDataFactory.operationData;

			vm.generateEstimatives();
			vm.loadEvents();

			operationDataService.on('setOnParallelEventChangeListener', () => { vm.loadEvents(); });
			operationDataService.on('setOnEventChangeListener', (data) => { vm.loadEvents(); });

			operationDataService.on('setOnEstimativesChangeListener', () => { vm.generateEstimatives(); });
			operationDataService.on('setOnForecastChangeListener', () => { vm.generateEstimatives(); });

			operationDataService.on('setOnJointChangeListener', () => { vm.generateEstimatives(); });
			operationDataService.on('setOnCurrentJointListener', () => { vm.generateEstimatives(); });
			operationDataService.on('setOnNoCurrentJointListener', () => { vm.generateEstimatives(); });
		});
	}

	public selectedPoint(point) {
		this.getReading(point);
	}

	public removeReadingFromList(index) {
		const readingRemoved = this.$scope.selectedReadings.splice(index, 1);
		this.$scope.removeMarker = readingRemoved[0].timestamp;
		this.restoreColor(readingRemoved[0].color);
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

	private getReading(point) {

		if (!point.timestamp) { return; }

		const tick = new Date(point.timestamp).getTime();
		this.readingSetupAPIService.getTick(tick).then((reading: any) => {

			reading.color = point.color = this.getColor();
			this.$scope.selectedReadings.push(reading);

			// O time stamp enviado na rota é diferente do que vem na leitura
			// Isso garante que o ponto e a leitura tenha o mesmo timestamp
			point.timestamp = reading.timestamp;
			this.$scope.lastSelectedPoint = point;
		});
	}
	private getColor() {
		return this.colors.shift();
	}

	private restoreColor(color: string) {
		this.colors.push(color);
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
