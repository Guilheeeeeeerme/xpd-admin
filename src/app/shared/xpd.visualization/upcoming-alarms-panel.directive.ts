import template from './upcoming-alarms-panel.template.html';

export class UpcomingAlarmsPanelDirective implements ng.IDirective {

	public retrict = 'EA';
	public template = template;
	public scope = {
		onInit: '&',
		onClickCollapse: '&',
		collapse: '=',
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
			this.listNextAlarms(scope);
		});

		scope.$watch('currentDirection', () => {
			scope.alarmListSorted = this.getAlarmByDirectionSorted(scope);
			this.listNextAlarms(scope);
		});

		scope.$watch('tripinAlarms', () => {
			scope.alarmListSorted = this.getAlarmByDirectionSorted(scope);
		}, true);

		scope.$watch('tripoutAlarms', () => {
			scope.alarmListSorted = this.getAlarmByDirectionSorted(scope);
		}, true);

	}

	public static Factory(): ng.IDirectiveFactory {
		return () => new UpcomingAlarmsPanelDirective();
	}

	private getAlarmByDirectionSorted($scope) {

		if ($scope.currentDirection) {
			if ($scope.currentDirection.tripin && $scope.tripinAlarms) {
				return $scope.tripinAlarms.sort((a, b) => {
					return a.startDepth - b.startDepth;
				});
			} else if (!$scope.currentDirection.tripin && $scope.tripoutAlarms) {
				return $scope.tripoutAlarms.sort((a, b) => {
					return b.startDepth - a.startDepth;
				});
			}
		}
	}

	private listNextAlarms($scope) {

		const nextAlarms = [];

		if (!$scope.currentBitDepth && $scope.alarmListSorted) {
			$scope.nextAlarms = $scope.alarmListSorted.slice(0, 3);
		} else if ($scope.alarmListSorted) {
			for (const alarm of $scope.alarmListSorted) {

				if ($scope.currentDirection.tripin && alarm.startDepth >= $scope.currentBitDepth
					&& (!alarm.triggered || alarm.alwaysTripin)) {
					nextAlarms.push(alarm);
				}

				if (!$scope.currentDirection.tripin && alarm.startDepth <= $scope.currentBitDepth
					&& (!alarm.triggered || alarm.alwaysTripout)) {
					nextAlarms.push(alarm);
				}

				if (nextAlarms.length === 3) {
					break;
				}
			}
		}

		$scope.nextAlarms = nextAlarms;
	}

}
