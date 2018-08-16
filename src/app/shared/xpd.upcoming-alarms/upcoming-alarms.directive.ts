// (function() {
// 	'use strict';

// 	upcomingAlarms.$inject = [];
import template from './upcoming-alarms.template.html';

export class UpcomingAlarmsDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new UpcomingAlarmsDirective();
	}

	public restrict = 'AE';
	public scope = {
		currentDirection: '=',
		currentBitDepth: '=',
		alarmContext: '=',
	};
	public template = template;

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		scope.nextAlarms = [];
		// scope.alarmListSorted;
		// scope.tripinAlarms;
		// scope.tripoutAlarms;

		scope.$watch('currentBitDepth', function (newBitDepth) {
			if (newBitDepth) {
				alarmListGenerate(newBitDepth, scope.currentDirection.tripin);
			}
		}, true);

		scope.$watch('currentDirection', function (newDirection) {
			alarmListGenerate(scope.currentBitDepth, newDirection.tripin);
		}, true);

		scope.$watch('alarmContext', function () {
			alarmListGenerate(scope.currentBitDepth, scope.currentDirection.tripin);
		}, true);

		function alarmListGenerate(bitDepth, direction) {
			scope.alarmListSorted = getAlarmByDirectionSorted(direction);
			listNextAlarms(bitDepth);
		}

		function getAlarmByDirectionSorted(direction) {

			if (direction && scope.alarmContext.tripin) {
				return scope.alarmContext.tripin.sort((a, b) => {
					return a.startDepth - b.startDepth;
				});
			} else if (scope.alarmContext.tripout) {
				return scope.alarmContext.tripout.sort((a, b) => {
					return b.startDepth - a.startDepth;
				});
			}
		}

		function listNextAlarms(currentBitDepth) {

			scope.nextAlarms = [];

			if (!currentBitDepth && scope.alarmListSorted) {
				scope.nextAlarms = scope.alarmListSorted.slice(0, 3);
			} else {
				for (const i in scope.alarmListSorted) {

					const alarm = scope.alarmListSorted[i];

					if (scope.currentDirection.tripin && alarm.startDepth >= currentBitDepth && (!alarm.triggered || alarm.alwaysTripin)) {
						scope.nextAlarms.push(alarm);
					}

					if (!scope.currentDirection.tripin && alarm.startDepth <= currentBitDepth && (!alarm.triggered || alarm.alwaysTripout)) {
						scope.nextAlarms.push(alarm);
					}

					if (scope.nextAlarms.length === 3) {
						break;
					}
				}
			}
		}

	}

}
// })();
