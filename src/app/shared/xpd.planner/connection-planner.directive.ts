// (function() {

import * as angular from 'angular';
import './connection-planner.style.scss';
import template from './connection-planner.template.html';

export class XPDConnectionPlannerDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new XPDConnectionPlannerDirective();
	}
	public scope = {
		label: '@',
		targetSpeed: '=',
		targetTime: '=',
		timeSlices: '<',
		optimumSpeed: '<',
		actionButtonApply: '&',
	};
	public template = template;

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		let stopWatchingPlannerTimeSlices;

		scope.actionSwap = actionSwap;
		scope.actionButtonAddTimeSlice = actionButtonAddTimeSlice;
		scope.changingPercentageOf = changingPercentageOf;
		scope.makeMoveVtarget = makeMoveVtarget;

		function changingPercentageOf(item) {
			scope.selectedSlice = item;
			// onTimeSlicesPercentageChange();

		}

		function makeMoveVtarget(item, list) {
			// tslint:disable-next-line:variable-name
			list.map(function (_item) {

				if (item.timeOrder === _item.timeOrder) {
					_item.moveVtarget = _item.moveVtarget;
				} else {
					_item.moveVtarget = false;
				}

				return _item;
			});
		}

		scope.$watch('targetSpeed', updateTargetTime, true);

		function actionSwap(indexA, valueA, indexB, valueB) {

			if (stopWatchingPlannerTimeSlices) {
				stopWatchingPlannerTimeSlices();
			}

			if (valueA && valueB) {
				scope.timeSlices[scope.selectedDirection][indexA] = angular.copy(valueB);
				scope.timeSlices[scope.selectedDirection][indexB] = angular.copy(valueA);
			}

			stopWatchingPlannerTimeSlices = startWatchingPlannerTimeSlices();
		}

		function updateTargetTime() {

			const reference = 1;

			scope.targetTime = reference / scope.targetSpeed;
			scope.optimumTime = reference / scope.optimumSpeed;
		}

		stopWatchingPlannerTimeSlices = startWatchingPlannerTimeSlices();

		function actionButtonAddTimeSlice(timeSlices, direction, name) {

			if (stopWatchingPlannerTimeSlices) {
				stopWatchingPlannerTimeSlices();
			}

			timeSlices[direction].push({
				id: null,
				name,
				percentage: 0,
				timeOrder: timeSlices[direction].length + 1,
				tripin: direction !== 'tripout',
				moveVtarget: false,
				canDelete: true,
			});

			stopWatchingPlannerTimeSlices = startWatchingPlannerTimeSlices();

		}

		function startWatchingPlannerTimeSlices() {
			return scope.$watch('timeSlices', onTimeSlicesPercentageChange, true);
		}

		function onTimeSlicesPercentageChange() {

			let timeSlices = scope.timeSlices;

			const direction = scope.selectedDirection;

			if (!timeSlices || !direction) {
				return;
			}

			timeSlices = timeSlices[direction];

			scope.leftPercentage = 100;

			let timeOrder = 1;
			let timeSlice = null;

			for (const i in timeSlices) {

				timeSlice = timeSlices[i];

				timeSlice.timeOrder = timeOrder;

				timeSlice.percentage = Math.round(timeSlice.percentage);
				scope.leftPercentage -= timeSlice.percentage;

				timeOrder++;
			}

			if (scope.leftPercentage < 0) {
				scope.selectedSlice.percentage += scope.leftPercentage;
			}

		}

	}
}

// })();
