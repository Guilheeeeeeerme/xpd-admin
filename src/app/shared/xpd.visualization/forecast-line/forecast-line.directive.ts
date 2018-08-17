import * as angular from 'angular';
import { HighchartsService } from '../../highcharts/highcharts.service';
import { OperationDataService } from '../../xpd.operation-data/operation-data.service';
import { ReportsSetupAPIService } from '../../xpd.setupapi/reports-setupapi.service';

export class ForecastLineDirective implements ng.IDirective {

	public static $inject = ['$q', 'highchartsService', 'reportsSetupAPIService', 'operationDataService'];

	public static Factory(): ng.IDirectiveFactory {
		return (
			$q: ng.IQService,
			reportsSetupAPIService: ReportsSetupAPIService,
			operationDataService: OperationDataService,
			highchartsService: HighchartsService) => new ForecastLineDirective(
				$q,
				reportsSetupAPIService,
				operationDataService,
				highchartsService);
	}
	public restrict = 'E';
	public scope = {
		tripin: '=',
		settings: '=',
		state: '@',
		zoomAtState: '@',
	};

	constructor(
		private $q: ng.IQService,
		private reportsSetupAPIService: ReportsSetupAPIService,
		private operationDataService: OperationDataService,
		private highchartsService: HighchartsService) {
	}

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		this.highchartsService.highcharts().then((Highcharts) => {

			let actualLineDefer = this.$q.defer();
			const forecastLineChart = this.createChart(element[0], Highcharts);
			let buildEstimativeLineWatcher;

			const buildOptimumLine = () => {
				this.buildOptimumLine(
					forecastLineChart,
					actualLineDefer,
					angular.copy(scope.operationData.forecastContext.vOptimumEstimative),
					angular.copy(scope.tripin),
					scope.zoomAtState,
				);
			};

			const buildEstimativeLine = () => {
				this.buildEstimativeLine(
					forecastLineChart,
					actualLineDefer,
					angular.copy(scope.operationData.forecastContext.estimatives.vOptimumEstimative),
					angular.copy(scope.settings),
					angular.copy(scope.tripin),
					scope.zoomAtState,
				);
			};

			const loadEvents = () => {
				actualLineDefer = this.loadEvents(
					forecastLineChart,
					angular.copy(scope.operationData.suboperationContext.currentSuboperation.id),
					scope.zoomAtState,
				);
			};

			scope.$watchGroup([
				'operationData.forecastContext.vOptimumEstimative',
				'tripin',
				'zoomAtState',
			], (data) => {
				if (data[0] != null && data[1] != null) {
					buildOptimumLine();
				}
			}, true);

			scope.$watch('state', (state) => {

				if (buildEstimativeLineWatcher) {
					buildEstimativeLineWatcher();
				}

				if (state) {

					buildEstimativeLineWatcher = scope.$watchGroup([
						'operationData.forecastContext.estimatives.vOptimumEstimative',
						'settings.' + scope.state + '.TRIP.targetSpeed',
						'settings.' + scope.state + '.CONN.targetSpeed',
						'settings.' + scope.state + '.TRIP.optimumSpeed',
						'settings.' + scope.state + '.CONN.optimumSpeed',
						'tripin',
						'zoomAtState',
					], (data) => {
						if (
							data[0] != null &&
							data[1] != null &&
							data[2] != null &&
							data[3] != null &&
							data[4] != null &&
							data[5] != null
						) {
							buildEstimativeLine();
						}
					}, true);

				}

			}, true);

			scope.$watchGroup([
				'operationData.forecastContext.estimatives.vOptimumEstimative',
				'operationData.suboperationContext.currentSuboperation.id',
				'zoomAtState',
			], (data) => {
				if (data[0] != null && data[1] != null) {
					loadEvents();
					buildEstimativeLine();
				}
			}, true);

		});

		this.operationDataService.openConnection(['forecast', 'subOperation']).then(() => {
			scope.operationData = this.operationDataService.operationDataFactory.operationData;
		});

	}

	private buildEstimativeLine(
		forecastLineChart,
		actualLineDefer,
		vOptimumEstimative: any[],
		settings: any,
		tripin: boolean,
		zoomAtState: string) {

		let estimatedPoints = [];

		actualLineDefer.promise.then((data: any) => {

			let lastExecutedEventEndTime = data.lastExecutedEventEndTime;

			vOptimumEstimative = vOptimumEstimative.filter((estimative) => {
				const state = Object.keys(estimative)[0];
				estimative = estimative[state];

				if (zoomAtState != null && state !== zoomAtState) {
					return false;
				}

				return estimative.isTripin === tripin;
			});

			/**
			 * Montando a linha a partir do ultimo evento seguindo o vtarget
			 */
			for (let estimative of vOptimumEstimative) {
				let endTime = 0;

				const state = Object.keys(estimative)[0];
				estimative = estimative[state];
				estimative.state = state;

				let lastEventEndTime = null;

				estimatedPoints = [...estimatedPoints, ...estimative.BOTH.points.map((point) => {

					let coef = 1;

					try {
						const targetSpeed = settings[estimative.state][point.eventType].targetSpeed;
						const optimumSpeed = settings[estimative.state][point.eventType].optimumSpeed;
						coef = targetSpeed / optimumSpeed;
					} catch (error) {
						coef = 1;
					}

					let currentEventEndTime = point.accumulated * 1000;

					if (lastEventEndTime &&
						(point.eventType === 'TRIP' && (!point.alarm || point.alarm && point.minDuration != null)) ||
						(point.eventType === 'CONN')
					) {

						const regularDuration = (currentEventEndTime - lastEventEndTime);
						let targetDuration = regularDuration / coef;

						if (point.minDuration != null) {
							targetDuration = Math.max(targetDuration, (point.minDuration * 1000));
						}

						const diff = targetDuration - regularDuration;
						currentEventEndTime += diff;
					}

					lastEventEndTime = angular.copy(currentEventEndTime);
					currentEventEndTime += lastExecutedEventEndTime;

					point.x = angular.copy(currentEventEndTime);
					endTime = Math.max(endTime, currentEventEndTime);

					point.accumulated += currentEventEndTime;

					return [point.x, point.y];

				})];

				lastExecutedEventEndTime = Math.max(endTime, lastExecutedEventEndTime);
			}

			forecastLineChart.series[1].update({
				data: estimatedPoints,
			}, true); // true / false to redraw

		});

	}

	private buildOptimumLine(
		forecastLineChart,
		actualLineDefer,
		vOptimumEstimative: any[],
		tripin: boolean,
		zoomAtState: string) {

		let optimumPoints = [];

		actualLineDefer.promise.then((data: any) => {

			let eventStartTime = data.firstExecutedEventStartTime;

			vOptimumEstimative = vOptimumEstimative.filter((estimative) => {
				const state = Object.keys(estimative)[0];
				estimative = estimative[state];

				if (zoomAtState != null && state !== zoomAtState) {
					return false;
				}

				return estimative.isTripin === tripin;
			});

			/**
			 * Montando a linha do parametro optimum
			 */
			for (let estimative of vOptimumEstimative) {
				let endTime = 0;

				const state = Object.keys(estimative)[0];
				estimative = estimative[state];
				estimative.state = state;

				optimumPoints = [...optimumPoints, ...estimative.BOTH.points.map((point) => {

					point.accumulated *= 1000;

					point.accumulated += eventStartTime;
					point.x = point.accumulated;

					endTime = Math.max(endTime, point.accumulated);
					return [point.x, point.y];

				})];

				eventStartTime = Math.max(endTime, eventStartTime);
			}

			forecastLineChart.series[0].update({
				data: optimumPoints,
			}, true); // true / false to redraw

		});

	}

	private loadEvents(
		forecastLineChart,
		suboperationId: number,
		zoomAtState: string) {

		const actualLineDefer = this.$q.defer();

		const executedPoints = [];

		let firstExecutedEventStartTime;
		let lastExecutedEventEndTime;

		this.reportsSetupAPIService.getSuboperationExecuted(suboperationId).then((events: any[]) => {

			/**
			 * Montando a linha de executados
			 */
			if (events) {

				if (zoomAtState != null) {
					events = events.filter((event) => {

						if ( event.state != null && event.state !== zoomAtState) {
							return false;
						}

						return true;
					});
				}

				for (const event of events) {
					firstExecutedEventStartTime = Math.min((firstExecutedEventStartTime != null) ? firstExecutedEventStartTime : event.x, event.x);
					lastExecutedEventEndTime = Math.max((lastExecutedEventEndTime != null) ? lastExecutedEventEndTime : event.x, event.x);
					event.y = event.joint;
					executedPoints.push([event.x, event.y]);
				}

			}

			forecastLineChart.series[2].update({
				data: executedPoints,
			}, true); // true / false to redraw

			actualLineDefer.resolve({
				firstExecutedEventStartTime: firstExecutedEventStartTime,
				lastExecutedEventEndTime: lastExecutedEventEndTime,
			});

		});

		return actualLineDefer;

	}

	private createChart(target, Highcharts) {

		return Highcharts.chart(target, {

			chart: {
				marginTop: 0,
				marginBottom: 0,
				spacingTop: 0,
				spacingBottom: 0,
				zoomType: 'x',
			},

			title: {
				text: null,
			},

			xAxis: {
				visible: false,
			},

			yAxis: {
				reversed: true,
				visible: false,
			},

			tooltip: {
				enabled: false,
			},

			plotOptions: {
				series: {
					animation: false,
					turboThreshold: 0,
					pointStart: 2010,
					connectNulls: true,
				},
				line: {
					animation: false,
					dataLabels: {
						enabled: true,
					},
					enableMouseTracking: false,
				},
			},

			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle',
			},

			series: [{
				name: 'Optimum',
				data: [],
			}, {
				name: 'Estimative',
				data: [],
			}, {
				name: 'Actual',
				data: [],
			}],

		});
	}
}
