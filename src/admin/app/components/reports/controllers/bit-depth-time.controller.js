(function () {
	'use strict';

	angular.module('xpd.reports')
		.controller('BitDepthTimeController', bitDepthTimeController);

	bitDepthTimeController.$inject = ['$scope', '$routeParams', 'reportsSetupAPIService'];

	function bitDepthTimeController($scope, $routeParams, reportsSetupAPIService) {

		var vm = this;

		$scope.dados = {
			data: [],
			title: 'Bit Depth x Time',
			dateTimeEvent: {}
		};

		$scope.wellId = $routeParams.wellId;

		vm.setCurrentPlannedEvent = setCurrentPlannedEvent;
		vm.setCurrentExecutedEvent = setCurrentExecutedEvent;
		vm.setHoleDepth = setHoleDepth;
		vm.setCurrentPoint = setCurrentPoint;

		vm.getAlarmsFromEvent = getAlarmsFromEvent;

		if ($scope.wellId !== undefined) {
			renderChart();
		}

		function renderChart() {
			reportsSetupAPIService.getOperationQueue($scope.wellId, getOperationQueueCallback, error);
		}

		function runPlanned(results, resolve) {
			try {
				results.shift()().then(function (result) {
					$scope.planned.push(result);
					runPlanned(results, resolve);
				});
			} catch (e) {

				var mergedData = {
					bitDepthPlannedPoints: null,
					sectionsBands: null,
					startChartAt: new Date().getTime(),
				};

				var startPointAt;

				$scope.planned.map(function (chartData) {
					mergedData.startChartAt = Math.min(mergedData.startChartAt, chartData.startChartAt);
				});

				startPointAt = mergedData.startChartAt;

				$scope.planned.map(function (chartData) {

					chartData.bitDepthPlannedPoints.data = chartData.bitDepthPlannedPoints.events.map(function (event) {
						var point = [
							startPointAt,
							event.startBitDepth,
						];

						startPointAt += (event.duration * 1000);

						return point;
					});
				});

				$scope.planned.map(function (chartData) {

					if (!mergedData.sectionsBands) {
						mergedData.sectionsBands = chartData.sectionsBands;
					}
				});

				$scope.planned.map(function (result) {

					if (!mergedData.bitDepthPlannedPoints) {
						mergedData.bitDepthPlannedPoints = result.bitDepthPlannedPoints;
					} else if (result.bitDepthPlannedPoints.data.length && result.bitDepthPlannedPoints.events.length) {
						mergedData.bitDepthPlannedPoints.data = [...mergedData.bitDepthPlannedPoints.data, ...result.bitDepthPlannedPoints.data];
						mergedData.bitDepthPlannedPoints.events = [...mergedData.bitDepthPlannedPoints.events, ...result.bitDepthPlannedPoints.events];
					}

				});

				// $scope.dados.data.bitDepthPlannedPoints = mergedData.bitDepthPlannedPoints;
				// $scope.dados.data.sectionsBands = mergedData.sectionsBands;
				// $scope.dados.data.startChartAt = mergedData.startChartAt;

				// mergeExecutedAndPlanned(mergedData);

				$scope.dados.data = mergedData;
				resolve();
			}
		}

		function runExecuted(results) {
			try {
				results.shift()().then(function (result) {
					$scope.executed.push(result);
					runExecuted(results);
				});
			} catch (e) {

				var mergedData = {
					bitDepthPlannedPoints: $scope.dados.data.bitDepthPlannedPoints,
					sectionsBands: $scope.dados.data.sectionsBands,
					startChartAt: $scope.dados.data.startChartAt,
					bitDepthExecutedPoints: null,
					holeDepthPoints: null,
				};

				var holeDepth = null;

				$scope.executed.map(function (chartData) {
					if (!mergedData.bitDepthExecutedPoints) {
						mergedData.bitDepthExecutedPoints = chartData.bitDepthExecutedPoints;
					} else if (chartData.bitDepthExecutedPoints.data.length && chartData.bitDepthExecutedPoints.events.length) {
						mergedData.bitDepthExecutedPoints.data = [...mergedData.bitDepthExecutedPoints.data, ...chartData.bitDepthExecutedPoints.data];
						mergedData.bitDepthExecutedPoints.events = [...mergedData.bitDepthExecutedPoints.events, ...chartData.bitDepthExecutedPoints.events];
					}

					if (!mergedData.holeDepthPoints) {
						mergedData.holeDepthPoints = chartData.holeDepthPoints;
					} else if (chartData.holeDepthPoints.data.length) {

						if (!holeDepth)
							holeDepth = mergedData.holeDepthPoints.data[mergedData.holeDepthPoints.data.length - 1][1];

						chartData.holeDepthPoints.data = chartData.holeDepthPoints.data.map(function (data) {
							holeDepth = Math.max(holeDepth, data[1]);
							data[1] = holeDepth;

							return data;
						});

						mergedData.holeDepthPoints.data = [...mergedData.holeDepthPoints.data, ...chartData.holeDepthPoints.data];
					}

					if (!mergedData.sectionsBands) {
						mergedData.sectionsBands = chartData.sectionsBands;
					}
				});

				$scope.dados.data = mergedData;
			}
		}

		function getOperationQueueCallback(results) {
			getOperationPlanned(results).then(function () {
				getOperationExecuted(results);
			});
		}

		function getOperationPlanned(operations) {
			$scope.planned = [];

			return new Promise(function (resolve, reject) {

				operations = operations.map(function (operation) {
					return function () {
						return new Promise(function (resolve, reject) {
							reportsSetupAPIService.getBitDepthChartForOperation($scope.wellId, operation.id, resolve, reject);
						});
					};
				});

				runPlanned(operations, resolve);
			});			
		}

		function getOperationExecuted(operations) {
			$scope.executed = [];
			operations = operations.map(function (operation) {
				return function () {
					return new Promise(function (resolve, reject) {
						reportsSetupAPIService.getOperationExecuted(operation.id, resolve, reject);
					});
				};
			});

			runExecuted(operations);
		}

		function error(error) {
			console.log('error', error);
		}

		function setCurrentPlannedEvent(event) {
			$scope.dados.plannedEvent = event;
			$scope.$apply();
		}

		function setHoleDepth(event) {
			$scope.dados.holeDepth = event;
			$scope.$apply();
		}

		function setCurrentExecutedEvent(event) {
			$scope.dados.executedEvent = event;
			$scope.$apply();
		}

		function setCurrentPoint(event) {
			$scope.dados.currentPoint = event;
			$scope.$apply();
		}

		function getAlarmsFromEvent(event) {
			if (event.alarm) {
				return [event.alarm];
			}

			if (event.durationAlarm) {
				return [event.durationAlarm];
			}

			if (event.alarms) {
				return event.alarms;
			}

			return [];
		}



	}

})();
