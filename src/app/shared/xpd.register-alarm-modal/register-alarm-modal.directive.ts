// (function() {
// 	'use strict';

// 	angular.module('xpd.register-alarm-modal', [])
// 		.directive('registerAlarmModal', registerAlarmModal);

// 	registerAlarmModal.$inject = [];
import template from './register-alarm-modal.template.html';

export class RegisterAlarmModalDirective implements ng.IDirective {
	public restrict = 'E';
	public scope = {
		alarm: '=',
		operation: '=',
		alarmType: '@',
		modalTitle: '@',
		alarmForm: '=',
		actionSaveAlarm: '=',
		actionCancelAlarm: '=',
	};
	public template = template;

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		scope.actionChangeDepth = actionChangeDepth;
		scope.$watch('alarm.isDurationAlarm', changeIsDurationAlarm);
		scope.$watch('alarm.startTime', takeSecondsAway, true);
		scope.$watch('alarm.endTime', takeSecondsAway, true);

		function changeIsDurationAlarm() {

			if (scope.alarm.isDurationAlarm === true) {
				scope.alarm.endDepth = scope.alarm.startDepth;
			}

		}

		function actionChangeDepth() {

			if (scope.alarm.isDurationAlarm) {
				scope.alarm.endDepth = scope.alarm.startDepth;
			}

		}

		function takeSecondsAway(date) {
			if (date && (date.getSeconds() || date.getMilliseconds())) {
				date.setSeconds(null);
				date.setMilliseconds(null);
			}
		}

	}

	public static Factory(): ng.IDirectiveFactory {
		return () => new RegisterAlarmModalDirective();
	}

}
// })();
