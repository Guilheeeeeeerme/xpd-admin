import * as angular from 'angular';
import { IQService, route } from 'angular';
import { ReportsSetupAPIService } from '../../shared/xpd.setupapi/reports-setupapi.service';

export class BitDepthTimeController {
	// 'use strict';

	public static $inject = [
		'$scope',
		'$q',
		'$routeParams',
		'reportsSetupAPIService'];
	private bitDepthReportData: any;

	constructor(
		private $scope: any,
		private $q: IQService,
		private $routeParams: route.IRouteService,
		private reportsSetupAPIService: ReportsSetupAPIService) {

		$scope.dados = {
			data: [],
			title: 'Bit Depth x Time',
			dateTimeEvent: {},
		};

		$scope.wellId = ($routeParams as any).wellId;

		if ($scope.wellId !== undefined) {
			this.reportsSetupAPIService.getOperationQueue(this.$scope.wellId).then(
				(operationQueue) => { this.setOperationQueue(operationQueue); },
				(arg) => { this.error(arg); },
			);
		}
	}

	private setOperationQueue(operationQueue) {

		const bitDepthReportData: any = {};
		const plannedPromise = this.getPlannedPoints(operationQueue);
		const executedPromise = this.getExecutedPoints(operationQueue);
		const bitDepthReportDataReady = this.$q.defer();

		this.$q.all([plannedPromise, executedPromise]).then((results) => {

			const plannedPoints = results[0];
			const executedPoints = results[1];
			const holeDepthPoints = [];
			let startTime = new Date().getTime();

			for (let executedPoint of executedPoints) {
				executedPoint = executedPoint.map((point) => {
					startTime = Math.min(startTime, point.x);

					if (point.x) {
						if (holeDepthPoints.length === 0 ||
							holeDepthPoints.length > 0 && holeDepthPoints[holeDepthPoints.length - 1][1] < point.holeDepth) {
							holeDepthPoints.push([point.x, point.holeDepth]);
							holeDepthPoints.push([point.x, point.holeDepth]);
						} else {
							holeDepthPoints[holeDepthPoints.length - 1][0] = point.x;
						}
					}

					delete point.holeDepth;
					return point;
				});
			}

			bitDepthReportData.startChartAt = angular.copy(startTime);

			for (let plannedPoint of plannedPoints) {
				let endTime = 0;

				plannedPoint = plannedPoint.map((point) => {
					point.x += startTime;
					endTime = Math.max(endTime, point.x);
					return point;
				});

				startTime = Math.max(endTime, startTime);
			}

			bitDepthReportData.plannedPoints = plannedPoints;
			bitDepthReportData.holeDepthPoints = holeDepthPoints;
			bitDepthReportData.executedPoints = executedPoints;

			this.bitDepthReportData = bitDepthReportData;

			this.$scope.bitDepthReportDataReady = bitDepthReportDataReady.promise;

			bitDepthReportDataReady.resolve(bitDepthReportData);

		});

	}

	private getExecutedPoints(operationQueue) {

		const executedPromises = [];

		for (const operation of operationQueue) {
			executedPromises.push(this.reportsSetupAPIService.getOperationExecuted(operation.id));
		}

		return this.$q.all(executedPromises);
	}

	private getPlannedPoints(operationQueue) {

		const planningPromises = [];

		for (const operation of operationQueue) {
			planningPromises.push(this.reportsSetupAPIService.getBitDepthChartForOperation(this.$scope.wellId, operation.id));
		}

		return this.$q.all(planningPromises);
	}

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
		console.log(event);
		// this.$scope.dados.currentPoint = event;
		// this.$scope.$apply();
	}

	// public getAlarmsFromEvent(event) {
	// 	if (event.alarm) {
	// 		return [event.alarm];
	// 	}

	// 	if (event.durationAlarm) {
	// 		return [event.durationAlarm];
	// 	}

	// 	if (event.alarms) {
	// 		return event.alarms;
	// 	}

	// 	return [];
	// }

	// private runPlanned(results, resolve) {
	// 	try {
	// 		results.shift()().then((result) => {
	// 			this.$scope.planned.push(result);
	// 			this.runPlanned(results, resolve);
	// 		});
	// 	} catch (e) {

	// 		const mergedData = {
	// 			bitDepthPlannedPoints: null,
	// 			sectionsBands: null,
	// 			startChartAt: new Date().getTime(),
	// 		};

	// 		let startPointAt;

	// 		this.$scope.planned.map((chartData) => {
	// 			mergedData.startChartAt = Math.min(mergedData.startChartAt, chartData.startChartAt);
	// 		});

	// 		startPointAt = mergedData.startChartAt;

	// 		this.$scope.planned.map((chartData) => {

	// 			chartData.bitDepthPlannedPoints.data = chartData.bitDepthPlannedPoints.events.map((event) => {
	// 				const point = [
	// 					startPointAt,
	// 					event.startBitDepth,
	// 				];

	// 				startPointAt += (event.duration * 1000);

	// 				return point;
	// 			});
	// 		});

	// 		this.$scope.planned.map((chartData) => {

	// 			if (!mergedData.sectionsBands) {
	// 				mergedData.sectionsBands = chartData.sectionsBands;
	// 			}
	// 		});

	// 		this.$scope.planned.map((result) => {

	// 			if (!mergedData.bitDepthPlannedPoints) {
	// 				mergedData.bitDepthPlannedPoints = result.bitDepthPlannedPoints;
	// 			} else if (result.bitDepthPlannedPoints.data.length && result.bitDepthPlannedPoints.events.length) {
	// 				mergedData.bitDepthPlannedPoints.data = [...mergedData.bitDepthPlannedPoints.data, ...result.bitDepthPlannedPoints.data];
	// 				mergedData.bitDepthPlannedPoints.events = [...mergedData.bitDepthPlannedPoints.events, ...result.bitDepthPlannedPoints.events];
	// 			}

	// 		});

	// 		this.$scope.dados.data = mergedData;
	// 		resolve();
	// 	}
	// }

	// private runExecuted(results) {
	// 	try {
	// 		results.shift()().then((result) => {
	// 			this.$scope.executed.push(result);
	// 			this.runExecuted(results);
	// 		});
	// 	} catch (e) {

	// 		const mergedData = {
	// 			bitDepthPlannedPoints: this.$scope.dados.data.bitDepthPlannedPoints,
	// 			sectionsBands: this.$scope.dados.data.sectionsBands,
	// 			startChartAt: this.$scope.dados.data.startChartAt,
	// 			bitDepthExecutedPoints: null,
	// 			holeDepthPoints: null,
	// 		};

	// 		let holeDepth = null;

	// 		this.$scope.executed.map((chartData) => {
	// 			if (!mergedData.bitDepthExecutedPoints) {
	// 				mergedData.bitDepthExecutedPoints = chartData.bitDepthExecutedPoints;
	// 			} else if (chartData.bitDepthExecutedPoints.data.length && chartData.bitDepthExecutedPoints.events.length) {
	// 				mergedData.bitDepthExecutedPoints.data = [...mergedData.bitDepthExecutedPoints.data, ...chartData.bitDepthExecutedPoints.data];
	// 				mergedData.bitDepthExecutedPoints.events = [...mergedData.bitDepthExecutedPoints.events, ...chartData.bitDepthExecutedPoints.events];
	// 			}

	// 			if (!mergedData.holeDepthPoints) {
	// 				mergedData.holeDepthPoints = chartData.holeDepthPoints;
	// 			} else if (chartData.holeDepthPoints.data.length) {

	// 				if (!holeDepth) {
	// 					holeDepth = mergedData.holeDepthPoints.data[mergedData.holeDepthPoints.data.length - 1][1];
	// 				}

	// 				chartData.holeDepthPoints.data = chartData.holeDepthPoints.data.map((data) => {
	// 					holeDepth = Math.max(holeDepth, data[1]);
	// 					data[1] = holeDepth;

	// 					return data;
	// 				});

	// 				mergedData.holeDepthPoints.data = [...mergedData.holeDepthPoints.data, ...chartData.holeDepthPoints.data];
	// 			}

	// 			if (!mergedData.sectionsBands) {
	// 				mergedData.sectionsBands = chartData.sectionsBands;
	// 			}
	// 		});

	// 		mergedData.bitDepthExecutedPoints.data = this.fixXaxisOrder(
	// 			mergedData.bitDepthExecutedPoints.data, (data) => {
	// 				return data.x;
	// 			});

	// 		mergedData.holeDepthPoints.data = this.fixXaxisOrder(
	// 			mergedData.holeDepthPoints.data, (data) => {
	// 				return data[0];
	// 			});

	// 		this.$scope.dados.data = mergedData;
	// 	}
	// }

	// private fixXaxisOrder(list, attr) {
	// 	return list.reduce((acumulador, valorAtual, indice, array) => {

	// 		if (acumulador.length === 0) {
	// 			return [valorAtual];
	// 		}

	// 		if (attr(acumulador[acumulador.length - 1]) < attr(valorAtual)) {
	// 			acumulador.push(valorAtual);
	// 		}

	// 		return acumulador;

	// 	}, []);
	// }

	// private getOperationPlanned(operations) {
	// 	this.$scope.planned = [];

	// 	return new Promise((resolve, reject) => {

	// 		operations = operations.map((operation) => {
	// 			return () => {
	// 				return this.reportsSetupAPIService.getBitDepthChartForOperation(this.$scope.wellId, operation.id);
	// 			};
	// 		});

	// 		this.runPlanned(operations, resolve);
	// 	});
	// }

	// private getOperationExecuted(operations) {
	// 	this.$scope.executed = [];
	// 	operations = operations.map((operation) => {
	// 		return () => {
	// 			return this.reportsSetupAPIService.getOperationExecuted(operation.id);
	// 		};
	// 	});

	// 	this.runExecuted(operations);
	// }

	private error(error) {
		console.log('error', error);
	}

}

// })();
