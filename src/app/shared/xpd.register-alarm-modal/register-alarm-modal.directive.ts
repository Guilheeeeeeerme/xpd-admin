import template from './register-alarm-modal.template.html';

export class RegisterAlarmModalDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new RegisterAlarmModalDirective();
	}
	public restrict = 'E';
	public scope = {
		alarm: '=',
		operation: '=',
		alarmType: '@',
		modalTitle: '@',
		alarmForm: '=',
		actionSaveAlarm: '&',
		actionCancelAlarm: '&',
	};
	public template = template;

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		scope.changeIsDurationAlarm = () => {
			if (scope.alarm.isDurationAlarm === true) {
				scope.alarm.endDepth = scope.alarm.startDepth;
			}
		};

		scope.actionChangeDepth = () => {
			if (scope.alarm.isDurationAlarm) {
				scope.alarm.endDepth = scope.alarm.startDepth;
			}
		};

		scope.takeSecondsAway = (date) => {
			if (date && date !== undefined) {
				date = new Date(date);
				date.setSeconds(null);
				date.setMilliseconds(null);
			} else {
				return;
			}
		};

		scope.$watch('alarm.isDurationAlarm', scope.changeIsDurationAlarm);
		scope.$watch('alarm.startTime', scope.takeSecondsAway, true);
		scope.$watch('alarm.endTime', scope.takeSecondsAway, true);

	}

}
