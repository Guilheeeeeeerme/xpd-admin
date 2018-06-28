(function () {

	'use strict';

	angular.module('xpd.operation-dashboard').controller('OperationDashboardController', operationDashboardController);

	operationDashboardController.$inject = ['$scope', '$filter', 'operationDataFactory'];

	function operationDashboardController($scope, $filter, operationDataFactory) {

		var vm = this;

		var selectedBaseLine;
		var selectedEventType;

		$scope.statusPanel = [];
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
				prepareFailure();
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

		function getTotalFailureTime(startTime, endTime) {
			if(!endTime) return 0;

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