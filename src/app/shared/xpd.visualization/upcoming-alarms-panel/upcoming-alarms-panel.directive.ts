import template from './upcoming-alarms-panel.template.html';

export class UpcomingAlarmsPanelDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new UpcomingAlarmsPanelDirective();
	}

	public retrict = 'EA';
	public template = template;
	public scope = {
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

		const keyName = 'panelNextAlarmsIsCollapsed';
		scope.collapse = getPanelState();

		function getPanelState() {
			try {
				return JSON.parse(localStorage.getItem(keyName));
			} catch (error) {
				return true;
			}
		}

		scope.changePanelState = () => {
			const newState = !getPanelState();
			scope.collapse = newState;
			localStorage.setItem(keyName, JSON.stringify(newState));
		};

		const listNextAlarms = () => {

			let nextAlarms = [];

			if (!scope.currentBitDepth && scope.alarmListSorted) {
				if (!isNaN(attributes.limit)) {
					nextAlarms = scope.alarmListSorted;
				} else {
					nextAlarms = scope.alarmListSorted.slice(0, 3);
				}
			} else if (scope.alarmListSorted) {
				for (const alarm of scope.alarmListSorted) {

					if (scope.currentDirection && alarm.startDepth >= scope.currentBitDepth
						&& (!alarm.triggered || alarm.alwaysTripin)) {
						nextAlarms.push(alarm);
					}

					if (!scope.currentDirection && alarm.startDepth <= scope.currentBitDepth
						&& (!alarm.triggered || alarm.alwaysTripout)) {
						nextAlarms.push(alarm);
					}

					if (nextAlarms.length === 3) {
						break;
					}
				}
			}

			scope.nextAlarms = nextAlarms;
		};

		const getAlarmByDirectionSorted = (tripinAlarms, tripoutAlarms) => {

			if (scope.currentDirection != null) {
				if (scope.currentDirection && tripinAlarms) {

					const temp = tripinAlarms.filter((a) => {
						return (a.tripin && scope.currentDirection);
					});

					return temp.sort((a, b) => {
						return a.startDepth - b.startDepth;
					});

				} else if (!scope.currentDirection && tripoutAlarms) {

					const temp = tripoutAlarms.filter((a) => {
						return (a.tripout && !scope.currentDirection);
					});

					return temp.sort((a, b) => {
						return b.startDepth - a.startDepth;
					});

				}
			}
		};

		scope.$watch('currentBitDepth', () => {
			listNextAlarms();
		});

		scope.$watch('currentDirection', () => {
			scope.alarmListSorted = getAlarmByDirectionSorted(scope.tripinAlarms, scope.tripoutAlarms);
			listNextAlarms();
		});

		scope.$watch('tripinAlarms', () => {
			scope.alarmListSorted = getAlarmByDirectionSorted(scope.tripinAlarms, scope.tripoutAlarms);
		}, true);

		scope.$watch('tripoutAlarms', () => {
			scope.alarmListSorted = getAlarmByDirectionSorted(scope.tripinAlarms, scope.tripoutAlarms);
		}, true);

	}

}
