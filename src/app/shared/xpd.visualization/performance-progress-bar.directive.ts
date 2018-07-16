
// angular.module('xpd.visualization')
// 	.directive('performanceProgressBar', performanceProgressBar);

// performanceProgressBar.$inject = [];
import template from './performance-progress-bar.template.html';

export class PerformanceProgressBarDirective implements ng.IDirective {
	public template = template;
	public restrict = 'AE';
	public scope = {
		title: '@',
		expectedValue: '=?',
		currentValue: '=',
		highValue: '=',
		mediumValue: '=',
		lowValue: '=',
		isRealTime: '=?',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		scope.isRealTime = (scope.isRealTime) ? scope.isRealTime : false;
		scope.afterLowValue = null;
		scope.legendBar = [];

		scope.$watch('currentValue', function(newValue) {
			if (newValue && scope.afterLowValue) {
				prepareCurrentPerformance();
			}
		});

		scope.$watchGroup(['highValue', 'mediumValue', 'lowValue'], function(newValues) {
			if (newValues) {
				scope.highValue = newValues[0];
				scope.mediumValue = newValues[1];
				scope.lowValue = newValues[2];

				prepareLegendBar();
				prepareCurrentPerformance();
			}

		});

		function prepareLegendBar() {

			scope.afterLowValue = scope.lowValue + (scope.lowValue / 10);

			const highPercentage = calcPercentage(scope.highValue, scope.afterLowValue);
			const mediumPercentage = calcPercentage(scope.mediumValue, scope.afterLowValue) - highPercentage;
			const lowPercentage = calcPercentage(scope.lowValue, scope.afterLowValue) - (highPercentage + mediumPercentage);
			const afterLowPercentage = 100 - (highPercentage + mediumPercentage + lowPercentage);

			scope.legendBar = [
				{
					color: '',
					percentage: highPercentage,
				},
				{
					color: 'progress-bar-success',
					percentage: mediumPercentage,
				},
				{
					color: 'progress-bar-warning',
					percentage: lowPercentage,
				},
				{
					color: 'progress-bar-danger',
					percentage: afterLowPercentage,
				},
			];
		}

		function prepareCurrentPerformance() {
			const percentage = calcPercentage(scope.currentValue, scope.afterLowValue);
			scope.currentPercentage = (percentage > 100) ? 100 : percentage;
			scope.currentColor = getColorPerformance(scope.currentValue, scope.highValue, scope.mediumValue, scope.lowValue);
		}

		function calcPercentage(partTime, totalTime) {
			return (partTime * 100) / totalTime;
		}

		function getColorPerformance(duration, voptimumTime, vstandardTime, vpoorTime) {

			if (duration < voptimumTime) {
				return '';
			} else if (duration <= vstandardTime) {
				return 'progress-bar-success';
			} else if (duration <= vpoorTime) {
				return 'progress-bar-warning';
			} else {
				return 'progress-bar-danger';
			}
		}
	}

	public static Factory(): ng.IDirectiveFactory {
		return () => new PerformanceProgressBarDirective();
	}
}
