import { OperationDataService } from '../../../../app/shared/xpd.operation-data/operation-data.service';
import { ReadingSetupAPIService } from './../../../../app/shared/xpd.setupapi/reading-setupapi.service';

export class OperationDashboardController {

	// 'use strict';

	// angular.module('xpd.operation-dashboard').controller('OperationDashboardController', operationDashboardController);

	public static $inject = ['$scope', '$filter', 'operationDataService', 'readingSetupAPIService'];
	public operationDataFactory: any;
	public selectedBaseLine: any;
	public selectedEventType: any;

	constructor(
		private $scope: any,
		private $filter,
		private operationDataService: OperationDataService,
		private readingSetupAPIService: ReadingSetupAPIService) {

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
			vm.main();
		});

		operationDataService.on('setOnvOptimumEstimativeListener', (data) => { vm.main(); });
		operationDataService.on('setOnActualLineListener', (data) => { vm.main(); });
		operationDataService.on('setOnForecastChangeListener', (data) => { vm.main(); });

		operationDataService.on('setOnJointChangeListener', (data) => { vm.generateEstimatives(); });
		operationDataService.on('setOnCurrentJointListener', (data) => { vm.generateEstimatives(); });
		operationDataService.on('setOnNoCurrentJointListener', (data) => { vm.generateEstimatives(); });
	}

	/**
	 * @param {string} selectedLineName: vOptimumEstimative | vStandardEstimative | vPoorEstimative
	 * @param {string} eventType : CONN | TRIP | BOTH
	 */
	public actionButtonBuildForecast(selectedLineName, eventType) {

		this.selectedBaseLine = selectedLineName;
		this.selectedEventType = eventType;

		/**
		 * Linha que o usuário escolheu
		 */
		const selectedLine = this.$scope.operationData.forecastContext[selectedLineName];

		/**
		 * Os tres parametros para definir cores
		 */
		const vOptimumEstimative = this.$scope.operationData.forecastContext.vOptimumEstimative;
		const vStandardEstimative = this.$scope.operationData.forecastContext.vStandardEstimative;
		const vPoorEstimative = this.$scope.operationData.forecastContext.vPoorEstimative;

		/**
		 * O que realmente aconteceu
		 */
		const actualLine = this.$scope.operationData.forecastContext.actualLine;

		this.$scope.forecast = [];

		let statesHash;
		let state;
		let isTripin;
		const splitColor = '#90ed7d';

		/**
		 * Expected
		 */
		for (const i in selectedLine) {

			statesHash = selectedLine[i];
			state = Object.keys(statesHash)[0];
			isTripin = statesHash[state].isTripin;

			const selectedParamExpectedTime = this.calcTimeSpent(selectedLine, state, eventType, isTripin);

			this.$scope.forecast.push({
				name: 'Expected ' + this.$filter('xpdStateLabelFilter')(state) + (isTripin ? ' Trip In' : ' Trip Out'),
				y: selectedParamExpectedTime,
				color: splitColor,
			});

		}

		/**
		 * Total Expected
		 */
		this.$scope.forecast.push({
			name: 'Total Expected Time',
			isIntermediateSum: true,
			color: '#434348',
		});

		/**
		 * Actual
		 */
		for (const j in selectedLine) {

			statesHash = selectedLine[j];
			state = Object.keys(statesHash)[0];
			isTripin = statesHash[state].isTripin;

			const directionLabel = isTripin === false ? 'TRIPOUT' : 'TRIPIN';

			const optimumTimeSpent = this.calcTimeSpent(vOptimumEstimative, state, eventType, isTripin);
			const standardTimeSpent = this.calcTimeSpent(vStandardEstimative, state, eventType, isTripin);
			const poorTimeSpent = this.calcTimeSpent(vPoorEstimative, state, eventType, isTripin);

			if (actualLine[state] && actualLine[state][directionLabel] && actualLine[state][directionLabel][eventType]) {

				const actualTimeSpent = Math.abs(
					actualLine[state][directionLabel][eventType].finalTime -
					actualLine[state][directionLabel][eventType].startTime,
				);

				this.$scope.forecast.push({
					name: 'Time Spent on ' + this.$filter('xpdStateLabelFilter')(state) + (isTripin ? ' Trip In' : ' Trip Out'),
					y: -1 * actualTimeSpent,
					color: this.color(actualTimeSpent, optimumTimeSpent, standardTimeSpent, poorTimeSpent),
				});

			}

		}

		/**
		 * Remaining Time
		 */
		this.$scope.forecast.push({
			name: 'Remaining Time',
			isSum: true,
			color: '#434348',
		});

	}

	public getTotalFailureTime(startTime, endTime) {
		if (!endTime) { return 0; }

		const diffTime = new Date(endTime).getTime() - new Date(startTime).getTime();
		return new Date(diffTime);
	}

	public getPanelStartState(keyName) {
		try {
			this.$scope.statusPanel[keyName] = JSON.parse(localStorage.getItem(keyName));
			return this.$scope.statusPanel[keyName];
		} catch (error) {
			return true;
		}
	}

	public changePanelState(keyName) {
		const newState = !this.getPanelStartState(keyName);
		this.$scope.statusPanel[keyName] = newState;
		localStorage.setItem(keyName, JSON.stringify(newState));
	}

	public selectedPoint(point) {
		this.$scope.statusPanel.panelChanelsIsCollapsed = false;
		localStorage.setItem('panelChanelsIsCollapsed', JSON.stringify(false));

		this.getReading(point);
	}

	public removeReadingFromList(index) {
		const readingRemoved = this.$scope.selectedReadings.splice(index, 1);
		this.$scope.removeMarker = readingRemoved[0].timestamp;
		this.restoreColor(readingRemoved[0].color);
	}

	private generateEstimatives() {

		if (this.$scope.operationData.stateContext && this.$scope.operationData.forecastContext) {

			let expectations: any = {};

			try {

				const currentState = this.$scope.operationData.stateContext.currentState;
				const estimatives = this.$scope.operationData.forecastContext.estimatives;
				const estimatedAt = new Date(estimatives.estimatedAt).getTime();

				const vTargetStateJointInterval = estimatives.vTargetEstimative.filter((line) => {
					return line[currentState] != null;
				})[0][currentState];

				const vOptimumStateJointInterval = estimatives.vOptimumEstimative.filter((line) => {
					return line[currentState] != null;
				})[0][currentState];

				const vStandardStateJointInterval = estimatives.vStandardEstimative.filter((line) => {
					return line[currentState] != null;
				})[0][currentState];

				const vPoorStateJointInterval = estimatives.vPoorEstimative.filter((line) => {
					return line[currentState] != null;
				})[0][currentState];

				const stateExpectedDuration = (1000 * vTargetStateJointInterval.BOTH.finalTime);
				const vOptimumStateExpectedDuration = (1000 * vOptimumStateJointInterval.BOTH.finalTime);
				const vStandardStateExpectedDuration = (1000 * vStandardStateJointInterval.BOTH.finalTime);
				const vPoorStateExpectedDuration = (1000 * vPoorStateJointInterval.BOTH.finalTime);

				// EXPECTED TRIP/CONN
				this.$scope.eventProperty.CONN = this.getEventProperty('CONN', vTargetStateJointInterval, vOptimumStateJointInterval, vStandardStateJointInterval, vPoorStateJointInterval);
				this.$scope.eventProperty.TRIP = this.getEventProperty('TRIP', vTargetStateJointInterval, vOptimumStateJointInterval, vStandardStateJointInterval, vPoorStateJointInterval);
				this.$scope.eventProperty.BOTH = this.getEventProperty('BOTH', vTargetStateJointInterval, vOptimumStateJointInterval, vStandardStateJointInterval, vPoorStateJointInterval);

				expectations = {
					stateExpectedEndTime: estimatedAt + stateExpectedDuration,
					vPoorStateExpectedEndTime: estimatedAt + vPoorStateExpectedDuration,

					stateExpectedDuration,
					vOptimumStateExpectedDuration,
					vStandardStateExpectedDuration,
					vPoorStateExpectedDuration,

					jointExpectedDuration: (stateExpectedDuration / vTargetStateJointInterval.BOTH.points.length),
					vPoorJointExpectedDuration: (vPoorStateExpectedDuration / vTargetStateJointInterval.BOTH.points.length),
				};

				const nextActivities = [];

				// tslint:disable-next-line:prefer-for-of
				for (let index = 0;
					index < estimatives.vTargetEstimative.length;
					index++) {

					try {

						const vTargetEstimative = estimatives.vTargetEstimative[index];

						const state = Object.keys(vTargetEstimative)[0];
						let startTime = estimatedAt;
						const duration = (vTargetEstimative[state].BOTH.finalTime * 1000);

						if (nextActivities.length > 0) {
							startTime = nextActivities[nextActivities.length - 1].finalTime;
						}

						const activity = {
							name: state,
							duration,
							startTime,
							finalTime: (startTime + duration),
							isTripin: vTargetEstimative[state].BOTH.isTripin,
						};

						nextActivities.push(activity);

					} catch (error) {
						console.error(error);
					}

				}

				expectations.nextActivities = nextActivities;

			} catch (error) {
				console.error(error);
			}

			this.$scope.expectations = expectations;
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

	private main() {
		try {

			this.generateEstimatives();

			if (!this.selectedBaseLine) {
				this.selectedBaseLine = 'vOptimumEstimative';
			}

			if (!this.selectedEventType) {
				this.selectedEventType = 'BOTH';
			}

			this.actionButtonBuildForecast(this.selectedBaseLine, this.selectedEventType);
			this.calcAccScore();
			this.getLastTwoEventsDuration(this.$scope.operationData.eventContext);
		} catch (error) {
			// setTimeout(onReadyToStart, 5000);
		}

	}

	private calcTimeSpent(line, state, eventType, isTripin) {
		for (const i in line) {
			if (line[i] && line[i][state] && line[i][state].isTripin === isTripin && line[i][state][eventType]) {
				return Math.abs(line[i][state][eventType].finalTime - line[i][state][eventType].startTime);
			}
		}
	}

	private color(actualDuration, optimumDuration, standardDuration, poorDuration) {
		if (actualDuration <= optimumDuration) {
			return '#73b9c6';
		} else if (actualDuration > optimumDuration && actualDuration <= standardDuration) {
			return '#0FA419';
		} else if (actualDuration > standardDuration && actualDuration <= poorDuration) {
			return '#ffe699';
		} else {
			return '#860000';
		}
	}

	private calcAccScore() {
		this.$scope.scoreData = {
			accScore: this.$scope.operationData.shiftContext.accScore.totalScore / this.$scope.operationData.shiftContext.accScore.eventScoreQty,
		};
	}

	private getLastTwoEventsDuration(eventContext) {

		const lastEvents = eventContext.lastEvents;

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
		this.readingSetupAPIService.getTick(tick, (reading) => {

			reading.color = point.color = this.getColor();
			this.$scope.selectedReadings.push(reading);

			// O time stamp enviado na rota é diferente do que vem na leitura
			// Isso garante que o ponto e a leitura tenha o mesmo timestamp
			point.timestamp = reading.timestamp;
			this.$scope.lastSelectedPoint = point;
		});
	}

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

	private getColor() {
		return this.colors.shift();
	}

	private restoreColor(color: string) {
		this.colors.push(color);
	}

}
