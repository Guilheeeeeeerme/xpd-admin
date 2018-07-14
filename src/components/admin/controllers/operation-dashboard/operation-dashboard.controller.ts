import { OperationDataService } from '../../../../xpd-resources/ng/xpd.operation-data/operation-data.service';

export class OperationDashboardController {

	// 'use strict';

	// angular.module('xpd.operation-dashboard').controller('OperationDashboardController', operationDashboardController);

	public static $inject = ['$scope', '$filter', 'operationDataService'];
	public actionButtonBuildForecast: (selectedLineName: any, eventType: any) => void;
	public getTotalFailureTime: (startTime: any, endTime: any) => 0 | Date;
	public getPanelStartState: (keyName: any) => any;
	public changePanelState: (keyName: any) => void;
	public operationDataFactory: any;

	constructor($scope, $filter, operationDataService: OperationDataService) {

		const vm = this;

		let selectedBaseLine;
		let selectedEventType;

		$scope.eventProperty = [];
		$scope.eventProperty.TRIP = {};
		$scope.eventProperty.CONN = {};
		$scope.statusPanel = [];
		$scope.jointInfo = {};
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
	}

}
