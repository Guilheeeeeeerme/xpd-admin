// angular.module('xpd.visualization').directive('oldTracking', oldTracking);
import template from '../xpd-resources/ng/xpd.visualization/old-tracking.template.html';

export class OldTrackingDirective implements ng.IDirective {
	public scope = {
		actionEventModalButtonClose: '=',
		actionEventModalButtonSave: '=',
		actionOpenDropdownMenu: '=',
		actionClickEventDetailsButton: '=',
		actionClickFailuresButton: '=',
		actionClickLessonsLearnedButton: '=',
		taskExpectedDuration: '=',
		currentTick: '=',
		currentOperation: '=',
		currentEvent: '=',
		currentReading: '=',
		currentCalculated: '=',
		safetySpeedLimit: '=',
		currentTimeCalculated: '=',
		blockSpeedContext: '=',
		changingStatesList: '=',
		changingAlarmsList: '=',
		unreachable: '=',
		currentState: '=',
		connectionTimes: '=',
		tripTimes: '=',
		timeBlocks: '=',
		flags: '=',
	};
	public restrict = 'AE';
	public template = template;

	public static Factory(): ng.IDirectiveFactory {
		return () => new OldTrackingDirective();
	}
}
