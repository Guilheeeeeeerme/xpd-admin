
import './old-tracking.style.scss';
import template from './old-tracking.template.html';

export class OldTrackingDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new OldTrackingDirective();
	}
	public scope = {
		actionOpenDropdownMenu: '&',
		actionClickEventDetails: '&',
		actionClickFailures: '&',
		actionClickLessonsLearned: '&',
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

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {
		scope.openDropdownMenu = (mouseEvent, eventLog) => {
			scope.actionOpenDropdownMenu({
				mouseEvent: mouseEvent,
				eventLog: eventLog,
			});
		};

		scope.onClickEventDetails = () => {
			scope.actionClickEventDetails();
		};

		scope.onClickFailures = () => {
			scope.actionClickFailures();
		};

		scope.onClickLessonsLearned = () => {
			scope.actionClickLessonsLearned();
		};
	}
}
