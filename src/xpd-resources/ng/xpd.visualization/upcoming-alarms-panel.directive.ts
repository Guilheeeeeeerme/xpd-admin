import template from './xpd-resources/ng/xpd.visualization/upcoming-alarms-panel.template.html';

export class UpcomingAlarmsPanelDirective implements ng.IDirective {

	public retrict = 'EA';
	public template = template;
	public scope: any = {
		tripinAlarms: '=',
		tripoutAlarms: '=',
		currentDirection: '=',
		currentBitDepth: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		scope.$watch('currentBitDepth', listNextAlarms);

		scope.$watch('currentDirection', function() {
			scope.alarmListSorted = getAlarmByDirectionSorted();
			listNextAlarms();
		});
		scope.$watch('tripinAlarms', function() {
			scope.alarmListSorted = getAlarmByDirectionSorted();
		}, true);
		scope.$watch('tripoutAlarms', function() {
			scope.alarmListSorted = getAlarmByDirectionSorted();
		}, true);

		function getAlarmByDirectionSorted() {
			if (scope.currentDirection) {
				if (scope.currentDirection.tripin && scope.tripinAlarms) {
					return scope.tripinAlarms.sort(function(a, b) {
						return a.startDepth - b.startDepth;
					});
				} else if (!scope.currentDirection.tripin && scope.tripoutAlarms) {
					return scope.tripoutAlarms.sort(function(a, b) {
						return b.startDepth - a.startDepth;
					});
				}
			}
		}

		function listNextAlarms() {

			const nextAlarms = [];

			if (!scope.currentBitDepth && scope.alarmListSorted) {
				scope.nextAlarms = scope.alarmListSorted.slice(0, 3);
			} else {
				for (const alarm of scope.alarmListSorted) {

					if (scope.currentDirection.tripin && alarm.startDepth >= scope.currentBitDepth
						&& (!alarm.triggered || alarm.alwaysTripin)) {
						nextAlarms.push(alarm);
					}

					if (!scope.currentDirection.tripin && alarm.startDepth <= scope.currentBitDepth
						&& (!alarm.triggered || alarm.alwaysTripout)) {
						nextAlarms.push(alarm);
					}

					if (nextAlarms.length === 3) {
						break;
					}
				}
			}

			scope.nextAlarms = nextAlarms;
		}
	}

	public static Factory(): ng.IDirectiveFactory {
		return () => new UpcomingAlarmsPanelDirective();
	}

}
