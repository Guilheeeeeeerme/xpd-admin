(function () {

	'use strict';

	angular.module('xpd.operation-dashboard').controller('OperationDashboardController', operationDashboardController);

	operationDashboardController.$inject = ['$scope', '$filter', 'operationDataFactory', 'readingSetupAPIService'];

	function operationDashboardController($scope, $filter, operationDataFactory, readingSetupAPIService) {

		var vm = this;

		var selectedBaseLine;
		var selectedEventType;

		$scope.eventProperty = [];
		$scope.eventProperty['TRIP'] = {};
		$scope.eventProperty['CONN'] = {};
		$scope.statusPanel = [];
		$scope.jointInfo = {};
		$scope.readingTimestamp = null;
		$scope.dados = {
			connectionEvents: [],
			tripEvents: [],
			timeEvents: []
		};

		operationDataFactory.openConnection([]).then(function (response) {
			operationDataFactory = response;
			$scope.operationData = operationDataFactory.operationData;
			main();
		});

		vm.actionButtonBuildForecast = actionButtonBuildForecast;
		vm.getTotalFailureTime = getTotalFailureTime;
		vm.getPanelStartState = getPanelStartState;
		vm.changePanelState = changePanelState;
		vm.selectedTimestamp = selectedTimestamp;

		operationDataFactory.addEventListener('operationDashboardController', 'setOnOptimumLineListener', main);
		operationDataFactory.addEventListener('operationDashboardController', 'setOnActualLineListener', main);
		operationDataFactory.addEventListener('operationDashboardController', 'setOnForecastChangeListener', main);

		operationDataFactory.addEventListener('operationDashboardController', 'setOnJointChangeListener', generateEstimatives);
		operationDataFactory.addEventListener('operationDashboardController', 'setOnCurrentJointListener', generateEstimatives);
		operationDataFactory.addEventListener('operationDashboardController', 'setOnNoCurrentJointListener', generateEstimatives);

		function generateEstimatives() {

			if ($scope.operationData.stateContext && $scope.operationData.forecastContext) {

				var expectations = {};

				try {

					var currentState = $scope.operationData.stateContext.currentState;
					var estimatives = $scope.operationData.forecastContext.estimatives;
					var estimatedAt = new Date(estimatives.estimatedAt).getTime();

					var vTargetStateJointInterval = estimatives.vTargetLine.filter(function (line) {
						return line[currentState] != null;
					})[0][currentState];

					var vOptimumStateJointInterval = estimatives.vOptimumLine.filter(function (line) {
						return line[currentState] != null;
					})[0][currentState];

					var vStandardStateJointInterval = estimatives.vStandardLine.filter(function (line) {
						return line[currentState] != null;
					})[0][currentState];

					var vPoorStateJointInterval = estimatives.vPoorLine.filter(function (line) {
						return line[currentState] != null;
					})[0][currentState];

					var stateExpectedDuration = (1000 * vTargetStateJointInterval.BOTH.finalTime);
					var vOptimumStateExpectedDuration = (1000 * vOptimumStateJointInterval.BOTH.finalTime);
					var vStandardStateExpectedDuration = (1000 * vStandardStateJointInterval.BOTH.finalTime);
					var vPoorStateExpectedDuration = (1000 * vPoorStateJointInterval.BOTH.finalTime);

					// EXPECTED TRIP/CONN
					$scope.eventProperty['CONN'] = getEventProperty('CONN', vTargetStateJointInterval, vOptimumStateJointInterval, vStandardStateJointInterval, vPoorStateJointInterval);
					$scope.eventProperty['TRIP'] = getEventProperty('TRIP', vTargetStateJointInterval, vOptimumStateJointInterval, vStandardStateJointInterval, vPoorStateJointInterval);
					$scope.eventProperty['BOTH'] = getEventProperty('BOTH', vTargetStateJointInterval, vOptimumStateJointInterval, vStandardStateJointInterval, vPoorStateJointInterval);

					expectations = {
						stateExpectedEndTime: estimatedAt + stateExpectedDuration,
						vPoorStateExpectedEndTime: estimatedAt + vPoorStateExpectedDuration,

						stateExpectedDuration: stateExpectedDuration,
						vOptimumStateExpectedDuration: vOptimumStateExpectedDuration,
						vStandardStateExpectedDuration: vStandardStateExpectedDuration,
						vPoorStateExpectedDuration: vPoorStateExpectedDuration,

						jointExpectedDuration: (stateExpectedDuration / vTargetStateJointInterval.BOTH.points.length),
						vPoorJointExpectedDuration: (vPoorStateExpectedDuration / vTargetStateJointInterval.BOTH.points.length),
					};

					var nextActivities = [];

					for (var index = 0;
						index < estimatives.vTargetLine.length;
						index++) {

						try {

							var vTargetLine = estimatives.vTargetLine[index];

							var state = Object.keys(vTargetLine)[0];
							var startTime = estimatedAt;
							var duration = (vTargetLine[state].BOTH.finalTime * 1000);

							if (nextActivities.length > 0) {
								startTime = nextActivities[nextActivities.length - 1].finalTime;
							}

							var activity = {
								name: state,
								duration: duration,
								startTime: startTime,
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
			var selectedLine = $scope.operationData.forecastContext[selectedLineName];

			/**
			 * Os tres parametros para definir cores
			 */
			var vOptimumLine = $scope.operationData.forecastContext.vOptimumLine;
			var standardLine = $scope.operationData.forecastContext.vStandardLine;
			var poorLine = $scope.operationData.forecastContext.vPoorLine;

			/**
			 * O que realmente aconteceu
			 */
			var actualLine = $scope.operationData.forecastContext.actualLine;

			$scope.forecast = [];

			var statesHash;
			var state;
			var isTripin;
			var splitColor = '#90ed7d';

			/**
			 * Expected
			 */
			for (var i in selectedLine) {

				statesHash = selectedLine[i];
				state = Object.keys(statesHash)[0];
				isTripin = statesHash[state].isTripin;

				var selectedParamExpectedTime = calcTimeSpent(selectedLine, state, eventType, isTripin);

				$scope.forecast.push({
					name: 'Expected ' + $filter('xpdStateLabelFilter')(state) + (isTripin ? ' Trip In' : ' Trip Out'),
					y: selectedParamExpectedTime,
					color: splitColor
				});

			}

			/**
			 * Total Expected
			 */
			$scope.forecast.push({
				name: 'Total Expected Time',
				isIntermediateSum: true,
				color: '#434348'
			});

			/**
			 * Actual
			 */
			for (var j in selectedLine) {

				statesHash = selectedLine[j];
				state = Object.keys(statesHash)[0];
				isTripin = statesHash[state].isTripin;

				var directionLabel = isTripin === false ? 'TRIPOUT' : 'TRIPIN';

				var optimumTimeSpent = calcTimeSpent(vOptimumLine, state, eventType, isTripin);
				var standardTimeSpent = calcTimeSpent(standardLine, state, eventType, isTripin);
				var poorTimeSpent = calcTimeSpent(poorLine, state, eventType, isTripin);

				if (actualLine[state] && actualLine[state][directionLabel] && actualLine[state][directionLabel][eventType]) {

					var actualTimeSpent = Math.abs(
						actualLine[state][directionLabel][eventType].finalTime -
						actualLine[state][directionLabel][eventType].startTime
					);

					$scope.forecast.push({
						name: 'Time Spent on ' + $filter('xpdStateLabelFilter')(state) + (isTripin ? ' Trip In' : ' Trip Out'),
						y: -1 * actualTimeSpent,
						color: color(actualTimeSpent, optimumTimeSpent, standardTimeSpent, poorTimeSpent)
					});

				}

			}

			/**
			 * Remaining Time
			 */
			$scope.forecast.push({
				name: 'Remaining Time',
				isSum: true,
				color: '#434348'
			});

		}

		function calcTimeSpent(line, state, eventType, isTripin) {
			for (var i in line) {
				if (line[i] && line[i][state] && line[i][state].isTripin == isTripin && line[i][state][eventType]) {
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
				accScore: $scope.operationData.shiftContext.accScore.totalScore / $scope.operationData.shiftContext.accScore.eventScoreQty
			};
		}

		function getLastTwoEventsDuration(eventContext) {

			var lastEvents = eventContext.lastEvents;

			var conn = false;
			var trip = false;

			for (var index = lastEvents.length - 1; index >= 0; index--) {

				var event = lastEvents[index];

				if (event.eventType == 'CONN') {
					$scope.lastConnDuration = (event.duration / 1000);
					conn = true;
				}

				if (event.eventType == 'TRIP') {
					$scope.lastTripDuration = (event.duration / 1000);
					trip = true;
				}

				if (conn && trip) break;

			}
		}	

		function getTotalFailureTime(startTime, endTime) {
			if (!endTime) return 0;

			var diffTime = new Date(endTime).getTime() - new Date(startTime).getTime();
			return new Date(diffTime);
		}

		function getPanelStartState(keyName) {
			$scope.statusPanel[keyName] = JSON.parse(localStorage.getItem(keyName));
			return $scope.statusPanel[keyName];
		}

		function changePanelState(keyName) {
			var newState = !getPanelStartState(keyName);
			$scope.statusPanel[keyName] = newState;
			localStorage.setItem(keyName, newState);
		}

		function selectedTimestamp(timestamp) {
			getReading(timestamp);
		}

		function getReading(timestamp) {

			if (!timestamp) return;

			var tick = new Date(timestamp).getTime();
			readingSetupAPIService.getTick(tick, getReadingSuccessCallback);
		}

		function getReadingSuccessCallback(reading) {
			$scope.selectedReading = reading;
		}
	}

})();