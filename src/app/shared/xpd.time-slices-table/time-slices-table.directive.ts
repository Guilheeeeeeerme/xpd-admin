
import * as angular from 'angular';
import './time-slices-table.style.scss';
import template from './time-slices-table.template.html';

export class TimeSlicesTableDirective implements ng.IDirective {
	public static $inject = [];

	public static Factory(): ng.IDirectiveFactory {
		return () => new TimeSlicesTableDirective();
	}
	public restrict = 'E';
	public template = template;
	public scope = {
		name: '@',
		timeSliceForm: '=',
		disabled: '=',
		duration: '@',
		timeSlices: '=ngModel',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		scope.direction = (attrs.direction === 'tripout') ? 'tripout' : 'tripin';

		const organizeTimeSlices = (): void => {

			scope.remainingPercentage = 100;
			scope.remainingTime = +scope.duration;

			let timeSlices = angular.copy(scope.timeSlices);

			if (timeSlices && timeSlices.length) {

				timeSlices = timeSlices.filter((timeSlice) => {
					return timeSlice.enabled !== false;
				});

				timeSlices = timeSlices.sort((timeSlice1, timeSlice2) => {
					return timeSlice1.timeOrder - timeSlice2.timeOrder;
				});

				for (const i in timeSlices) {
					timeSlices[i].enabled = true;
					timeSlices[i].timeOrder = (+i + 1);
					timeSlices[i].duration = +scope.duration * (timeSlices[i].percentage / 100);

					scope.remainingPercentage -= timeSlices[i].percentage;
					scope.remainingTime -= timeSlices[i].duration;
				}

				scope.timeSlices = timeSlices.sort((timeSlice1, timeSlice2) => {
					return timeSlice1.timeOrder - timeSlice2.timeOrder;
				});

			}

		};

		const actionButtonAddTimeSlice = (newTaskName) => {

			organizeTimeSlices();

			const newTimeSlice: any = {
				name: newTaskName,
				timeOrder: scope.timeSlices.length + 1,
				enabled: true,
				tripin: (scope.direction === 'tripout') ? false : true,
				percentage: scope.remainingPercentage,
				duration: scope.remainingTime,
			};

			scope.newTaskName = null;

			scope.timeSlices.push(newTimeSlice);

			organizeTimeSlices();

		};

		const actionButtonRemoveTimeSlice = (timeSlice) => {
			timeSlice.enabled = false;
			organizeTimeSlices();
		};

		const actionButtonSwap = (timeSlice1, timeSlice2) => {
			if (timeSlice1 && timeSlice2) {
				const timeOrder = timeSlice1.timeOrder;
				timeSlice1.timeOrder = timeSlice2.timeOrder;
				timeSlice2.timeOrder = timeOrder;
				organizeTimeSlices();
			}
		};

		const actionChangePercentage = (timeSlice) => {
			timeSlice.percentage = +timeSlice.percentage;

			scope.remainingPercentage = 100;
			scope.remainingTime = +scope.duration;

			for (const i in scope.timeSlices) {
				scope.timeSlices[i].enabled = true;
				scope.timeSlices[i].timeOrder = (+i + 1);
				scope.timeSlices[i].duration = +scope.duration * (scope.timeSlices[i].percentage / 100);

				scope.remainingPercentage -= scope.timeSlices[i].percentage;
				scope.remainingTime -= scope.timeSlices[i].duration;
			}

			if (scope.remainingPercentage < 0) {
				timeSlice.percentage += scope.remainingPercentage;
			}

		};

		scope.actionButtonAddTimeSlice = actionButtonAddTimeSlice;
		scope.actionButtonRemoveTimeSlice = actionButtonRemoveTimeSlice;
		scope.actionButtonSwap = actionButtonSwap;
		scope.actionChangePercentage = actionChangePercentage;

		scope.$watch('duration', (seconds) => {
			if (angular.isNumber(seconds) || angular.isNumber(+seconds)) {
				organizeTimeSlices();
			}
		});

	}

}
