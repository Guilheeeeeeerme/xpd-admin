import * as angular from 'angular';
import { HighchartsService } from '../../highcharts/highcharts.service';
import { OperationDataService } from '../../xpd.operation-data/operation-data.service';
import { ReportsSetupAPIService } from '../../xpd.setupapi/reports-setupapi.service';

export class ForecastLineDirective implements ng.IDirective {
	private forecastLineChart: any;
	private drawChartTimeout: any;
	private loadEventTimeout: any;

	constructor(
		private reportsSetupAPIService: ReportsSetupAPIService,
		private operationDataService: OperationDataService,
		private highchartsService: HighchartsService) { }

	public static $inject = ['highchartsService', 'reportsSetupAPIService', 'operationDataService'];
	public restrict = 'E';
	public scope = {
		tripin: '=',
		settings: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		const drawChart = (events, plannedPoints, estimativePoints, settings, tripin) => {

			const scopeEvents = angular.copy(events);
			let scopeOptimumPoints = angular.copy(plannedPoints);
			let scopeEstimativePoints = angular.copy(estimativePoints);
			const scopeSettings = angular.copy(settings);

			scopeOptimumPoints = scopeOptimumPoints.filter((estimative) => {
				const state = Object.keys(estimative)[0];
				estimative = estimative[state];
				estimative.state = state;
				return estimative.isTripin === tripin;
			});

			scopeEstimativePoints = scopeEstimativePoints.filter((estimative) => {
				const state = Object.keys(estimative)[0];
				estimative = estimative[state];
				estimative.state = state;
				return estimative.isTripin === tripin;
			});

			const executedPoints = [];
			let optimumPoints = [];
			let estimatedPoints = [];

			let firstExecutedEventStartTime = new Date().getTime();
			let lastExecutedEventStartTime = new Date().getTime();

			/**
			 * Montando a linha de executados
			 */
			if (scopeEvents) {

				for (const event of scopeEvents) {
					firstExecutedEventStartTime = Math.min(firstExecutedEventStartTime, event.x);
					lastExecutedEventStartTime = Math.max(lastExecutedEventStartTime, event.x);
					event.y = event.joint;
					executedPoints.push([event.x, event.y]);
				}

			}

			/**
			 * Montando a linha do parametro optimum
			 */
			if (scopeOptimumPoints) {

				for (let estimative of scopeOptimumPoints) {
					let endTime = 0;

					const state = Object.keys(estimative)[0];
					estimative = estimative[state];
					estimative.state = state;

					optimumPoints = [...optimumPoints, ...estimative.BOTH.points.map((point) => {

						point.accumulated *= 1000;

						point.accumulated += firstExecutedEventStartTime;
						point.x = point.accumulated;

						endTime = Math.max(endTime, point.accumulated);
						return [point.x, point.y];

					})];

					firstExecutedEventStartTime = Math.max(endTime, firstExecutedEventStartTime);
				}

			}

			/**
			 * Montando a linha a partir do ultimo evento seguindo o vtarget
			 */
			if (scopeEstimativePoints) {

				for (let estimative of scopeEstimativePoints) {
					let endTime = 0;

					const state = Object.keys(estimative)[0];
					estimative = estimative[state];
					estimative.state = state;

					let lastEventEndTime = null;

					estimatedPoints = [...estimatedPoints, ...estimative.BOTH.points.map((point) => {

						let percentage = 1;

						try {
							const targetSpeed = scopeSettings[estimative.state][point.eventType].targetSpeed;
							const optimumSpeed = scopeSettings[estimative.state][point.eventType].optimumSpeed;
							percentage = targetSpeed / optimumSpeed;
						} catch (error) {
							percentage = 1;
						}

						let currentEventEndTime = point.accumulated * 1000;

						if (lastEventEndTime &&
							(point.eventType === 'TRIP' && (!point.alarm || point.alarm && point.minDuration != null)) ||
							(point.eventType === 'CONN')
						) {

							const regularDuration = (currentEventEndTime - lastEventEndTime);
							let targetDuration = (currentEventEndTime - lastEventEndTime) / percentage;

							if (point.minDuration != null && targetDuration < (point.minDuration * 1000)) {
								targetDuration = (point.minDuration * 1000);
							}

							const diff = targetDuration - regularDuration;
							currentEventEndTime += diff;
						}

						lastEventEndTime = angular.copy(currentEventEndTime);
						currentEventEndTime += lastExecutedEventStartTime;

						point.x = angular.copy(currentEventEndTime);
						endTime = Math.max(endTime, currentEventEndTime);

						point.accumulated += currentEventEndTime;

						return [point.x, point.y];

					})];

					lastExecutedEventStartTime = Math.max(endTime, lastExecutedEventStartTime);
				}
			}

			this.forecastLineChart.series[0].update({
				data: optimumPoints,
			}, true); // true / false to redraw

			this.forecastLineChart.series[1].update({
				data: estimatedPoints,
			}, true); // true / false to redraw

			this.forecastLineChart.series[2].update({
				data: executedPoints,
			}, true); // true / false to redraw

		};

		const tryDrawChart = () => {

			if (this.drawChartTimeout) {
				clearTimeout(this.drawChartTimeout);
			}

			try {
				this.drawChartTimeout = setTimeout(() => {
					drawChart(scope.events, scope.optimumPoints, scope.estimativePoints, scope.settings, scope.tripin);
				}, 1000);
			} catch (error) {
				// console.log(error);
			}
		};

		const loadEstimatives = () => {

			try {
				scope.optimumPoints = scope.operationData.forecastContext.vOptimumEstimative;
				scope.estimativePoints = scope.operationData.forecastContext.estimatives.vOptimumEstimative;

				tryDrawChart();
			} catch (error) {
				// topper
			}
		};

		const loadEvents = () => {

			if (scope.operationData &&
				scope.operationData.suboperationContext &&
				scope.operationData.suboperationContext.currentSuboperation &&
				scope.operationData.suboperationContext.currentSuboperation.id) {

				if (this.loadEventTimeout) {
					clearTimeout(this.loadEventTimeout);
				}

				this.loadEventTimeout = setTimeout(() => {

					this.reportsSetupAPIService.getSuboperationExecuted(scope.operationData.suboperationContext.currentSuboperation.id).then((events) => {
						scope.events = events;
						tryDrawChart();
					});

				}, 1000);

			}

		};

		const createChart = (Highcharts) => {

			return Highcharts.chart(element[0], {

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
		};

		this.highchartsService.highcharts().then((Highcharts) => {

			this.forecastLineChart = createChart(Highcharts);

			this.operationDataService.openConnection([]).then(() => {

				scope.operationData = this.operationDataService.operationDataFactory.operationData;

				this.operationDataService.on('setOnEventChangeListener', () => { loadEvents(); });
				this.operationDataService.on('setOnParallelEventChangeListener', () => { loadEvents(); });
				this.operationDataService.on('setOnCurrentSuboperationListener', () => { loadEvents(); });
				this.operationDataService.on('setOnNoCurrentSuboperationListener', () => { loadEvents(); });
				this.operationDataService.on('setOnSuboperationDetectedListener', () => { loadEvents(); });
				this.operationDataService.on('setOnSuboperationSavedListener', () => { loadEvents(); });

				this.operationDataService.on('setOn OPTIMUM_LINE Listener', () => { loadEstimatives(); });
				this.operationDataService.on('setOn FORECAST_CHANGE Listener', () => { loadEstimatives(); });
				this.operationDataService.on('setOn ESTIMATIVES_CHANGE Listener', () => { loadEstimatives(); });

				scope.$watch('settings', (settings) => { if (settings) { tryDrawChart(); } }, true);
				scope.$watch('tripin', (tripin) => { if (tripin) { tryDrawChart(); } });

				scope.$watch('operationData.forecastContext.vOptimumEstimative', () => { loadEstimatives(); });
				scope.$watch('operationData.forecastContext.estimatives.vOptimumEstimative', () => { loadEstimatives(); });
				scope.$watch('operationData.suboperationContext.currentSuboperation.id', () => { loadEvents(); });

				loadEvents();
				loadEstimatives();

			});

		});

	}

	public static Factory(): ng.IDirectiveFactory {
		return (
			reportsSetupAPIService: ReportsSetupAPIService,
			operationDataService: OperationDataService,
			highchartsService: HighchartsService) => new ForecastLineDirective(
				reportsSetupAPIService,
				operationDataService,
				highchartsService);
	}
}
