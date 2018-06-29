(function () {

	'use strict';

	angular.module('xpd.operation-dashboard').controller('OperationDashboardController', operationDashboardController);

	operationDashboardController.$inject = ['$scope', '$filter', 'operationDataFactory'];

	function operationDashboardController($scope, $filter, operationDataFactory) {

		var vm = this;

		var selectedBaseLine;
		var selectedEventType;

		$scope.statusPanel = [];
		$scope.jointInfo = {};
		$scope.dados = {
			connectionEvents: [],
			tripEvents: [],
			timeEvents: [],
		};

		operationDataFactory.openConnection([]).then(function (response) {
			operationDataFactory = response;
			$scope.operationData = operationDataFactory.operationData;
			__init();
		});

		vm.actionButtonBuildForecast = actionButtonBuildForecast;
		vm.getTotalFailureTime = getTotalFailureTime;
		vm.getPanelStartState = getPanelStartState;
		vm.changePanelState = changePanelState;

		operationDataFactory.addEventListener('operationDashboardController', 'setOnOptimumLineListener', __init);
		operationDataFactory.addEventListener('operationDashboardController', 'setOnActualLineListener', __init);
		operationDataFactory.addEventListener('operationDashboardController', 'setOnForecastChangeListener', __init);

		function __init() {
			try {

				if (!selectedBaseLine) {
					selectedBaseLine = 'vOptimumLine';
				}

				if (!selectedEventType) {
					selectedEventType = 'BOTH';
				}

				actionButtonBuildForecast(selectedBaseLine, selectedEventType);
				calcAccScore();
				getLastTwoEvents($scope.operationData.eventContext);
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
			$scope.accScore = $scope.operationData.shiftContext.accScore.totalScore / $scope.operationData.shiftContext.accScore.eventScoreQty;
		}

		function getLastTwoEvents(eventContext) {

			var lastEvents = eventContext.lastEvents;
			var lastTwoEvents = [];

			var conn = false;
			var trip = false;

			for (var index = lastEvents.length-1; index >= 0; index--) {

				var event = lastEvents[index];				
				
				if (event.eventType == 'CONN') {
					lastTwoEvents['CONN'] = prepareLastEvent(event);
					conn = true;
				}

				if (event.eventType == 'TRIP') {
					lastTwoEvents['TRIP'] = prepareLastEvent(event);
					trip = true;
				}

				if (conn && trip) break;

			}

			$scope.lastTwoEvents = lastTwoEvents;
			$scope.jointInfo = prepareJoint();
		}

		function prepareLastEvent(event) {

			//afterVpoor é só para aparecer a barra vermelha após o poor

			var eventDuration = event.duration / 1000;
			var displacement = 1;

			if(event.eventType == 'TRIP') {
				displacement = $scope.operationData.operationContext.currentOperation.slipsThreshold;
			}

			var vtargetTime = displacement / event.vtarget;
			var voptimumTime = displacement / event.voptimum;
			var vstandardTime = displacement / event.vstandard;
			var vpoorTime = displacement / event.vpoor;
			var afterVpoorTime = vpoorTime + (vpoorTime / 10);
			var voptimumPercentage = calcPercentage(voptimumTime, afterVpoorTime);
			var vstandardPercentage = calcPercentage(vstandardTime, afterVpoorTime) - voptimumPercentage;
			var vpoorPercentage = calcPercentage(vpoorTime, afterVpoorTime) - (voptimumPercentage + vstandardPercentage);
			var afterVpoorPercentage = 100 - (voptimumPercentage + vstandardPercentage + vpoorPercentage);
			var colorPerformance = getColorPerformance(eventDuration, voptimumTime, vstandardTime, vpoorTime);

			return {
				duration: eventDuration,
				vtargetTime: vtargetTime,
				percentageDuration: calcPercentage(eventDuration, afterVpoorTime),
				voptimumTime: voptimumTime,
				vstandardTime: vstandardTime,
				vpoorTime: vpoorTime,
				afterVpoorTime: vpoorTime + (vpoorTime / 10),
				colorPerformance: colorPerformance,

				voptimumPercentage: voptimumPercentage,
				vstandardPercentage: vstandardPercentage,
				vpoorPercentage: vpoorPercentage,
				afterVpoorPercentage: afterVpoorPercentage
			};
		}

		function prepareJoint() {
			var tripEvent = $scope.lastTwoEvents['TRIP'];
			var connEvent = $scope.lastTwoEvents['CONN'];

			console.log('trip', 'conn');

			var duration = tripEvent.duration + connEvent.duration;
			var voptimumTime = tripEvent.voptimumTime + connEvent.voptimumTime;
			var vstandardTime = tripEvent.vstandardTime + connEvent.vstandardTime;
			var vpoorTime = tripEvent.vpoorTime + connEvent.vpoorTime;
			var afterVpoorTime = tripEvent.afterVpoorTime + connEvent.afterVpoorTime;
			var percentageDuration = calcPercentage(duration, afterVpoorTime);
			var colorPerformance = getColorPerformance(duration, voptimumTime, vstandardTime, vpoorTime);

			return {
				duration: duration,
				voptimumTime: voptimumTime,
				vstandardTime: vstandardTime,
				vpoorTime: vpoorTime,
				afterVpoorTime: afterVpoorTime,
				percentageDuration: percentageDuration,
				colorPerformance: colorPerformance,
			}

		}

		function calcPercentage(partTime, totalTime) {
			return (partTime * 100) / totalTime;
		}

		function getColorPerformance(duration, voptimumTime, vstandardTime, vpoorTime) {

			if (duration < voptimumTime) {
				return '';
			} else if (duration <= vstandardTime ) {
				return 'progress-bar-success';
			} else if (duration <= vpoorTime) {
				return 'progress-bar-warning';
			} else {
				return 'progress-bar-danger';
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
	}

})();