import { OperationDataService } from '../../../../xpd-resources/ng/xpd.operation-data/operation-data.service';
import { ReadingSetupAPIService } from '../../../../xpd-resources/ng/xpd.setupapi/reading-setupapi.service';

export class OperationDashboardController {

	// 'use strict';

	// angular.module('xpd.operation-dashboard').controller('OperationDashboardController', operationDashboardController);

	public static $inject = ['$scope', '$filter', 'operationDataService'];
	public actionButtonBuildForecast: (selectedLineName: any, eventType: any) => void;
	public getTotalFailureTime: (startTime: any, endTime: any) => 0 | Date;
	public getPanelStartState: (keyName: any) => any;
	public changePanelState: (keyName: any) => void;
	public operationDataFactory: any;

	constructor($scope, $filter, operationDataService: OperationDataService, readingSetupAPIService: ReadingSetupAPIService) {

		const vm = this;

		let selectedBaseLine;
		let selectedEventType;

		$scope.eventProperty = [];
		$scope.eventProperty.TRIP = {};
		$scope.eventProperty.CONN = {};
		$scope.statusPanel = [];
		$scope.jointInfo = {};
		$scope.removeMarker = null;
		$scope.lastSelectedPoint = null;
		$scope.selectedReadings = [];
		$scope.dados = {
			connectionEvents: [],
			tripEvents: [],
			timeEvents: [],
		};

		operationDataService.openConnection([]).then(function() {
			vm.operationDataFactory = operationDataService.operationDataFactory;
			$scope.operationData = vm.operationDataFactory.operationData;
			main();
		});

		vm.actionButtonBuildForecast = actionButtonBuildForecast;
		vm.getTotalFailureTime = getTotalFailureTime;
		vm.getPanelStartState = getPanelStartState;
		vm.changePanelState = changePanelState;
		vm.selectedPoint = selectedPoint;
		vm.removeReadingFromList = removeReadingFromList;

		operationDataService.on('setOnOptimumLineListener', main);
		operationDataService.on('setOnActualLineListener', main);
		operationDataService.on('setOnForecastChangeListener', main);

		operationDataService.on('setOnJointChangeListener', generateEstimatives);
		operationDataService.on('setOnCurrentJointListener', generateEstimatives);
		operationDataService.on('setOnNoCurrentJointListener', generateEstimatives);

		function generateEstimatives() {

			if ($scope.operationData.stateContext && $scope.operationData.forecastContext) {

				let expectations: any = {};

				try {

					const currentState = $scope.operationData.stateContext.currentState;
					const estimatives = $scope.operationData.forecastContext.estimatives;
					const estimatedAt = new Date(estimatives.estimatedAt).getTime();

					const vTargetStateJointInterval = estimatives.vTargetLine.filter(function(line) {
						return line[currentState] != null;
					})[0][currentState];

					const vOptimumStateJointInterval = estimatives.vOptimumLine.filter(function(line) {
						return line[currentState] != null;
					})[0][currentState];

					const vStandardStateJointInterval = estimatives.vStandardLine.filter(function(line) {
						return line[currentState] != null;
					})[0][currentState];

					const vPoorStateJointInterval = estimatives.vPoorLine.filter(function(line) {
						return line[currentState] != null;
					})[0][currentState];

					const stateExpectedDuration = (1000 * vTargetStateJointInterval.BOTH.finalTime);
					const vOptimumStateExpectedDuration = (1000 * vOptimumStateJointInterval.BOTH.finalTime);
					const vStandardStateExpectedDuration = (1000 * vStandardStateJointInterval.BOTH.finalTime);
					const vPoorStateExpectedDuration = (1000 * vPoorStateJointInterval.BOTH.finalTime);

					// EXPECTED TRIP/CONN
					$scope.eventProperty.CONN = getEventProperty('CONN', vTargetStateJointInterval, vOptimumStateJointInterval, vStandardStateJointInterval, vPoorStateJointInterval);
					$scope.eventProperty.TRIP = getEventProperty('TRIP', vTargetStateJointInterval, vOptimumStateJointInterval, vStandardStateJointInterval, vPoorStateJointInterval);
					$scope.eventProperty.BOTH = getEventProperty('BOTH', vTargetStateJointInterval, vOptimumStateJointInterval, vStandardStateJointInterval, vPoorStateJointInterval);

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
						index < estimatives.vTargetLine.length;
						index++) {

						try {

							const vTargetLine = estimatives.vTargetLine[index];

							const state = Object.keys(vTargetLine)[0];
							let startTime = estimatedAt;
							const duration = (vTargetLine[state].BOTH.finalTime * 1000);

							if (nextActivities.length > 0) {
								startTime = nextActivities[nextActivities.length - 1].finalTime;
							}

							const activity = {
								name: state,
								duration,
								startTime,
								finalTime: (startTime + duration),
								isTripin: vTargetLine[state].BOTH.isTripin,
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

				$scope.expectations = expectations;
			}

		}

		function getEventProperty(eventType, vTargetStateJointInterval, vOptimumStateJointInterval, vStandardStateJointInterval, vPoorStateJointInterval) {
			return {
				vtargetTime: (vTargetStateJointInterval[eventType].finalTime / vTargetStateJointInterval[eventType].points.length),
				voptimumTime: (vOptimumStateJointInterval[eventType].finalTime / vOptimumStateJointInterval[eventType].points.length),
				vstandardTime: (vStandardStateJointInterval[eventType].finalTime / vStandardStateJointInterval[eventType].points.length),
				vpoorTime: (vPoorStateJointInterval[eventType].finalTime / vPoorStateJointInterval[eventType].points.length),
			};
		}

		function main() {
			try {

				generateEstimatives();

				if (!selectedBaseLine) {
					selectedBaseLine = 'vOptimumLine';
				}

				if (!selectedEventType) {
					selectedEventType = 'BOTH';
				}

				actionButtonBuildForecast(selectedBaseLine, selectedEventType);
				calcAccScore();
				getLastTwoEventsDuration($scope.operationData.eventContext);
			} catch (error) {
				// setTimeout(onReadyToStart, 5000);
			}

		}

		/**
		 * @param {string} selectedLineName: vOptimumLine | vStandardLine | vPoorLine
		 * @param {string} eventType : CONN | TRIP | BOTH
		 */
		function actionButtonBuildForecast(selectedLineName, eventType) {

			selectedBaseLine = selectedLineName;
			selectedEventType = eventType;

			/**
			 * Linha que o usuário escolheu
			 */
			const selectedLine = $scope.operationData.forecastContext[selectedLineName];

			/**
			 * Os tres parametros para definir cores
			 */
			const vOptimumLine = $scope.operationData.forecastContext.vOptimumLine;
			const standardLine = $scope.operationData.forecastContext.vStandardLine;
			const poorLine = $scope.operationData.forecastContext.vPoorLine;

			/**
			 * O que realmente aconteceu
			 */
			const actualLine = $scope.operationData.forecastContext.actualLine;

			$scope.forecast = [];

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

				const selectedParamExpectedTime = calcTimeSpent(selectedLine, state, eventType, isTripin);

				$scope.forecast.push({
					name: 'Expected ' + $filter('xpdStateLabelFilter')(state) + (isTripin ? ' Trip In' : ' Trip Out'),
					y: selectedParamExpectedTime,
					color: splitColor,
				});

			}

			/**
			 * Total Expected
			 */
			$scope.forecast.push({
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

				const optimumTimeSpent = calcTimeSpent(vOptimumLine, state, eventType, isTripin);
				const standardTimeSpent = calcTimeSpent(standardLine, state, eventType, isTripin);
				const poorTimeSpent = calcTimeSpent(poorLine, state, eventType, isTripin);

				if (actualLine[state] && actualLine[state][directionLabel] && actualLine[state][directionLabel][eventType]) {

					const actualTimeSpent = Math.abs(
						actualLine[state][directionLabel][eventType].finalTime -
						actualLine[state][directionLabel][eventType].startTime,
					);

					$scope.forecast.push({
						name: 'Time Spent on ' + $filter('xpdStateLabelFilter')(state) + (isTripin ? ' Trip In' : ' Trip Out'),
						y: -1 * actualTimeSpent,
						color: color(actualTimeSpent, optimumTimeSpent, standardTimeSpent, poorTimeSpent),
					});

				}

			}

			/**
			 * Remaining Time
			 */
			$scope.forecast.push({
				name: 'Remaining Time',
				isSum: true,
				color: '#434348',
			});

		}

		function calcTimeSpent(line, state, eventType, isTripin) {
			for (const i in line) {
				if (line[i] && line[i][state] && line[i][state].isTripin === isTripin && line[i][state][eventType]) {
					return Math.abs(line[i][state][eventType].finalTime - line[i][state][eventType].startTime);
				}
			}
		}

		function color(actualDuration, optimumDuration, standardDuration, poorDuration) {
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

		function calcAccScore() {
			$scope.scoreData = {
				accScore: $scope.operationData.shiftContext.accScore.totalScore / $scope.operationData.shiftContext.accScore.eventScoreQty,
			};
		}

		function getLastTwoEventsDuration(eventContext) {

			const lastEvents = eventContext.lastEvents;

			let conn = false;
			let trip = false;

			for (let index = lastEvents.length - 1; index >= 0; index--) {

				const event = lastEvents[index];

				if (event.eventType === 'CONN') {
					$scope.lastConnDuration = (event.duration / 1000);
					conn = true;
				}

				if (event.eventType === 'TRIP') {
					$scope.lastTripDuration = (event.duration / 1000);
					trip = true;
				}

				if (conn && trip) { break; }

			}
		}

		function getTotalFailureTime(startTime, endTime) {
			if (!endTime) { return 0; }

			const diffTime = new Date(endTime).getTime() - new Date(startTime).getTime();
			return new Date(diffTime);
		}

		function getPanelStartState(keyName) {
			$scope.statusPanel[keyName] = JSON.parse(localStorage.getItem(keyName));
			return $scope.statusPanel[keyName];
		}

		function changePanelState(keyName) {
			const newState = !getPanelStartState(keyName);
			$scope.statusPanel[keyName] = newState;
			localStorage.setItem(keyName, JSON.stringify(newState));
		}

		function selectedPoint(point) {
			getReading(point);
		}

		function getReading(point) {

			if (!point.timestamp) { return; }

			const tick = new Date(point.timestamp).getTime();
			this.readingSetupAPIService.getTick(tick, function (reading) {

				reading.color = point.color = getColor();
				$scope.selectedReadings.push(reading);

				// O time stamp enviado na rota é diferente do que vem na leitura
				// Isso garante que o ponto e a leitura tenha o mesmo timestamp
				point.timestamp = reading.timestamp;
				$scope.lastSelectedPoint = point;
			});
		}

		function removeReadingFromList(index) {
			const readingRemoved = $scope.selectedReadings.splice(index, 1);
			$scope.removeMarker = readingRemoved[0].timestamp;
			restoreColor(readingRemoved[0].color);
		}

		const colors = [
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
			'#C895C5', '#320033', '#FF6832', '#66E1D3', '#CFCDAC', '#D0AC94', '#7ED379', '#012C58'
		];

		function getColor() {
			return colors.shift();
		}

		function restoreColor(color: string) {
			colors.push(color);
		}
	}

}
