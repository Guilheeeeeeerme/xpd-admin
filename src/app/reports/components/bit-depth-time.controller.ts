import { ReportsSetupAPIService } from '../../shared/xpd.setupapi/reports-setupapi.service';

export class BitDepthTimeController {
	// 'use strict';

	// angular.module('xpd.reports').controller('BitDepthTimeController', BitDepthTimeController);

	public static $inject = ['$scope', '$routeParams', 'reportsSetupAPIService'];

	constructor(
		private $scope,
		private $routeParams,
		private reportsSetupAPIService: ReportsSetupAPIService) {

		const vm = this;

		$scope.dados = {
			data: [],
			title: 'Bit Depth x Time',
			dateTimeEvent: {},
		};

		$scope.wellId = $routeParams.wellId;

		if ($scope.wellId !== undefined) {
			this.getOperationQueue();
		}

	}

	private getOperationQueue() {
		this.reportsSetupAPIService.getOperationQueue(
			this.$scope.wellId,
			(results) => { this.getOperationQueueCallback(results); },
			(error) => { this.error(error); });
	}

	private getOperationQueueCallback(operations) {

		this.getOperationPlanned(operations).then(() => {
			this.getOperationExecuted(operations);
		});
	}

	private getOperationPlanned(operations) {

		this.$scope.planned = [];

		return new Promise((resolve, reject) => {

			const promises = operations.map((operation) => {
				return new Promise((resolve1, reject1) => {
					this.reportsSetupAPIService.getBitDepthChartForOperation(
						this.$scope.wellId, operation.id, resolve1, reject1);
				});
			});

			Promise.all(promises).then((plannedOperations) => {
				this.$scope.planned = plannedOperations;
				this.drawPlanned();
				resolve();
			});

		});
	}

	private getOperationExecuted(operations) {

		this.$scope.executed = [];

		return new Promise((resolve, reject) => {

			const promises = operations.map((operation) => {
				return new Promise((resolve1, reject1) => {
					this.reportsSetupAPIService.getOperationExecuted(operation.id, resolve1, reject1);
				});
			});

			Promise.all(promises).then((executedOperation) => {
				this.$scope.executed = executedOperation;
				this.drawExecuted();
				resolve();
			});

		});

	}

	private drawPlanned() {

		const mergedData = {
			bitDepthPlannedPoints: null,
			sectionsBands: null,
			startChartAt: new Date().getTime(),
		};

		let startPointAt;

		this.$scope.planned.map((chartData) => {
			mergedData.startChartAt = Math.min(mergedData.startChartAt, chartData.startChartAt);
		});

		startPointAt = mergedData.startChartAt;

		this.$scope.planned.map((chartData) => {

			chartData.bitDepthPlannedPoints.data = chartData.bitDepthPlannedPoints.events.map((event) => {
				const point = [
					startPointAt,
					event.startBitDepth,
				];

				startPointAt += (event.duration * 1000);

				return point;
			});
		});

		this.$scope.planned.map((chartData) => {

			if (!mergedData.sectionsBands) {
				mergedData.sectionsBands = chartData.sectionsBands;
			}
		});

		this.$scope.planned.map((result) => {

			if (!mergedData.bitDepthPlannedPoints) {
				mergedData.bitDepthPlannedPoints = result.bitDepthPlannedPoints;
			} else if (result.bitDepthPlannedPoints.data.length && result.bitDepthPlannedPoints.events.length) {
				mergedData.bitDepthPlannedPoints.data = [...mergedData.bitDepthPlannedPoints.data, ...result.bitDepthPlannedPoints.data];
				mergedData.bitDepthPlannedPoints.events = [...mergedData.bitDepthPlannedPoints.events, ...result.bitDepthPlannedPoints.events];
			}

		});

		this.$scope.dados.data = mergedData;

	}

	private drawExecuted() {

		const mergedData = {
			bitDepthPlannedPoints: this.$scope.dados.data.bitDepthPlannedPoints,
			sectionsBands: this.$scope.dados.data.sectionsBands,
			startChartAt: this.$scope.dados.data.startChartAt,
			bitDepthExecutedPoints: null,
			holeDepthPoints: null,
		};

		this.$scope.executed.map((incomingChartData) => {

			if (!mergedData.bitDepthExecutedPoints) {

				mergedData.bitDepthExecutedPoints = incomingChartData.bitDepthExecutedPoints;

			} else if (incomingChartData.bitDepthExecutedPoints.data.length &&
				incomingChartData.bitDepthExecutedPoints.events.length) {

				mergedData.bitDepthExecutedPoints.data = [
					...mergedData.bitDepthExecutedPoints.data,
					...incomingChartData.bitDepthExecutedPoints.data];

				mergedData.bitDepthExecutedPoints.events = [
					...mergedData.bitDepthExecutedPoints.events,
					...incomingChartData.bitDepthExecutedPoints.events];
			}

			if (!mergedData.holeDepthPoints && incomingChartData.holeDepthPoints) {
				mergedData.holeDepthPoints = incomingChartData.holeDepthPoints;
			} else if (
				mergedData.holeDepthPoints &&
				incomingChartData.holeDepthPoints &&
				mergedData.holeDepthPoints.data &&
				incomingChartData.holeDepthPoints.data) {
				mergedData.holeDepthPoints.data = [
					...mergedData.holeDepthPoints.data,
					...incomingChartData.holeDepthPoints.data];
			}

			// if (!mergedData.holeDepthPoints) {
			// 	mergedData.holeDepthPoints = chartData.holeDepthPoints;
			// } else if (chartData.holeDepthPoints.data.length) {

			// 	if (!holeDepth) {
			// 		holeDepth = mergedData.holeDepthPoints.data[mergedData.holeDepthPoints.data.length - 1][1];
			// 	}

			// 	chartData.holeDepthPoints.data = chartData.holeDepthPoints.data.map((data) => {
			// 		holeDepth = Math.max(holeDepth, data[1]);
			// 		data[1] = holeDepth;

			// 		return data;
			// 	});

			// 	mergedData.holeDepthPoints.data = [...mergedData.holeDepthPoints.data, ...chartData.holeDepthPoints.data];
			// }

			// if (!mergedData.sectionsBands) {
			// 	mergedData.sectionsBands = chartData.sectionsBands;
			// }

		});

		/**
		 * Garantindo que as coisas estão em ordem
		 */

		try {
			mergedData.bitDepthExecutedPoints.data = mergedData.bitDepthExecutedPoints.data.sort((a, b) => a.x - b.x);
		} catch (error) {
			console.error(error);
		}

		try {
			const holeDepthPoints = [];

			mergedData.holeDepthPoints.data = mergedData.holeDepthPoints.data.sort((a, b) => a[0] - b[0]);

			mergedData.holeDepthPoints.data.filter((d) => {

				if (d[1]) {

					if (holeDepthPoints.length === 0 || holeDepthPoints[holeDepthPoints.length - 1][1] < d[1]) {
						holeDepthPoints.push(d);
						holeDepthPoints.push(d);
					}

					holeDepthPoints[holeDepthPoints.length - 1][0] = d[0];

				}

			});

			mergedData.holeDepthPoints.data = holeDepthPoints;

		} catch (error) {
			console.error(error);
		}

		this.$scope.dados.data = mergedData;

	}

	/**
	 *
	 * @param event
	 */
	public setCurrentPlannedEvent(event) {
		this.$scope.dados.plannedEvent = event;
		this.$scope.$apply();
	}

	public setHoleDepth(event) {
		this.$scope.dados.holeDepth = event;
		this.$scope.$apply();
	}

	public setCurrentExecutedEvent(event) {
		this.$scope.dados.executedEvent = event;
		this.$scope.$apply();
	}

	public setCurrentPoint(event) {
		this.$scope.dados.currentPoint = event;
		this.$scope.$apply();
	}

	public getAlarmsFromEvent(event) {
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

	private error(error) {
		console.log('error', error);
	}
}

// })();
