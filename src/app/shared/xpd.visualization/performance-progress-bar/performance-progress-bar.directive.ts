import './performance-progress-bar.style.scss';
import template from './performance-progress-bar.template.html';

export class PerformanceProgressBarDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new PerformanceProgressBarDirective();
	}

	public template = template;
	public restrict = 'AE';
	public scope = {
		title: '@',
		expectedValue: '=?',
		currentValue: '@',
		lowValue: '@',
		mediumValue: '@',
		highValue: '@',
		isRealTime: '=?',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		scope.isRealTime = (scope.isRealTime) ? scope.isRealTime : false;
		scope.afterHighValue = null;
		scope.legendBar = [];

		scope.$watch('currentValue', (newValue) => {
			if (newValue && scope.afterHighValue) {
				prepareCurrentPerformance();
			}
		});

		scope.$watchGroup(['lowValue', 'mediumValue', 'highValue'], (newValues) => {
			if (newValues) {
				scope.lowValue = +newValues[0] || 0;
				scope.mediumValue = +newValues[1] || 0;
				scope.highValue = +newValues[2] || 0;

				prepareLegendBar();
				prepareCurrentPerformance();
			}

		});

		const prepareLegendBar = () => {

			scope.afterHighValue = +scope.highValue + (+scope.highValue / 10);

			const lowPercentage = calcPercentage(+scope.lowValue, scope.afterHighValue);
			const mediumPercentage = calcPercentage(+scope.mediumValue, scope.afterHighValue) - lowPercentage;
			const highPercentage = calcPercentage(+scope.highValue, scope.afterHighValue) - (lowPercentage + mediumPercentage);
			const afterHighPercentage = 100 - (lowPercentage + mediumPercentage + highPercentage);

			scope.legendBar = [
				{
					color: '',
					percentage: lowPercentage,
				},
				{
					color: 'progress-bar-success',
					percentage: mediumPercentage,
				},
				{
					color: 'progress-bar-warning',
					percentage: highPercentage,
				},
				{
					color: 'progress-bar-danger',
					percentage: afterHighPercentage,
				},
			];
		};

		const prepareCurrentPerformance = () => {
			const percentage = calcPercentage(+scope.currentValue, scope.afterHighValue);
			scope.currentPercentage = (percentage > 100) ? 100 : percentage;
			scope.currentColor = getColorPerformance(+scope.currentValue, +scope.lowValue, +scope.mediumValue, +scope.highValue);
		};

		const calcPercentage = (partTime, totalTime) => {
			return (partTime * 100) / totalTime;
		};

		const getColorPerformance = (duration, voptimumTime, vstandardTime, vpoorTime) => {

			if (duration < voptimumTime) {
				return '';
			} else if (duration <= vstandardTime) {
				return 'progress-bar-success';
			} else if (duration <= vpoorTime) {
				return 'progress-bar-warning';
			} else {
				return 'progress-bar-danger';
			}
		};
	}
}
