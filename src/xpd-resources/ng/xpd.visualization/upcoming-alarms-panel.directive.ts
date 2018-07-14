import template from './upcoming-alarms-panel.template.html';

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

		scope.$watch('currentBitDepth', () => {
			this.listNextAlarms();
		});

		scope.$watch('currentDirection', () => {
			scope.alarmListSorted = this.getAlarmByDirectionSorted();
			this.listNextAlarms();
		});

		scope.$watch('tripinAlarms', () => {
			scope.alarmListSorted = this.getAlarmByDirectionSorted();
		}, true);

		scope.$watch('tripoutAlarms', () => {
			scope.alarmListSorted = this.getAlarmByDirectionSorted();
		}, true);

	}

	public static Factory(): ng.IDirectiveFactory {
		return () => new UpcomingAlarmsPanelDirective();
	}

	private getAlarmByDirectionSorted() {
		if (this.scope.currentDirection) {
			if (this.scope.currentDirection.tripin && this.scope.tripinAlarms) {
				return this.scope.tripinAlarms.sort((a, b) => {
					return a.startDepth - b.startDepth;
				});
			} else if (!this.scope.currentDirection.tripin && this.scope.tripoutAlarms) {
				return this.scope.tripoutAlarms.sort((a, b) => {
					return b.startDepth - a.startDepth;
				});
			}
		}
	}

	private listNextAlarms() {

		const nextAlarms = [];

		if (!this.scope.currentBitDepth && this.scope.alarmListSorted) {
			this.scope.nextAlarms = this.scope.alarmListSorted.slice(0, 3);
		} else {
			for (const alarm of this.scope.alarmListSorted) {

				if (this.scope.currentDirection.tripin && alarm.startDepth >= this.scope.currentBitDepth
					&& (!alarm.triggered || alarm.alwaysTripin)) {
					nextAlarms.push(alarm);
				}

				if (!this.scope.currentDirection.tripin && alarm.startDepth <= this.scope.currentBitDepth
					&& (!alarm.triggered || alarm.alwaysTripout)) {
					nextAlarms.push(alarm);
				}

				if (nextAlarms.length === 3) {
					break;
				}
			}
		}

		this.scope.nextAlarms = nextAlarms;
	}

}
