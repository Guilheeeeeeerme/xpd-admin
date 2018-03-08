(function () {
	'use strict';

	angular.module('xpd.reports')
		.controller('BitDepthTimeController', bitDepthTimeController);

	bitDepthTimeController.$inject = ['$scope', '$routeParams', 'reportsSetupAPIService'];

	function bitDepthTimeController($scope, $routeParams, reportSetupAPIService) {

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
			reportSetupAPIService.getOperationQueue($scope.wellId, getOperationQueue, error);
		}

		function runQueue(results) {
			try {
				results.shift()().then(function (result) {
					$scope.results.push(result);
					runQueue(results);
				});
			} catch (e) {

				var mergedData = {
					bitDepthPlannedPoints: null,
					bitDepthExecutedPoints: null,
					holeDepthPoints: null,
					sectionsBands: null,
					startChartAt: new Date().getTime(),
				};

				let holeDepth = null;

				$scope.results.map(function (result) {

					if (!mergedData.startChartAt) {
						mergedData.startChartAt = result.startChartAt;
					} else {
						mergedData.startChartAt = Math.min(result.startChartAt, mergedData.startChartAt);
					}

					if (!mergedData.bitDepthExecutedPoints) {
						mergedData.bitDepthExecutedPoints = result.bitDepthExecutedPoints;
					} else if (result.bitDepthExecutedPoints.data.length && result.bitDepthExecutedPoints.events.length) {
						mergedData.bitDepthExecutedPoints.data = [...mergedData.bitDepthExecutedPoints.data, ...result.bitDepthExecutedPoints.data];
						mergedData.bitDepthExecutedPoints.events = [...mergedData.bitDepthExecutedPoints.events, ...result.bitDepthExecutedPoints.events];
					}


					if (!mergedData.holeDepthPoints) {
						mergedData.holeDepthPoints = result.holeDepthPoints;
					} else if (result.holeDepthPoints.data.length) {

						result.holeDepthPoints.data = result.holeDepthPoints.data.map(function (data) {
							if (!holeDepth) {
								holeDepth = data[1];
							} else {
								holeDepth = Math.max(holeDepth, data[1]);
								data[1] = holeDepth;
							}

							return data;
						});

						mergedData.holeDepthPoints.data = [...mergedData.holeDepthPoints.data, ...result.holeDepthPoints.data];
					}

					if (!mergedData.sectionsBands) {
						mergedData.sectionsBands = result.sectionsBands;
					}
				});

				let startChartAt = angular.copy(mergedData.startChartAt);

				$scope.results.map(function (result) {

					result.bitDepthPlannedPoints.data = result.bitDepthPlannedPoints.data.map(function (data, index) {
						data.x = startChartAt;
						startChartAt += (result.bitDepthPlannedPoints.events[index].duration * 1000);
						return data;
					});

					if (!mergedData.bitDepthPlannedPoints) {
						mergedData.bitDepthPlannedPoints = result.bitDepthPlannedPoints;
					} else if (result.bitDepthPlannedPoints.data.length && result.bitDepthPlannedPoints.events.length) {
						mergedData.bitDepthPlannedPoints.data = [...mergedData.bitDepthPlannedPoints.data, ...result.bitDepthPlannedPoints.data];
						mergedData.bitDepthPlannedPoints.events = [...mergedData.bitDepthPlannedPoints.events, ...result.bitDepthPlannedPoints.events];
					}

				});

				$scope.dados.data = mergedData;
				// console.log($scope.results);
			}
		}

		function getOperationQueue(results) {

			$scope.results = [];
			results = results.map(function (result) {
				return function () {
					return new Promise(function (resolve, reject) {
						reportSetupAPIService.getBitDepthChartForOperation($scope.wellId, result.id, resolve, reject);
					});
				};
			});
			runQueue(results);

			// $scope.dados.data = result;
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
