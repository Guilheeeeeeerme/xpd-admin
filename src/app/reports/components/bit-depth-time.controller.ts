import * as angular from 'angular';
import { IQService, route } from 'angular';
import { EventLogSetupAPIService } from '../../shared/xpd.setupapi/eventlog-setupapi.service';
import { ReportsSetupAPIService } from '../../shared/xpd.setupapi/reports-setupapi.service';

export class BitDepthTimeController {
	// 'use strict';

	public static $inject = [
		'$scope',
		'$q',
		'$routeParams',
		'eventlogSetupAPIService',
		'reportsSetupAPIService'];
	private bitDepthReportData: any;

	constructor(
		private $scope: any,
		private $q: IQService,
		private $routeParams: route.IRouteService,
		private eventLogSetupAPIService: EventLogSetupAPIService,
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

	public toDate(arg) {
		return new Date(arg).getTime();
	}

	public setCurrentPoint(event) {

		// XPDSearchMapSingleton.getInstance().flush(injectName);

		// console.log(this.bitDepthReportData.plannedPoints);
		// console.log(this.bitDepthReportData.holeDepthPoints);
		// console.log(this.bitDepthReportData.executedPoints);

		this.$scope.dados.selectedLineType = event.selectedLineType;

		const plannedLocked = event.plannedLocked;
		const executedLocked = event.executedLocked;

		if (this.$scope.dados.selectedLineType === 'executedEvent') {
			if (!executedLocked) {
				this.eventLogSetupAPIService.getWithDetails(event.id).then((eventDetails: any) => {
					this.setCurrentExecutedEvent(eventDetails);
				});
			}
			this.setHoleDepth({ depth: event.holeDepth });
		} else if (this.$scope.dados.selectedLineType === 'plannedEvent') {
			if (!executedLocked) {
				this.findExecutedEvent(event.x);
			}
			this.findHoleDepth(event.x);
		} else {
			if (!executedLocked) {
				this.findExecutedEvent(event.x);
			}
			this.setHoleDepth({ depth: event.y });
		}

		if (!plannedLocked) {
			this.findPlannedEvent(event.x);
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

					point.selectedLineType = 'executedEvent';

					if (point.performance === 0) {
						point.segmentColor = point.color = '#1565C0';
					} else if (point.performance === 1) {
						point.segmentColor = point.color = '#0FA419';
					} else if (point.performance === 2) {
						point.segmentColor = point.color = '#FFDD68';
					} else {
						point.segmentColor = point.color = '#EA3F3B';
					}

					startTime = Math.min(startTime, point.x);

					if (point.x && point.holeDepth) {
						if (holeDepthPoints.length === 0 ||
							holeDepthPoints.length > 0 && holeDepthPoints[holeDepthPoints.length - 1].y < point.holeDepth) {
							holeDepthPoints.push({ x: point.x, y: point.holeDepth, selectedLineType: 'holeDepth' });
							holeDepthPoints.push({ x: point.x, y: point.holeDepth, selectedLineType: 'holeDepth' });
						} else {
							holeDepthPoints[holeDepthPoints.length - 1].x = point.x;
						}

					}

					return point;
				});
			}

			bitDepthReportData.startChartAt = angular.copy(startTime);

			for (let plannedPoint of plannedPoints) {
				let endTime = 0;

				plannedPoint = plannedPoint.map((point) => {
					point.x *= 1000;
					point.x += startTime;
					point.selectedLineType = 'plannedEvent';
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
			planningPromises.push(this.reportsSetupAPIService.getOperationPlanning(this.$scope.wellId, operation.id));
		}

		return this.$q.all(planningPromises);
	}

	private setCurrentPlannedEvent(event) {
		if (event) {
			event.alarms = this.getAlarmsFromEvent(event);
		}
		this.$scope.dados.plannedEvent = event;
	}

	private setCurrentExecutedEvent(event) {
		this.$scope.dados.executedEvent = event;
	}

	private setHoleDepth(event) {
		this.$scope.dados.holeDepth = event;
	}

	private findExecutedEvent(timestamp) {
		for (const executedPoint of this.bitDepthReportData.executedPoints) {
			let lastEvent = null;

			for (const event of executedPoint) {

				if (lastEvent && lastEvent.id && timestamp >= lastEvent.x && event.x >= timestamp) {

					this.eventLogSetupAPIService.getWithDetails(event.id).then((eventDetails: any) => {
						this.setCurrentExecutedEvent(eventDetails);
					});

					return;
				}

				lastEvent = event;
			}
		}

		this.setCurrentExecutedEvent(null);
	}

	private findPlannedEvent(timestamp) {
		for (const plannedPointsData of this.bitDepthReportData.plannedPoints) {
			let lastEvent = null;

			for (const event of plannedPointsData) {

				if (lastEvent && timestamp >= lastEvent.x && event.x >= timestamp) {
					lastEvent.duration = (event.x - lastEvent.x);

					lastEvent.startBitDepth = lastEvent.y;
					lastEvent.endBitDepth = event.y;

					lastEvent.startTime = lastEvent.x;
					lastEvent.endTime = event.x;

					this.setCurrentPlannedEvent(lastEvent);
					return;
				}

				lastEvent = event;
			}
		}

		this.setCurrentPlannedEvent(null);

	}

	private findHoleDepth(timestamp) {
		for (const holeDepthPointsData of this.bitDepthReportData.holeDepthPoints) {
			let lastEvent = null;

			for (const event of holeDepthPointsData) {

				if (lastEvent && lastEvent.id && timestamp >= lastEvent.x && event.x >= timestamp) {
					this.setHoleDepth({ depth: event.y });
					return;
				}

				lastEvent = event;
			}
		}
		this.setHoleDepth(null);
	}

	private getAlarmsFromEvent(event) {
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
