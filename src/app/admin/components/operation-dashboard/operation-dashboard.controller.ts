import * as angular from 'angular';
import { OperationDataService } from '../../../shared/xpd.operation-data/operation-data.service';
import { ReadingSetupAPIService } from '../../../shared/xpd.setupapi/reading-setupapi.service';
import { OperationActivitiesEstimatorService } from './operation-activities-estimator/operation-activities-estimator.service';

export class OperationDashboardController {

	public static $inject = ['$scope', '$filter', 'operationDataService', 'readingSetupAPIService', 'operationActivitiesEstimatorService'];
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

	constructor(
		private $scope: any,
		private $filter,
		private operationDataService: OperationDataService,
		private readingSetupAPIService: ReadingSetupAPIService,
		private operationActivitiesEstimatorService: OperationActivitiesEstimatorService) {

		const vm = this;

		$scope.eventProperty = [];
		$scope.eventProperty.TRIP = {};
		$scope.eventProperty.CONN = {};
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

		if (
			this.$scope.operationData.stateContext &&
			this.$scope.operationData.stateContext.currentState &&
			this.$scope.operationData.forecastContext &&
			this.$scope.operationData.forecastContext.estimatives) {

			const currentState = this.$scope.operationData.stateContext.currentState;
			const estimatives = this.$scope.operationData.forecastContext.estimatives;
			const estimatedAt = new Date(estimatives.estimatedAt).getTime();

			const vTargetStateJointInterval = estimatives.vTargetEstimative.filter((estimative) => {
				return estimative[currentState] != null;
			})[0][currentState];

			const vOptimumStateJointInterval = estimatives.vOptimumEstimative.filter((estimative) => {
				return estimative[currentState] != null;
			})[0][currentState];

			const vStandardStateJointInterval = estimatives.vStandardEstimative.filter((estimative) => {
				return estimative[currentState] != null;
			})[0][currentState];

			const vPoorStateJointInterval = estimatives.vPoorEstimative.filter((estimative) => {
				return estimative[currentState] != null;
			})[0][currentState];

			const stateExpectedDuration = (1000 * vTargetStateJointInterval.BOTH.finalTime);
			const vOptimumStateExpectedDuration = (1000 * vOptimumStateJointInterval.BOTH.finalTime);
			const vStandardStateExpectedDuration = (1000 * vStandardStateJointInterval.BOTH.finalTime);
			const vPoorStateExpectedDuration = (1000 * vPoorStateJointInterval.BOTH.finalTime);

			// EXPECTED TRIP/CONN
			this.$scope.eventProperty.CONN = this.getEventProperty('CONN', vTargetStateJointInterval, vOptimumStateJointInterval, vStandardStateJointInterval, vPoorStateJointInterval);
			this.$scope.eventProperty.TRIP = this.getEventProperty('TRIP', vTargetStateJointInterval, vOptimumStateJointInterval, vStandardStateJointInterval, vPoorStateJointInterval);
			this.$scope.eventProperty.BOTH = this.getEventProperty('BOTH', vTargetStateJointInterval, vOptimumStateJointInterval, vStandardStateJointInterval, vPoorStateJointInterval);

			this.$scope.expectations = {
				stateExpectedEndTime: estimatedAt + stateExpectedDuration,
				vOptimumStateExpectedDuration,
				vStandardStateExpectedDuration,
				vPoorStateExpectedDuration,
			};

			const nextActivitiesEstimatives = this.operationActivitiesEstimatorService.estimateNextActivities(estimatedAt, estimatives.vTargetEstimative);

			let operationFinalTimeEstimative = angular.copy(estimatedAt);

			for (const activity of nextActivitiesEstimatives) {
				operationFinalTimeEstimative = Math.max(activity.finalTime, operationFinalTimeEstimative);
			}

			this.$scope.operationFinalTimeEstimative = operationFinalTimeEstimative;
			this.$scope.nextActivitiesEstimatives = nextActivitiesEstimatives;
		}

		try {
			this.calcAccScore();
			this.getLastTwoEventsDuration(this.$scope.operationData.eventContext.lastEvents);
		} catch (error) {
			// faça nada
		}

	}

	private getEventProperty(eventType, vTargetStateJointInterval, vOptimumStateJointInterval, vStandardStateJointInterval, vPoorStateJointInterval) {
		return {
			vtargetTime: (vTargetStateJointInterval[eventType].finalTime / vTargetStateJointInterval[eventType].points.length),
			voptimumTime: (vOptimumStateJointInterval[eventType].finalTime / vOptimumStateJointInterval[eventType].points.length),
			vstandardTime: (vStandardStateJointInterval[eventType].finalTime / vStandardStateJointInterval[eventType].points.length),
			vpoorTime: (vPoorStateJointInterval[eventType].finalTime / vPoorStateJointInterval[eventType].points.length),
		};
	}

	private calcAccScore() {
		this.$scope.scoreData = {
			accScore: this.$scope.operationData.shiftContext.accScore.totalScore / this.$scope.operationData.shiftContext.accScore.eventScoreQty,
		};
	}

	private getLastTwoEventsDuration(lastEvents) {

		let conn = false;
		let trip = false;

		for (let index = lastEvents.length - 1; index >= 0; index--) {

			const event = lastEvents[index];

			if (event.eventType === 'CONN') {
				this.$scope.lastConnDuration = (event.duration / 1000);
				conn = true;
			}

			if (event.eventType === 'TRIP') {
				this.$scope.lastTripDuration = (event.duration / 1000);
				trip = true;
			}

			if (conn && trip) { break; }

		}
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

}
