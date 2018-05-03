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

				var startPointAt;

				$scope.results.map(function (chartData) {
					mergedData.startChartAt = Math.min(mergedData.startChartAt, chartData.startChartAt);
				});

				startPointAt = mergedData.startChartAt;

				$scope.results.map(function (chartData) {
					
					chartData.bitDepthPlannedPoints.data = chartData.bitDepthPlannedPoints.events.map(function(event){
						var point = [
							startPointAt,
							event.startBitDepth,
						];

						startPointAt += (event.duration * 1000);

						return point;
					});
				});

				var holeDepth = null;

				$scope.results.map(function (chartData) {
					
					// if (!mergedData.startChartAt) {
					// 	mergedData.startChartAt = result.startChartAt;
					// } else {
					// 	mergedData.startChartAt = Math.min(result.startChartAt, mergedData.startChartAt);
					// }

					if (!mergedData.bitDepthExecutedPoints) {
						mergedData.bitDepthExecutedPoints = chartData.bitDepthExecutedPoints;
					} else if (chartData.bitDepthExecutedPoints.data.length && chartData.bitDepthExecutedPoints.events.length) {
						mergedData.bitDepthExecutedPoints.data = [...mergedData.bitDepthExecutedPoints.data, ...chartData.bitDepthExecutedPoints.data];
						mergedData.bitDepthExecutedPoints.events = [...mergedData.bitDepthExecutedPoints.events, ...chartData.bitDepthExecutedPoints.events];
					}


					if (!mergedData.holeDepthPoints) {
						mergedData.holeDepthPoints = chartData.holeDepthPoints;
					} else if (chartData.holeDepthPoints.data.length) {
						
						if(!holeDepth)
							holeDepth = mergedData.holeDepthPoints.data[mergedData.holeDepthPoints.data.length-1][1];

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

				// let startChartAt = angular.copy(mergedData.startChartAt);

				$scope.results.map(function (result) {

					// result.bitDepthPlannedPoints.data = result.bitDepthPlannedPoints.data.map(function (data, index) {
					// 	data.x = startChartAt;
					// 	startChartAt += (result.bitDepthPlannedPoints.events[index].duration * 1000);
					// 	return data;
					// });

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
